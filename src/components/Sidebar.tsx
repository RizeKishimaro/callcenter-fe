import * as React from 'react';
import {
  AlertCircle,
  AudioLines,
  BetweenHorizonalEnd,
  Building2,
  CassetteTape,
  FileClock,
  FolderClock,
  HeartHandshake,
  History,
  LayoutDashboard,
  ListEnd,
  PhoneCall,
  ScrollText,
  Settings,
  UserCheck,
  Users2,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { Nav } from './Nav';


const roleBasedAccess = {

  admin: [
    { title: 'Dashboard', label: '', icon: LayoutDashboard, variant: 'ghost', href: '/dashboard/manage' },
    { title: 'SetUp', label: '', icon: Building2, variant: 'ghost', href: '/dashboard/manage/admin/set-up' },
    { title: 'IVR', label: '', icon: AudioLines, variant: 'ghost', href: '/dashboard/manage/admin/ivr' },
    { title: 'Agent', label: '', icon: Users2, variant: 'ghost', href: '/dashboard/manage/agent' },
    { title: 'Campaign', label: '', icon: ListEnd, variant: 'ghost', href: '/dashboard/manage/admin/campaign' },
    // { title: 'CDR', label: '', icon: ScrollText, variant: 'ghost', href: '/dashboard/manage/cdr' },
    // { title: 'Log', label: '', icon: FileClock, variant: 'ghost', href: '/dashboard/manage/log' },
    { title: 'Call History', label: '', icon: History, variant: 'ghost', href: '/dashboard/manage/call-history' },
    // { title: 'Recording', label: '', icon: CassetteTape, variant: 'ghost', href: '/dashboard/manage/recording' },
    { title: 'User', label: '', icon: UserCheck, variant: 'ghost', href: '/dashboard/manage/admin' },
    { title: 'Audio Store', label: '', icon: FolderClock, variant: 'ghost', href: '/dashboard/manage/audio-store' },
    // { title: 'Settings', label: '', icon: Settings, variant: 'ghost', href: '/dashboard/manage/settings' },
    { title: 'Sip(provider)', label: '', icon: BetweenHorizonalEnd, variant: 'ghost', href: '/dashboard/manage/admin/sip-provider' },
    // { title: 'CRM', label: '', icon: HeartHandshake, variant: 'ghost', href: '/dashboard/manage/crm' },
  ],
  supervisor: [
    { title: 'Dashboard', label: '', icon: LayoutDashboard, variant: 'ghost', href: '/dashboard/manage' },
    { title: 'Agent', label: '', icon: Users2, variant: 'ghost', href: '/dashboard/manage/agent' },
    // { title: 'CDR', label: '', icon: ScrollText, variant: 'ghost', href: '/dashboard/manage/cdr' },
    // { title: 'Log', label: '', icon: FileClock, variant: 'ghost', href: '/dashboard/manage/log' },
    { title: 'Call History', label: '', icon: History, variant: 'ghost', href: '/dashboard/manage/call-history' },
    // { title: 'Recording', label: '', icon: CassetteTape, variant: 'ghost', href: '/dashboard/manage/recording' },
    { title: 'User', label: '', icon: UserCheck, variant: 'ghost', href: '/dashboard/manage/user' },
  ],
  agent: [
    { title: 'Call History', label: '', icon: History, variant: 'ghost', href: '/dashboard/manage/call-history' },
    { title: 'Agent', label: '', icon: Users2, variant: 'ghost', href: '/dashboard/agent/agent' },
  ],
};

const Sidebar = ({ userRole, isCollapsed }: { userRole: string, isCollapsed: boolean, }) => {
  const links = roleBasedAccess[userRole] || [];

  return (
    <div className='h-screen bg-dashboardPrimary text-white'>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          { title: "BP Call-Center", label: '', icon: PhoneCall, variant: 'ghost' }
        ]}
      />
      <Separator />
      <Nav isCollapsed={isCollapsed} links={links} />
      {/* <Separator /> */}
    </div>
  );
};

export default Sidebar;
