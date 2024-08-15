
import { useState, useEffect } from 'react';
import { DataTable } from './datatable/data-table';
import { Payment, columns } from "./datatable/columns";

const getData = async (): Promise<Payment[]> => {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      csnumber: "09978551579",
      agnumber: "012399009",
      calltimemin: 1,
      calltimesec: 65,
      status: "ANSWER"
    },
    {
      id: "id-1",
      csnumber: "09978551579",
      agnumber: "012399009",
      calltimemin: 1,
      calltimesec: 65,
      status: "ANSWER"
    },
    {
      id: "id-2",
      csnumber: "09978551580",
      agnumber: "012399010",
      calltimemin: 2,
      calltimesec: 30,
      status: "NO ANSWER"
    },
    {
      id: "id-3",
      csnumber: "09978551581",
      agnumber: "012399011",
      calltimemin: 0,
      calltimesec: 45,
      status: "ANSWER"
    },
    {
      id: "id-4",
      csnumber: "09978551582",
      agnumber: "012399012",
      calltimemin: 3,
      calltimesec: 20,
      status: "NO ANSWER"
    },
    {
      id: "id-5",
      csnumber: "09978551583",
      agnumber: "012399013",
      calltimemin: 4,
      calltimesec: 55,
      status: "ANSWER"
    },
    {
      id: "id-6",
      csnumber: "09978551584",
      agnumber: "012399014",
      calltimemin: 2,
      calltimesec: 15,
      status: "NO ANSWER"
    },
    {
      id: "id-7",
      csnumber: "09978551585",
      agnumber: "012399015",
      calltimemin: 1,
      calltimesec: 30,
      status: "ANSWER"
    },
    {
      id: "id-8",
      csnumber: "09978551586",
      agnumber: "012399016",
      calltimemin: 5,
      calltimesec: 25,
      status: "NO ANSWER"
    },
    {
      id: "id-9",
      csnumber: "09978551587",
      agnumber: "012399017",
      calltimemin: 0,
      calltimesec: 50,
      status: "ANSWER"
    },
    {
      id: "id-10",
      csnumber: "09978551588",
      agnumber: "012399018",
      calltimemin: 3,
      calltimesec: 35,
      status: "NO ANSWER"
    }
  ]
}

const RecentCalls = () => {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-5'>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default RecentCalls;

