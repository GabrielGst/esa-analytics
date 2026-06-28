// SPO items

export type Activity = {
  type: 'activity',
  ssapId: string,
  Title: string,
  country: string,
  fundCode: string, // code
  title0: string,
  status: Date, // Last Modified Date dans SSAP
  contractNumber: string,
  supplierCode: string,
  supplierName: string,
  trls: string,
  other: string,
  yearAchievement: number,
  submissionDate: Date,
  submittedBy: string,
  lastAuthor: string,
  // From the Countries Program Codes excel file located in NMS SPO under Project Control flder
  scheme: string,
  // From the ARAP
  arap_PlannedStartTRL: string,
  arap_PlannedEndTRL: string,
  arap_Description: string,
  arap_StartofActivity: string,
  arap_EED: string,
  arap_ProspectforUse: string,
  arap_PerformanceofCompagny: string,
  arap_Note: string,
  arap_OverallAmount: string,
  arap_lastModifiedOn: string,
  // Editable fields
  description: string,
  author0: string,
  impact1: string,
  impact2: string,
  impact3: string,
  esaInternal: boolean,
  // Added PPTGEN
  technicalOfficer: string,

}

export type Story = {
  type: 'story',
  ssapId: string,
  country: string,
  fundCode: string,
  status: Date, // Last Generation PPT
  pptReport: string, // Link to last gen presentation
  numberOfActivities: number,
  supplierCode: string,
  image: string,
  compLogo: string,
  trls: string,
  other: string,
  yearAchievement: number,
  submissionDate: Date,
  submittedBy: string,
  lastAuthor: string,
  // editable fields
  Title: string,
  storyDescription: string,
  storyAuthor: string,
  esaInternal: boolean,
  storyStatus: string,
  impact1: string,
  impact2: string,
  impact3: string,
  contractNumber1: string,
  contractNumber2: string,
  contractNumber3: string,
  contractNumber4: string,
  contractNumber5: string,
  customers: string,
  customer1: string,
  customer2: string,
  customer3: string,
  customer4: string,
  customer5: string,
  // [key: `customer_${string}`]: string;
}
// Story Form

// type CustomerInputKey<Id extends string> = `customer_${Id}`;

// type CustomerFormFields<Ids extends string> = {
//   [K in CustomerInputKey<Ids>]: string;
// }

// export type StoryForm<Ids extends string> = CustomerFormFields<Ids> & Partial<Story>

export type storyFormProps = {
  filledUpValues: Story | undefined,
  setFilledUpValues:(payload: SetStateAction<Story | undefined>) => void,
  activityData: Activity[],
  triggerRefresh?: () => void,
}

// PostApi

import { SetStateAction } from "react";

export type outputsPostApi = {
  status: 'success' | 'error';
  message?: string;
  data?: {
    files: { [key: string]: string },
    activity: { [key: string]: string },
    story: { [key: string]: string },
    activities: { [key: string]: string },
    stories: { [key: string]: string },
    relatedActivities?: { [key: string]: string },
  } | Record<string, any>;
  target?: 'activity_page' | 'story_page' | 'edit_activity' | 'edit_story' | 'activity_form' | 'story_form';
};

export type inputsPostApi = {
  route: string,
  inputData: dataPayload,
  setstatus: (payload: SetStateAction<"initial" | "uploading" | "success" | "fail">) => void,
  toastSuccessMessage: string,
  toastErrorMessage: string,
  toastSuccessDescription?: string,
  toastErrorDescription?: string,
  title?: string,
  message?: string
}

type storyProcessObject = {
  ssapId:  string,
  contractNumber: string | string,
  customer:  string | string,
  overallAmount: number | string,
}

export type dataPayload = {
  payload?: {
    formData?: { [key: string]: string | boolean },
    childActivities?: string,
    slug?: string,
    dissociatedActivities?: string[],
    deletedStories?: string[],
    associatedActivities?: string,
    storyAuthor?: string,
    storyBirth?: string,
    lastModifiedOn?: string,
    lastAuthor?: string,
    formatedEntries?: storyProcessObject[],
  },
  flags?: {
    slug?: string,
    folder?: string,
    listName?: string,
    exportStatus?: boolean,
    storyName?: string,
    storyId?: string,
  },
  route?: string
} | FormData


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


// Deprecated

// export type ActivitySPO = {
//   ssapId: string,
//   contractNumber: string,
//   country: string,
//   fundCode: string,
//   title0: string,
//   status: string,
//   supplierCode: string,
//   supplierName: string,
//   trls: string,
//   technicalOfficer: string,
//   lastAuthor: string,
//   // editable fields
//   description: string,
//   author0: string,
//   impact1: string,
//   impact2: string,
//   impact3: string,
//   esaInternal: boolean 
// }


// export type StorySPO = {
//   ssapId: string,
//   country: string,
//   fundCode: string,
//   status: Date, // Last Generation PPT
//   pptReport: string, // Link to last gen presentation
//   numberOfActivities: number,
//   supplierCode: string,
//   image: string,
//   compLogo: string,
//   trls: string,
//   other: string,
//   yearAchievement: number,
//   submissionDate: Date,
//   submittedBy: string,
//   lastAuthor: string,
//   // editable fields
//   Title: string,
//   storyDescription: string,
//   storyAuthor: string,
//   esaInternal: boolean,
//   impact1: string,
//   impact2: string,
//   impact3: string,
//   contractNumber1: string,
//   contractNumber2: string,
//   contractNumber3: string,
//   contractNumber4: string,
//   contractNumber5: string,
//   customer1: string,
//   customer2: string,
//   customer3: string,
//   customer4: string,
//   customer5: string,
// }

// export type displayActivity = {
//   ssapId: string, //Prog_Ref
//   country: string,
//   fundCode: string, // code
//   title: string,
//   status: Date, // Last Modified Date dans SSAP
//   contractNumber: string,
//   description: string,
//   supplierCode: string,
//   supplierName: string,
//   trls: string,
//   yearAchievement: number, // default : date of last payment ? our user entry ?
//   submissionDate: Date,
//   submittedBy: string,
//   esaInternal: string,
//   author: string,
//   lastAuthor: string,
// }

// export type displayRelatedActivities = {
//   ssapId: string, //Prog_Ref
//   country: string,
//   fundCode: string, // code
//   title: string,
//   status: Date, // Last Modified Date dans SSAP
//   description: string,
//   supplierCode: string,
//   supplierName: string,
//   yearAchievement: number,
//   submissionDate: Date,
//   submittedBy: string,
//   esaInternal: string,
//   author: string,
//   lastAuthor: string,
// }

// export type displayStory = {
//   ssapId: string,
//   country: string,
//   // listing des country
//   fundCode: string,
//   // listing des fundCode
//   title: string,
//   status: Date,
//   // Last Generation PPT
//   pptReport: string,
//   // Link to last gen presentation
//   description: string,
//   supplierName: string,
//   // listing des supplierCode
//   numberOfActivities: number,
//   yearAchievement: number,
//   submissionDate: Date,
//   esaInternal: string,
//   author: string,
//   lastAuthor: string,
// }