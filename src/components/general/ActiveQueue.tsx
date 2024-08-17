import Draggable from 'react-draggable';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { activeAgentProps } from '../../providers/types/agent';
import { agents } from '../../constant/agent';
import { Badge } from '../ui/badge';

const ActiveQueue = () => {
  const containerWidth = 400; // Define the width of the container
  const containerHeight = 400; // Define the height of the container
  const iconSize = 64; // Size of the icons (h-16 w-16 in Tailwind CSS is 64px)

  // Generate random positions within the container, accounting for icon size
  const randomPosition = () => {
    return {
      top: Math.floor(Math.random() * (containerHeight - iconSize)) + 'px',
      left: Math.floor(Math.random() * (containerWidth - iconSize)) + 'px',
    };
  };

  // Calculate agent statistics
  const totalAgents = agents.length;
  const onlineAgents = agents.filter(agent => agent.isActive).length;
  const idleAgents = totalAgents - onlineAgents;

  const allAgents: activeAgentProps[] = agents;
  return (
    <div className='bg-dashboardSecondary dark:bg-dashboardSecondary-foreground rounded-md h-full px-10 py-5'>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1 flex justify-center items-center h-20">
          <h3 className='text-5xl'>
            {totalAgents}
          </h3>
          <p className='text-sm uppercase'>
            Total <br></br>
            Agents
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center h-20">
          <h3 className='text-5xl'>
            {onlineAgents}
          </h3>
          <p className='text-sm uppercase'>
            Online <br></br>
            Agents
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center h-20">
          <h3 className='text-5xl'>
            {idleAgents}
          </h3>
          <p className='text-sm uppercase'>
            idle <br></br>
            Agents
          </p>
        </div>
      </div>
      <div
        className="overflow-hidden relative w-full h-[80%]"
      >
        {allAgents.map((agent) => (
          <Draggable key={agent.id} bounds="parent">
            <div
              className={`absolute ${agent.isActive ? 'opacity-100' : 'opacity-40'}`}
              style={randomPosition()}
            >
              <Drawer>
                <DrawerTrigger>
                  <Avatar className={`rounded-full h-16 w-16 cursor-pointer hover:scale-110 transition-all ease-in-out duration-200 bg-black ${agent.isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <AvatarImage src="" />
                    <AvatarFallback>{agent.name}</AvatarFallback>
                  </Avatar>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="md:w-1/3 w-full mx-auto">
                    <div className="flex p-6 space-x-6 w-full">
                      {/* User Image on the left */}
                      <div className="flex-shrink-0 flex-1">
                        <Avatar className="rounded-full h-44 w-44">
                          <AvatarImage src={agent.img} />
                          <AvatarFallback>{agent.name}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex flex-col justify-center flex-1 h-full gap-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>Name:</div>
                          <div className="font-semibold">{agent.name}</div>
                          <div>Email:</div>
                          <div className="font-semibold">{agent.email}</div>
                          <div>Status:</div>
                          <div className="font-semibold">{agent.isActive ? (
                            <Badge className='bg-success text-white'>Active</Badge>
                          ) : (
                            <Badge className='bg-red-400 text-white'>InActive</Badge>
                          )}</div>
                          <div>Gender:</div>
                          <div className="font-semibold">{agent.gender}</div>
                          <div>Address:</div>
                          <div className="font-semibold">{agent.address}</div>
                          <div>Call Time:</div>
                          <div className="font-semibold">{agent.callTime} - minutes</div>
                        </div>
                      </div>
                    </div>
                    <DrawerFooter>
                      <DrawerClose>
                        <Button className='w-full'>Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default ActiveQueue;
