"use client";

import { useState, useTransition } from "react";
import { deleteLocation, updateLocation } from "@/actions/superadmin/locations";
import {
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  Loader2,
  MapPin,
} from "lucide-react";
import { Database } from "@/types/database.types";
import { toast } from "sonner";
import { Modal } from "antd";

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

  const handleSaveUpdate = (id: string) => {
    if (!editValues.city.trim() || !editValues.state.trim()) {
      toast.error("City and state cannot be empty.");
      return;
    }
    startTransition(async () => {
      const result = await updateLocation(id, editValues);
      if (result.success && result.data) {
        setData((prev) =>
          prev.map((item) => (item.id === id ? result.data! : item)),
        );
        setEditingId(null);
        toast.success(`${result.data.city} updated successfully`);
      } else {
        toast.error("Update failed", { description: result.message });
      }
    });
  };

  const handleDelete = (id: string, cityName: string) => {
    Modal.confirm({
      title: "Delete Location?",
      content: (
        <div className="pt-1">
          <p className="text-sm text-gray-600 mb-2">
            You are about to delete{" "}
            <span className="font-bold text-gray-900">{cityName}</span>.
            Hospitals registered under this city may be affected.
          </p>
          <p className="text-xs text-red-600 font-semibold bg-red-50 rounded-lg px-3 py-2 border border-red-100">
            ⚠️ This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        className:
          "!bg-red-600 !border-red-600 hover:!bg-red-700 !font-bold !text-white",
      },
      icon: null,
      centered: true,
      async onOk() {
        const previousData = [...data];
        setData((prev) => prev.filter((loc) => loc.id !== id));
        const result = await deleteLocation(id);
        if (!result.success) {
          toast.error("Delete failed", { description: result.message });
          setData(previousData);
        } else {
          toast.success(`${cityName} deleted successfully`);
        }
      },
    });
  };

  return (
    <div className="flex flex-col">
      {}
      <div className="px-5 py-4 border-b border-border">
        <div className="relative max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search city or state…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-badge-bg border border-border rounded-xl text-sm font-medium text-heading placeholder:text-muted outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {}
      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-badge-bg border border-border flex items-center justify-center mb-3">
            <MapPin size={20} className="text-muted" />
          </div>
          <p className="text-sm font-bold text-heading mb-1">
            No locations found
          </p>
          <p className="text-xs text-muted">
            {search
              ? "Try a different search term."
              : "Add your first location to get started."}
          </p>
        </div>
      )}

      {filteredData.length > 0 && (
        <>
          {}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-badge-bg border-b border-border">
                  <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest w-[40%]">
                    City
                  </th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                    State
                  </th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredData.map((loc) => {
                  const isEditing = editingId === loc.id;
                  return (
                    <tr
                      key={loc.id}
                      className="hover:bg-badge-bg/40 transition-colors group"
                    >
                      {}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editValues.city}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                city: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-accent/40 rounded-xl text-sm font-semibold text-heading bg-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                          />
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-badge-bg border border-border flex items-center justify-center flex-shrink-0">
                              <MapPin size={12} className="text-accent" />
                            </div>
                            <span className="font-bold text-sm text-heading">
                              {loc.city}
                            </span>
                          </div>
                        )}
                      </td>

                      {}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            value={editValues.state}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                state: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-accent/40 rounded-xl text-sm font-medium text-heading bg-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                          />
                        ) : (
                          <span className="text-sm font-medium text-body">
                            {loc.state}
                          </span>
                        )}
                      </td>

                      {}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveUpdate(loc.id)}
                                disabled={isPending}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-40 transition-all"
                              >
                                {isPending ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Check size={13} />
                                )}
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 text-muted border border-border hover:bg-slate-100 transition-all"
                              >
                                <X size={13} />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(loc)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-body border border-border bg-white hover:border-accent/40 hover:text-accent hover:bg-badge-bg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Pencil size={13} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(loc.id, loc.city)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-error border border-red-100 bg-red-50 hover:bg-error hover:text-white hover:border-error transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={13} />
                                Delete
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

          {}
          <div className="md:hidden divide-y divide-border/60">
            {filteredData.map((loc) => {
              const isEditing = editingId === loc.id;
              return (
                <div key={loc.id} className="p-5">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block">
                          City
                        </label>
                        <input
                          autoFocus
                          value={editValues.city}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              city: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2.5 border border-accent/40 rounded-xl text-sm font-semibold text-heading bg-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block">
                          State
                        </label>
                        <input
                          value={editValues.state}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              state: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2.5 border border-accent/40 rounded-xl text-sm font-medium text-heading bg-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleSaveUpdate(loc.id)}
                          disabled={isPending}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-40"
                        >
                          {isPending ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Check size={13} />
                          )}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-muted border border-border hover:bg-slate-100 transition-all"
                        >
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-badge-bg border border-border flex items-center justify-center flex-shrink-0">
                          <MapPin size={15} className="text-accent" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-heading truncate">
                            {loc.city}
                          </p>
                          <p className="text-xs text-muted">{loc.state}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEditing(loc)}
                          className="w-8 h-8 rounded-xl border border-border bg-white flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 hover:bg-badge-bg transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(loc.id, loc.city)}
                          className="w-8 h-8 rounded-xl border border-red-100 bg-red-50 flex items-center justify-center text-error hover:bg-error hover:text-white hover:border-error transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {}
          <div className="px-5 py-3.5 border-t border-border bg-badge-bg/40">
            <p className="text-xs font-semibold text-muted">
              {filteredData.length === data.length
                ? `${data.length} location${data.length !== 1 ? "s" : ""}`
                : `${filteredData.length} of ${data.length} locations`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
