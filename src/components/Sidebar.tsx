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
        <div className='h-screen'>

            {/* <div className={cn('flex h-[52px] items-center justify-center', isCollapsed ? 'h-[52px]' : 'px-2')}> */}
            <Nav isCollapsed={isCollapsed} links={[
                { title: "BP Call-Center", label: '', icon: PhoneCall, variant: 'ghost' }
            ]} />
            {/* </div> */}
            <Separator />
            {/* For Agent */}
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    { title: 'Dashboard', label: '', icon: LayoutDashboard, variant: 'ghost' },
                    { title: 'Business', label: '', icon: Building2, variant: 'ghost' },
                    { title: 'IVR', label: '28', icon: AudioLines, variant: 'ghost' },
                    { title: 'Agent', label: '12', icon: Users2, variant: 'ghost' },
                    { title: 'Compagin', label: '128', icon: ListEnd, variant: 'ghost' },
                ]}
            />
            <Separator />
            {/* For Supervisor */}
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    { title: 'CDR', label: '12', icon: ScrollText, variant: 'ghost' },
                    { title: 'Log', label: '1200', icon: FileClock, variant: 'ghost' },
                    { title: 'Call History', label: '300', icon: History, variant: 'ghost' },
                    { title: 'Recording', label: '120', icon: CassetteTape, variant: 'ghost' },
                    { title: 'User', label: '8', icon: UserCheck, variant: 'ghost' },
                ]}
            />
            <Separator />
            {/* For Admin */}
            {userRole === 'admin' && (
                <Nav
                    isCollapsed={isCollapsed}
                    links={[
                        { title: 'Audio Store', label: '12', icon: FolderClock, variant: 'ghost' },
                        { title: 'Settings', label: '456', icon: Settings, variant: 'ghost' },
                        { title: 'Sip(provider)', label: '128', icon: BetweenHorizonalEnd, variant: 'ghost' },
                        { title: 'CRM', label: '45', icon: HeartHandshake, variant: 'ghost' },
                    ]}
                />
            )}
        </div>
    );
};

export default Sidebar;
