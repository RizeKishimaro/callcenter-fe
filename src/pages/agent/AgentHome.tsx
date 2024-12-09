
import { useRef, useState, useEffect, useMemo } from "react";
import JsSIP, { NameAddrHeader, UA } from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";
import {
  Input,
} from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { socket } from "../../providers/socket/socket";
import { useDecrypt } from "../../store/hooks/useDecrypt";
import axiosInstance from "../../providers/axiosClient";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../../components/ui/button";
import SecondCounter from "./SecondCounter";
import { UAConfiguration } from "jssip/lib/UA";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { WebPhoneComponent } from "../../components/web-phone";
import Crmform from "../../components/form/crm-form";

const AgentHome = () => {
  const remoteAudioRef = useRef(null);

  const [webphoneStatus, setWebphoneStatus] = useState(false);
  const [accountStatus, setAccountStatus] = useState(false);
  const [ua, setUa] = useState<UA | null>(null);
  const [session, setSession] = useState<RTCSession | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [service, setService] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [inviteNumber, setInviteNumber] = useState("");
  const [clientCount, setClientCount] = useState(0)
  const [providerAddress, setProviderAddress] = useState(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null)
  const audioElement = useRef<HTMLAudioElement | null>(null)
  const [pauseReason, setPauseReason] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const [agentData, setAgentData] = useState<any>(null);
  const [prefix, setPrefix] = useState<string>("");
  const volume = 50 / 100;

  const agentAccount = {
    sipUsername: useDecrypt(localStorage.getItem("sipUsername") || ""),
    sipPassword: useDecrypt(localStorage.getItem("password") || ""),
    agentId: localStorage.getItem("id") || ""
  };
  const location = useLocation()
  const queryClient = useQueryClient();

  // Function to play the ringtone when ringing
  const playRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.volume = volume
      ringtoneRef.current.play().catch((error) => {
        console.error("Failed to play ringtone:", error);
      });
    }
  };

  // Function to stop the ringtone
  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0; // Reset to start
    }
  };

  const getAgentInfo = async () => {
    const data = await axiosInstance.get(`/agent/${agentAccount.agentId}`);
    setPrefix(data?.data?.Campaign?.prefix)
    setAgentData(data.data);
    setProviderAddress(data?.data?.Campaign?.SipProvider?.host)
    const { status } = await axiosInstance.post(`/agent/loginQueue`, {
      username: `${agentAccount.sipUsername}_${data?.data?.Campaign?.prefix}`,
      campaign: data?.data?.Campaign?.name
    })

    return data
  };






  useEffect(() => {
    const handleBeforeUnload = (event) => {
      socket.emit('disconnectAgent');      // Optionally, you can set a message on the event to alert the user (optional)
      event.preventDefault();
      event.returnValue = '';
    };

    // Listen for window close or tab close
    window.addEventListener('beforeunload', handleBeforeUnload);


    // Listen for route changes
    // Clean up the event listener when the component is unmounted
    getAgentInfo()
  }, [])
  useEffect(() => {
    socket.emit("disconnectAgent")
  }, [location])

  useEffect(() => {
    if (prefix) {

      const wsSocket = new JsSIP.WebSocketInterface(`${import.meta.env.VITE_APP_WEBSOCKET_HOST}:${import.meta.env.VITE_APP_WEBSOCKET_PORT}/ws`)
      const configuration = {
        uri: `sip:${agentAccount.sipUsername}_${prefix}@${import.meta.env.VITE_APP_SIP_HOST}`,
        user_agent: "NextGenCC",
        sockets: [wsSocket],
        authorization_user: `${agentAccount.sipUsername}_${prefix}`,
        password: agentAccount.sipPassword,
        trace_sip: true,
      };



      const userAgent = new JsSIP.UA(configuration);
      JsSIP.debug.enable('JsSIP:*');


      setUa(userAgent)


      userAgent.on("disconnected", () => {
        console.log(userAgent.status)
      })
      userAgent.start();

      return () => {
        userAgent.stop()
      };
    }
  }, [prefix]);
  const sendActiveAgent = () => {
    socket.emit("idle", {
      isActive: isInCall
    });
  }
  const sendInactiveAgent = () => {
    socket.emit("incall", {
      isActive: isInCall
    });

  }
  useEffect(() => {
    const applySetInvite = (number) => {
      setInviteNumber(number);
    }
    ua?.on("newRTCSession", (e) => {
      const session: RTCSession = e?.session;
      setIsRinging(true);
      const number = session?.remote_identity?.display_name?.toString()
      setSession(session)
      applySetInvite(number)
      session.on('confirmed', () => {
        console.log("incall ")
        setIsInCall(true);
        setIsRinging(false);
        const peerConnection = session.connection;

        peerConnection.getReceivers().forEach((receiver) => {
          if (receiver.track.kind === 'audio') {
            if (audioElement.current) {
              const remoteStream = new MediaStream();
              remoteStream.addTrack(receiver.track);
              audioElement.current.srcObject = remoteStream;
              audioElement.current.play();
            }
          }
        });

      });

      session.on('ended', (data) => {
        if (agentData) {
          const total_second = (new Date(session?.end_time).getTime() - new Date(session?.start_time).getTime()) / 1000
          const hangUpfrom = !data?.message?.from ? agentAccount.agentId : null
          console.log(agentData)
          sendCallHistory(session?.remote_identity.uri.user,
            session.local_identity.uri.user, hangUpfrom, null, session.start_time, session?.end_time,
            total_second, data.cause, agentData?.Campaign?.name, session?.direction)
        } else {
          console.log("No Data FOund")
        }
        setIsInCall(false);
        setIsRinging(false);
        setIsCalling(false);
        sendActiveAgent()
      });

      session.on('failed', (data) => {
        if (agentData) {
          const total_second = !isNaN((new Date(session?.end_time).getTime() - new Date(session?.start_time).getTime()) / 1000) && null
          const hangUpfrom = !data?.message?.from ? agentAccount.agentId : null
          sendCallHistory(session?.remote_identity.uri.user,
            session.local_identity.uri.user, hangUpfrom, null, session.start_time, session?.end_time,
            total_second, data.cause, agentData?.Campaign?.name, session?.direction)
        }
        sendActiveAgent()

        setIsCalling(false);
        setIsInCall(false)
        setIsRinging(false);
      });


    });
    ua?.on("connected", () => {
    });
    ua?.on("disconnected", () => {
      ua?.start()
      console.log("disconnected")
      setWebphoneStatus(false)
    })
    ua?.on("registered", () => {
      setAccountStatus(true);
    })
    ua?.on("unregistered", () => {
      // ua?.register();
      console.log("unregistered")
      setAccountStatus(false)
    })



    return () => {
    };
  }, [ua]); useEffect(() => {
    if (isInCall) {
      sendInactiveAgent()
    }
  }, [isInCall])
  useEffect(() => {
    socket.on('connect', () => {
      setWebphoneStatus(true)
    });
    socket.emit('exchangeData', {
      userId: agentData?.id,
      displayName: agentData?.name,
      profile: agentData?.profile ? `${import.meta.env.VITE_APP_BACKEND_URL}/${agentData?.profile}` : "",
      sipName: agentData?.sipName,
      isActive: isInCall,
      socketRoom: agentData?.Campaign?.name,
      loggedInTime: new Date()
    });

    socket.emit('joinRoom', { room: agentData?.Campaign?.name });

    socket.on('exchangeComplete', (s) => {
      console.log('exchange complete', s);
    });

    socket.on('clientCount', (roomCounts) => {
      setClientCount(roomCounts)
    });
    socket.emit('getAgentData', (response) => {
    });
    if (isInCall) {
      sendInactiveAgent()
    }
    return () => {
      socket.off("joinRoom")
      socket.off("exchangeData")
      socket.off("exchangeComplete")
      socket.off("clientCount")
      socket.off("connect")
    }
  }, [agentData?.id]);

  const sendCallHistory = (remote_num, local_num, hangUpfrom?: any, transferFrom?: any,
    start_time, end_time, total_second, call_status, campaign_name, direction) => {
    const startdate = new Date(start_time).toISOString()
    const enddate = new Date(end_time).toISOString()
    axiosInstance.post(`/call-history`, {
      caller_number: remote_num,
      agent_number: local_num,
      call_hangup_by: hangUpfrom,
      transfer_by: transferFrom,
      call_start_time: startdate,
      call_end_time: enddate,
      total_seconds: Math.floor(total_second),
      direction: direction,
      agent_number_id: agentData?.id,
      call_status,
      campaign_name,
    })

  }
  const handleCall = () => {
    if (ua && !isCalling || !isInCall) {
      setIsCalling(true);
      setInviteNumber(phoneNumber)
      const options = {
        mediaConstraints: { audio: true, video: false },
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false },
        },
      };

      const destination = `sip:${phoneNumber}@${providerAddress}`;
      const callSession = ua?.call(destination, options);
      const peerConnection = callSession?.connection;

      callSession?.on("progress", () => {
        peerConnection?.getReceivers().forEach((receiver) => {
          if (receiver.track.kind === 'audio') {
            if (audioElement.current) {
              const remoteStream = new MediaStream();
              remoteStream.addTrack(receiver.track);
              audioElement.current.srcObject = remoteStream;
              audioElement.current.play();
            }
          }
        });
      });
      callSession?.on("accepted", () => {
        setIsInCall(true)
        const peerConnection = callSession?.connection;
        console.log(peerConnection.getReceivers())

        peerConnection.getReceivers().forEach((receiver) => {
          if (receiver.track.kind === 'audio') {
            if (audioElement.current) {
              const remoteStream = new MediaStream();
              remoteStream.addTrack(receiver.track);
              audioElement.current.srcObject = remoteStream;
              audioElement.current.play();
            }
          }
        });

      })

      callSession?.on('ended', (data) => {
        const total_second = (new Date(callSession?.end_time).getTime() - new Date(callSession?.start_time).getTime()) / 1000
        const hangUpfrom = !data?.message?.from ? agentAccount.agentId : null
        sendActiveAgent()
        sendCallHistory(callSession?.remote_identity.uri.user,
          callSession.local_identity.uri.user, hangUpfrom, null, callSession.start_time, callSession?.end_time,
          total_second, data.cause, agentData.Campaign.name, callSession?.direction)
        setIsInCall(false);
        setIsCalling(false);
        setInviteNumber("");
        // handlePause(agentAccount?.sipUsername, agentData?.Campaign.name);
      });

      callSession?.on('failed', (data) => {
        const total_second = (new Date(callSession?.end_time).getTime() - new Date(callSession?.start_time).getTime()) / 1000
        const hangUpfrom = !data?.message?.from ? agentAccount.agentId : null
        sendCallHistory(callSession?.remote_identity.uri.user,
          callSession.local_identity.uri.user, hangUpfrom, null, callSession.start_time, callSession?.end_time,
          total_second, data.cause, agentData.Campaign.name, callSession?.direction)
        setIsCalling(false);
        sendActiveAgent()

        setInviteNumber("");
      });
    }
  };


  const handlePause = async (agt_number, campaign_name) => {
    console.log(agt_number, campaign_name)
    const { status } = await axiosInstance.post(`/agent/pause`, {
      username: agt_number,
      campaign: campaign_name,
      reason: pauseReason
    });
    if (!status.toString().startsWith("2")) {
      setIsPaused(false)
      return 0;
    }
    setIsPaused(true)
    localStorage.setItem("paused", "true");
    console.log("paused")
    return 1;
  }


  const handleResume = async () => {
    const { status } = await axiosInstance.post(`/agent/resume`, {
      username: agentData?.sipName,
      campaign: agentData?.Campaign?.name,
    })
    setPauseReason("")
    setIsPaused(false)
    localStorage.setItem("paused", "false");
    return 1;
  }


  return (
    <main className="profile-page dark:bg-black w-full h-max overflow-y-scroll dark:text-white">
      <audio ref={remoteAudioRef} id="remoteAudio" autoPlay />
      <audio ref={ringtoneRef} id="ringtoneref" autoPlay />
      <div className="px-6 dark:bg-black min-h-screen h-max dark:text-white flex rounded-lg">
        <div className="flex flex-col w-full">
          <section className="relative block h-[500px]">
            <div
              className="absolute top-0 w-full h-full bg-center bg-cover border-t-0 rounded-t-lg"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80")',
              }}
            >
              <span id="blackOverlay" className="absolute w-full h-full bg-black opacity-50" />
            </div>
          </section>
          <audio ref={ringtoneRef} controls preload="true" loop src="/ringtone.mp3" className="hidden"></audio>
          <section className="relative py-16 bg-blueGray-200 dark:bg-black dark:text-white">
            <div className="container px-4 mx-auto">
              <div className="relative flex flex-col w-full min-w-0 mb-6 -mt-64 break-words bg-white rounded-lg shadow-xl">
                <div className="px-6 dark:bg-black min-h-screen flex h-max dark:text-white py-5 rounded-lg">
                  <div className="flex justify-center w-full max-w-2xl p-4">
                    <Card className="w-full">
                      <CardHeader className="relative pb-0">
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/10 rounded-full blur-xl" />
                            <Avatar className={`w-32 rounded-full overflow-hidden h-32 border-4 ${accountStatus ? "border-green-500" : "border-red-500"}  flex`}>
                              <AvatarImage
                                src={`${import.meta.env.VITE_APP_BACKEND_URL}${agentData?.profile}`}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                {agentData?.name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="mt-4 text-center space-y-2">
                            <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tight">
                                {agentData?.name}
                              </h2>
                              <p className="text-muted-foreground">
                                ({agentData?.sipName})
                              </p>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">SIP Status:</span>
                                {accountStatus ? (
                                  <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                                    Online
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">
                                    Offline
                                  </Badge>
                                )}
                              </div>
                              <Separator orientation="vertical" className="h-4" />
                              <div className="flex items-center gap-2">
                                <span className="text-sm">Online Agents:</span>
                                <Badge variant="outline" className="font-mono">
                                  {clientCount}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="text-center">
                            <CardTitle className="text-lg font-semibold">
                              Your Performance
                            </CardTitle>
                          </div>
                          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-1 text-center">
                              <span className="text-2xl font-bold tracking-tight">
                                {agentData?.outgoing || 0}
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Outbound
                              </p>
                            </div>
                            <div className="space-y-1 text-center">
                              <span className="text-2xl font-bold tracking-tight">
                                {agentData?.incoming || 0}
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Inbound
                              </p>
                            </div>
                            <div className="space-y-1 text-center">
                              <span className="text-2xl font-bold tracking-tight">
                                {agentData?.totalSeconds || 0}
                                <span className="text-sm font-normal ml-1">(s)</span>
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Total Call Time
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Crmform />
                        </div>
                      </CardContent>
                    </Card>
                  </div>                  <div className="md:w-2/4 w-full h-full my-auto p-4 flex flex-col">

                    <WebPhoneComponent ua={ua} providerAddress={providerAddress} accountStatus={accountStatus} />
                    {/* <div className="border-2 rounded-lg p-3 mb-3"> */}
                    {/* <div className=" text-center flex items-center justify-center"> */}
                    {/*   <p className="text-xl font-medium">WebPhone</p> */}
                    {/*   <span className="relative flex h-3 w-3 ml-3"> */}
                    {/*     <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${webphoneStatus ? "bg-green-400" : "bg-red-400"} opacity-75`}></span> */}
                    {/*     <span className={`relative inline-flex rounded-full h-3 w-3 ${webphoneStatus ? "bg-green-600" : "bg-red-600"} `}></span> */}
                    {/*   </span> */}
                    {/* </div> */}
                    {/* <div className="text-center">
                        <span className="opacity-75 ml-3 text-center text-sm">(if this is red it's lying)</span>

                      </div> */}
                    {/* <div className="ml-3 my-3"> */}

                    {/* <div className="flex flex-col"> */}
                    {/*   {isRinging && ( */}
                    {/*     <p className="flex mb-3"> */}
                    {/*       <PhoneIcon className="mr-2" /> */}
                    {/*       <span>{inviteNumber ? inviteNumber : "Unknown"}</span> */}
                    {/*     </p> */}
                    {/*   )} */}
                    {/*   {isInCall && ( */}
                    {/*     <p className="flex mb-3"> */}
                    {/*       <PhoneIcon className="mr-2" /> */}
                    {/*       <span>{inviteNumber ? inviteNumber : "Unknown"}</span> */}
                    {/*     </p> */}
                    {/*   )} */}
                    {/*   {isRinging && ( */}
                    {/*     <p className="flex mb-3"> */}
                    {/*       <Server className="mr-2" /> */}
                    {/*       <span>{service ? service : "Unknown Service"}</span> */}
                    {/*     </p> */}
                    {/*   )} */}

                    {/*   {!isRinging && isInCall && ( */}
                    {/*     <> */}
                    {/*       <div className="flex mb-3"> */}
                    {/*         <Clock className="mr-2" /> */}
                    {/*         <SecondCounter /> */}
                    {/*       </div> */}
                    {/*       <p className="flex mb-3"> */}
                    {/*         <Server className="mr-2" /> */}
                    {/*         <span>{service ? service : "Unknown Service"}</span> */}
                    {/*       </p> */}

                    {/*     </> */}
                    {/*   ) */}
                    {/*   } */}
                    {/* </div> */}

                    {/* <div className="my-5"> */}
                    {/*   {!isCalling && !isRinging && !isInCall && ( */}
                    {/*     <Input */}
                    {/*       placeholder="Enter Phone Number" */}
                    {/*       onChange={(e) => setPhoneNumber(e.target.value)} */}
                    {/*       className="w-2/4 mx-auto mb-3" */}
                    {/*     /> */}
                    {/*   )} */}
                    {/*   {isInCall && ( */}
                    {/*     <> */}
                    {/*       <Input */}
                    {/*         placeholder="Enter DTMF To Send" */}
                    {/*         onChange={(e) => { */}
                    {/*           const number = e.target.value.at(-1); */}
                    {/*           console.log(number); */}
                    {/*           sendDTMF(number); */}
                    {/*         }} */}
                    {/*         className="w-2/4 mx-auto mb-3" */}
                    {/*       /> */}
                    {/*       <Input */}
                    {/*         placeholder="Enter Number To Transfer" */}
                    {/*         onChange={(e) => setDialpadNumber(e.target.value)} */}
                    {/*         className="w-2/4 mx-auto mb-3" */}
                    {/*       /> */}
                    {/*     </> */}
                    {/*   )} */}
                    {/* </div> */}

                    <audio ref={audioElement} autoPlay className="hidden" />
                    <audio ref={ringtoneRef} src="/ringtone.mp3" className="hidden" />

                    {/* {isCalling && !isInCall && <p>Calling...</p>} */}

                    {/* <div className="flex justify-center items-center"> */}
                    {/*   {!isCalling && !isRinging && !isInCall && ( */}
                    {/*     <button */}
                    {/*       className={`${!phoneNumber ? "opacity-50" : ""} p-5 bg-green-400 rounded-full mr-3`} */}
                    {/*       disabled={!phoneNumber} */}
                    {/*       onClick={handleCall} */}
                    {/*     > */}
                    {/*       <PhoneCall /> */}
                    {/*     </button> */}
                    {/*   )} */}
                    {/*   {isRinging && !isInCall && ( */}
                    {/*     <> */}
                    {/*       {!isCalling && <> */}
                    {/*         <button onClick={handleAnswer} className="p-5 bg-green-400 rounded-full mr-3"> */}
                    {/*           <PhoneIncoming /> */}
                    {/*         </button> */}

                    {/*       </>} */}
                    {/*       <button className="p-5 bg-red-400 rounded-full mr-3" onClick={handleHangup}> */}
                    {/*         <PhoneOff /> */}
                    {/*       </button> */}
                    {/*     </> */}
                    {/*   )} */}

                    {/* {isInCall && ( */}
                    {/*   <> */}
                    {/*     <button className="p-5 bg-red-400 rounded-full mr-3" onClick={handleHangup}> */}
                    {/*       <PhoneOff /> */}
                    {/*     </button> */}
                    {/*     <button className="p-5 bg-red-400 rounded-full mr-3" onClick={transferCall}> */}
                    {/*       <PhoneForwarded /> */}
                    {/*     </button> */}
                    {/*     {!isMuted ? <button className="p-5 bg-red-400 rounded-full mr-3" onClick={muteCall}> */}
                    {/*       <MicOff /> */}
                    {/*     </button> */}
                    {/*       : <button className="p-5 bg-green-400 rounded-full mr-3" onClick={unmuteCall}> */}
                    {/*         <MicOff /> */}
                    {/*       </button> */}
                    {/*     } */}
                    {/*     {!isHold ? <button className="p-5 bg-red-400 rounded-full mr-3" onClick={holdCall}> */}
                    {/*       <Hand /> */}
                    {/*     </button> */}
                    {/*       : <button className="p-5 bg-green-400 rounded-full mr-3" onClick={unHoldCall}> */}
                    {/*         <Hand /> */}
                    {/*       </button> */}
                    {/*     } */}

                    {/*   </> */}
                    {/* )} */}
                    {/* </div> */}
                    {/* </div> */}

                    {/* </div> */}
                    <div className="mt-4 p-4 border-2 rounded-lg">
                      <h3 className="text-center font-medium text-xl mb-3">Pause Me</h3>
                      {
                        !isPaused && localStorage.getItem("paused") != "true" ? (<>
                          <div className="mb-3 w-2/4 mx-auto">
                            <Input placeholder="Reason" onChange={
                              (e) => {
                                setPauseReason(e.target.value)
                              }} />
                          </div>
                          <div className="text-center" >
                            <Button disabled={!pauseReason} onClick={() => {
                              handlePause(agentAccount?.sipUsername, agentData?.Campaign.name)
                            }} variant={"secondary"}>Pause</Button>
                          </div>

                        </>) : (<>
                          <p className="text-center mb-3">You are paused</p>
                          <div className="text-center" >
                            <Button onClick={() => {
                              handleResume()
                              setIsPaused(true)
                            }} variant={"secondary"}>Resume</Button>
                          </div>

                        </>)
                      }
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </section>
        </div>
      </div >
    </main >
  );
};

export default AgentHome;

