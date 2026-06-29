"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from 'next/navigation'
import { MRT_RowSelectionState } from 'mantine-react-table';

// In House Components
// import { StoryForm } from "@/components/ssap/forms/story-form-v2"
// import MultipleFileUploader from "@/components/ssap/MultipleFileUploader";
import { Story, Activity } from "@/lib/types"
import { StoryActivityTable } from '@/components/ssap/tables/story-activities-table';
import { PostApi } from "@/components/PostApi";
import StoryFormMantine from "@/components/ssap/forms/story-form";
import { inputsPostApi, outputsPostApi, dataPayload } from '@/lib/types';

import GenPptx from "@/components/ssap/GeneratePPT";
import { useDisclosure } from "@mantine/hooks";
import CustomModal from "@/components/ssap/CustomModal";
import AssociateActivityModalField from '@/components/ssap/AssociateActivityFunction';
import MultipleFileUploader from "@/components/MultipleFileUploader";
import { CustomDrawer } from "@/components/ssap/forms/CustomDrawer";
import ActivityFormMantine from "@/components/ssap/forms/activity-form";
import ActivityModalContent from "@/components/ssap/ActivityModal";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";


export default function Page() {

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [propId, setPropId] = useState<string>("");
  const [lastRefresh, setlastRefresh] = useState<Date>();
  const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');
  const [filledUpValues, setFilledUpValues] = useState<Story>();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>();
  const [tableData, setTableData] = useState<Activity[]>([]);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available

  const [openedAssociateActivity, handlersAssociateActivity] = useDisclosure(false);
  const [openedRow, handlersRow] = useDisclosure(false);
  const [openedDrawer, handlersDrawer] = useDisclosure(false);
  const [editActivity, setEditActivity] = useState<{ssapId: string, title: string}>({ssapId: "", title: ""});
  // const [modalData, setModalData] = useState(); 
  
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshCompKey, setRefreshCompKey] = useState(0);

  function delayRefresh(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  const handleRefresh = async () => {
    // console.log(refreshKey)
    handlersDrawer.close()
    notifications.show({
      id: 'waiting-server',
      title: "Waiting to refresh...",
      message: "Refreshing page data...",
      color: "yellow",
      autoClose: false,
      loading: true,
    })
    await delayRefresh(300);
    setRefreshKey(prev => prev + 1);
    notifications.update({
      id: 'waiting-server',
      color: 'green',
      title: "Refreshing",
      message: "Refreshing with updated values",
      autoClose: 10000,
    })
  };

  async function refreshTable(slug: string) {
    const dataTableRefresh: dataPayload = {
      payload: {},
      flags: {
        slug: slug,
        listName: "SSAP_list_of_activities",
        exportStatus: false,
        // filter: 'story'
      }
    }

    const response: outputsPostApi = await PostApi({
      route: "refresh-app/",
      inputData: dataTableRefresh,
      setstatus: setStatus,
      toastSuccessMessage: "Successfuly fetched the python API.",
      toastErrorMessage: "Error fetching the python API."
      })

    // console.log(rawData)

    const activities: Activity[] = Object.values(response.data?.relatedActivities ?? {});
    console.log(activities)

    const refreshTime: Date = new Date();
    setlastRefresh(refreshTime)

    if (response.status === "success") {
      setTableData(activities);
    } else {
      setTableData([])
    }
    console.log("refreshTable status : ", response.status)
  } 

  async function refreshForm(slug: string) {

    console.log("\n\n Refreshing Form values \n\n")

    const dataFormRefresh: dataPayload = {
      payload: {},
      flags: {
        slug: slug,
        folder: "Shared Documents/SSAP/stories/" + slug,
        listName: "SSAP_list_of_stories",
      }
    }

    const response: outputsPostApi = await PostApi({
      route: "refresh-app/", //get-activity before
      inputData: dataFormRefresh,
      setstatus: setStatus, 
      toastSuccessMessage: "Successfuly fetched the python API.",
      toastErrorMessage: "Error fetching the python API."
    })

    // console.log(fetchData)

    const refreshTime: Date = new Date();
    setlastRefresh(refreshTime)

    if (response.status === "success") {
      console.log("Refresh Form status : ", response.status)
      
      // const allFiles: string[] = Object.values(response.data?.files); // array of all file names
      const allValues: Story = response.data?.story; //[slug]; // array of all form attributes

      setFilledUpValues(allValues);
      // setUploadedFiles(allFiles)
    } else {
      console.log("Refresh Form status : ", response.status)
    }
  }

  async function refreshStoryFiles(slug: string) {
    try {
      const res = await fetch(`/api/files?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setUploadedFiles(data.files);
      }
    } catch (err) {
      console.error('Failed to fetch story files:', err);
    }
  }

  async function refresh(slug: string) {
    await Promise.all([refreshTable(slug), refreshForm(slug), refreshStoryFiles(slug)])
  }


  useEffect(() => {
    const encodedSegment = pathname.split('/').pop(); 
    
    if (encodedSegment !== undefined) {
      const decodedSegment = decodeURIComponent(encodedSegment);
      setPropId(decodedSegment);
    }
  }, [pathname, searchParams]);
  
  useEffect(() => {
    if (propId) {
      refresh(propId);
    }
  }, [propId]);

  useEffect(() => {
    if (propId && refreshKey > 0) {
      refresh(propId);
    }
  }, [refreshKey]);

  // useEffect(() => {
  //   console.log("\n\n Detected change in filledUpValues or uploadedFiles \n\n")
  //   console.log(filledUpValues)
  //   console.log(uploadedFiles)
  // }, [filledUpValues, uploadedFiles])

  return (
    <div>
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Editing story : {filledUpValues?.Title}
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          See a list of related activity and their status, edit the impacts and informations for your story.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          <strong>
            Last refresh on {lastRefresh?.toLocaleString()}.
          </strong>
        </p>
      </div>

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Related Activities
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-4">
        Hereafters is a list of selected reporting in your story.
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-4">
        If you want to associate an activity to this story, please click on the following "Associate Activity" button and paste the activity ssapId found on the Create Story table displaying all activities.
      </p>

      <div className="container mx-auto py-10">
        <StoryActivityTable
          data={tableData}
          relatedStory={propId}
          setRowSelectionAction={setRowSelection}
          rowSelection={rowSelection}
          openModalAction={() => handlersAssociateActivity.open()}
          openDrawerAction={() => handlersRow.open()}
          setActivityAction={setEditActivity}
        />
      </div>


      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Story Informations
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-4">
        You can see already uploaded data, update and add inormations in the following form.
      </p>
      
      {/* Maybe induces several reoad of the webpage at load time ? */}
      <div className="container mx-auto py-10">
        {/* <StoryForm itemId={propId} filledUpValues={filledUpValues}></StoryForm> */}
        <StoryFormMantine
          filledUpValues={filledUpValues}
          setFilledUpValues={setFilledUpValues}
          activityData={tableData}
          triggerRefresh={handleRefresh}
        />
      </div>

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Story related files
      </h2>
      
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Hereafters is a list of links to the uploaded files for the selected activity.
      </p>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {
          uploadedFiles &&
          uploadedFiles.map((value, counter) => (
            <li key={counter+1} className="flex items-center gap-3 text-sm text-muted-foreground">
              <a
                href={`/api/file/${encodeURIComponent(propId)}/${encodeURIComponent(value)}`}
                target="_blank"
              >
                File {counter+1} : {value}
              </a>
              <Button
                size="compact-xs"
                color="red"
                variant="light"
                onClick={async () => {
                  await fetch(`/api/file/${encodeURIComponent(propId)}/${encodeURIComponent(value)}`, { method: 'DELETE' });
                  refreshStoryFiles(propId);
                }}
              >
                Delete
              </Button>
            </li>
          ))
        }
      </ul>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        You can upload attachments for this story hereafters.
      </p>

      <div className="container mx-auto py-10">
        <MultipleFileUploader slug={propId} onUploadSuccess={() => refreshStoryFiles(propId)} />
      </div>


      {/* <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Story related files
      </h3> */}

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Report Generation
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Click on the button hereunder to generate the powerpoint report for this story.
      </p>
      
      <div className="container mx-auto py-10 flex justify-center" >
        <GenPptx slug={propId} storyData={filledUpValues} activityData={tableData} disabled={!filledUpValues} />
      </div>



      <CustomModal
        opened={openedAssociateActivity}
        onClose={() => handlersAssociateActivity.close()}
        title="Associate new activities"
        centered
        sx={{
        width: '50%', // Example: Set width to 50% of the parent
        maxWidth: '600px', // Example: Limit max width to 600px
        height: '400px', // Example: Set height to 400px
        maxHeight: '600px', // Example: Limit max height to 600px
        }}
        className='z-50'
      >
        <p className="leading-7 [&:not(:first-child)]:mt-10">
          Please enter the ssapId for the activities. Please use "," as a separator in case you want to ass multiple activities simultaneously.
        </p>
        <AssociateActivityModalField slug={propId} />
      </CustomModal>

      
      <CustomModal
        key={refreshCompKey + "-modal"}
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
          key={refreshCompKey + "-modal-content"}
          data={tableData.filter(e => e.ssapId === editActivity.ssapId)[0]}
          activityId={editActivity.ssapId}
          triggerRefresh={refreshKey}
        />
        <div className="flex place-items-center justify-center">
          <Button
            onClick={() => handlersDrawer.open()}
          >
            Edit Activity
          </Button>
        </div>

      </CustomModal>

      <CustomDrawer
        key={refreshCompKey + "-drawer"}
        opened={openedDrawer}
        onClose={() => handlersDrawer.close()}
        position="left"
        // title="Edit Activity"
        size={"80vw lg:35vw xl:25vw"}
        withCloseButton={false}    
        zIndex={200}    
      >
        <div className="prose max-w-none">
          <h1>
            Edit activity : {editActivity.title}
          </h1>
          <p>
            Use the form to update activity's data, and eventually use the file uploader to update any relevant files.
          </p>
        </div>
        
        <ActivityFormMantine
          data={tableData.filter(e => e.ssapId === editActivity.ssapId)[0]}
          activityId={editActivity.ssapId}
          triggerRefresh={handlersDrawer.close}
          onSaved={(updated) => setTableData(prev => prev.map(a => a.ssapId === updated.ssapId ? updated : a))}
        />

      </CustomDrawer>
    </div>
  )
}