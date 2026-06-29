"use client";

import { useState, useEffect } from 'react';

// In House Components and Styles
import { Activity } from '@/lib/types';
import { Tabs, Paper } from '@mantine/core';

// @ts-ignore
import { formatMoney } from 'accounting-js'; // Add a manual type declaration (recommended)

// UI Components
import { 
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  FileInput,
  Checkbox,
  Autocomplete,
  Code,
  Title
 } from '@mantine/core';


// Define contract and customers arrays for autocomplete fields.
// To do : load the official data in these arrays.
// To do : change autocomplete dields to controlled components to implement automatic filterings of these arrays.


type props = {
  data: Activity,
  activityId: string,
  triggerRefresh?: number,
} & React.HTMLAttributes<HTMLDivElement>;

// Define Activity Form
// To do : implement commented validation
function ActivityModalContent({ data, activityId, triggerRefresh, className}: props) {
  const [slug, setSlug] = useState<string>("");
  const [activityData, setActivityData] = useState<Activity>(data);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>();

  async function refreshActivity(slug: string) {
    try {
      const res = await fetch(`/api/activity/${encodeURIComponent(slug)}`);
      const json = await res.json();
      if (json.status === 'success') {
        setActivityData(json.activity);
      }
    } catch (err) {
      console.error('Failed to refresh activity:', err);
    }
  }

  async function refreshFiles(slug: string) {
    try {
      const res = await fetch(`/api/files?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setUploadedFiles(data.files);
      }
    } catch (err) {
      console.error('Failed to fetch files:', err);
    }
  }

  // useEffect(() => {
  //   const encodedSegment = pathname.split('/').pop(); 
    
  //   if (encodedSegment !== undefined) {
  //     const decodedSegment = decodeURIComponent(encodedSegment);
  //     setSlug(decodedSegment);
  //   }
  // }, [pathname, searchParams]);

  useEffect(() => {
    setSlug(activityId)
  }, [])

  useEffect(() => {
    if (data) setActivityData(data);
  }, [data]);
  
  useEffect(() => {
    if (slug) {
      refreshActivity(slug);
      refreshFiles(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (slug && triggerRefresh) {
      refreshActivity(slug);
      refreshFiles(slug);
    }
  }, [triggerRefresh]);

  // const [slug, setSlug] = useState<string>("");
  // const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');
  // const [lastRefresh, setlastRefresh] = useState<Date>();
  // const [data, setdata] = useState<Activity>();


  // async function refreshForm(slug: string) {

  //   console.log("\n\n Refreshing Form values \n\n")

  //   const dataForm = {
  //     payload: {},
  //     flags: {
  //       slug: slug,
  //       folder: "Shared Documents/SSAP/activities/" + slug,
  //       listName: "SSAP_list_of_activities",
  //     }
  //   }

  //   const response: outputsPostApi = await PostApi({
  //     route: "refresh-app/",
  //     inputData: dataForm,
  //     setstatus: setStatus,
  //     toastSuccessMessage: "Successfuly fetched the python API.",
  //     toastErrorMessage: "Error fetching the python API."
  //   });

  //   const refreshTime: Date = new Date();
  //   setlastRefresh(refreshTime)

  //   if (response.status === "success") {
  //     console.log("Refresh Form status : ", response.status)

  //     // const allFiles: string[] = Object.values(response.activityData?.files); // array of all file names
  //     const allValues: Activity = response.activityData?.activity[slug]; // array of all file names
  //     // console.log(allFiles)
  //     // console.log(allValues)

  //     setdata(allValues);
  //   } else {
  //     console.log("Refresh Form status : ", response.status)
  //   }
  // }

  // useEffect(() => {
  //   setSlug(activityId)
  // }, [])
  
  // useEffect(() => {
  //   if (slug) {
  //     refreshForm(slug);
  //   }
  // }, [slug]);

  // useEffect(() => {
  //   refreshForm(slug)
  // }, [triggerRefresh])

  return (
    <div className={className}>
      <div className='justify-between prose max-w-[80vw] lg:max-w-[60vw] xl:max-w-[40vw] prose-a:text-blue-600'>
        <h1>
          {activityData?.Title} : {activityData?.title0}
        </h1>
        <h2 className='mt-0'>
          {activityData?.scheme} - {"Supplier Name : " + activityData?.supplierName}
        </h2>

        <Tabs defaultValue="description">
          <Tabs.List>
            <Tabs.Tab value="description">
              Description
            </Tabs.Tab>
            <Tabs.Tab value="arap">
              Annual Review Data
            </Tabs.Tab>
            <Tabs.Tab value="impacts">
              Impacts
            </Tabs.Tab>
            <Tabs.Tab value="files">
              Related Files
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="description">
            {/* <p className='m-4 p-md'>
              Description : {(activityData?.description ?? "Please enter a description for the activity.")}
            </p> */}
            <p className='m-4 p-md'>
              Contract Number : {activityData?.contractNumber}
            </p>
            {/* <p className='m-4 p-md'>
              Overall Amount : {formatMoney(parseFloat(activityData?.arap_OverallAmount ?? "Lacks data in the Annual Review"), { symbol: "€", precision: 2, thousand: ".", decimal: "," })}
            </p> */}
            <p className='m-4 p-md'>
              Scheme : {activityData?.scheme ?? "Lacks scheme in the MP"}
            </p>
            <p className='m-4 p-md'>
              Fund code : {activityData?.fundCode ?? "Lacks fundcode in the MP"}
            </p>
            <p className='m-4 p-md'>
              {/* Really the MP here ? */}
              Technical Officer : {activityData?.technicalOfficer ?? "Lacks data in the MP"}
            </p>
            {/* <p className='m-4 p-md'>
              Story Author : {activityData?.author0 ?? "Lacks data in the MP"}
            </p> */}
            <p className='m-4 p-md'>
              Esa Internal : {activityData?.esaInternal ?? "Default to YES"}
            </p>
          </Tabs.Panel>

          <Tabs.Panel value="arap">
            <p className='m-4 p-md'>
              ARAP Last Modification On : {new Date(activityData?.arap_lastModifiedOn).toLocaleString() ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              Description : {activityData?.arap_Description ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              Start of Activity : {activityData?.arap_StartofActivity ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              ESA Expected Due Date : {activityData?.arap_EED ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              Overall Amount : {formatMoney(parseFloat(activityData?.arap_OverallAmount ?? ""), { symbol: "€", precision: 2, thousand: ".", decimal: "," }) ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              Planned Start TRL : {activityData?.arap_PlannedStartTRL ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              Planned End TRL : {activityData?.arap_PlannedEndTRL ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              Prospect for Use : {activityData?.arap_ProspectforUse ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              Performance of company : {activityData?.arap_PerformanceofCompagny ?? "Lacks data in the Annual Review"}
            </p>
            <p className='m-4 p-md'>
              Note : {activityData?.arap_Note ?? "Lacks data in the Annual Review"}
            </p>
          </Tabs.Panel>

          <Tabs.Panel value="impacts">
            <p className='m-4 p-md'>
              Impact No 1 : {activityData?.impact1 ?? "Please explain the first industrial impact of this activity."}
            </p>
            <p className='m-4 p-md'>
              Impact No 2 : {activityData?.impact2?? "Please explain an eventual second industrial impact of this activity."}
            </p>
            <p className='m-4 p-md'>
              Impact No 3 : {activityData?.impact3 ?? "Please explain a potential third industrial impact of this activity."}
            </p>
          </Tabs.Panel>
          
          <Tabs.Panel value="files">

            <p className='m-4 p-md'>
              Hereafters is a list of links to the uploaded files for the selected activity.
            </p>

            <ul>
              {
                uploadedFiles &&
                uploadedFiles.map((value, counter) => (
                  <li key={counter+1} className='flex items-center gap-3 my-1'>
                    <a
                      href={`/api/file/${encodeURIComponent(slug)}/${encodeURIComponent(value)}`}
                      target="_blank"
                    >
                      File {counter+1} : {value}
                    </a>
                    <Button
                      size="compact-xs"
                      color="red"
                      variant="light"
                      onClick={async () => {
                        await fetch(`/api/file/${encodeURIComponent(slug)}/${encodeURIComponent(value)}`, { method: 'DELETE' });
                        refreshFiles(slug);
                      }}
                    >
                      Delete
                    </Button>
                  </li>
                ))
              }
            </ul>

          </Tabs.Panel>
          
        </Tabs>


      </div>
    </div>
  );
}

export default ActivityModalContent;