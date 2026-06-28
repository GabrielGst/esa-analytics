import React, { useState } from 'react';

// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"

import { Button, Input } from "@mantine/core"
import { notifications } from '@mantine/notifications';

function MultipleFileUploader({ slug, onUploadSuccess }: { slug: string; onUploadSuccess?: () => void }) {
  // console.log("This is the slug from GetData side" + slug)

  const [files, setFiles] = useState<FileList | null>(null);
  // const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // setStatus('initial');
      setFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    notifications.show({
      id: 'fetch-server',
      title: "Requesting server...",
      message: "Uploading files to database...",
      color: "yellow",
      autoClose: false,
      loading: true,
    })
    if (files) {
      // setStatus('uploading');

      const formData = new FormData();
      [...files].forEach((file, key) => {
        formData.append(`file_${key}`, file);
      });
      formData.append('slug', slug)

      try {
        const result = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await result.json();

        console.log(data);
        notifications.update({
          id: 'fetch-server',
          color: 'green',
          title: "Server request success",
          message: "Files uploaded successfully !",
          autoClose: 2000,
        })
        onUploadSuccess?.();
        // setStatus('success');
      } catch (error) {
        console.error(error);
        notifications.update({
          id: 'fetch-server',
          color: 'red',
          title: "Server request error",
          message: "Error uploading files to database",
          autoClose: 2000,
        })
        // setStatus('fail');
      }
    }
  };

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-10">
        <label htmlFor="id" className='prose max-w-none'>Attachements</label>
        <Input id="file" type="file" multiple onChange={handleFileChange} className="mt-4"/>
      </div>

      {files && [...files].map((file, index) => (
        <section key={file.name} className="prose max-w-none">
          <br></br>
          <h4>
            File number {index + 1} details: 
          </h4>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Name: {file.name}</li>
            {/* <li>Type: {file.type}</li> */}
            <li>Size: {(file.size * 1e-3).toFixed(2)} kB</li>
          </ul>
        </section>
      ))}

      {files && (
        <div className='mt-6 mb-6 flex justify-center'>
          <Button
            onClick={handleUpload}
            className="submit"
          >
            Upload {files.length > 1 ? 'files' : 'a file'}
          </Button>

        </div>
      )}

      <br></br>
      {/* <div className='mb-18'>
        <Result status={status} />
      </div> */}
      
    </>
  );
};

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


export default MultipleFileUploader;