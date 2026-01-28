import { getSession } from '@/lib/session';
import { getAllUsers, getAllProgress, getCertificationStats, getDemoRequestStats } from '@/lib/db';
import { MODULES } from '@/lib/modules';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Users, Award, Clock, BookOpen, CheckCircle, MessageSquare, UserPlus } from 'lucide-react';
import AdminAccessCodes from '@/components/AdminAccessCodes';

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  // Admin only access
  if (session.role !== 'admin') {
    redirect('/dashboard');
  }

  const users = await getAllUsers();
  const progressData = await getAllProgress();
  const certStats = await getCertificationStats();
  
  // Get demo request stats
  let demoStats = { totalCount: 0, recentCount: 0 };
  try {
    demoStats = await getDemoRequestStats();
  } catch (e) {
    // Table might not exist yet
  }

  // Calculate totals
  const totalUsers = users.length;
  const certifiedUsers = progressData.filter((p) => 
    parseInt(String(p.modules_completed)) === MODULES.length
  ).length;
  const certificationRate = totalUsers > 0 ? Math.round((certifiedUsers / totalUsers) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <ShieldCheck className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">Track team progress, review contributions, and manage leads.</p>
      </div>

      {/* Admin Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/admin/contributions"
          className="bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <MessageSquare className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors">Review Contributions</h2>
          </div>
          <p className="text-sm text-muted">Review and approve pending team contributions</p>
        </Link>

        <Link 
          href="/admin/leads"
          className="bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <UserPlus className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors">Demo Requests</h2>
          </div>
          <p className="text-sm text-muted">{demoStats.totalCount} total leads • {demoStats.recentCount} this week</p>
        </Link>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="font-semibold text-foreground">Team Overview</h2>
          </div>
          <p className="text-sm text-muted">{totalUsers} users • {certificationRate}% certified</p>
        </div>
      </div>

      {/* Access Codes & Invites */}
      <AdminAccessCodes />

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Users"
          value={totalUsers}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard 
          label="Certified"
          value={certifiedUsers}
          subtitle={`${certificationRate}% of team`}
          icon={<Award className="w-5 h-5" />}
          highlight
        />
        <StatCard 
          label="In Progress"
          value={totalUsers - certifiedUsers}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard 
          label="Modules"
          value={MODULES.length}
          icon={<BookOpen className="w-5 h-5" />}
        />
      </div>

      {/* Progress by department */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h2 className="text-base font-semibold mb-4">Progress by Department</h2>
        <div className="space-y-4">
          {certStats.map((dept) => {
            const total = parseInt(String(dept.total_users));
            const certified = parseInt(String(dept.certified_users));
            const percent = total > 0 ? Math.round((certified / total) * 100) : 0;
            
            return (
              <div key={String(dept.department)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{String(dept.department)}</span>
                  <span className="text-sm text-muted">{certified}/{total} certified ({percent}%)</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      percent === 100 ? 'bg-success' : percent > 50 ? 'bg-accent' : 'bg-warning'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User list */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left p-4 text-sm font-medium text-muted">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Department</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Progress</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {progressData.map((user) => {
                const completed = parseInt(String(user.modules_completed));
                const isCertified = completed === MODULES.length;
                const percent = Math.round((completed / MODULES.length) * 100);
                const userInfo = users.find((u) => u.id === user.user_id);
                
                return (
                  <tr key={String(user.user_id)} className="hover:bg-background/50">
                    <td className="p-4">
                      <span className="font-medium">{String(user.name)}</span>
                    </td>
                    <td className="p-4 text-sm text-muted">{String(user.email)}</td>
                    <td className="p-4 text-sm">{String(user.department)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isCertified ? 'bg-success' : 'bg-accent'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">{completed}/{MODULES.length}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {isCertified ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Certified
                        </span>
                      ) : completed > 0 ? (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                          In Progress
                        </span>
                      ) : (
                        <span className="text-xs bg-muted/20 text-muted px-2 py-1 rounded-full">
                          Not Started
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted">
                      {userInfo?.created_at ? new Date(userInfo.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  subtitle, 
  icon, 
  highlight 
}: { 
  label: string; 
  value: number; 
  subtitle?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-5 border ${
      highlight 
        ? 'bg-success/10 border-success/30' 
        : 'bg-surface border-border'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted text-sm">{label}</span>
        <span className={highlight ? 'text-success' : 'text-muted'}>{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${highlight ? 'text-success' : ''}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
    </div>
  );
}
