import { ModeToggle } from './mode-toggle'
import { UserNav } from './UserNav'

type Props = {}

const Navbar = (props: Props) => {
    return (
        <>
            <div className="hidden flex-col md:flex md:mb-3">
                <div className="border-b">
                    <div className="flex h-14 items-center px-4">
                        {/* <TeamSwitcher />
                        <MainNav className="mx-6" /> */}
                        <div className="ml-auto flex items-center space-x-4">
                            <ModeToggle />
                            <UserNav />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar;