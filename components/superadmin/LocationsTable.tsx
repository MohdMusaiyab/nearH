"use client";

import { useState, useTransition } from "react";
import { deleteLocation, updateLocation } from "@/actions/superadmin/locations";
import { Pencil, Trash2, Search, Check, X, Loader2 } from "lucide-react";
import { Database } from "@/types/database.types";

type LocationRow = Database["public"]["Tables"]["locations"]["Row"];

export default function LocationTable({
  initialData,
}: {
  initialData: LocationRow[];
}) {
  const [data, setData] = useState<LocationRow[]>(initialData);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ city: string; state: string }>(
    { city: "", state: "" },
  );
  const [isPending, startTransition] = useTransition();

  const filteredData = data.filter(
    (loc) =>
      loc.city.toLowerCase().includes(search.toLowerCase()) ||
      loc.state.toLowerCase().includes(search.toLowerCase()),
  );

  const startEditing = (loc: LocationRow) => {
    setEditingId(loc.id);
    setEditValues({ city: loc.city, state: loc.state });
  };

  const handleSaveUpdate = async (id: string) => {
    startTransition(async () => {
      const result = await updateLocation(id, editValues);
      if (result.success && result.data) {
        setData((prev) =>
          prev.map((item) => (item.id === id ? result.data! : item)),
        );
        setEditingId(null);
      } else {
        alert(result.message);
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;

    const previousData = [...data];
    setData((prev) => prev.filter((loc) => loc.id !== id));

    const result = await deleteLocation(id);
    if (!result.success) {
      alert(result.message);
      setData(previousData);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search locations..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                City
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                State
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((loc) => {
              const isEditing = editingId === loc.id;
              return (
                <tr
                  key={loc.id}
                  className="hover:bg-slate-50/80 transition-colors h-[72px]"
                >
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        className="w-full px-2 py-1 border rounded bg-white text-sm"
                        value={editValues.city}
                        onChange={(e) =>
                          setEditValues({ ...editValues, city: e.target.value })
                        }
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold text-slate-900">
                        {loc.city}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        className="w-full px-2 py-1 border rounded bg-white text-sm"
                        value={editValues.state}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            state: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <span className="text-slate-600 text-sm">
                        {loc.state}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveUpdate(loc.id)}
                            disabled={isPending}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            {isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(loc)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(loc.id, loc.city)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
