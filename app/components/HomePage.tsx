"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons

const HomePage = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const rows = 12;

  const fetchData = async (pageNumber: number) => {
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=${rows}`
      );
      setData(response.data.data);
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const onPageChange = (event: any) => {
    setPage(event.page + 1);
  };

  const onSelectionChange = (event: any) => {
    setSelectedRows(event.value);
  };

  return (
    <>
      <DataTable
        value={data}
        paginator
        rows={rows}
        totalRecords={totalRecords}
        onPage={onPageChange}
        lazy
        onSelectionChange={onSelectionChange}
        first={(page - 1) * rows}
        selectionMode="checkbox"
        selection={selectedRows}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>
    </>
  );
};

export default HomePage;
