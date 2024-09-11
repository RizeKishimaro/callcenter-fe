import ActiveQueue from "../../components/general/ActiveQueue";
import CallCount from "../../components/general/CallCount";
import SipInfo from "../../components/general/SipInfo";
import QueueStatusMember from "../admin/components/QueueStatus";

export default function AdminHome() {
  return (
    <div className="flex flex-col lg:flex-row p-3 gap-x-3">
      <div className="flex-1 flex flex-col lg:gap-y-5 md:gap-y-3">
        <div className="flex flex-col md:flex-row gap-x-3">
          <div className="w-3/5"><SipInfo /></div>
          <div className="w-2/5 h-2/3 overflow-scroll"><QueueStatusMember /></div>
        </div>
        <div className=""><CallCount /></div>
      </div>
      <div className="w-full xl:max-w-[550px] lg:mxa-w-[450px]">
        <ActiveQueue />
      </div>
    </div>
  )
};
