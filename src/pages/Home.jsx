import React, { useState } from 'react'

import DataTable from '../components/DataTable'
import Filters from '../components/Filters'
import styles from './home.module.css'

function Home() {
  const [filters, setFilters] = useState({});
  return (
    <>
      <div className={styles['body']}>

        <Filters onFilterChange={setFilters} />
        <DataTable filters={filters} />

      </div>
    </>
  )
}

export default Home
