import React, { useEffect, useState } from 'react'

import DataTable from '../components/DataTable'
import Filters from '../components/Filters'

function Home() {
  const [filters, setFilters] = useState({});
  return (
    <>
      <Filters onFilterChange={setFilters} />
      <DataTable filters={filters} />
    </>
  )
}

export default Home
