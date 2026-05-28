import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getContactsGroupedByCompany, findOpportunityForCompany, type Opportunity } from './data';
import QuickSendForm from './QuickSendForm';

export type CompanyGroup = {
  company: string;
  opportunity: Opportunity | null;
  contacts: { id: string; email: string; company: string }[];
};

export default async function QuickSendPage() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) redirect('/login');
  if (session.role !== 'admin') redirect('/dashboard');

  const grouped = getContactsGroupedByCompany();
  const groups: CompanyGroup[] = grouped.map(({ company, contacts }) => ({
    company,
    opportunity: findOpportunityForCompany(company) || null,
    contacts,
  }));

  return <QuickSendForm groups={groups} />;
}
