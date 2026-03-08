import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteConfig } from "@/lib/site-config";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  return (
    <div>
      <Nav />
      {authenticated ? <AdminDashboard initialConfig={await getSiteConfig()} /> : <AdminLogin />}
      <Footer />
    </div>
  );
}
