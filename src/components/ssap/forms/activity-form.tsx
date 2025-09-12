"use client";

// Core components
import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';

// UI Components
import { 
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  Checkbox,
 } from '@mantine/core';

// In House Components and Types
import { PostApi } from '@/components/PostApi';
import MultipleFileUploader from '@/components/MultipleFileUploader';

import {
  outputsPostApi,
  dataPayload,
  Activity
} from '@/lib/types';


// Defines form values initialisation
function loadInitialValues(refreshData: Activity | undefined
): Promise<Partial<Activity>> {

  console.log("loadInitialValues inputs : \n", refreshData)

  return new Promise((resolve) => {
    setTimeout(() => resolve({
      description: refreshData?.arap_Description === null ? '' : refreshData?.arap_Description,
      author0: refreshData?.author0 === null ? '' : refreshData?.author0,
      esaInternal: refreshData?.esaInternal ?? true,
      impact1: refreshData?.impact1 === null ? '' : refreshData?.impact1,
      impact2: refreshData?.impact2 === null ? '' : refreshData?.impact2,
      impact3: refreshData?.impact3 === null ? '' : refreshData?.impact3,
    }), 2000);
  });
}


type props = {
  data: Activity,
  activityId: string,
  triggerRefresh: () => void,
} & React.HTMLAttributes<HTMLDivElement>;


// Define Activity Form
// To do : implement commented validation
function ActivityFormMantine({
  data,
  activityId,
  triggerRefresh,
  className}: props) {

  const [slug, setSlug] = useState<string>("");
  const [active, setActive] = useState(0);
  const [loadedInit, setLoadedInit] = useState(false);
  const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');


  const form = useForm<Partial<Activity>>({
    mode: 'uncontrolled',
    initialValues: {
    },
    onValuesChange: (values) => {
      window.localStorage.setItem('user-form', JSON.stringify(values));
    },

    // validate: (values) => {
    //   if (active === 0) {
    //     return {
    //       username:
    //         values.username.trim().length < 6
    //           ? 'Username must include at least 6 characters'
    //           : null,
    //       password:
    //         values.password.length < 6 ? 'Password must include at least 6 characters' : null,
    //     };
    //   }

    //   if (active === 1) {
    //     return {
    //       name: values.name.trim().length < 2 ? 'Name must include at least 2 characters' : null,
    //       email: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',
    //     };
    //   }

    //   return {};
    // },
  });

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  async function onSubmit(values: Partial<Activity>) {
    nextStep() 
    setStatus('uploading');
    console.log(slug)
    console.log(values)

    const dataFormUpload: dataPayload = {
      payload: {
        formData: {
          description: values.description ?? '',
          author: values.author0 ?? '',
          esaInternal: values.esaInternal ?? true,
          impact1: values.impact1 ?? '',
          impact2: values.impact2 ?? '',
          impact3: values.impact3 ?? '',
          itemId: slug ?? '',
        }
      },
      flags: {
        listName: "SSAP_list_of_activities",
        exportStatus: false,
      }
    }

    const response: outputsPostApi = await PostApi({
      route: "post-ssap/",
      inputData: dataFormUpload,
      setstatus: setStatus,
      toastSuccessMessage: "Successfuly fetched the python API.",
      toastErrorMessage: "Error fetching the python API."
    })

    triggerRefresh()
  
  }

  useEffect(() => {
    setSlug(activityId)
  }, [])

  useEffect(() => {
    loadInitialValues(
      data
    ).then((values) => {
      console.log(values)
      form.setValues(values);
      form.resetDirty(values);
    }).then(() => {
      setLoadedInit(true)
    });
  }, [data]);

  // useEffect(() => {
  //   const storedValue = window.localStorage.getItem('user-form');
  //   console.log("Comparison between stored values and loaded values : \n")
  //   console.log(storedValue)
  //   console.log(form.getValues())

  //   if (storedValue && loadedInit) {
  //     if (storedValue !== form.getValues()) {
  //       try {
  //         form.setValues(JSON.parse(window.localStorage.getItem('user-form')!));
  //       } catch (e) {
  //         console.log('Failed to parse stored value');
  //       }
  //     }
  //   }
  // }, [loadedInit]);

  return (
    <div className={className}>
      <div className='prose max-w-none mt-8'>
        <h2>
          Activity Update
        </h2>
      </div>

      <div className='mt-8'>
        <Stepper active={active}>
          <Stepper.Step label="First step" description="Activity Overview">
            {/* <TextInput
              className='mt-3'
              label="Author"
              description="Author email address."
              placeholder="Please enter your email address"
              key={form.key('author0')}
              {...form.getInputProps('author0')}
            /> */}
            <Textarea
              className='mt-3'
              label="Description"
              description="Explain the purpose of this Activity."
              placeholder="Please enter a description for this Activity."
              key={form.key('description')}
              {...form.getInputProps('description')}
            />
            <Checkbox
              className='mt-3'
              // defaultChecked
              label="This Activity is dedicated to esa internal use only."
              color="rgba(23, 60, 138, 1)"
              key={form.key('esaInternal')}
              {...form.getInputProps('esaInternal', { type: 'checkbox' })}
            />
          </Stepper.Step>

          <Stepper.Step label="Second step" description="Activity Description">

            {/* Impacts */}
            <div >

              {
                ['impact1', 'impact2', 'impact3'].map((key, counter) => (
                  <Textarea
                    className='mt-3'
                    label={`Impact ${counter + 1}`}
                    description={`Describe impact ${counter + 1} for the Activity`}
                    placeholder={`Please enter impact ${counter + 1} for the Activity`}
                    key={form.key(key)}
                    {...form.getInputProps(key)}
                  />
                ))
              }

            </div>

          </Stepper.Step>

          
          <Stepper.Step label="Third step" description="Related Files">

            {/* Impacts */}
            
          <div className='mt-12 prose max-w-none prose-a:text-blue-600'>
            <h2>
              Activity related files
            </h2>

            <p>
              Please click on "Upload a File" before updating form.
            </p>

          </div>

            <MultipleFileUploader slug={slug} ></MultipleFileUploader>

          </Stepper.Step>


          <Stepper.Completed>
            Thank you for updating this Activity !
            {/* <Code block mt="xl">
              {JSON.stringify(form.getValues(), null, 2)}
            </Code> */}
          </Stepper.Completed>
        </Stepper>

        <Group className="flex-end" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active < 2 && <Button onClick={nextStep}>Next step</Button>}
          {active == 2 && <Button onClick={() => {
            onSubmit(form.getValues())}}
          >
            Update
          </Button>}
        </Group>
      </div>

      
    </div>
  );
}

export default ActivityFormMantine;