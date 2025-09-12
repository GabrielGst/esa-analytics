"use client";


import React, { useEffect, useState } from "react"

import { MRT_RowSelectionState } from 'mantine-react-table';

import { Story } from "@/lib/types"
import { inputsPostApi, outputsPostApi, dataPayload } from "@/lib/types";
import { StoryTable } from "@/components/ssap/tables/story-table";
import { PostApi } from "@/components/PostApi";


type StorySelection = {
  [x: string]: boolean; 
}

const Result = ({ status }: { status: string }) => {
  if (status === 'success') {
    return (
    <>
      <br></br>
      <p>✅ File uploaded successfully!</p>
    </>
  );
  } else if (status === 'fail') {
    return (
      <>
        <br></br>
        <p>❌ File upload failed!</p>
      </>
    );
  } else if (status === 'uploading') {
    return (
      <>
        <br></br>
        <p>⏳ Uploading selected file...</p>
      </>
    );
  } else {
    return null;
  }
};


export default function Home() {

  const [tableData, setTableData] = useState<Story[]>([]);
  const [lastRefresh, setlastRefresh] = useState<Date>();
  
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available
  const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');

  async function refreshTable() {
    const data: dataPayload = {
      payload: {},
      flags: {
        listName: "SSAP_list_of_stories",
        exportStatus: false,
      }
    }

    const response: outputsPostApi = await PostApi({
      route: "refresh-app/",
      inputData: data,
      setstatus: setStatus,
      toastSuccessMessage: "Successfuly fetched the python API.",
      toastErrorMessage: "Error fetching the python API."
    });

    const stories: Story[] = Object.values(response.data?.stories)//.map((item) => ({
    //   ssapId: item.storyId,
    //   country: item.country,
    //   fundCode: item.fundCode,
    //   title: item.Title,
    //   status: item.status,
    //   pptReport: item.pptReport,
    //   description: item.storyDescription,
    //   supplierName: item.supplierName,
    //   numberOfActivities: item.numberOfActivities,
    //   yearAchievement: item.yearAchievement,
    //   submissionDate: item.submissionDate,
    //   esaInternal: item.esaInternal,
    //   author: item.storyAuthor,
    //   lastAuthor: item.lastAuthor,
    // }));
    
    // console.log(stories)

    const refreshTime: Date = new Date();
    setlastRefresh(refreshTime)

    if (response.status === "success") {
      console.log("status : ", response.status)
      setTableData(stories);
    } else {
      setTableData([])
      console.log("status : ", response.status)
    }

    // console.log(status)
    // console.log(tableData)
  }

  useEffect(() => {
    refreshTable()
  }, []);
 
  return (
    <div >

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Stories
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Stories are successful partnership between ESA and a specific entity or a given country, dependeing on the scope of the story you want to tell.
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-3">
        Select a reviewed story and access the presentation generator.
      </p>



      {/* <div className="flex flex-col">
        <Button className="w-md self-center" onClick={() => refreshTable()}>Refresh</Button>
      </div> */}

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Browse stories
      </h2>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        You can browse stories and edit them directly from this table. 
      </p>

      <p className="leading-7 [&:not(:first-child)]:mt-3">
        <strong>
          Last Refresh : {lastRefresh?.toLocaleString()}
        </strong>
      </p>

      <div className="container mx-auto py-10">
        <StoryTable data={tableData} setRowSelectionAction={setRowSelection} rowSelection={rowSelection} />
      </div>
    </div>
  );
}
