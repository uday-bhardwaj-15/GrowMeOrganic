"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { db } from "@/app/firebaseConfig";
import { collection, addDoc, getDocs, writeBatch } from "firebase/firestore";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const rows = 12;

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=${rows}`
      );
      setData(response.data.data);
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const onPageChange = (event: any) => {
    setPage(event.page + 1);
  };

  // Save selected rows to Firestore
  const saveSelectedRowsToFirestore = async (selectedRows: any[]) => {
    try {
      const collectionRef = collection(db, "selectedCheckboxes"); // 'selectedArtworks' is the Firestore collection
      for (const artist_id of selectedRows) {
        await addDoc(collectionRef, artist_id); // Save each selected row to Firestore
      }
      console.log("Selected rows saved to Firestore!");
    } catch (error) {
      console.error("Error saving selected rows to Firestore:", error);
    }
  };

  const onSelectionChange = (event: any) => {
    setSelectedRows(event.value);
    setSelectedCount(event.value.length); // Update the selected count when selection changes

    // Save the selected rows to Firestore
    saveSelectedRowsToFirestore(event.value);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (!isNaN(count)) {
      const newSelectedRows = data.slice(0, count); // Select the first 'count' rows
      setSelectedRows(newSelectedRows);
      setSelectedCount(count);

      // Save the selected rows to Firestore
      saveSelectedRowsToFirestore(newSelectedRows);
    }
  };
  const handleClear = async () => {
    setSelectedRows([]);
    setSelectedCount(0);

    try {
      const collectionRef = collection(db, "selectedCheckboxes");
      const querySnapshot = await getDocs(collectionRef);
      const batch = writeBatch(db);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log("All data cleared from Firestore!");
    } catch (error) {
      console.error("Error clearing data from Firestore:", error);
    }
  };
  return (
    <>
      {loading ? (
        <div className="loader">
          <div className="wrapper">
            <div className="text">LOADING</div>
            <div className="box"></div>
          </div>
        </div>
      ) : (
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
          selection={selectedRows} // use the selectedRows state
          tableStyle={{ minWidth: "50rem" }}
          header={
            <div className="flex align-items-center mb-2">
              <InputText
                type="number"
                placeholder="Select count"
                onChange={handleInputChange}
              />
              <Button
                className="bg-gray-600"
                onClick={handleClear}
                label="Clear"
              />
            </div>
          }
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column field="title" header="Title" />
          <Column field="place_of_origin" header="Place of Origin" />
          <Column field="artist_display" header="Artist Display" />
          <Column field="inscriptions" header="Inscriptions" />
          <Column field="date_start" header="Date Start" />
          <Column field="date_end" header="Date End" />
        </DataTable>
      )}
      <div>Selected Count: {selectedCount}</div>
    </>
  );
};

export default HomePage;
