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
    PhoneIncoming,
    ScrollText,
    Settings,
    UserCheck,
    Users2,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { Nav } from './Nav';

const  Sidebar = ({ userRole, isCollapsed }: { userRole: string, isCollapsed: boolean, }) => {

    return (
        <div className='h-screen bg-dashboardPrimary text-white'>

            {/* <div className={cn('flex h-[52px] items-center justify-center', isCollapsed ? 'h-[52px]' : 'px-2')}> */}
            <Nav isCollapsed={isCollapsed} links={[
                { title: "BP Call-Center", label: '', icon: PhoneCall, variant: 'ghost' }
            ]} />
            {/* </div> */}
            {/* <Separator /> */}
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    { title: 'Dashboard', label: '', icon: LayoutDashboard, variant: 'ghost', href: '/dashboard/manage' },
                    { title: 'Business', label: '', icon: Building2, variant: 'ghost', href: '/dashboard/manage/business' },
                    { title: 'IVR', label: '28', icon: AudioLines, variant: 'ghost', href: '/dashboard/manage/ivr' },
                    { title: 'Agent', label: '12', icon: Users2, variant: 'ghost', href: '/dashboard/manage/agent' },
                    { title: 'Campaign', label: '128', icon: ListEnd, variant: 'ghost', href: '/dashboard/manage/campaign' },
                ]}
            />
            <Separator />
            {/* For Supervisor */}
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    { title: 'CDR', label: '12', icon: ScrollText, variant: 'ghost', href: '/dashboard/manage/cdr' },
                    { title: 'Log', label: '1200', icon: FileClock, variant: 'ghost', href: '/dashboard/manage/log' },
                    { title: 'Call History', label: '300', icon: History, variant: 'ghost', href: '/dashboard/manage/call-history' },
                    { title: 'Recording', label: '120', icon: CassetteTape, variant: 'ghost', href: '/dashboard/manage/recording' },
                    { title: 'User', label: '8', icon: UserCheck, variant: 'ghost', href: '/dashboard/manage/user' },
                ]}
            />
            <Separator />
            {/* For Admin */}
            {userRole === 'admin' && (
                <Nav
                    isCollapsed={isCollapsed}
                    links={[
                        { title: 'Audio Store', label: '12', icon: FolderClock, variant: 'ghost', href: '/dashboard/manage/audio-store' },
                        { title: 'Settings', label: '456', icon: Settings, variant: 'ghost', href: '/dashboard/manage/settings' },
                        { title: 'Sip(provider)', label: '128', icon: BetweenHorizonalEnd, variant: 'ghost', href: '/dashboard/manage/sip-provider' },
                        { title: 'CRM', label: '45', icon: HeartHandshake, variant: 'ghost', href: '/dashboard/manage/crm' },
                    ]}
                />
            )}
        </div>
    );
};

export default Sidebar;
