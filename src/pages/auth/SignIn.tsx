import SignInProfile from "../../assets/images/SignInProfile.png"
import SignInForm from '../../components/form/SignInForm';

const SignIn = () => {
  return (
    <div className='flex w-screen h-screen flex-row overflow-hidden'>
      <div className="flex-1"><img src={SignInProfile} className='lg:object-cover' alt="SignInProfile" /></div>
      <div className='flex-1 h-full flex justify-center items-center'><SignInForm /></div>
    </div>
  )
}
export default SignIn;