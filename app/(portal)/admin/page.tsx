import { getSession } from '@/lib/session';
import { getAllUsers, getAllProgress, getCertificationStats } from '@/lib/db';
import { MODULES } from '@/lib/modules';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  // For now, allow all users to see admin (you can add role check later)
  // if (session.role !== 'admin') {
  //   redirect('/dashboard');
  // }

  const users = await getAllUsers();
  const progressData = await getAllProgress();
  const certStats = await getCertificationStats();

  // Calculate totals
  const totalUsers = users.length;
  const certifiedUsers = progressData.filter((p: { modules_completed: string }) => 
    parseInt(p.modules_completed) === MODULES.length
  ).length;
  const certificationRate = totalUsers > 0 ? Math.round((certifiedUsers / totalUsers) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted">Track team progress and certification status.</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Users"
          value={totalUsers}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard 
          label="Certified"
          value={certifiedUsers}
          subtitle={`${certificationRate}% of team`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
          highlight
        />
        <StatCard 
          label="In Progress"
          value={totalUsers - certifiedUsers}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          label="Modules"
          value={MODULES.length}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      </div>

      {/* Progress by department */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Progress by Department</h2>
        <div className="space-y-4">
          {certStats.map((dept: { department: string; total_users: string; certified_users: string }) => {
            const total = parseInt(dept.total_users);
            const certified = parseInt(dept.certified_users);
            const percent = total > 0 ? Math.round((certified / total) * 100) : 0;
            
            return (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{dept.department}</span>
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
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">All Users</h2>
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
              {progressData.map((user: {
                user_id: number;
                name: string;
                email: string;
                department: string;
                modules_started: string;
                modules_completed: string;
              }) => {
                const completed = parseInt(user.modules_completed);
                const isCertified = completed === MODULES.length;
                const percent = Math.round((completed / MODULES.length) * 100);
                const userInfo = users.find((u: { id: number }) => u.id === user.user_id);
                
                return (
                  <tr key={user.user_id} className="hover:bg-background/50">
                    <td className="p-4">
                      <span className="font-medium">{user.name}</span>
                    </td>
                    <td className="p-4 text-sm text-muted">{user.email}</td>
                    <td className="p-4 text-sm">{user.department}</td>
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
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
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
    <div className={`rounded-xl p-6 border ${
      highlight 
        ? 'bg-success/10 border-success/30' 
        : 'bg-surface border-border'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted text-sm">{label}</span>
        <span className={highlight ? 'text-success' : 'text-muted'}>{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${highlight ? 'text-success' : ''}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
    </div>
  );
}
