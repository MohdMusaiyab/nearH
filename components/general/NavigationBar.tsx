"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import {
  Hospital,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Search,
  Activity,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
interface ExtendedProfile extends Profile {
  hospitalName?: string;
}

let profileFetchPromise: Promise<any> | null = null;

export function Navigation() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dashboardHref = useMemo(() => {
    if (isLoading) return "#";

    if (!profile) return "/auth/login";
    if (profile.role === "superadmin") return "/superadmin/dashboard";
    if (profile.role === "admin") return "/admin/dashboard";
    return "/profile";
  }, [profile, isLoading]);

  useEffect(() => {
    let mounted = true;
    let hasFetched = false;

    const fetchProfile = async () => {
      if (!mounted || hasFetched) return;
      hasFetched = true;
      setIsLoading(true);

      try {
        if (!profileFetchPromise) {
          profileFetchPromise = fetch("/api/auth/me", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : null))
            .finally(() => {
              profileFetchPromise = null;
            });
        }

        const data = await profileFetchPromise;
        if (data && mounted) {
          setProfile(data);
        }
      } catch (e) {
        if (mounted) console.error("Error fetching profile:", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && mounted) {
        setUser(session.user);
        await fetchProfile();
      } else if (mounted) {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        hasFetched = false; // Reset so we fetch the new user's profile
        await fetchProfile();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        hasFetched = false;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSignOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setIsOpen(false);
      setDropdownOpen(false);

      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { href: "/explore", label: "Find Care", icon: Search },
    { href: "/about-us", label: "Our Mission", icon: Activity },
  ];

  if (profile?.role === "admin" && profile?.status === "approved") {
    navLinks.push({
      href: "/shared/inventory",
      label: "Inventory",
      icon: LayoutDashboard,
    });
  }

  const navBg = isScrolled
    ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
    : "bg-transparent";

  if (pathname.startsWith("/auth/")) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-500 h-20 lg:h-24 flex items-center ${navBg}`}
      >
        <div className="w-full px-4 lg:px-0">
          <div className="flex justify-between items-center">
            {}
            <div className="flex items-center ">
              <Link
                href="/"
                className="flex items-center gap-3 group lg:w-64 lg:pl-5 lg:shrink-0"
              >
                <div className="w-10 h-10 bg-heading rounded-xl flex items-center justify-center shadow-lg shadow-heading/20 group-hover:scale-105 transition-transform duration-200">
                  <Hospital size={20} className="text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-heading">
                  Near
                  <span className="text-accent underline decoration-heading decoration-[3px] underline-offset-4">
                    H
                  </span>
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative text-sm font-bold tracking-wide transition-colors duration-200 py-1 text-heading/70 hover:text-heading group"
                    >
                      {link.label}
                      <span
                        className={`absolute bottom-0 left-0 h-[2px] bg-heading rounded-full transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {}
            <div className="hidden lg:flex items-center px-6">
              {!isLoading &&
                (user ? (
                  <div
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-heading hover:bg-slate-100 transition-colors duration-200"
                    >
                      <div className="w-7 h-7 rounded-lg bg-heading/10 flex items-center justify-center">
                        <UserIcon size={14} className="text-heading" />
                      </div>
                      <span>Account</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                          style={{ transformOrigin: "top center" }}
                        >
                          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                            <p className="text-xs font-bold text-heading truncate">
                              {user.email}
                            </p>
                            {profile?.hospitalName && (
                              <p className="text-[11px] text-accent font-semibold mt-0.5 truncate">
                                {profile.hospitalName}
                              </p>
                            )}
                          </div>
                          <div className="py-2">
                            <Link
                              href={dashboardHref}
                              onClick={(e) => {
                                if (dashboardHref === "#") e.preventDefault();
                                setDropdownOpen(false);
                              }}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                dashboardHref === "#"
                                  ? "opacity-50 cursor-not-allowed"
                                  : "text-heading hover:bg-badge-bg hover:text-accent"
                              }`}
                            >
                              <LayoutDashboard
                                size={15}
                                className="text-accent"
                              />
                              {isLoading ? "Syncing..." : "Command Center"}
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-error hover:bg-red-50 transition-colors text-left"
                            >
                              <LogOut size={15} /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-sm font-black px-6 py-2.5 rounded-xl border-2 border-heading text-heading hover:bg-heading hover:text-white transition-all duration-200"
                  >
                    PARTNER LOGIN
                  </Link>
                ))}
            </div>

            {}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[6px] group"
            >
              <span
                className={`block h-[2.5px] bg-heading rounded-full transition-all duration-300 ${isOpen ? "w-6 rotate-45 translate-y-[8.5px]" : "w-6"}`}
              />
              <span
                className={`block h-[2.5px] bg-heading rounded-full transition-all duration-300 ${isOpen ? "opacity-0 w-0" : "w-4"}`}
              />
              <span
                className={`block h-[2.5px] bg-heading rounded-full transition-all duration-300 ${isOpen ? "w-6 -rotate-45 -translate-y-[8.5px]" : "w-5"}`}
              />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-105 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[min(320px,90vw)] bg-white z-110 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-heading rounded-lg flex items-center justify-center">
                    <Hospital size={16} className="text-white" />
                  </div>
                  <span className="text-xl font-black text-heading">NearH</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-heading hover:bg-slate-200 transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col px-4 py-6 gap-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base transition-colors ${isActive ? "bg-heading text-white" : "text-heading hover:bg-slate-50"}`}
                      >
                        <Icon
                          size={18}
                          className={isActive ? "text-white" : "text-accent"}
                        />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {user && (
                <div className="px-4 mb-4">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-heading truncate">
                        {user.email}
                      </p>
                      {profile?.hospitalName && (
                        <p className="text-[11px] text-accent font-semibold mt-0.5">
                          {profile.hospitalName}
                        </p>
                      )}
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={(e) => {
                        if (dashboardHref === "#") e.preventDefault();
                        setDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        dashboardHref === "#"
                          ? "opacity-50 cursor-not-allowed"
                          : "text-heading hover:bg-badge-bg hover:text-accent"
                      }`}
                    >
                      <LayoutDashboard size={15} className="text-accent" />
                      {isLoading ? "Syncing..." : "Command Center"}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-error hover:bg-red-50 transition-colors text-left border-t border-slate-100"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-auto px-4 py-6 border-t border-slate-100">
                {!user && (
                  <>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-4 bg-heading text-white text-center font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Register Hospital
                    </Link>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-4 text-heading text-center font-bold border-2 border-heading rounded-xl mt-3 hover:bg-heading hover:text-white transition-all"
                    >
                      Partner Login
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
