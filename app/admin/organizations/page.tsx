import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import Link from "next/link";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export default async function AdminOrganizationsPage() {
  const isAdminAuth = await checkAdminAuth();
  if (!isAdminAuth) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  // Get all organizations (admin view)
  const { data: organizations, error } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
            >
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Organizations</h1>
            <p className="text-gray-600">System-wide organization list</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm mb-6">
                Error loading organizations: {error.message}
              </div>
            )}

            {organizations && organizations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Brand Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Domain</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Industry</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.map((org) => (
                      <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{org.brand_name}</td>
                        <td className="py-3 px-4 text-gray-600">{org.domain}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {org.industry}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm font-mono">
                          {org.owner_user_id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(org.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No organizations in the system yet
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
