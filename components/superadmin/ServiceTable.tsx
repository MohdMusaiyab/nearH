"use client";

import { useState, useTransition } from "react";
import {
  deleteMasterService,
  updateMasterService,
} from "@/actions/superadmin/services";
import {
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  Loader2,
  Activity,
} from "lucide-react";
import { Database } from "@/types/database.types";

type ServiceRow = Database["public"]["Tables"]["services_list"]["Row"];

export default function ServiceTable({
  initialData,
}: {
  initialData: ServiceRow[];
}) {
  const [data, setData] = useState<ServiceRow[]>(initialData);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredData = data.filter((s) =>
    s.service_name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async (id: string) => {
    startTransition(async () => {
      const res = await updateMasterService(id, { service_name: editValue });
      if (res.success && res.data) {
        setData((prev) =>
          prev.map((item) => (item.id === id ? res.data! : item)),
        );
        setEditingId(null);
      } else alert(res.message);
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from catalog?`)) return;
    const prev = [...data];
    setData((d) => d.filter((s) => s.id !== id));
    const res = await deleteMasterService(id);
    if (!res.success) {
      alert(res.message);
      setData(prev);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Service Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((service) => (
              <tr
                key={service.id}
                className="hover:bg-slate-50/80 transition-colors h-[72px]"
              >
                <td className="px-6 py-4">
                  {editingId === service.id ? (
                    <input
                      className="w-full px-3 py-1 border rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900">
                        {service.service_name}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === service.id ? (
                      <>
                        <button
                          onClick={() => handleSave(service.id)}
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
                          onClick={() => {
                            setEditingId(service.id);
                            setEditValue(service.service_name);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.service_name)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
