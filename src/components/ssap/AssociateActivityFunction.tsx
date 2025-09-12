import { Textarea , CloseButton, Button } from '@mantine/core';
import { useState } from 'react';

import { PostApi } from '../PostApi';
import { dataPayload, inputsPostApi, outputsPostApi } from '@/lib/types';
import { SubresourceIntegrityPlugin } from 'next/dist/build/webpack/plugins/subresource-integrity-plugin';

type props = {
  slug: string,
}


export default function AssociateActivityModalField({ slug } : props) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');

  function handleChange(changeValue: string) {
    setValue(changeValue)
    console.log(changeValue)
  }


  async function handleClick() {
    const dataActivity: dataPayload = {
      payload: {
        associatedActivities: value,
      },
      flags: {
        storyId: slug,
        listName: "SSAP_list_of_stories",
      }
    }

    const response: outputsPostApi = await PostApi({
      route: "associate-activity/",
      inputData: dataActivity,
      setstatus: setStatus,
      toastSuccessMessage: "Succesfully fetched Python API.",
      toastErrorMessage: "Error when fetching Python API.",
      toastSuccessDescription: "When associating activity" + value,
      toastErrorDescription : "When associating activity" + value,
    })
  }


  return (
    <div 
      className='mt-4 p-2 flex flex-col justify-center'
    >
      <Textarea 
        placeholder="activity_SIR2_09_4000138315_,activity_RO_91_4000129508_1000012043"
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

      <Button onClick={() => handleClick()} className="mt-4 p-2">
        Associate
      </Button>
    </div>
  );
}

