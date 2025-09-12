"use client";


import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

import { useRouter } from 'next/navigation';

import { Textarea , CloseButton, Button } from '@mantine/core';

import { PostApi } from '../PostApi';
import { generateRandomString } from "@/lib/utils"

import { dataPayload, outputsPostApi } from '@/lib/types';



type activitySelection = {
  [x: string]: boolean; 
}

type props = {
  rowSelection: activitySelection,
}


export default function CreateStoryModalField({ rowSelection } : props) {
  const [value, setValue] = useState('');
  // const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');
  const [storyCreationStatus, setstoryCreationStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');
  const [storyId, setStoryId] = useState<string>();

  const { data: session, status } = useSession();
  const storyCreator = session?.user.email;
  const storyBirth = new Date();

  const router = useRouter()

  function handleChange(changeValue: string) {
    setValue(changeValue)
    // console.log(changeValue)
  }


  async function handleCreateStory(rowSelection: activitySelection) {

    // var storyName="test";
    const uniqueKey = generateRandomString(15)
    const storyIdLoc = "story_guid" + uniqueKey

    console.log(value)
    console.log(storyIdLoc)
    console.log(rowSelection)

    const inputData: dataPayload = {
      payload: {
        childActivities: Object.keys(rowSelection).join(","),
        storyAuthor: storyCreator,
        storyBirth: storyBirth.toLocaleString(),
      },
      flags: {
        storyName: value === "" ? "test" : value,
        storyId: storyIdLoc,
        listName: "SSAP_list_of_stories",
      }

    };
    console.log(inputData)

    const response: outputsPostApi = await PostApi({  
      route: "create-story/",
      inputData: inputData,
      setstatus: setstoryCreationStatus,
      toastSuccessMessage: "Successfuly fetched the python API.",
      toastErrorMessage: "Error fetching the python API.",
      toastSuccessDescription: "When creating story" + value,
      toastErrorDescription : "When creating story" + value,
    })

    if (response.status == "success") {
      console.log("Success Story creation status : ", response.status)
      setStoryId(storyIdLoc)
    } else {
      console.log("Success Story creation status : ", response.status)
    }
  }

  useEffect(() => {
    if (storyCreationStatus === 'success') {
      router.push("/tools/success-story/stories/edit-story/" + storyId)
    }
  },[storyCreationStatus, storyId, router])


  return (
    <div 
      className='mt-4 p-2 flex flex-col justify-center'
    >
      <Textarea 
        placeholder="Story Name"
        value={value}
        onChange={(event) => handleChange(event.currentTarget.value)}
        // rightSectionPointerEvents="all"
        mt="md"
        autosize
        minRows={2}
        maxRows={8}
        // leftSection={<IconAt size={16} />}
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setValue('')}
            style={{ display: value ? undefined : 'none' }}
          />
        }
      /> 

      <Button onClick={() => handleCreateStory(rowSelection)} className="mt-4 p-2">
        Create Story
      </Button>
    </div>
  );
}

