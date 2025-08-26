// import { ChartAreaInteractive } from "@/app/admin-dashboard/chart-area-interactive"
import { DataTable } from "@/app/admin-dashboard/data-table"
import { SectionCards } from "@/app/admin-dashboard/section-cards"

import data from "./data.json"

export default function Page() {
  return (
    <>
      <SectionCards />
      {/* Charts temporarily disabled due to Recharts runtime error; re-enable after dep fix */}
      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}
      <DataTable data={data} />
    </>
  )
}
