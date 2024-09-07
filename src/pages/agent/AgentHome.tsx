
import { useRef, useState, useEffect, useMemo } from "react";
import JsSIP, { UA } from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";
import { Clock, MicOff, PhoneCall, PhoneForwarded, PhoneIcon, PhoneIncoming, PhoneOff, PhoneOffIcon } from "lucide-react";
import {
  Input,
} from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { socket } from "../../providers/socket/socket";
import { useDecrypt } from "../../store/hooks/useDecrypt";
import axiosInstance from "../../providers/axiosClient";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../../components/ui/button";
import SecondCounter from "./SecondCounter";
import { UAConfiguration } from "jssip/lib/UA";

const AgentHome = () => {
  const remoteAudioRef = useRef(null);
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [webphoneStatus, setWebphoneStatus] = useState(false);
  const [accountStatus, setAccountStatus] = useState(false);
  const [ua, setUa] = useState<UA | null>(null);
  const [session, setSession] = useState<RTCSession | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [dialpadNumber, setDialpadNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [inviteNumber, setInviteNumber] = useState("");
  const [clientCount, setClientCount] = useState(0)
  const [providerAddress, setProviderAddress] = useState(null);
  const audioElement = useRef<HTMLAudioElement | null>(null)
  const [pauseReason, setPauseReason] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const [agentData, setAgentData] = useState<any>(null);

  const agentAccount = {
    sipUsername: useDecrypt(localStorage.getItem("sipUsername") || ""),
    sipPassword: useDecrypt(localStorage.getItem("password") || ""),
    agentId: localStorage.getItem("id") || ""
  };
  const getAgentInfo = async () => {
    const data = await axiosInstance.get(`/agent/${agentAccount.agentId}`);
    setAgentData(data.data);
    setProviderAddress(data.data.SipProvider.host)

    return data
  };
  const sendInactiveAgent = () => {
    setIsConnected(false);
    socket.emit("incall", {
      isActive: isInCall
    });

  }
  const sendActiveAgent = () => {
    setIsConnected(true);
    socket.emit("idle", {
      isActive: isInCall
    });

  }


  useEffect(() => {
    const wsSocket = new JsSIP.WebSocketInterface(`${import.meta.env.VITE_APP_WEBSOCKET_HOST}:${import.meta.env.VITE_APP_WEBSOCKET_PORT}/ws`)
    const configuration: UAConfiguration = {
      uri: `sip:${agentAccount.sipUsername}@${import.meta.env.VITE_APP_SIP_HOST}`,
      sockets: [wsSocket],
      authorization_user: agentAccount.sipUsername,
      password: agentAccount.sipPassword,
    };

    const userAgent = new JsSIP.UA(configuration);


    setUa(userAgent)


    userAgent.on("disconnected", () => {
      console.log(userAgent.status)
    })
    userAgent.start();
    getAgentInfo()

    return () => {
      // userAgent.stop()
    };
  }, []);

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
          handlePause(agentAccount.sipUsername, agentData?.Campaign?.name)
        } else {
          console.log("No Data FOund")
        }
        setIsInCall(false);
        setIsRinging(false);
        setIsCalling(false);
        setIsPaused(true)
        sendActiveAgent()
        console.log("ended")
      });

      session.on('failed', (data) => {
        if (agentData) {
          const total_second = isNaN((new Date(session?.end_time).getTime() - new Date(session?.start_time).getTime()) / 1000) && null
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
  }, [ua]);
  useEffect(() => {
    if (isInCall) {
      sendInactiveAgent()
    }
  }, [isInCall])
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
      setWebphoneStatus(true)
    });

    socket.emit('exchangeData', {
      userId: agentData?.id,
      displayName: agentData?.name,
      profile: agentData?.profile ? `${import.meta.env.VITE_APP_BACKEND_URL}/${agentData?.profile}` : "",
      sipName: agentData?.sipName,
      isActive: isInCall
    });

    socket.emit('joinRoom', { room: agentData?.Campaign?.name });

    socket.on('exchangeComplete', (s) => {
      console.log('exchange complete', s);
    });
    socket.on("agentData", (data) => {
      console.log(data)
    })
    socket.on('clientCount', (roomCounts) => {
      setClientCount(roomCounts)
    });
    socket.emit('getAgentData', (response) => {
      console.log('Agent data:', response);
    });
    if (isInCall) {
      sendInactiveAgent()
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
        console.log(hangUpfrom);
        sendActiveAgent()
        sendCallHistory(callSession?.remote_identity.uri.user,
          callSession.local_identity.uri.user, hangUpfrom, null, callSession.start_time, callSession?.end_time,
          total_second, data.cause, agentData.Campaign.name, callSession?.direction)
        setIsInCall(false);
        setIsCalling(false);
        setInviteNumber("");
        setIsPaused(true)
        handlePause(agentAccount?.sipUsername, agentData?.Campaign.name);
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

  const handleHangup = () => {
    if (session) {
      session.terminate();
      setIsInCall(false);
      setIsRinging(false);
    }
  };
  const handlePause = async (agt_number, campaign_name) => {
    console.log(agt_number, campaign_name)
    const { status } = await axiosInstance.post(`/agent/pause`, {
      username: agt_number,
      campaign: campaign_name,
      reason: pauseReason
    });
    console.log(status)
    if (!status.toString().startsWith("2")) {
      setIsPaused(false)
      return 0;
    }
    setIsPaused(true)
    localStorage.setItem("paused", "true");
    console.log("paused")
    return 1;
  }
  const muteCall = () => {
    if (session) {
      session.mute();
    }
  }
  const unmuteCall = () => {
    if (session) {
      session.unmute();
    }
  }

  const handleAnswer = () => {
    if (session && isRinging) {
      session.answer();
      setIsInCall(true);
      setIsRinging(false);
    }
  };

  const transferCall = () => {
    if (session && dialpadNumber) {
      setDialpadNumber('')
      const target = `sip:${dialpadNumber}@${providerAddress}`;
      session.refer(target);
    }
  };

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
  const sendDTMF = (value: string) => {
    if (session && isInCall) {
      session.sendDTMF(value);
    }
  };



  return (
    <main className="profile-page dark:bg-gray-600 w-full h-max overflow-y-scroll dark:text-white">
      <audio ref={remoteAudioRef} id="remoteAudio" autoPlay />
      <div className="px-6 dark:bg-gray-600 min-h-screen h-max dark:text-white flex rounded-lg">
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

          <section className="relative py-16 bg-blueGray-200 dark:bg-gray-600 dark:text-white">
            <div className="container px-4 mx-auto">
              <div className="relative flex flex-col w-full min-w-0 mb-6 -mt-64 break-words bg-white rounded-lg shadow-xl">
                <div className="px-6 dark:bg-gray-600 min-h-screen flex h-max dark:text-white py-5 rounded-lg">
                  <div className="flex justify-center mb-5 w-2/4 flex-wrap">
                    <div className="flex w-full flex-1 px-4 lg:order-2 dark:bg-gray-600 dark:text-white">
                      <div className="w-full">
                        <div className="my-5 flex flex-col justify-center w-full">
                          <div className="mx-auto mb-3">
                            <Avatar className="">

                              <AvatarImage className="shadow-xl rounded-full h-auto border-green-500 max-w-[150px]" src={`${import.meta.env.VITE_APP_BACKEND_URL}${agentData?.profile}`}
                              />
                              <AvatarFallback>Agent</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex w-full text-center flex-col justify-center">
                            <div>
                              <p className="text-2xl font-bold">{agentData?.name}<span className="font-normal ml-2">({agentData?.sipName})</span></p>
                            </div>
                            <div className="mt-3">
                              status: {accountStatus ? <span
                                className="inline-block text-muted whitespace-nowrap rounded-full bg-emerald-200 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-success-700 dark:bg-emerald-700 dark:text-success-500/80">
                                online
                              </span> : <span
                                className="inline-block whitespace-nowrap rounded-full bg-danger-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-danger-700 dark:bg-[#2c0f14] dark:text-danger-500 ">
                                offline
                              </span>}
                              <p className="text-sm mt-2">Online Agents: {clientCount}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5">
                          <div className="">
                            <p className="text-lg font-bold text-center">Your Performance</p>
                          </div>
                          <div className="mt-3 w-full flex gap-3 mx-auto justify-center">
                            <p className="mb-1 font-bold flex flex-col text-center ">{89} <span className="font-normal">Transfer</span></p>
                            <p className="mb-1 font-bold flex flex-col text-center">{30}<span className="font-normal">Outbound</span></p>
                            <p className="mb-1 font-bold flex flex-col text-center">{4.3}<span className="font-normal">Rating</span></p>
                          </div>
                        </div>
                        <div className="mt-10 w-[75%] mx-auto">
                          <div className="font-bold">
                            <p className="text-center">CRM Form</p>
                          </div>
                          <div className="mt-3">
                            <div className="mb-2">
                              <Input type="text" placeholder="CRM Information" />
                            </div>
                            <div className="mb-2">
                              <Input type="text" placeholder="CRM Information" />
                            </div>
                            <div className="mb-2">
                              <Select>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="CRM Information" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select Commands</SelectLabel>
                                    <SelectItem value="ssh">SSH</SelectItem>
                                    <SelectItem value="pwd">PWD</SelectItem>
                                    <SelectItem value="ip">IP</SelectItem>
                                    <SelectItem value="whoami">WhoAmI</SelectItem>
                                    <SelectItem value="sudo">Sudo</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="text-center">
                              <Button variant={"secondary"} >Submit</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/4 w-full h-full my-auto p-4 flex flex-col">
                    <div className="border-2 rounded-lg p-3 mb-3">
                      <div className=" text-center flex items-center justify-center">
                        <p className="text-xl font-medium">WebPhone</p>
                        <span className="relative flex h-3 w-3 ml-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${webphoneStatus ? "bg-green-400" : "bg-red-400"} opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${webphoneStatus ? "bg-green-600" : "bg-red-600"} `}></span>
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="opacity-75 ml-3 text-center text-sm">(if this is red it's lying)</span>

                      </div>
                      <div className="ml-3 my-3">

                        <div className="flex flex-col">
                          {isRinging && (
                            <p className="flex mb-3">
                              <PhoneIcon className="mr-2" />
                              <span>{inviteNumber ? inviteNumber : "unknown"}</span>
                            </p>
                          )}
                          {isInCall && (
                            <p className="flex mb-3">
                              <PhoneIcon className="mr-2" />
                              <span>{inviteNumber ? inviteNumber : "unknown"}</span>
                            </p>
                          )}

                          {!isRinging && isInCall && (
                            <>


                              <div className="flex mb-3">
                                <Clock className="mr-2" />
                                <SecondCounter />
                              </div>

                            </>
                          )
                          }
                        </div>

                        <div className="my-5">
                          {!isCalling && !isRinging && !isInCall && (
                            <Input
                              placeholder="Enter Phone Number"
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-2/4 mx-auto mb-3"
                            />
                          )}
                          {isInCall && (
                            <>
                              <Input
                                placeholder="Enter DTMF To Send"
                                onChange={(e) => {
                                  const number = e.target.value.at(-1);
                                  sendDTMF(number);
                                }}
                                className="w-2/4 mx-auto mb-3"
                              />
                              <Input
                                placeholder="Enter Number To Transfer"
                                onChange={(e) => setDialpadNumber(e.target.value)}
                                className="w-2/4 mx-auto mb-3"
                              />
                            </>
                          )}
                        </div>

                        <audio ref={audioElement} autoPlay className="hidden" />

                        {isCalling && <p>Calling...</p>}

                        <div className="flex justify-center items-center">
                          {!isCalling && !isRinging && !isInCall && (
                            <button
                              className={`${!phoneNumber ? "opacity-50" : ""} p-5 bg-green-400 rounded-full mr-3`}
                              disabled={!phoneNumber}
                              onClick={handleCall}
                            >
                              <PhoneCall />
                            </button>
                          )}
                          {isRinging && !isInCall && (
                            <>
                              <button onClick={handleAnswer} className="p-5 bg-green-400 rounded-full mr-3">
                                <PhoneIncoming />
                              </button>
                              <button className="p-5 bg-red-400 rounded-full mr-3" onClick={handleHangup}>
                                <PhoneOff />
                              </button>
                            </>
                          )}

                          {isInCall && (
                            <>
                              <button className="p-5 bg-red-400 rounded-full mr-3" onClick={handleHangup}>
                                <PhoneOff />
                              </button>
                              <button className="p-5 bg-red-400 rounded-full mr-3" onClick={handleHangup}>
                                <PhoneOff />
                              </button>
                              <button className="p-5 bg-red-400 rounded-full mr-3" onClick={transferCall}>
                                <PhoneForwarded />
                              </button>
                              <button className="p-5 bg-red-400 rounded-full mr-3" onClick={muteCall}>
                                <MicOff />
                              </button>
                              <button className="p-5 bg-green-400 rounded-full mr-3" onClick={unmuteCall}>
                                <MicOff />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
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
                            <Button onClick={() => {
                              handlePause(agentAccount?.sipUsername, agentData?.Campaign.name)
                            }} variant={"secondary"}>Pause</Button>
                          </div>

                        </>) : (<>
                          <p className="text-center mb-3">You are paused</p>
                          <div className="text-center" >
                            <Button onClick={() => {
                              handleResume()
                              setIsPaused(false)
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

