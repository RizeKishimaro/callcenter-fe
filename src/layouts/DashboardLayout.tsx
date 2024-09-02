import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import React, { useEffect } from 'react';
import { TooltipProvider } from '../components/ui/tooltip';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';
import { cn } from '../lib/utils';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../service/auth/authService';
import { useToast } from '../components/ui/use-toast';
import Loading from '../components/Loading';

interface DashboardLayoutProps {
  userRole: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userRole }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [panelSize, setPanelSize] = React.useState(15); // Default size for the panel
  const navCollapsedSize = 10; // Adjust this value as needed
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const handleResize = (size: number) => {
    setPanelSize(size);
    setIsCollapsed(size <= navCollapsedSize);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['Profile'],
    queryFn: () => getProfile(),
    onSuccess: (data) => {
      console.log(" The data from backend: ", data);
    },
    onError: (error) => {
      console.log("ON ERROR : ", error);
      if (error?.response?.data?.statusCode === 401) {
        navigate('/sign-in');
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: `Error: ${error?.response?.data?.message}`,
        });
      }
    },
  });

  useEffect(() => {
    if (!isLoading && isError) {
      if (error?.response?.data?.statusCode === 401) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: `Please sign-in`,
        });
        navigate('/sign-in');
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: `Error: ${error?.response?.data?.message}`,
        });
      }
    }
  }, [isLoading, isError, error, navigate, toast]);

  useEffect(() => {
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

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      switch (userRole) {
        case 'admin':
        case 'supervisor':
          navigate('/dashboard/manage', { replace: true });
          break;
        case 'agent':
          navigate('/dashboard/agent', { replace: true });
          break;
        default:
          navigate('/sign-in', { replace: true });
          break;
      }
    }
  }, [userRole, location.pathname, navigate]);

  //if (isLoading) return <Loading />;

  return (
    <>
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
    </>
  );
};

export default DashboardLayout;
