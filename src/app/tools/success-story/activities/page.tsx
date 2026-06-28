"use client";

import React, { useEffect, useState } from "react"
// import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button";

import { Activity } from "@/lib/types"
import { ActivityTable } from "@/components/ssap/tables/activity-table";
import { PostApi } from "@/components/PostApi";

// import { generateRandomString } from "@/lib/utils"

import { MRT_RowSelectionState } from 'mantine-react-table';
// import { toast } from "sonner"
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

import { inputsPostApi, outputsPostApi, dataPayload } from "@/lib/types";
import { useDisclosure } from "@mantine/hooks";
import CustomModal from "@/components/ssap/CustomModal";
import CreateStoryModalField from "@/components/ssap/CreateStoryFunction";

import { CustomDrawer } from "@/components/ssap/forms/CustomDrawer";
import ActivityFormMantine from "@/components/ssap/forms/activity-form";
import ActivityModalContent from "@/components/ssap/ActivityModal";
import { notifications } from "@mantine/notifications";
import { getFacetedUniqueValues } from "@tanstack/react-table";
import { Button, ScrollArea } from "@mantine/core";

// type activitySelection = {
//   [x: string]: boolean; 
// }


// const Result = ({ status }: { status: string }) => {
//   if (status === 'success') {
//     return (
//     <>
//       <br></br>
//       <p>✅ File uploaded successfully!</p>
//     </>
//   );
//   } else if (status === 'fail') {
//     return (
//       <>
//         <br></br>
//         <p>❌ File upload failed!</p>
//       </>
//     );
//   } else if (status === 'uploading') {
//     return (
//       <>
//         <br></br>
//         <p>⏳ Uploading selected file...</p>
//       </>
//     );
//   } else {
//     return null;
//   }
// };


export default function Home() {

  const [tableData, setTableData] = useState<Activity[]>([]);
  const [lastRefresh, setlastRefresh] = useState<Date>();
  
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available
  const [refreshStatus, setRefreshStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');
  const [storyCreationStatus, setstoryCreationStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');
  const [storyId, setStoryId] = useState<string>();

  
  const [opened, { open, close }] = useDisclosure(false);
  const [openedRow, handlersRow] = useDisclosure(false);
  const [openedDrawer, handlersDrawer] = useDisclosure(false);
  const [editActivity, setEditActivity] = useState<{ssapId: string, title: string}>({ssapId: "", title: ""});

  // const [modalData, setModalData] = useState();  

  // const router = useRouter()
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
      message: "Waiting for database to be updated...",
      color: "yellow",
      autoClose: false,
      loading: true,
    })
    await delayRefresh(3000);
    setRefreshKey(prev => prev + 1); // Change triggers refresh
    notifications.update({
      id: 'waiting-server',
      color: 'green',
      title: "Refreshing",
      message: "Refreshing with updated values",
      autoClose: 10000,
    })
  };
  
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
      toastErrorMessage: "Error fetching the python API.",
      // title: "Fetching related files",
      // message: "Fetching related files..."
    });

    const refreshTime: Date = new Date();
    setlastRefresh(refreshTime)

    if (response.status === "success") {

      console.log(response.status)
      const activities: Activity[] = Object.values(response.data?.activities);
      // console.log(activities)
      setTableData(activities);
      setRefreshCompKey(prev => prev + 1);

    } else {
      console.log(response.status)
      setTableData([])
    }

    // console.log("Activities (table): \n\n", tableData)
  }

  
  // async function createStory(rowSelection: activitySelection) {

  //   // var storyName="test";
  //   var storyName = (document.getElementById('storyName') as HTMLInputElement).value;
  //   const uniqueKey = generateRandomString(15)
  //   const storyIdLoc = "story_guid" + uniqueKey

  //   console.log(storyName)
  //   console.log(storyIdLoc)
  //   console.log(rowSelection)

  //   const inputData: dataPayload = {
  //     payload: {
  //       childActivities: Object.keys(rowSelection).join(",")
  //     },
  //     flags: {
  //       storyName: storyName === "" ? "test" : storyName,
  //       storyId: storyIdLoc,
  //       listName: "SSAP_list_of_stories",
  //     }

  //   };
  //   console.log(inputData)

  //   const response: outputsPostApi = await PostApi({  
  //     route: "create-story/",
  //     inputData: inputData,
  //     setstatus: setstoryCreationStatus,
  //     toastSuccessMessage: "Successfuly fetched the python API.",
  //     toastErrorMessage: "Error fetching the python API.",
  //     toastSuccessDescription: "When creating story" + storyName,
  //     toastErrorDescription : "When creating story" + storyName,
  //   })

  //   if (response.status == "success") {
  //     console.log("Success Story creation status : ", response.status)
  //     setStoryId(storyIdLoc)
  //   } else {
  //     console.log("Success Story creation status : ", response.status)
  //   }
  // }


  useEffect(() => {
    refreshTable()
  }, [refreshKey]);

  // useEffect(() => {
  //   if (storyCreationStatus === 'success') {
  //     router.push("/tools/success-story/stories/edit-story/" + storyId)
  //   }
  // },[storyCreationStatus, storyId, router])

 
  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Create Story
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-10">
        Browse activities, select some and create your story.
      </p>
      
      <p className="leading-7 [&:not(:first-child)]:mt-4">
        Tips :
      </p>

      <ol className="my-2 ml-14 list-disc [&>li]:mt-2">
        <li>Use the Fullscreen for more accessible navigation through the table</li>
        <li>In case you need to edit activities, you can even directly edit them through the table</li>
      </ol>

      <p className="leading-7 [&:not(:first-child)]:mt-8">
        <strong>
          Last Refresh : {lastRefresh?.toLocaleString()}
        </strong>
      </p>

      {/* <div className="flex flex-col">
        <Button className="w-md self-center" onClick={() => refreshTable()}>Refresh</Button>
      </div> */}

      
      {/* <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Browse activities
      </h2>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        You can browse activities and edit them directly from this table. 
      </p> */}
      
      <div className="container mx-auto py-10">
        <ActivityTable 
          // key={refreshCompKey}
          data={tableData} 
          setRowSelectionAction={setRowSelection} 
          rowSelection={rowSelection} 
          openModalAction={open} 
          openDrawerAction={() => handlersRow.open()} 
          setActivityAction={setEditActivity}
        />
      </div>

      {/* <div className="flex flex-col">
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Create story
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          You can select activities to include in your story above, then name your story in the following input field, then click "Create Story". 
        </p>

        <div className="grid w-full max-w-sm items-center gap-1.5 self-center mt-10">
          <Label htmlFor="storyName">Story Name</Label>
          <Input type="text" id="storyName" placeholder="Story Name" />    
        </div>

        <Button className="w-md self-center mt-10" onClick={() => createStory(rowSelection)}>Create Stories</Button>
      </div> */}

      
      <CustomModal
        opened={opened}
        onClose={close}
        title="Create Story"
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
          You can select activities to include in your story above, then name your story in the following input field, then click "Create Story". 
        </p>
        <CreateStoryModalField rowSelection={rowSelection} />
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
        <div
          className="flex place-items-center justify-center min-w-[80vw] lg:min-w-[60vw] xl:min-w-[40vw]"
          // style={{ minWidth: '80vw' }}
        >
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
          triggerRefresh={handleRefresh}
        />

      </CustomDrawer>
    </div>
  );
}
