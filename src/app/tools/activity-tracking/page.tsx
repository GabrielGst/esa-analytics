"use client";

// Core Imports
import React, { useEffect, useState } from "react";

// UI Imports
import { MRT_RowSelectionState } from "mantine-react-table";
import { useDisclosure } from "@mantine/hooks";

// In House components
import { ActivityTableTracking } from "@/components/ssap/tables/activity-table-tracking";
import CustomModal from "@/components/ssap/CustomModal";
import ActivityModalContent from "@/components/ssap/ActivityModal";
import { PostApi } from "@/components/PostApi";
import { Activity, outputsPostApi } from "@/lib/types";




export default function Home() {

  const [tableData, setTableData] = useState<Activity[]>([]);
  const [lastRefresh, setlastRefresh] = useState<Date>();
  
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available
  const [refreshStatus, setRefreshStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');
  

  const [openedRow, handlersRow] = useDisclosure(false);
  const [editActivity, setEditActivity] = useState<{ssapId: string, title: string}>({ssapId: "", title: ""});
  
  async function refreshTable() {
    const data = {
      payload: {},
      flags: {
        listName: "SSAP_list_of_activities",
        exportStatus: false,
      }
    }

    const response: outputsPostApi = await PostApi({
      route: "refresh-app/",
      inputData: data,
      setstatus: setRefreshStatus,
      toastSuccessMessage: "Successfuly fetched the python API.",
      toastErrorMessage: "Error fetching the python API."
    });

    const refreshTime: Date = new Date();
    setlastRefresh(refreshTime)

    if (response.status === "success") {

      console.log(response.status)
      const activities: Activity[] = Object.values(response.data?.activities);
      // console.log(activities)
      setTableData(activities);

    } else {
      console.log(response.status)
      setTableData([])
    }

    // console.log("Activities (table): \n\n", tableData)
  }
  

  useEffect(() => {
    refreshTable()
  }, []);

  
  return (
    <div>

      <article
        className="prose max-w-none prose-a:text-blue-600"
      >
        <h2>
          Annual Review Tracking : On Demand Draft Report Generator
        </h2>
        <p>
          This page allows for generation of draft Annual Review Application reports using TO's inputs without triggering the original application, allowing on demand checks of the content and inputs provided by the TOs.
        </p>
        <p>
          Browse, filter and select activities to include in the report using the following table.
        </p>
        <p>
          Hit the "Generate PPT" button once you are ready to generate the draft report.
        </p>
        
        <p>
          <strong>
            Last Refresh : {lastRefresh?.toLocaleString()} .
          </strong>
        </p>
      </article>
      

      <div className="container mx-auto py-10">
        <ActivityTableTracking
          data={tableData}
          setRowSelectionAction={setRowSelection}
          rowSelection={rowSelection}
          openRowAction={() => handlersRow.open()}
          setActivityAction={setEditActivity}
        />
      </div>

      <CustomModal
        opened={openedRow}
        onClose={() => handlersRow.close()}
        // title="Show Activity"
        zIndex={200}
        withCloseButton={false}
        trapFocus={false}
        // xOffset={"40vw"}
        // className={
        //   "ml-100vw mt-5vw"
        // }
        size={"80vw lg:60vw xl:40vw"}
        sx={{
        // width: '40vw', // Example: Set width to 50% of the parent
        // maxWidth: '40vw', // Example: Limit max width to 600px
        // height: '75vw', //'400px', // Example: Set height to 400px
        // maxHeight: '75vw', // Example: Limit max height to 600px
        // marginLeft: '30vw',
        // overflowY: 'auto'
        }}
      >
        <ActivityModalContent
          data={tableData.filter(e => e.ssapId === editActivity.ssapId)[0]}
          activityId={editActivity.ssapId}
        />
      </CustomModal>
      
    </div>
  );
}
