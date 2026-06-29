import { Textarea , CloseButton, Button } from '@mantine/core';
import { useState } from 'react';

import { PostApi } from '../PostApi';
import { Activity, dataPayload, outputsPostApi } from '@/lib/types';

type props = {
  slug: string,
  onAssociated?: (activities: Activity[]) => void,
  onClose?: () => void,
}


export default function AssociateActivityModalField({ slug, onAssociated, onClose } : props) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');

  function handleChange(changeValue: string) {
    setValue(changeValue)
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
    })

    if (response.status === "success") {
      const newActivities: Activity[] = (response.data as any)?.newActivities ?? [];
      onAssociated?.(newActivities);
      onClose?.();
    }
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

