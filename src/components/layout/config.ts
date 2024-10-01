import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'verify', title: 'Verify', href: paths.verify, icon: 'file-magnifying-glass', admin: false },
  { key: 'myCertificate', title: 'My Certificate', href: paths.myCertificate, icon: 'certificate', admin: false },
  { key: 'issue', title: 'Issue', href: paths.issue, icon: 'signature', admin: true },
  { key: 'batchIssue', title: 'Batch Issue', href: paths.batchIssue, icon: 'signature', admin: true },
  { key: 'destroy', title: 'Destroy', href: paths.destroy, icon: 'fire', admin: true },
  { key: 'batchDestroy', title: 'Batch Destroy', href: paths.batchDestroy, icon: 'fire', admin: true },
] satisfies NavItemConfig[];
