import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'verify', title: 'Verify', href: paths.verify, icon: 'file-magnifying-glass' },
  // { key: 'claim', title: 'Claim', href: paths.claim, icon: 'hand-withdraw' },
  { key: 'myCertificate', title: 'My Certificate', href: paths.myCertificate, icon: 'certificate' },
  { key: 'issue', title: 'Issue', href: paths.issue, icon: 'signature' },
  { key: 'batchIssue', title: 'Batch Issue', href: paths.batchIssue, icon: 'signature' },
] satisfies NavItemConfig[];
