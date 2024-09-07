import { memo } from "react"
import IvrTreeForm from "../../../components/form/IvrTreeForm"

const Ivr = () => {
    return (
        <div className="flex flex-row w-[90%] mx-auto">
            <div className="w-4/5 flex">
                <IvrTreeForm />
            </div>
            <div className="w-1/5"></div>
        </div>
    )
}

export default memo(Ivr)