import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { Smiley as SmileyIcon } from '@phosphor-icons/react/dist/ssr/Smiley';
import { FileMagnifyingGlass as FileMagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/FileMagnifyingGlass';
import { HandWithdraw as HandWithdrawIcon } from '@phosphor-icons/react/dist/ssr/HandWithdraw';
import { Certificate as CertificateIcon } from '@phosphor-icons/react/dist/ssr/Certificate';
import { Signature as SignatureIcon } from '@phosphor-icons/react/dist/ssr/Signature';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'smiley': SmileyIcon,
  'file-magnifying-glass': FileMagnifyingGlassIcon,
  'hand-withdraw': HandWithdrawIcon,
  'certificate': CertificateIcon,
  'signature': SignatureIcon,
  'magnifying-glass': MagnifyingGlassIcon,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
