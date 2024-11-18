import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Delete, Hand, MicOff, PhoneCall, PhoneForwarded, PhoneIcon, PhoneIncoming, PhoneOff, Server, User } from "lucide-react"

export function WebPhoneComponent() {
  const [isInCall, setIsInCall] = useState(false)
  const [isRinging, setIsRinging] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isHold, setIsHold] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [inviteNumber, setInviteNumber] = useState("")
  const [service, setService] = useState("Unknown Service")
  const [showDialpad, setShowDialpad] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
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

  const handleCall = () => {
    setIsInCall(true)
    setInviteNumber(phoneNumber)
    setShowDialpad(false)
  }

  const handleHangup = () => {
    setIsInCall(false)
    setIsRinging(false)
    setInviteNumber("")
    setPhoneNumber("")
    setShowDialpad(true)
  }

  const handleAnswer = () => {
    setIsInCall(true)
    setIsRinging(false)
    setShowDialpad(false)
  }

  const handleNumpadClick = (digit: string) => {
    if (!isInCall) {
      setPhoneNumber(prev => prev + digit)
    }
  }

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1))
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const numpadButtons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#'
  ]

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6">
      <div className="w-full md:w-2/2 space-y-6">
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">WebPhone</h3>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          {isInCall && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                </Avatar>
                <h4 className="text-lg font-semibold mb-2">{inviteNumber || "Unknown"}</h4>
                <p className="text-sm text-muted-foreground">{formatDuration(callDuration)}</p>
              </CardContent>
            </Card>
          )}
          {(!isRinging || isInCall) && !isInCall && (
            <div className="space-y-2">
              <p className="flex items-center">
                <PhoneIcon className="mr-2" />
                <span>{inviteNumber || "Unknown"}</span>
              </p>
              <p className="flex items-center">
                <Server className="mr-2" />
                <span>{service}</span>
              </p>
              <p className="flex items-center">
                <Clock className="mr-2" />
                <span>{formatDuration(callDuration)}</span>
              </p>
            </div>
          )}
          <div className="flex space-x-2">
            <Input
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isInCall || isRinging}
              className="flex-grow"
            />
            <Button
              variant="outline"
              onClick={handleBackspace}
              disabled={isInCall || isRinging || phoneNumber.length === 0}
            >
              <Delete className="h-4 w-4" />
            </Button>
          </div>
          {(showDialpad || !isInCall) && (
            <div className="grid grid-cols-3 gap-2">
              {numpadButtons.map((digit) => (
                <Button
                  key={digit}
                  variant="outline"
                  onClick={() => handleNumpadClick(digit)}
                  disabled={isInCall || isRinging}
                >
                  {digit}
                </Button>
              ))}
            </div>
          )}
          <div className="flex justify-center space-x-4">
            {!isInCall && !isRinging && (
              <Button onClick={handleCall} disabled={!phoneNumber}>
                <PhoneCall className="mr-2" />
                Call
              </Button>
            )}
            {isRinging && (
              <Button onClick={handleAnswer}>
                <PhoneIncoming className="mr-2" />
                Answer
              </Button>
            )}
            {(isInCall || isRinging) && (
              <Button variant="destructive" onClick={handleHangup}>
                <PhoneOff className="mr-2" />
                Hang Up
              </Button>
            )}
            {isInCall && (
              <>
                <Button variant="outline" onClick={() => setIsMuted(!isMuted)}>
                  <MicOff className="mr-2" />
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button variant="outline" onClick={() => setIsHold(!isHold)}>
                  <Hand className="mr-2" />
                  {isHold ? "Unhold" : "Hold"}
                </Button>
                <Button variant="outline">
                  <PhoneForwarded className="mr-2" />
                  Transfer
                </Button>
                <Button variant="outline" onClick={() => setShowDialpad(!showDialpad)}>
                  {showDialpad ? "Hide Dialpad" : "Show Dialpad"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}