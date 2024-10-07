import { useDispatch } from "react-redux"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { logout } from "../store/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { useDecrypt } from "../store/hooks/useDecrypt";
import { useInitials } from "../store/hooks/useInitials";
import { socket } from "../providers/socket/socket";

export function UserNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sipUsername = useDecrypt(localStorage.getItem('sipUsername') || '')
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    console.log("logout")
    socket.connect()
    socket.emit("disconnectAgent", { data: "lee" })
    dispatch(logout());
    navigate('/sign-in')
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>{useInitials(sipUsername)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{sipUsername}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button onClick={handleLogout} className="w-full">
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
