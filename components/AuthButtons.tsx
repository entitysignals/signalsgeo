"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthButtons() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // or a loading skeleton
  }

  if (user) {
    // User is logged in
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/account"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Account
        </Link>
      </div>
    );
  }

  // User is not logged in
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/login"
        className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-300"
      >
        Sign Up
      </Link>
    </div>
  );
}

