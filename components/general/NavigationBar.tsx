"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Menu,
  X,
  Hospital,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
  Shield,
  Stethoscope,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserProfile {
  id: string;
  role: "user" | "admin" | "superadmin" | null;
  status: "pending" | "approved" | "rejected" | null;
  hospitalName?: string;
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, status, associated_hospital_id")
            .eq("id", user.id)
            .single();

          if (profile) {
            // If admin, fetch hospital name
            let hospitalName;
            if (profile.role === "admin" && profile.associated_hospital_id) {
              const { data: hospital } = await supabase
                .from("hospitals")
                .select("name")
                .eq("id", profile.associated_hospital_id)
                .single();
              hospitalName = hospital?.name;
            }

            setProfile({
              id: user.id,
              role: profile.role,
              status: profile.status,
              hospitalName,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!profile) return null;

    if (profile.role === "superadmin") return "/superadmin";
    if (profile.role === "admin" && profile.status === "approved")
      return "/admin";
    return null;
  };

  const getNavLinks = () => {
    const links = [
      { href: "/explore", label: "Find Hospitals" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ];

    // Add hospital-specific links for approved admins
    if (profile?.role === "admin" && profile.status === "approved") {
      links.push({ href: "/shared/inventory", label: "Inventory" });
      links.push({ href: "/shared/doctors", label: "Doctors" });
    }

    return links;
  };

  const getStatusBadge = () => {
    if (!profile?.status) return null;

    const statusConfig = {
      pending: {
        icon: Clock,
        text: "Pending Approval",
        bg: "bg-amber-50",
        textColor: "text-amber-700",
        border: "border-amber-200",
      },
      approved: {
        icon: CheckCircle,
        text: "Approved",
        bg: "bg-emerald-50",
        textColor: "text-emerald-700",
        border: "border-emerald-200",
      },
      rejected: {
        icon: XCircle,
        text: "Rejected",
        bg: "bg-rose-50",
        textColor: "text-rose-700",
        border: "border-rose-200",
      },
    };

    const config = statusConfig[profile.status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${config.bg} ${config.textColor} rounded-full text-xs font-medium border ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  const getRoleBadge = () => {
    if (!profile?.role) return null;

    const roleConfig = {
      superadmin: {
        icon: Shield,
        text: "Super Admin",
        bg: "bg-purple-50",
        textColor: "text-purple-700",
        border: "border-purple-200",
      },
      admin: {
        icon: Stethoscope,
        text: "Hospital Admin",
        bg: "bg-blue-50",
        textColor: "text-blue-700",
        border: "border-blue-200",
      },
      user: null,
    };

    if (profile.role === "user") return null;

    const config = roleConfig[profile.role];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${config.bg} ${config.textColor} rounded-full text-xs font-medium border ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  const isActive = (href: string) => pathname === href;

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="w-24 h-9 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {getNavLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Status Badge - Only show if not approved */}
                {profile?.status && profile.status !== "approved" && (
                  <div className="mr-1">{getStatusBadge()}</div>
                )}

                {/* Role Badge */}
                {profile?.role &&
                  profile.role !== "user" &&
                  profile.status === "approved" && (
                    <div className="mr-1">{getRoleBadge()}</div>
                  )}

                {/* Dashboard Link */}
                {getDashboardLink() && (
                  <Link
                    href={getDashboardLink()!}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}

                {/* User Menu Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-xl hover:bg-slate-50">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 hidden group-hover:block">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user.email}
                      </p>
                      {profile?.hospitalName && (
                        <p className="text-xs text-indigo-600 mt-1.5 font-medium">
                          {profile.hospitalName}
                        </p>
                      )}

                      {/* Mobile-style badges in dropdown for desktop */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {profile?.status &&
                          profile.status !== "approved" &&
                          getStatusBadge()}
                        {profile?.role &&
                          profile.role !== "user" &&
                          profile.status === "approved" &&
                          getRoleBadge()}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors rounded-b-2xl"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-5 py-2.5 text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors rounded-xl hover:bg-indigo-50"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                >
                  Sign Up
                </Link>
                <span className="text-xs text-slate-400 ml-1 italic bg-slate-50 px-3 py-1.5 rounded-full">
                  For hospitals only
                </span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col space-y-1">
              {getNavLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 mt-2 border-t border-slate-100">
                {user ? (
                  <div className="space-y-3 px-2">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-slate-900 break-all">
                        {user.email}
                      </p>

                      {/* Mobile Badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {profile?.status &&
                          profile.status !== "approved" &&
                          getStatusBadge()}
                        {profile?.role &&
                          profile.role !== "user" &&
                          profile.status === "approved" &&
                          getRoleBadge()}
                      </div>

                      {profile?.hospitalName && (
                        <p className="text-xs text-indigo-600 mt-3 font-medium">
                          {profile.hospitalName}
                        </p>
                      )}
                    </div>

                    {getDashboardLink() && (
                      <Link
                        href={getDashboardLink()!}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-3.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3.5 bg-rose-50 text-rose-600 rounded-xl font-medium text-sm hover:bg-rose-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 px-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full px-4 py-3.5 text-center text-indigo-600 font-medium text-sm border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsOpen(false)}
                      className="block w-full px-4 py-3.5 text-center bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                    >
                      Sign Up
                    </Link>
                    <p className="text-xs text-slate-400 text-center pt-2 italic">
                      Hospital administrators only
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Logo Component
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-300 transition-all">
        <Hospital className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        Near<span className="text-indigo-600">H</span>
      </span>
    </Link>
  );
}
