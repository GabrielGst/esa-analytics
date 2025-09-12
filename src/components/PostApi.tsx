

import { SetStateAction } from "react";
// import { toast } from "sonner"

import { inputsPostApi, outputsPostApi } from "@/lib/types"
import { notifications } from '@mantine/notifications';

export async function PostApi({
    route,
    inputData,
    setstatus,
    toastSuccessMessage,
    toastErrorMessage,
    title,
    message
  }: inputsPostApi ) {

  const today = new Date();
  // const url = 'http://localhost:5050/flask/' + route;
  // const url = 'https://industry-analytics-dev.go.esa.int/api/proxy-flask' ; //+ route;
  const url = '/api/proxy-flask/';
  // const url = 'http://127.0.0.1:4000/api/' + route;

  var result: outputsPostApi = {
    status: "error" // initialize response with error
  };

  const fetchDate = new Date();

  console.log(`\n\n --------------------==~==~==~==[ [${fetchDate}] Using PostApi to fetch backend... ]==~==~==~==-------------------- \n\n`)
  
  const payload = { inputData, route: route}

  notifications.show({
    id: 'fetch-server',
    title: title ?? "Requesting server...",
    message: message ?? "Populating tables and fields...",
    color: "yellow",
    autoClose: false,
    loading: true,
  })

  console.log('Requested : ' + url + ' with method POST')
  console.log('Payload :\n', inputData)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    const { message, fetchData } = await response.json();

    result.message = message;
    result.data = fetchData;
    result.status = 'success';
    
    setstatus('success');

    
    notifications.update({
      id: 'fetch-server',
      color: 'green',
      title: "Server request success",
      message: toastSuccessMessage,
      autoClose: 2000,
    })

    // toast(
    //   toastSuccessMessage,
    //   { description: toastSuccessDescription ?? today.toLocaleDateString() + '\n' }
    // )
  } catch (error) {
    
    notifications.update({
      id: 'fetch-server',
      color: 'red',
      title: "Server request error",
      message: toastErrorMessage,
      autoClose: 2000,
    })

    // toast(
    //   toastErrorMessage,
    //   { description: toastErrorDescription ?? today.toLocaleDateString() + '\n' }
    // )
    console.error(error);
    setstatus('fail');
  }
  
  console.log("Fetched result :\n", result)
  
  console.log("\n\n --------------------==~==~==~==[ Completed fetching with PostApi ]==~==~==~==-------------------- \n\n")
  
  return result
}