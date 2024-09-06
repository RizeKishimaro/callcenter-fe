import React, { useEffect, useState } from 'react'
import { DataTable } from '../../agent/datatable/data-table'
import { sipColumns } from './datacolumn/sipprovidercolumn'
import { sipData } from '../../../providers/fakeData'

const SipProviderComponent = () => {

  const [selectedRow, setSelectedRow] = useState(null);
  useEffect(() => {
    console.log(selectedRow)
  }, [selectedRow])
  return (
    <div className='px-4'>
      <DataTable columns={sipColumns} data={sipData} filterColumn='sip_host' onSelectedRowChange={setSelectedRow} />

    </div>
  )
}

export default SipProviderComponent
