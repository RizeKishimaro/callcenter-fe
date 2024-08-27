import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import React from 'react';
import { TooltipProvider } from '../components/ui/tooltip';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';
import { cn } from '../lib/utils';
import Navbar from '../components/Navbar';

interface DashboardLayoutProps {
  userRole: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userRole }) => {


  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [panelSize, setPanelSize] = React.useState(15); // Default size for the panel
  const navCollapsedSize = 10; // Adjust this value as needed

  const handleResize = (size: number) => {
    setPanelSize(size);
    setIsCollapsed(size <= navCollapsedSize);
  };

  // Watch for window resize events
  React.useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth <= 768) { // Medium size or below
        setIsCollapsed(true);
      } else if (!isCollapsed) {
        setPanelSize(15); // Reset to default size when window is larger
      }
    };

    // Add event listener
    window.addEventListener('resize', handleWindowResize);

    // Initial check
    handleWindowResize();

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isCollapsed]);

  const location = useLocation();

  if (location.pathname === '/dashboard') {
    switch (userRole) {
      // case 'admin':
      //   return <Navigate to="/dashboard/admin" replace />;
      // case 'supervisor':
      //   return <Navigate to="/dashboard/supervisor" replace />;
      case 'agent':
        return <Navigate to="/dashboard/agents" replace />;
      default:
        return <Navigate to="/dashboard/manage" replace />;
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          if (sizes.length === 0) {
            sizes = [navCollapsedSize];
          }
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
        }}
        className="items-stretch"
      >
        <ResizablePanel
          defaultSize={panelSize}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={navCollapsedSize}
          maxSize={15}
          onResize={handleResize}
          className={cn(isCollapsed && 'max-w-[50px] transition-all duration-300 ease-in-out')}
        >
          <div className="overflow-auto w-auto h-auto">
            <Sidebar userRole={userRole} isCollapsed={isCollapsed} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction='vertical'>
            <ResizablePanel defaultSize={12}><Navbar /></ResizablePanel>
            <ResizablePanel>
              <div className="overflow-auto w-auto h-full">
                <Outlet />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default DashboardLayout;
