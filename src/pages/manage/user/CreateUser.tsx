import UserCreateForm from "../../../components/form/UserCreateForm"

const CreateUser = () => {
  return (
    <div className="flex flex-row w-[90%] mx-auto">
    <div className="w-4/5 flex">
      <UserCreateForm />
    </div>
    <div className="w-1/5"></div>
  </div>
  )
}

export default CreateUser