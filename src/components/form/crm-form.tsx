import { Input } from '../ui/input'
import { Button } from '../ui/button'

const Crmform = () => {
  return (
    <div className="mt-10 w-[75%] mx-auto">
      <div className="font-bold">
        <p className="text-center">CRM Form</p>
      </div>
      <div className="mt-3">
        <div className="mb-2">
          <Input type="text" placeholder="CRM Information" />
        </div>
        <div className="mb-2">
          <Input type="text" placeholder="CRM Information" />
        </div>
      </div>
      <div className="text-center">
        <Button variant={"secondary"} >Submit</Button>
      </div>
    </div>
  )
}

export default Crmform
