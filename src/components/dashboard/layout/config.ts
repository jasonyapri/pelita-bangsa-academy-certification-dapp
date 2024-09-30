import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'validate', title: 'Validate', href: paths.dashboard.validate, icon: 'file-magnifying-glass' },
  // { key: 'claim', title: 'Claim', href: paths.dashboard.claim, icon: 'hand-withdraw' },
  { key: 'myCertificate', title: 'My Certificate', href: paths.dashboard.myCertificate, icon: 'certificate' },
  { key: 'issue', title: 'Issue', href: paths.dashboard.issue, icon: 'signature' },
  { key: 'batchIssue', title: 'Batch Issue', href: paths.dashboard.batchIssue, icon: 'signature' },
  // { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
