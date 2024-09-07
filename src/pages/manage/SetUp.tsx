import { useSelector } from "react-redux"
import SetupProgress from "../../components/SetupPrgress"
import SipProviderForm from "../../components/form/SipProviderForm"
import IvrAudioUploadForm from "../../components/form/IvrAudioUploadForm"
import IvrTreeForm from "../../components/form/IvrTreeForm"
import PreviewForm from "../../components/form/PreviewForm"
import CampaignCreateForm from "../../components/form/CampaignCreateForm"

type Props = {}

const SetUp = (props: Props) => {
  const currentStep = useSelector((state: any) => state.setup.currentStep)

  return (
    <div className='flex flex-row w-[90%] mx-auto'>
      <div className="w-4/5 flex">
        {currentStep === 1 && <SipProviderForm />}
        {currentStep === 2 && <CampaignCreateForm />}
        {currentStep === 3 && <IvrAudioUploadForm />}
        {currentStep === 4 && <IvrTreeForm />}
        {currentStep === 5 && <PreviewForm />}
      </div>
      <div className="w-1/5">
        <SetupProgress />
      </div>
    </div>
  )
}

export default SetUp