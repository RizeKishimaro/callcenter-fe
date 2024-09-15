
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from '../ui/drawer';
import { Badge } from '../ui/badge';
import LoggedCounter from '../../pages/admin/components/LoggedCounter';

const ActiveQueue = ({ sockets, spyAgent, stopSpy }: { sockets: any, spyAgent: any, stopSpy: any }) => {
  const containerWidth = 400; // Define the width of the container
  const containerHeight = 400; // Define the height of the container
  const iconSize = 64; // Size of the icons (h-16 w-16 in Tailwind CSS is 64px)

  // State to store agents' positions
  const [agentPositions, setAgentPositions] = useState<{ [key: string]: { top: string, left: string } }>({});

  // Generate random positions within the container, accounting for icon size
  const randomPosition = () => {
    return {
      top: Math.floor(Math.random() * (containerHeight - iconSize)) + 'px',
      left: Math.floor(Math.random() * (containerWidth - iconSize)) + 'px',
    };
  };

  // On new data, generate positions if not already set
  useEffect(() => {
    const updatedPositions = { ...agentPositions };

    sockets?.data?.forEach((agent: any) => {
      if (!updatedPositions[agent.userid]) {
        updatedPositions[agent.userid] = randomPosition(); // Assign random position if not already set
      }
    });

    setAgentPositions(updatedPositions);
  }, [sockets?.data]);

  // Calculate agent statistics
  const totalAgents = sockets?.data?.length || 0;
  const onlineAgents = sockets?.data?.filter((agent: any) => agent.isActive).length || 0;
  const idleAgents = totalAgents - onlineAgents;

  const getFirstLetter = (name: string): string => {
    const nameArray = name?.split('');
    return nameArray ? nameArray[0]?.toLocaleUpperCase() : "N/A";
  };

  return (
    <div className='bg-dashboardSecondary dark:bg-dashboardSecondary-foreground rounded-md h-full px-10 py-5'>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1 flex justify-center items-center h-20">
          <h3 className='text-5xl'>
            {sockets?.totalAgents || 0}
          </h3>
          <p className='text-sm uppercase'>
            Total <br></br>
            Agents
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center h-20">
          <h3 className='text-5xl'>
            {sockets?.onlineAgentLen || 0}
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
            Idle <br></br>
            Agents
          </p>
        </div>
      </div>

      <div className="overflow-hidden relative w-full h-[80%]">
        {sockets?.data && sockets?.data?.map((agent: any) => (
          <Draggable key={agent.userid} bounds="parent">
            <div
              className={`absolute ${agent.isActive ? 'opacity-100' : 'opacity-40'}`}
              style={agentPositions[agent.userid]} // Use the stored position for each agent
            >
              <Drawer>
                <DrawerTrigger>
                  <Avatar
                    onClick={() => {
                      if (!agent.isActive) return -1;
                      spyAgent(agent?.sipName);
                      return;
                    }}
                    className={`rounded-full h-16 w-16 cursor-pointer hover:scale-110 transition-all ease-in-out duration-200 bg-black ${agent.isActive ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <AvatarImage src={agent.profile} />
                    <AvatarFallback>{getFirstLetter(agent.displayName)}</AvatarFallback>
                  </Avatar>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="md:w-1/3 w-full mx-auto">
                    <div className="flex p-6 space-x-6 w-full">
                      <div className="flex-shrink-0 flex-1">
                        <Avatar className="rounded-full h-44 w-44">
                          <AvatarImage src={agent.profile} />
                          <AvatarFallback>{getFirstLetter(agent.displayName)}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex flex-col justify-center flex-1 h-full gap-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>Name:</div>
                          <div className="font-semibold">{agent.displayName}</div>
                          <div>Email:</div>
                          <div className="font-semibold">{agent.email || "-"}</div>
                          <div>Status:</div>
                          <div className="font-semibold">
                            {agent.isActive ? (
                              <Badge className='bg-success text-white'>Active</Badge>
                            ) : (
                              <Badge className='bg-red-400 text-white'>Inactive</Badge>
                            )}
                          </div>
                          <div>
                            Login Time:
                          </div>
                          <div className='font-semibold'>
                            <LoggedCounter loggedInTime={agent.loggedInTime} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <DrawerFooter>
                      <DrawerClose onClick={stopSpy} className='w-full bg-white text-black py-2 px-2 rounded-lg'>
                        Close
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

