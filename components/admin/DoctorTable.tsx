"use client";

import { useEffect, useState } from "react";
import { deleteDoctor, type DoctorWithSpecialty } from "@/actions/admin/doctor";
import {
  Pencil,
  Trash2,
  Search,
  User,
  GraduationCap,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Modal, ConfigProvider, App } from "antd";

interface DoctorTableProps {
  initialData: DoctorWithSpecialty[];
  totalCount: number;
  pageSize: number;
}

// ── Internal Table Component ──
// We move the logic here so it can consume the 'App' context correctly.
function DoctorTableContent({
  initialData,
  totalCount,
  pageSize,
}: DoctorTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal } = App.useApp(); // This is the secret sauce for the theme to work

  const [data, setData] = useState<DoctorWithSpecialty[]>(initialData);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const updateFilters = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value.toString());
    else params.delete(key);
    if (key === "search") params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleDelete = (id: string, name: string) => {
    modal.confirm({
      title: (
        <span className="font-black text-heading">
          Remove Medical Staff
        </span>
      ),
      icon: <AlertCircle className="text-error w-5 h-5" />,
      content: (
        <div className="pt-1">
          <p className="text-sm text-body mb-2">
            Are you sure you want to remove{" "}
            <span className="font-bold text-heading">
              Dr. {name}
            </span>
            ?
          </p>
          <p className="text-xs text-error font-semibold bg-red-50 rounded-lg px-3 py-2 border border-red-100">
            ⚠️ This will remove their profile and OPD schedule from the public
            directory.
          </p>
        </div>
      ),
      okText: "Yes, Delete Profile",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      mask: { closable: true }, // Fixed deprecation: maskClosable -> mask.closable
      okButtonProps: {
        className:
          "!bg-error !border-error hover:!bg-error-hover !font-bold !text-white !rounded-xl",
      },
      cancelButtonProps: {
        className: "!rounded-xl !font-bold text-muted",
      },
      async onOk() {
        const previousData = [...data];
        setData((current) => current.filter((d) => d.id !== id));
        setIsDeletingId(id);

        const res = await deleteDoctor(id);

        if (res.success) {
          toast.success(`Dr. ${name} has been removed.`);
        } else {
          setData(previousData);
          toast.error("Delete failed", { description: res.message });
        }
        setIsDeletingId(null);
      },
    });
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Search Header */}
      <div className="p-5 border-b border-border">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search doctor by name..."
            defaultValue={searchParams.get("search") || ""}
            className="w-full pl-10 pr-4 py-2.5 bg-badge-bg/50 border border-border rounded-xl text-sm font-medium outline-none text-heading focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
            onChange={(e) => updateFilters("search", e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-badge-bg/40 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-widest">
                Doctor Details
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-widest">
                Specialty
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-16 text-center italic text-muted"
                >
                  No doctors found.
                </td>
              </tr>
            ) : (
              data.map((doc) => (
                <tr
                  key={doc.id}
                  className={`hover:bg-badge-bg/20 transition-colors group ${isDeletingId === doc.id ? "opacity-50" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-badge-bg rounded-full border border-border flex items-center justify-center text-accent">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-heading truncate text-sm">
                          {doc.name}
                        </div>
                        <div className="text-[10px] font-bold text-accent uppercase flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3 h-3" />{" "}
                          {doc.experience_years} Years Experience
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-badge-bg text-badge-text border border-border">
                      {doc.specialties_list?.specialty_name ||
                        "General Practitioner"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link
                        href={`/admin/doctors/edit/${doc.id}`}
                        className="p-2 text-muted hover:text-accent hover:bg-badge-bg rounded-xl transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
                        disabled={!!isDeletingId}
                        className="p-2 text-muted hover:text-error hover:bg-red-50 rounded-xl transition-all"
                      >
                        {isDeletingId === doc.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-border bg-badge-bg/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-bold text-muted uppercase">
          Showing {data.length} of {totalCount} Staff
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => updateFilters("page", currentPage - 1)}
              className="p-2 rounded-lg border border-border bg-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 py-1.5 rounded-lg bg-white border border-border text-xs font-black">
              {currentPage} / {totalPages}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => updateFilters("page", currentPage + 1)}
              className="p-2 rounded-lg border border-border bg-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Wrapper Component ──
export default function DoctorTable(props: DoctorTableProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0284C7",
          borderRadius: 12,
          fontFamily: "var(--font-sans)",
        },
      }}
    >
      <App>
        <DoctorTableContent {...props} />
      </App>
    </ConfigProvider>
  );
}
