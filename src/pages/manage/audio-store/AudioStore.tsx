import IvrAudioUploadForm from "../../../components/form/IvrAudioUploadForm"

const AudioStore = () => {
    return (
        <div className="flex flex-row w-[90%] mx-auto">
            <div className="w-4/5 flex">
                <IvrAudioUploadForm />
            </div>
            <div className="w-1/5"></div>
        </div>
    )
}

export default AudioStore