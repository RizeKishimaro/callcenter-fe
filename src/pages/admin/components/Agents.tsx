import { useState } from 'react';
import { DataTable } from '../../agent/datatable/data-table'
import { agentcolumns } from './datacolumn/agentcolumn';

const Agents = () => {
  const [selectedRow, setselectedRow] = useState([]);
  const fakeAgents = [
    {
      id: 1,
      ag_name: "agent_jones",
      sip_name: "sip_jones",
      ag_password: "jonesPass123!",
      ag_profile: "Customer Support",
      ag_call_time: 1800,  // 30 minutes
      campaign_id: 1,
      sip_provider_id: 2,
      created_at: "2024-08-21T10:15:00.000Z"
    },
    {
      id: 2,
      ag_name: "agent_smith",
      sip_name: "sip_smith",
      ag_password: "smithStrong456!",
      ag_profile: "Sales",
      ag_call_time: 1200,  // 20 minutes
      campaign_id: 1,
      sip_provider_id: 3,
      created_at: "2024-08-21T11:45:00.000Z"
    },
    {
      id: 3,
      ag_name: "agent_doe",
      sip_name: "sip_doe",
      ag_password: "doeSecure789!",
      ag_profile: "Technical Support",
      ag_call_time: 3600,  // 60 minutes
      campaign_id: 2,
      sip_provider_id: 1,
      created_at: "2024-08-21T09:00:00.000Z"
    },
    {
      id: 4,
      ag_name: "agent_lee",
      sip_name: "sip_lee",
      ag_password: "leePassword101!",
      ag_profile: "Account Management",
      ag_call_time: 2400,  // 40 minutes
      campaign_id: 3,
      sip_provider_id: 2,
      created_at: "2024-08-20T14:30:00.000Z"
    },
    {
      id: 5,
      ag_name: "agent_kim",
      sip_name: "sip_kim",
      ag_password: "kimPassSecure!",
      ag_profile: "Billing",
      ag_call_time: 900,  // 15 minutes
      campaign_id: 4,
      sip_provider_id: 4,
      created_at: "2024-08-19T13:45:00.000Z"
    },
    {
      id: 6,
      ag_name: "agent_tanaka",
      sip_name: "sip_tanaka",
      ag_password: "tanaka789!",
      ag_profile: "Technical Support",
      ag_call_time: 2100,  // 35 minutes
      campaign_id: 2,
      sip_provider_id: 5,
      created_at: "2024-08-21T15:00:00.000Z"
    },
    {
      id: 7,
      ag_name: "agent_kumar",
      sip_name: "sip_kumar",
      ag_password: "kumarPass321!",
      ag_profile: "Customer Support",
      ag_call_time: 3000,  // 50 minutes
      campaign_id: 3,
      sip_provider_id: 1,
      created_at: "2024-08-20T09:15:00.000Z"
    },
    {
      id: 8,
      ag_name: "agent_wong",
      sip_name: "sip_wong",
      ag_password: "wongSecure123!",
      ag_profile: "Sales",
      ag_call_time: 1800,  // 30 minutes
      campaign_id: 1,
      sip_provider_id: 3,
      created_at: "2024-08-21T16:00:00.000Z"
    },
    {
      id: 9,
      ag_name: "agent_patel",
      sip_name: "sip_patel",
      ag_password: "patelPass789!",
      ag_profile: "Billing",
      ag_call_time: 2700,  // 45 minutes
      campaign_id: 4,
      sip_provider_id: 4,
      created_at: "2024-08-19T10:30:00.000Z"
    },
    {
      id: 10,
      ag_name: "agent_singh",
      sip_name: "sip_singh",
      ag_password: "singhPass456!",
      ag_profile: "Account Management",
      ag_call_time: 3300,  // 55 minutes
      campaign_id: 3,
      sip_provider_id: 2,
      created_at: "2024-08-20T11:45:00.000Z"
    }
  ];


  return (
    <div className='p-4'>
      <DataTable columns={agentcolumns} data={fakeAgents} filterColumn='ag_name' onSelectedRowChange={setselectedRow} />
    </div>
  )
}

export default Agents
