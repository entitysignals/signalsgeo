import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user's organizations
  const { data: organizations, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user.user_metadata?.name || user.email}
              </p>
            </div>
            <form action="/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Log out
              </button>
            </form>
          </div>

          {/* Organizations */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Organizations</h2>
              <Link
                href="/dashboard/organizations/new"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Create Organization
              </Link>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm mb-6">
                Failed to load organizations
              </div>
            )}

            {organizations && organizations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No organizations yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first organization to start analyzing your website
                </p>
                <Link
                  href="/dashboard/organizations/new"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  Create Organization
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {organizations?.map((org) => (
                  <Link
                    key={org.id}
                    href={`/dashboard/organizations/${org.id}`}
                    className="p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {org.brand_name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{org.domain}</p>
                        <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                          {org.industry}
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
