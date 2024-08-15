import * as React from 'react';
import {
    AlertCircle,
    Archive,
    ArchiveX,
    AudioLines,
    BetweenHorizonalEnd,
    CassetteTape,
    File,
    HeartHandshake,
    Inbox,
    LayoutDashboard,
    ListEnd,
    MessagesSquare,
    PhoneCall,
    PhoneIncoming,
    ScrollText,
    Send,
    Settings,
    ShoppingCart,
    Trash2,
    UserCheck,
    Users2,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { Nav } from './Nav';

const Sidebar = ({ isCollapsed }: { isCollapsed: boolean, }) => {

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
                ]}
            />
            <Separator />
            {/* For Supervisor */}
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    { title: 'Call', label: '300', icon: PhoneIncoming, variant: 'ghost' },
                    { title: 'Recording', label: '120', icon: CassetteTape, variant: 'ghost' },
                    { title: 'Agent', label: '12', icon: Users2, variant: 'ghost' },
                    { title: 'CRM', label: '45', icon: HeartHandshake, variant: 'ghost' },
                    { title: 'IVR', label: '28', icon: AudioLines, variant: 'ghost' },
                ]}
            />
            <Separator />
            {/* For Admin */}
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    { title: 'CDR', label: '12', icon: ScrollText, variant: 'ghost' },
                    { title: 'Updates', label: '342', icon: AlertCircle, variant: 'ghost' },
                    { title: 'Settings', label: '456', icon: Settings, variant: 'ghost' },
                    { title: 'Sip(provider)', label: '128', icon: BetweenHorizonalEnd, variant: 'ghost' },
                    { title: 'Compagin', label: '128', icon: ListEnd, variant: 'ghost' },
                    { title: 'User', label: '8', icon: UserCheck, variant: 'ghost' },
                ]}
            />
        </div>
    );
};

export default Sidebar;
