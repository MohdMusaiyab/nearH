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
import { toast } from "sonner";
import { Modal } from "antd";

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

  const handleSave = (id: string) => {
    if (!editValue.trim()) {
      toast.error("Service name cannot be empty.");
      return;
    }
    startTransition(async () => {
      const res = await updateMasterService(id, {
        service_name: editValue.trim(),
      });
      if (res.success && res.data) {
        setData((prev) =>
          prev.map((item) => (item.id === id ? res.data! : item)),
        );
        setEditingId(null);
        toast.success(`"${res.data.service_name}" updated successfully`);
      } else {
        toast.error("Update failed", { description: res.message });
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: "Remove Service?",
      content: (
        <div className="pt-1">
          <p className="text-sm text-gray-600 mb-2">
            You are about to remove{" "}
            <span className="font-bold text-gray-900">{name}</span> from the
            service catalog. Hospitals using this service may be affected.
          </p>
          <p className="text-xs text-red-600 font-semibold bg-red-50 rounded-lg px-3 py-2 border border-red-100">
            ⚠️ This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Remove",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        className: "!bg-red-600 !border-red-600 hover:!bg-red-700 !font-bold",
      },
      icon: null,
      centered: true,
      async onOk() {
        const prev = [...data];
        setData((d) => d.filter((s) => s.id !== id));
        const res = await deleteMasterService(id);
        if (!res.success) {
          toast.error("Delete failed", { description: res.message });
          setData(prev);
        } else {
          toast.success(`"${name}" removed from catalog`);
        }
      },
    });
  };

  return (
    <div className="flex flex-col">
      {/* ── Search bar ── */}
      <div className="px-5 py-4 border-b border-border">
        <div className="relative max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-badge-bg border border-border rounded-xl text-sm font-medium text-heading placeholder:text-muted placeholder:font-normal outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
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

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-badge-bg border border-border flex items-center justify-center mb-3">
            <Activity size={20} className="text-muted" />
          </div>
          <p className="text-sm font-bold text-heading mb-1">
            No services found
          </p>
          <p className="text-xs text-muted">
            {search
              ? "Try a different search term."
              : "Add your first service to get started."}
          </p>
        </div>
      )}

      {filteredData.length > 0 && (
        <>
          {/* ── Desktop table ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-badge-bg border-b border-border">
                  <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                    Service Name
                  </th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredData.map((service) => {
                  const isEditing = editingId === service.id;
                  return (
                    <tr
                      key={service.id}
                      className="hover:bg-badge-bg/40 transition-colors group"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSave(service.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="w-full max-w-sm px-3 py-2 border border-accent/40 rounded-xl text-sm font-semibold text-heading bg-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-badge-bg border border-border flex items-center justify-center flex-shrink-0">
                              <Activity
                                size={14}
                                className="text-accent"
                              />
                            </div>
                            <span className="text-sm font-bold text-heading">
                              {service.service_name}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(service.id)}
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
                                <X size={13} /> Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(service.id);
                                  setEditValue(service.service_name);
                                }}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-body border border-border bg-white hover:border-accent/40 hover:text-accent hover:bg-badge-bg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Pencil size={13} /> Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(service.id, service.service_name)
                                }
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-error border border-red-100 bg-red-50 hover:bg-error hover:text-white hover:border-error transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={13} /> Delete
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

          {/* ── Mobile cards ── */}
          <div className="md:hidden divide-y divide-border/60">
            {filteredData.map((service) => {
              const isEditing = editingId === service.id;
              return (
                <div key={service.id} className="p-5">
                  {isEditing ? (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">
                        Service Name
                      </label>
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(service.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="w-full px-3 py-2.5 border border-accent/40 rounded-xl text-sm font-semibold text-heading bg-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(service.id)}
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
                          <Activity
                            size={15}
                            className="text-accent"
                          />
                        </div>
                        <span className="text-sm font-bold text-heading truncate">
                          {service.service_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingId(service.id);
                            setEditValue(service.service_name);
                          }}
                          className="w-8 h-8 rounded-xl border border-border bg-white flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 hover:bg-badge-bg transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(service.id, service.service_name)
                          }
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

          {/* Row count footer */}
          <div className="px-5 py-3.5 border-t border-border bg-badge-bg/40">
            <p className="text-xs font-semibold text-muted">
              {filteredData.length === data.length
                ? `${data.length} service${data.length !== 1 ? "s" : ""}`
                : `${filteredData.length} of ${data.length} services`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
