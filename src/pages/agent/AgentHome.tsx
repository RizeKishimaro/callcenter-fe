
import { useRef, useState, useEffect } from "react";
import JsSIP, { UA } from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";
import { useNavigate } from "react-router-dom";
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
import { useDecrypt } from "../../store/hooks/useDecrypt";
import axiosInstance from "../../providers/axiosClient";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../../components/ui/button";
import SecondCounter from "./SecondCounter";

const AgentHome = () => {
  const remoteAudioRef = useRef(null);
  const [ua, setUa] = useState<UA | null>(null);
  const [session, setSession] = useState<RTCSession | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [dialpadNumber, setDialpadNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [inviteNumber, setInviteNumber] = useState("");
  const [providerAddress, setProviderAddress] = useState("192.168.130.20");
  const audioElement = useRef<HTMLAudioElement | null>(null)
  const [agentData, setAgentData] = useState<any>(null);

  const agentAccount = {
    sipUsername: useDecrypt(localStorage.getItem("sipUsername") || ""),
    sipPassword: useDecrypt(localStorage.getItem("password") || ""),
    agentId: localStorage.getItem("id") || ""
  };

  const getAgentInfo = async () => {
    return await axiosInstance.get(`/agent/${agentAccount.agentId}`);
  };

  useEffect(() => {
    const socket = new JsSIP.WebSocketInterface(`${import.meta.env.VITE_APP_WEBSOCKET_HOST}:${import.meta.env.VITE_APP_WEBSOCKET_PORT}/ws`)
    const configuration = {
      uri: `sip:${agentAccount.sipUsername}@${import.meta.env.VITE_APP_SIP_HOST}`,
      sockets: [socket],
      authorizationUser: agentAccount.sipUsername,
      password: agentAccount.sipPassword,
    };
    const userAgent = new JsSIP.UA(configuration);
    setUa(userAgent);

    userAgent.on("newRTCSession", (e) => {
      const session = e.session;
      setSession(session);
      setIsCalling(true);

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

      session.on('ended', () => {
        console.log(session.remote_identity, session.local_identity)
        setIsInCall(false);
        setIsRinging(false);
        setIsCalling(false);

      });

      session.on('failed', () => {
        console.log(session.remote_identity, session.local_identity)

        setIsCalling(false);
        setIsInCall(false)
        setIsRinging(false);
      });

      session.on('invite', (e) => {
        setIsRinging(true);
        setInviteNumber(e.request.from.uri.toString());
      });
    });

    userAgent.start();

    return () => {
      userAgent.stop();
    };
  }, []);

  useEffect(() => {
    getAgentInfo().then((data) => {
      setAgentData(data.data);
      console.log(data)

      // setProviderAddress(data.data.SipProvider.)
    });

    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      if (ua) {
        ua.stop();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [ua]);

  const sendCallHistory = (remote_num, local_num, hangUpfrom?: any, transferFrom?: any,
    start_time, end_time, total_second: number, call_status, campaign_name) => {
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
      call_status,
      campaign_name,
    })

  }
  const handleCall = () => {
    if (ua && !isCalling || !isInCall) {
      setIsCalling(true);

      const options = {
        mediaConstraints: { audio: true, video: false },
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false },
        },
      };

      const destination = `sip:${phoneNumber}@${providerAddress}`;
      const callSession = ua.call(destination, options);
      callSession.on("accepted", () => {
        setIsInCall(true)
        const peerConnection = callSession.connection;

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

      callSession.on('ended', (data) => {
        const total_second = (new Date(callSession.end_time).getTime() - new Date(callSession.start_time).getTime()) / 1000
        const hangUpfrom = !data?.message?.from ? agentAccount.agentId : null
        console.log(hangUpfrom)
        sendCallHistory(callSession.remote_identity.uri.user,
          callSession.local_identity.uri.user, hangUpfrom, null, callSession.start_time, callSession.end_time, total_second, data.cause, agentData.Campaign.name)
        setIsInCall(false);
        setIsCalling(false);
      });

      callSession.on('failed', (reasaon) => {
        console.log(reasaon.cause)
        console.log(callSession.remote_identity, callSession.local_identity)
        setIsCalling(false);
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
                              <AvatarImage className="shadow-xl rounded-full h-auto border-green-500 max-w-[150px]" src={`${import.meta.env.VITE_APP_BACKEND_URL}/${agentData?.profile}`}
                              />
                              <AvatarFallback>Agent</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex w-full text-center flex-col justify-center">
                            <div>
                              <p className="text-2xl font-bold">{agentData?.name}<span className="font-normal ml-2">({agentData?.sipName})</span></p>
                            </div>
                            <div className="mt-3">
                              status: {true ? <span
                                className="inline-block text-muted whitespace-nowrap rounded-full bg-emerald-200 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-success-700 dark:bg-emerald-700 dark:text-success-500/80">
                                online
                              </span> : <span
                                className="inline-block whitespace-nowrap rounded-full bg-danger-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-danger-700 dark:bg-[#2c0f14] dark:text-danger-500 ">
                                offline
                              </span>}
                              <p className="text-sm mt-2">Online Agents: {49}</p>
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
                  <div className="md:w-2/4 w-full">
                    <div className="text-center">
                      <p className="text-xl font-medium">WebPhone</p>
                    </div>
                    <div className="ml-3 my-3">
                      <div className="flex flex-col">

                        {
                          isInCall || isRinging ? (<>
                            <p className="flex mb-3"><PhoneIcon className="mr-2" /><span>{"09978551579"}</span></p>
                            {<div className="flex mb-3"><Clock className="mr-2" />{isInCall && <SecondCounter />}</div>}

                          </>) : (<p className="text-center">Relax You Don't Have Any Calls,Yet.</p>)

                        }
                      </div>
                      <div className="my-5">
                        {!isCalling && !isRinging &&
                          < Input placeholder="Enter Phone Number" onChange={(e) => {
                            setPhoneNumber(e.target.value)
                          }} className="w-2/4 mx-auto mb-3" />
                        }
                        {
                          isCalling && isInCall &&
                          <>
                            <Input placeholder="Enter DTMF To Send" onChange={(e) => {
                              const number: any = e.target.value && e.target.value.at(-1);
                              sendDTMF(number)
                            }} className="w-2/4 mx-auto mb-3" />
                            <Input placeholder="Enter Number To Transfer" onChange={(e) => {
                              setDialpadNumber(e.target.value)
                            }} className="w-2/4 mx-auto mb-3" />
                          </>

                        }
                      </div>
                      <audio ref={audioElement} autoPlay className="hidden" />

                      {isCalling && <p>Calling...</p>}
                      <div className="flex justify-center items-center">
                        {
                          !isCalling && !isRinging &&
                          < button className={`${!phoneNumber && "opacity-50"} p-5 bg-green-400 rounded-full mr-3`} disabled={!phoneNumber} onClick={handleCall}>
                            <PhoneCall />
                          </button>


                        }
                        {isRinging &&
                          <button onClick={handleAnswer} className="p-5 bg-green-400 rounded-full mr-3">
                            <PhoneIncoming />
                          </button>

                        }
                        {isCalling || isInCall &&
                          (
                            <>
                              <button className="p-5 bg-red-400 rounded-full mr-3" onClick={handleHangup}>
                                <PhoneOff />
                              </button>
                            </>
                          )
                        }
                        {
                          isInCall && isRinging &&
                          <>
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
                        }
                      </div>
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

