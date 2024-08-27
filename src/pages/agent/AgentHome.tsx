import { useRef, useState, useEffect } from "react";
import { SimpleUser, SimpleUserOptions } from "sip.js/lib/platform/web";
import { UserAgent } from "sip.js";
import { useNavigate } from "react-router-dom";
import { PhoneCall, PhoneForwarded, PhoneOff } from "lucide-react";
import { Input } from "../../components/ui/input";

const AgentHome = () => {

  const remoteAudioRef = useRef<any>(null);
  const [simpleUser, setSimpleUser] = useState<SimpleUser>();
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isInvite, setIsInvite] = useState(false);
  const [dialpadNumber, setDialpadNumber] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('')
  const [providerAddress, setProviderAddress] = useState("192.168.130.20")
  const navigate = useNavigate();

  const agentAccount = {
    sipUsername: "agt0088",
    sipPassword: "password"
  }
  useEffect(() => {
    const server = `${import.meta.env.VITE_APP_WEBSOCKET_HOST}:${import.meta.env.VITE_APP_WEBSOCKET_PORT}/ws`;
    const aor = `sip:${agentAccount.sipUsername}@${import.meta.env.VITE_APP_SIP_HOST}`;
    const authorizationUsername = agentAccount.sipUsername;
    const authorizationPassword = agentAccount.sipPassword;

    const options: SimpleUserOptions = {
      aor,
      media: {
        remote: {
          audio: remoteAudioRef.current,
        },
      },
      register: false,
      userAgentOptions: {
        authorizationPassword,
        authorizationUsername,
      },
    };

    const user = new SimpleUser(server, options);
    user.delegate = {
      onRegistered: async () => {
      },
      onCallReceived: async () => {
        window.alert("First Invte");
        console.log("coming")
        setIsRinging(true);
      },
      onCallHangup: () => {
        setIsInCall(false);
        setIsRinging(false);
      },
    };

    const initialize = async () => {
      try {
        await user.connect();
        await user.register({
          requestDelegate: {
            onAccept: () => {
              return true;
            },
            onReject: (error: any) => {
              console.log(error);
              if (error.statusCode) {
                window.alert("Invalid Username or Password.Ask System Adminstrator.");
                setTimeout(() => {
                  navigate('/login')
                }, 3000)
              }
            }
          }
        });
        setSimpleUser(user);
      } catch (error) {
        console.error("Failure", error);
      }
    };

    initialize();

    return () => {
      if (user) {
        user.disconnect();
      }
    };
  }, []);
  // const emptyDialpad = () => {
  //   setDialpadNumber(undefined);
  // };
  useEffect(() => {
    const handleBeforeUnload = async (event: any) => {
      event.preventDefault();
      await simpleUser?.unregister();

    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    console.log("wok")
    //emptyDialpad();
  }, [isCalling]);

  const handleCall = async () => {
    if (simpleUser && !isCalling && !isInCall) {
      setIsCalling(true);
      setPhoneNumber("")
      console.log(phoneNumber);
      try {
        const destination = `sip:${phoneNumber}@${providerAddress}`;
        await simpleUser.call(destination, {
          inviteWithoutSdp: false,
          earlyMedia: true,
          requestDelegate: {
            onAccept: (response: any) => {
              console.log("SIP response received:", response);
            },
          },
        });
        setIsCalling(false);
        setIsInCall(true);
      } catch (error) {
        console.error("Call failed", error);
        setIsCalling(false);
      }
    }
  };

  const handleHangup = async () => {
    if (simpleUser && isRinging || isInCall) {
      try {
        await simpleUser?.hangup();
        setIsInCall(false);
        setIsRinging(false);
      } catch (error) {
        console.error("Hangup failed", error);
      }
    }
  };

  const handleAnswer = async () => {
    if (simpleUser && isRinging) {
      try {
        await simpleUser.answer();
        setIsInCall(true);
        setIsRinging(false);
      } catch (error) {
        console.error("Answer failed", error);
      }
    }
  };
  const transferCall = async () => {
    console.log(simpleUser && simpleUser.session);
    if (simpleUser && simpleUser.session) {
      console.log(dialpadNumber)
      const uri = UserAgent.makeURI(`sip:${dialpadNumber}@${providerAddress}`);

      try {
        await simpleUser.session.refer(uri);
        console.log("Transfer initiated");
      } catch (error) {
        console.error("Transfer failed", error);
      }
    } else {
      console.error("No active session to transfer");
    }
  };
  // const sendDTMF = (value: string) => {
  //   if (simpleUser && isInCall) {
  //     console.log(value)
  //     //value && simpleUser.sendDTMF(value);
  //   }
  // };
  const handleTrunkLineChange = (e: any) => {
    if (e.value) {
      setProviderAddress("192.168.130.20")
    } else {
      setProviderAddress("172.250.230.160")
    }
  }

  return (
    <main className="profile-page dark:bg-gray-600 w-full h-max overflow-y-scroll dark:text-white">
      <audio ref={remoteAudioRef} id="remoteAudio" autoPlay />
      <div>
        <div>
          <section className="relative block h-[500px]">
            <div
              className="absolute top-0 w-full h-full bg-center bg-cover border-t-0 rounded-t-lg"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80")',
              }}
            >
              <span
                id="blackOverlay"
                className="absolute w-full h-full bg-black opacity-50"
              />
            </div>
          </section>

          <section className="relative py-16 bg-blueGray-200  dark:bg-gray-600 dark:text-white">
            <div className="container px-4 mx-auto">
              <div className="relative flex flex-col w-full min-w-0 mb-6 -mt-64 break-words bg-white rounded-lg shadow-xl">
                <div className="px-6  dark:bg-gray-600 dark:text-white">
                  <div className="flex justify-center mb-5 flex-warp">
                    <div className="flex items-center justify-center w-full px-4 lg:w-3/12 lg:order-2  dark:bg-gray-600 dark:text-white">

                      <div className="relative flex flex-col items-center w-full text-center  dark:bg-gray-600 dark:text-white">
                        <img
                          alt="Profile"
                          src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                          className="shadow-xl rounded-full h-auto border-none mr-4 max-w-[150px] absolute selection:transform top-[-70px] -translate-y-1/2"
                        />
                        <div className="relative mt-[50px] flex justify-center gap-4">
                          {!isInCall && !isCalling && !isRinging && (
                            <div className="p-3 flex flex-col mt-5 gap-2">
                              <Input placeholder="Enter Phone Number"
                                className="input input-bordered input-primary w-full max-w-xs"
                                value={phoneNumber || ""}
                                onChange={(e) => {
                                  setPhoneNumber(e.target.value)
                                }}
                              />
                              <div>
                                <button
                                  onClick={handleCall}
                                  className="bg-green-400 p-3 rounded-full w-15 h-15"
                                >
                                  <PhoneCall className="w-8 h-8 mx-auto text-white" />
                                </button>

                              </div>
                            </div>

                          )}
                          {isInCall && (
                            <>
                              <button
                                onClick={handleHangup}
                                className="bg-red-400 p-3 rounded-full w-15 h-15"
                              >
                                <PhoneOff className="w-8 h-8 mx-auto text-white" />
                              </button>
                              {!isInvite && (
                                <button
                                  className="bg-red-400 p-3 rounded-full w-15 h-15"
                                  onClick={transferCall}
                                >
                                  <PhoneForwarded className="w-8 h-8 mx-auto text-white" />
                                </button>
                              )}
                            </>
                          )}
                          {isCalling && <div>Calling...</div>}
                          {isRinging && (
                            <>
                              {!isInvite && (
                                <button
                                  className="bg-red-400 rounded-full p-3 w-15 h-15"
                                  onClick={transferCall}
                                >
                                  <PhoneForwarded className="w-8 h-8 mx-auto text-white" />
                                </button>
                              )}
                              <button
                                onClick={handleAnswer}
                                className="bg-green-400 p-3 rounded-full w-15 h-15 animate-bounce"
                              >
                                <PhoneCall className="w-8 h-8 mx-auto text-white" />
                              </button>
                              <button
                                onClick={handleHangup}
                                className="bg-red-400 p-3 rounded-full w-15 h-15"
                              >
                                <PhoneOff className="w-8 h-8 mx-auto text-white" />
                              </button>
                            </>
                          )}
                          <div>
                            {/* <Dialpad */}
                            {/*   onDTMF={sendDTMF} */}
                            {/*   isCalling={isCalling} */}
                            {/*   dialpadNumber={dialpadNumber} */}
                            {/*   setDialpadNumber={setDialpadNumber} */}
                            {/* /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dark:bg-gray-600 dark:text-white w-full px-4 lg:w-4/12 lg:order-3 lg:text-right lg:self-center">

                      <form>
                        <div className="mb-3">
                          <label
                            htmlFor="message"
                            className="block mb-2 font-medium text-gray-900 text-md dark:text-white text-start"
                          >
                            Customer Relationship Management
                          </label>
                          <textarea
                            id="message"
                            cols={10}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg bg-gray-700 placeholder-gray-400 border border-slate-400 focus:ring-0 focus:outline-none"
                            placeholder="Leave a comment..."
                          ></textarea>
                        </div>
                        <div className="mb-5 text-end">
                          <button className="px-4 py-1 text-white bg-blue-400 rounded-md text-md">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="w-full px-4 lg:w-4/12 lg:order-1 dark:bg-gray-600 dark:text-white">
                      <div className="flex justify-start py-4 pt-8 lg:pt-4">
                        <div className="p-3 mr-4 text-center">
                          <span className="block text-xl font-bold tracking-wide uppercase text-blueGray-600">
                            22
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Calls
                          </span>
                        </div>
                        <div className="p-3 mr-4 text-center">
                          <span className="block text-xl font-bold tracking-wide uppercase text-blueGray-600">
                            10
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Hangup
                          </span>
                        </div>
                        <div className="p-3 text-center lg:mr-4">
                          <span className="block text-xl font-bold tracking-wide uppercase text-blueGray-600">
                            89
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Total
                          </span>
                        </div>
                      </div>
                      <div className="mt-12 text-start">
                        <h3 className="mb-2 text-4xl font-semibold leading-normal text-blueGray-700">
                          Jenna Stones
                        </h3>
                        <div className="mt-0 mb-2 text-sm font-bold leading-normal uppercase text-blueGray-400">
                          <i className="mr-2 text-lg fas fa-map-marker-alt text-blueGray-400" />
                          Los Angeles, California
                        </div>
                        <div className="mt-10 mb-2 text-blueGray-600">
                          <i className="mr-2 text-lg fas fa-briefcase text-blueGray-400" />
                          Call Center Agent - UMFCCI OIL
                        </div>
                        <div className="mb-2 text-blueGray-600">
                          <i className="mr-2 text-lg fas fa-university text-blueGray-400" />
                          University of Computer Science
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div >
      </div >
    </main >
  );
};

export default AgentHome;
