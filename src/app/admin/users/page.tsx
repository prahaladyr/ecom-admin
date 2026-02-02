import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserRoleForm from "@/components/admin/users/user-role-form";

type User = {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt?: string;
};

export default async function UsersPage() {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const res = await backendFetch("/api/v1/users?page=1&limit=100", { headers });
  const json = (await res.json().catch(() => null)) as { items?: User[] } | null;
  const users = json?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage roles for user accounts.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Update role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2">
                        <div className="font-medium">{user.email}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          Role: {user.role}
                        </div>
                      </td>
                      <td className="py-2 hidden sm:table-cell">{user.role}</td>
                      <td className="py-2">
                        <UserRoleForm userId={user.id} role={user.role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
