import React from "react"
import CampaignCreateForm from "../../../components/form/CampaignCreateForm"

const CreateCampaign = () => {
    return (
        <div className="flex flex-row w-[90%] mx-auto">
            <div className="w-4/5 flex">
                <CampaignCreateForm />
            </div>
            <div className="w-1/5"></div>
        </div>
    )
}

export default CreateCampaign