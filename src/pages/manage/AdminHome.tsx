
import { useEffect, useState, useRef } from "react";
import JsSIP from 'jssip'; // Ensure you have jssip installed
import ActiveQueue from "../../components/general/ActiveQueue";
import CallCount from "../../components/general/CallCount";
import SipInfo from "../../components/general/SipInfo";
import { socket } from "../../providers/socket/socket";
import { UAConfiguration } from "jssip/lib/UA";
import { RTCSession } from "jssip/lib/RTCSession";
import axiosInstance from "../../providers/axiosClient";
import { useDecrypt } from "../../store/hooks/useDecrypt";
import QueueStatusMember from "../admin/components/QueueStatus";

const AdminHome = () => {
  const [connectedSockets, setConnectedSockets] = useState([]);
  const [sipUa, setSipUa] = useState<JsSIP.UA | null>(null);
  const [session, setSession] = useState<RTCSession | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);  // Ref for the audio element
  const managerAccount = {
    sipUsername: useDecrypt(localStorage.getItem("adminSipUri") || ""),
    sipPassword: useDecrypt(localStorage.getItem("password") || ""),
    agentId: localStorage.getItem("id") || ""
  };

  const spyAgent = async (agentSipName: string) => {
    const params = {
      account: agentSipName,
      spyaccount: managerAccount.sipUsername
    }
    await axiosInstance.get("/sip-provider/spy", { params });
    setIsInCall(true);
    return "success!";
  }

  const stopSpy = () => {
    console.log("stop");
    session && session.terminate();
    setIsInCall(false);
  }

  useEffect(() => {
    console.log("mounted")
    // Socket connection setup
    socket.on('connect', () => {
      console.log('Supervisor connected');
    });
    socket.emit('joinStaffRoom', { room: 'staffroom' });


    socket.on('allAgentsData', (agentsData) => {
      setConnectedSockets(agentsData);
    });





    // SIP setup using JsSIP
    const wsSocket = new JsSIP.WebSocketInterface(`${import.meta.env.VITE_APP_WEBSOCKET_HOST}:${import.meta.env.VITE_APP_WEBSOCKET_PORT}/ws`);
    const configuration: UAConfiguration = {
      uri: `sip:${managerAccount.sipUsername}@${import.meta.env.VITE_APP_SIP_HOST}`,
      sockets: [wsSocket],
      authorization_user: managerAccount.sipUsername,
      password: managerAccount.sipPassword,
      session_timers: false,

    };

    const ua = new JsSIP.UA(configuration);

    ua.on('connected', () => {
      console.log('SIP connected');
    });

    ua.on('disconnected', () => {
      ua.register()
      console.log('SIP disconnected');
    });

    ua.on('registered', () => {
      console.log('SIP registered');
    });

    ua.on('registrationFailed', (e) => {
      console.error('SIP registration failed', e);
    });

    // Handling incoming calls and auto-answering
    ua.on('newRTCSession', (e) => {
      const session: RTCSession = e.session;
      setSession(session);
      if (session.direction === 'incoming') {
        console.log('Incoming call detected');

        // Auto-answer the call
        session.answer({
          mediaConstraints: { audio: true, video: false },
        });

        session?.on("accepted", () => {
          setIsInCall(true)
          const peerConnection = session?.connection;

          peerConnection.getReceivers().forEach((receiver) => {
            console.log(receiver)
            if (receiver.track.kind === 'audio') {
              if (audioRef.current) {
                console.log("received")
                const remoteStream = new MediaStream();
                remoteStream.addTrack(receiver.track);
                audioRef.current.srcObject = remoteStream;
                audioRef.current.play();
              }
            }
          });

        })

        session.on('ended', () => {
          console.log('Call ended');
          setIsInCall(false);
        });

        session.on('failed', () => {
          console.log('Call failed');
          setIsInCall(false);
        });

        // Handling media stream for audio playback
      }
    });

    // Start the SIP user agent
    ua.start();
    setSipUa(ua);

    // Cleanup on component unmount
    return () => {
      ua.stop();
      socket.off('connect');
      socket.off('allAgentsData');
      socket.off("queueStatus")
      socket.off("incall")
      socket.off("idle")
      socket.off("disconnectAgent")
      socket.off("ended")
      socket.off("failed")
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row p-3 gap-x-3">
      <div className="flex-1 flex flex-col lg:gap-y-5 md:gap-y-3">
        <div className="flex flex-col md:flex-row gap-x-3">
          <div className="w-3/5"><SipInfo id={managerAccount.agentId} /></div>
          <div className="w-2/5 h-2/3 overflow-scroll"><QueueStatusMember queueMembers={connectedSockets} /></div>
        </div>
        <div className=""><CallCount /></div>
      </div>
      <div className="w-full xl:max-w-[550px] lg:mxa-w-[450px]">
        <ActiveQueue sockets={connectedSockets} spyAgent={spyAgent} stopSpy={stopSpy} />
      </div>
      <audio ref={audioRef} />
    </div>);
}

export default AdminHome
