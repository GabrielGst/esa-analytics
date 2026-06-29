"use client";

import { useState, useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation'
import { useSession } from "next-auth/react";

import { useForm } from '@mantine/form';

// In House Components and Styles
import { Story } from '@/lib/types';
import { PostApi } from '@/components/PostApi';
import MultipleFileUploader from '../../MultipleFileUploader';
import { inputsPostApi, outputsPostApi, dataPayload } from '@/lib/types';
import { storyFormProps } from '@/lib/types';

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


// Defines form values initialisation
function loadInitialValues(refreshData: Story | undefined
): Promise<Partial<Story>> {

  console.log("loadInitialValues inputs : \n", refreshData)

  let customerTuples: any[];

  if (refreshData?.customers) {
    customerTuples = refreshData?.customers.split(',').map(item => item.split('_customer_')) ?? [];
  } else {
    customerTuples = []
  }

  const customerObject = Object.fromEntries(customerTuples)

  const storyObject = {
      Title: refreshData?.Title === null ? '' : refreshData?.Title,
      storyDescription: refreshData?.storyDescription === null ? '' : refreshData?.storyDescription,
      storyAuthor: refreshData?.storyAuthor === null ? '' : refreshData?.storyAuthor,
      esaInternal: refreshData?.esaInternal ?? true,
      impact1: refreshData?.impact1 === null ? '' : refreshData?.impact1,
      impact2: refreshData?.impact2 === null ? '' : refreshData?.impact2,
      impact3: refreshData?.impact3 === null ? '' : refreshData?.impact3,
      // contractNumber1: refreshData?.contractNumber1 === null ? '' : refreshData?.contractNumber1,
      // contractNumber2: refreshData?.contractNumber2 === null ? '' : refreshData?.contractNumber2,
      // contractNumber3: refreshData?.contractNumber3 === null ? '' : refreshData?.contractNumber3,
      // contractNumber4: refreshData?.contractNumber4 === null ? '' : refreshData?.contractNumber4,
      // contractNumber5: refreshData?.contractNumber5 === null ? '' : refreshData?.contractNumber5,
      // customer1: refreshData?.customer1 === null ? '' : refreshData?.customer1,
      // customer2: refreshData?.customer2 === null ? '' : refreshData?.customer2,
      // customer3: refreshData?.customer3 === null ? '' : refreshData?.customer3,
      // customer4: refreshData?.customer4 === null ? '' : refreshData?.customer4,
      // customer5: refreshData?.customer5 === null ? '' : refreshData?.customer5,
    }

    const res = {
      ...storyObject,
      ...customerObject
    }

    console.log('Initial values :\n')
    console.log(res)
    
  return Promise.resolve(res);
}


// Define Story Form
// To do : implement commented validation
function StoryFormMantine({
  filledUpValues,
  setFilledUpValues,
  activityData,
  triggerRefresh,
}: storyFormProps) {
  const [slug, setSlug] = useState<string>("");
  const [active, setActive] = useState(0);
  const [loadedInit, setLoadedInit] = useState(false);
  const [statusRequest, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');
  const [lastRefresh, setlastRefresh] = useState<Date>();
  // const [filledUpValues, setFilledUpValues] = useState<Story>();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>();

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: session, status } = useSession();
  const storyLastAuthor = session?.user.email;
  const storyBirth = new Date();



  // const activityIds = [...new Set(activityData.map(row => row.ssapId))] as const;
  // type ActivityId = typeof activityIds[number];

  const form = useForm<Partial<Story>>({
    mode: 'uncontrolled',
    initialValues: {
    },
    onValuesChange: (values) => {
      // window.localStorage.setItem('user-form', JSON.stringify(values));
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
      return current < 2 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  
  


  async function onSubmit(values: Partial<Story>) { 
    
    // nextStep() 
    setStatus('uploading');
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(slug)
    console.log(values)

    const customersArray = Object.entries(values).filter(([key]) => key.startsWith('activity_')).map(([key, value]) => {
      return `${key}_customer_${value}`;
    });

    const storyFormatedEntries = activityData.map(row => {
      return {
        'ssapId': row.ssapId,
        'contractNumber': row.contractNumber ?? "Lacking Contract Number",
        // 'customer': customersArray.find(str => str.startsWith(`customer_${row.ssapId}_`))?.split('_')[2] ?? "Lacking Customer Data",
        'customer': String(Object.entries(values).find(([key]) => key === `activity_${row.ssapId}`)?.[1]) ?? "Lacking Customer Data",
        'overallAmount': Number(row.arap_OverallAmount) ?? "Lacking Overall Amount Data",
      }
    })

    function isNumericRow(
      row: { overallAmount: number | string }
    ): row is { overallAmount: number } {
      return typeof row.overallAmount === "number";
    }

    const numericRows = storyFormatedEntries.filter(isNumericRow);
    const sortedRows = [...numericRows].sort((a, b) => b.overallAmount - a.overallAmount);
    console.log(customersArray)
    console.log(sortedRows)
    const top5 = sortedRows.slice(0,6)

    
    const dataFormUpload: dataPayload = {
      payload: {
        formData: {
          title: values.Title ?? '',
          description: values.storyDescription ?? '',
          author: values.storyAuthor ?? '',
          esaInternal: values.esaInternal ?? true,
          customer1: top5[0]?.customer ?? '',
          customer2: top5[1]?.customer ?? '',
          customer3: top5[2]?.customer ?? '',
          customer4: top5[3]?.customer ?? '',
          customer5: top5[4]?.customer ?? '',
          contractNumber1: top5[0]?.contractNumber ?? '',
          contractNumber2: top5[1]?.contractNumber ?? '',
          contractNumber3: top5[2]?.contractNumber ?? '',
          contractNumber4: top5[3]?.contractNumber ?? '',
          contractNumber5: top5[4]?.contractNumber ?? '',
          customers: customersArray.join(","),
          impact1: values.impact1 ?? '',
          impact2: values.impact2 ?? '',
          impact3: values.impact3 ?? '',
          itemId: slug ?? '',
        },
        lastModifiedOn: storyBirth.toLocaleString(),
        lastAuthor: storyLastAuthor,
        formatedEntries: storyFormatedEntries,
      },
      flags: {
        listName: "SSAP_list_of_stories",
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

    if (response.status === "success") {
      if (response.data?.story) {
        setFilledUpValues(response.data.story as Story);
      }
    }
  }

  // async function refreshForm(slug: string) {

  //   console.log("\n\n Refreshing Form values \n\n")

  //   const dataFormRefresh: dataPayload = {
  //     payload: {},
  //     flags: {
  //       slug: slug,
  //       folder: "Shared Documents/SSAP/stories/" + slug,
  //       listName: "SSAP_list_of_stories",
  //     }
  //   }

  //   const response: outputsPostApi = await PostApi({
  //     route: "refresh-app/", //get-activity before
  //     inputData: dataFormRefresh,
  //     setstatus: setStatus, 
  //     toastSuccessMessage: "Successfuly fetched the python API.",
  //     toastErrorMessage: "Error fetching the python API."
  //   })

  //   // console.log(fetchData)

  //   const refreshTime: Date = new Date();
  //   setlastRefresh(refreshTime)

  //   if (response.status === "success") {
  //     console.log("Refresh Form status : ", response.status)
      
  //     const allFiles: string[] = Object.values(response.data?.files); // array of all file names
  //     const allValues: Story = response.data?.story[slug]; // array of all form attributes

  //     setFilledUpValues(allValues);
  //     setUploadedFiles(allFiles)
  //   } else {
  //     console.log("Refresh Form status : ", response.status)
  //   }
  // }

  useEffect(() => {
    const encodedSegment = pathname.split('/').pop(); 
    
    if (encodedSegment !== undefined) {
      const decodedSegment = decodeURIComponent(encodedSegment);
      setSlug(decodedSegment);
    }
  }, [pathname, searchParams]);
  
  // useEffect(() => {
  //   if (slug) {
  //     refreshForm(slug);
  //   }
  // }, [slug]);


  useEffect(() => {
    loadInitialValues(
      filledUpValues
    ).then((values) => {
      console.log("filledUpValues change detected, form values were updated with : \n\n", values)
      form.setValues(values);
      form.resetDirty(values);
    }).then(() => {
      setLoadedInit(true)
    });
  }, [filledUpValues]); //filledUpValues

  useEffect(() => {
    console.log("Values changed :\n")
    console.log(form.values)

  }, [form.values])
  // useEffect(() => {
  //   const storedValue = window.localStorage.getItem('user-form');
  //   console.log("Comparison between stored values and loaded values : \n", storedValue)
  //   console.log(form.getValues())

  //   if (storedValue && loadedInit) {
  //     if (storedValue !== form.getValues()) {
  //       try {
  //         form.setValues(JSON.parse(window.localStorage.getItem('user-form')!));
  //         setLoadedInit(false)
  //       } catch (e) {
  //         console.log('Failed to parse stored value');
  //       }
  //     }
  //   }
  // }, [loadedInit]);

  return (
    <>
      <Stepper active={active}>
        <Stepper.Step label="First step" description="Story Overview">
          <TextInput
            className='mt-3'
            label="Author"
            description="Author email address."
            placeholder="Please enter your email address"
            key={form.key('storyAuthor')}
            {...form.getInputProps('storyAuthor')}
          />
          <TextInput
            className='mt-3'
            label="Title"
            description="Title of the story."
            placeholder="Please enter a title for this story."
            key={form.key('Title')}
            {...form.getInputProps('Title')}
          />
          <Textarea
            className='mt-3'
            label="Description"
            description="Explain the purpose of this story."
            placeholder="Please enter a description for this story."
            autosize={true}
            maxRows={16}
            minRows={4}
            key={form.key('storyDescription')}
            {...form.getInputProps('storyDescription')}
          />
          <Checkbox
            // defaultChecked
            className='mt-4 mb-8'
            label="This story is dedicated to esa internal use only."
            color="rgba(23, 60, 138, 1)"
            key={form.key('esaInternal')}
            {...form.getInputProps('esaInternal', { type: 'checkbox' })}
          />
        </Stepper.Step>

        <Stepper.Step label="Second step" description="Story Description">


          {/* Impacts */}
          
          <div className='mt-6'>
            <Title order={1}>Impacts</Title>

            {
              ['impact1', 'impact2', 'impact3'].map((key, counter) => (
                <Textarea
                  className='mt-3'
                  label={`Impact ${counter + 1}`}
                  description={`Describe impact ${counter + 1} for the story`}
                  placeholder={`Please enter impact ${counter + 1} for the story`}
                  autosize={true}
                  maxRows={16}
                  minRows={4}
                  key={form.key(key)}
                  {...form.getInputProps(key)}
                />
              ))
            }

          </div>


          {/* Contracts */}
          
          {/* <div className='mt-6'>
            <Title order={1}>Contracts</Title>

            {
              ['contractNumber1', 'contractNumber2', 'contractNumber3', 'contractNumber4', 'contractNumber5'].map((key, counter) => (
                <Autocomplete
                  className='mt-3'
                  label={`Contract Number for activity ${counter + 1}`}
                  description={`Related activity ${counter + 1} for the story`}
                  placeholder={`Please enter the contract number for the related activity ${counter + 1}`}
                  data={contractArray}
                  maxDropdownHeight={200}
                  key={form.key(key)}
                  {...form.getInputProps(key)}
                />
              ))
            }

          </div> */}


          {/* Customers */}

          <div className='mt-6 mb-8'>
            <Title order={1}>Customers</Title>
            
            {
              // ['customer1', 'customer2', 'customer3', 'customer4', 'customer5']
              activityData.map((item, counter) => (
                <Textarea
                  className='mt-3'
                  name={`activity_${item.ssapId}`}
                  label={`Customer for <${item.Title}>`}
                  description={`Related customer for: <${item.title0}>`}
                  placeholder={`Please enter the customer for the related activity: <${item.ssapId}>`}
                  key={form.key(`activity_${item.ssapId}`)}
                  {...form.getInputProps(`activity_${item.ssapId}`)}
                />
              ))
            }

          </div>

        </Stepper.Step>

        {/* <Stepper.Completed> */}
          {/* Thank you for completing this story !
          <Code block mt="xl">
            {JSON.stringify(form.getValues(), null, 2)}
          </Code> */}
        {/* </Stepper.Completed> */}
      </Stepper>

      <Group className="flex-end" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active < 1 && <Button onClick={nextStep}>Next step</Button>}
        {active == 1 && <Button onClick={() => onSubmit(form.getValues())}>Update</Button>}
      </Group>
    </>
  );
}

export default StoryFormMantine;