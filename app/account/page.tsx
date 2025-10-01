import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <Input
              type="text"
              value={user.user_metadata?.name || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={user.email || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <Input
              type="text"
              value={user.user_metadata?.website || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <form action="/auth/logout" method="POST">
              <button
                type="submit"
                className="px-6 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all duration-300"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


