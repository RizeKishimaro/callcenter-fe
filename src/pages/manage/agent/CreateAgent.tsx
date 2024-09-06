import AgentCreateForm from '../../../components/form/AgentCreateForm'

const CreateAgent = () => {
  return (
    <div className="flex flex-row w-[90%] mx-auto">
      <div className="w-4/5 flex">
        <AgentCreateForm />
      </div>
      <div className="w-1/5"></div>
    </div>
  )
}

export default CreateAgent