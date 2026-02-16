import { getNetworkReferrals } from "@/actions/superadmin/referrals";
import SuperadminReferralClient from "@/components/superadmin/SuperadminReferralClient";
import { Database } from "@/types/database.types";

// Define the valid status type from your DB
type ReferralStatus = Database["public"]["Enums"]["referral_status"];

interface Props {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function SuperadminReferralsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  // --- TYPE GUARD: Convert string to ReferralStatus without 'any' ---
  const validStatuses: ReferralStatus[] = [
    "Pending",
    "Accepted",
    "Rejected",
    "Completed",
  ];

  // We check if the status in URL is actually one of our valid DB enums
  const status = validStatuses.includes(params.status as ReferralStatus)
    ? (params.status as ReferralStatus)
    : undefined;

  const { data, success } = await getNetworkReferrals({
    page,
    pageSize: 10,
    status: status, // Now strictly typed
  });

  if (!success || !data) {
    return (
      <div className="p-12 text-center bg-white rounded-[3rem] border border-slate-200">
        <p className="text-slate-500 font-bold">
          Failed to load network referrals.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Network Handshakes
          </h1>
          <p className="text-slate-500 font-medium">
            Monitoring all active patient transfers across the state.
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              Total Referrals
            </p>
            <p className="text-xl font-black text-indigo-700">
              {data.totalCount}
            </p>
          </div>
        </div>
      </div>

      <SuperadminReferralClient
        initialReferrals={data.referrals}
        totalCount={data.totalCount}
        currentPage={page}
      />
    </div>
  );
}
