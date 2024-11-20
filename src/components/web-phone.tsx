
import React, { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Delete, Hand, MicOff, PhoneCall, PhoneForwarded, Binary, PhoneIncoming, PhoneOff, Server, User } from 'lucide-react'
import { RTCSession } from 'jssip/lib/RTCSession'

export function WebPhoneComponent({ ua, agentData, providerAddress }) {
  const [session, setSession] = useState<RTCSession | null>(null)
  const [isCalling, setIsCalling] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [service, setService] = useState("Unknown Service")
  const [isMuted, setIsMuted] = useState(false)
  const [isHold, setIsHold] = useState(false)
  const [isRinging, setIsRinging] = useState(false)
  const [dialpadNumber, setDialpadNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [inviteNumber, setInviteNumber] = useState("")
  const [callDuration, setCallDuration] = useState(0)
  const [showDialpad, setShowDialpad] = useState(true)

  const audioElement = useRef<HTMLAudioElement | null>(null)
  const ringtoneRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let interval = null
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1)
      }, 1000)
    } else {
      setCallDuration(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isInCall])

  useEffect(() => {
    if (ua) {
      ua.on("newRTCSession", handleNewRTCSession)
    }
    return () => {
      if (ua) {
        ua.off("newRTCSession", handleNewRTCSession)
      }
    }
  }, [ua])

  const handleNewRTCSession = (e) => {
    const session = e?.session
    setIsRinging(true)
    if (session.direction === 'incoming') playRingtone()

    const number = session?.remote_identity?.display_name?.toString()
    const serviceName = session ? e?.request?.headers?.['X-Service-From']?.[0]?.raw : "Unknown"
    setService(serviceName)
    setSession(session)
    setInviteNumber(number)

    session.on('confirmed', handleSessionConfirmed)
    session.on('ended', handleSessionEnded)
    session.on('failed', handleSessionFailed)
  }

  const handleSessionConfirmed = () => {
    ringtoneRef.current?.pause()
    setIsInCall(true)
    setIsRinging(false)
    stopRingtone()
    setPhoneNumber("")
    setupAudioStream()
  }

  const handleSessionEnded = () => {
    setIsInCall(false)
    setIsRinging(false)
    setIsCalling(false)
    setDialpadNumber("")
    setPhoneNumber("")
    resetCall()
  }

  const handleSessionFailed = () => {
    stopRingtone()
    setIsCalling(false)
    setIsInCall(false)
    setDialpadNumber("")
    setPhoneNumber("")
    setIsRinging(false)
    resetCall()
  }

  const setupAudioStream = () => {
    if (session && audioElement.current) {
      const peerConnection = session.connection
      console.log(peerConnection?.getReceivers())
      peerConnection?.getReceivers().forEach((receiver) => {
        console.log(receiver)
        if (receiver.track.kind === 'audio' && audioElement.current) {
          const remoteStream = new MediaStream()
          remoteStream.addTrack(receiver.track)
          audioElement.current.srcObject = remoteStream
          audioElement.current.play()
        }
      })
    }
  }

  const playRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.play().catch((error) => {
        console.error("Failed to play ringtone:", error)
      })
    }
  }

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause()
      ringtoneRef.current.currentTime = 0
    }
  }

  const handleCall = () => {
    console.log(ua)
    if (ua && !isCalling && !isInCall) {
      setIsCalling(true)
      setInviteNumber(phoneNumber)
      const options = {
        mediaConstraints: { audio: true, video: false },
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false },
        },
      }

      const destination = `sip:${phoneNumber}@${providerAddress}`
      const callSession = ua?.call(destination, options)
      setSession(callSession)

      callSession?.on("progress", setupAudioStream)
      callSession?.on("accepted", handleSessionConfirmed)
    }
  }

  const handleHangup = () => {
    if (session) {
      session.terminate()
      resetCall()
    }
  }

  const handleAnswer = () => {
    if (session && isRinging) {
      session.answer()
      setIsInCall(true)
      setIsRinging(false)
    }
  }

  const muteCall = () => {
    if (session) {
      session.mute()
      setIsMuted(true)
    }
  }

  const unmuteCall = () => {
    if (session) {
      session.unmute()
      setIsMuted(false)
    }
  }

  const holdCall = () => {
    if (session) {
      session.sendDTMF("#700")
      setIsHold(true)
    }
  }

  const unHoldCall = () => {
    if (session) {
      session?.unhold()
      setIsHold(false)
    }
  }

  const transferCall = () => {
    if (session && dialpadNumber) {
      const target = `sip:${dialpadNumber}@${providerAddress}`
      session.refer(target)
      setDialpadNumber('')
    }
  }

  const sendDTMF = (value) => {
    if (session && isInCall && value) {
      session.sendDTMF(value)
    }
  }

  const resetCall = () => {
    setIsInCall(false)
    setIsRinging(false)
    setIsCalling(false)
    setInviteNumber("")
    setPhoneNumber("")
    setShowDialpad(true)
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const numpadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">WebPhone</h2>
            <div className="flex items-center">
              <span className="mr-2">Status:</span>
              <span className={`h-3 w-3 rounded-full ${isInCall ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
          </div>

          {isInCall || isCalling || isRinging && (
            <div className="mb-4 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-2">
                <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
              </Avatar>
              <p className="text-lg font-semibold">{inviteNumber ? inviteNumber : phoneNumber || "Unknown"}</p>
              <p className="text-sm text-gray-500">{formatDuration(callDuration)}</p>
            </div>
          )}

          {/* {isInCall && !isRinging && ( */}
          <div className="mb-4">
            <div className="flex">
              <Input
                type="tel"
                placeholder="Phone Number"
                value={isInCall ? dialpadNumber : phoneNumber}
                focus={true}
                onChange={(e) => {
                  if (isInCall) {
                    setDialpadNumber(e.target.value)
                  } else {
                    setPhoneNumber(e.target.value)
                  }
                }}
                className="flex-grow mr-2"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (isInCall) {
                    setDialpadNumber(prev => prev.slice(0, -1))
                  } else {
                    setPhoneNumber(prev => prev.slice(0, -1))
                  }
                }}
                disabled={phoneNumber.length === 0}
              >
                <Delete className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* )} */}

          {(showDialpad || !isInCall) && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {numpadButtons.map((digit) => (
                <Button
                  key={digit}
                  variant="outline"
                  onClick={() => {
                    if (isInCall) {
                      setDialpadNumber(prev => prev + digit)
                    } else {
                      setPhoneNumber(prev => prev + digit)
                    }
                  }}
                >
                  {digit}
                </Button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {!isInCall && !isRinging && (
              <Button onClick={handleCall} disabled={!phoneNumber || isCalling}>
                <PhoneCall className="mr-2 h-4 w-4" />
                Call
              </Button>
            )}
            {isRinging && !isCalling && !isInCall && (
              <Button onClick={handleAnswer} className="bg-green-500 hover:bg-green-600">
                <PhoneIncoming className="mr-2 h-4 w-4" />
                Answer
              </Button>
            )}
            {(isInCall || isRinging) && (
              <Button variant="destructive" onClick={handleHangup}>
                <PhoneOff className="mr-2 h-4 w-4" />
                Hang Up
              </Button>
            )}
            {isRinging && !isCalling && !isInCall && (
              <Button className="bg-green-500 hover:bg-green-600" onClick={sendDTMF}>
                <Binary className="mr-2 h-4 w-4" />
                Send DTMF
              </Button>
            )}

            {isInCall && (
              <>
                <Button variant="outline" onClick={isMuted ? unmuteCall : muteCall}>
                  <MicOff className="mr-2 h-4 w-4" />
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button variant="outline" onClick={isHold ? unHoldCall : holdCall}>
                  <Hand className="mr-2 h-4 w-4" />
                  {isHold ? "Unhold" : "Hold"}
                </Button>
                <Button variant="outline" onClick={transferCall} disabled={!dialpadNumber}>
                  <PhoneForwarded className="mr-2 h-4 w-4" />
                  Transfer
                </Button>
                <Button variant="outline" onClick={() => setShowDialpad(!showDialpad)}>
                  {showDialpad ? "Hide Dialpad" : "Show Dialpad"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <audio ref={audioElement} autoPlay className="hidden" />
      <audio ref={ringtoneRef} src="/ringtone.mp3" className="hidden" />
    </div>
  )
}
