import SipProviderForm from "../../../components/form/SipProviderForm"

const CreateSipProvider = () => {
    return (
        <div className="flex flex-row w-[90%] mx-auto">
            <div className="w-4/5 flex">
                <SipProviderForm />
            </div>
            <div className="w-1/5"></div>
        </div>
    )
}

export default CreateSipProvider