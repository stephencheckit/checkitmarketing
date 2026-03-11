import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import AdminInboxWidget from '@/components/AdminInboxWidget';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <LayoutDashboard className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
          Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Marketing activity overview
        </p>
      </div>

      {session.role === 'admin' && (
        <AdminInboxWidget />
      )}

      <DashboardShell />
    </div>
  );
}
