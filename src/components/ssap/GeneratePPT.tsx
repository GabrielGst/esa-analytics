// @ts-nocheck
"use client";

import pptxgen from "pptxgenjs";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { Story, Activity } from "@/lib/types"

// @ts-ignore
import { formatMoney } from 'accounting-js'; // Add a manual type declaration (recommended)

type props = {
  slug: string,
  storyData: Story | undefined,
  activityData: Activity[]
}

export default function GenPptx({
  slug,
  storyData,
  activityData
}: props) {

  // const [files, setFiles] = useState<FileList | null>(null);
  // const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');

  const prezName = "public/pptGen/Sample Presentation.pptx";

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setStatus('initial');
  //     setFiles(e.target.files);
  //   }
  // };

  // const handleUpload = async (storyData) => {
  //   if (files) {

  //     const formData = new FormData();
  //     [...files].forEach((file, key) => {
  //       formData.append(`file_${key}`, file);
  //     });
  //     formData.append('slug', title)

  //     try {
  //       const result = await fetch('http://localhost:5050/api/multiple-uploads/', {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       const data = await result.json();

  //       console.log(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  function handleClick() {

    const reviewDateLocale = new Date().toLocaleString();

    // Use GitHub PptxGenJS for PPT creation, find more information on https://gitbrent.github.io/PptxGenJS/
    // 1. Create a Presentation with layout
    let pres = new pptxgen();
    
    console.log(`\n\n --------------------==~==~==~==[ STARTING PPT GEN... ]==~==~==~==-------------------- \n\n`);
    console.log(`* pptxgenjs ver: ${pres.version}`);
    console.log(`* save location: ${process.cwd()}`);
    console.log("Story Data :\n", storyData)
    console.log("Activities Data :\n", activityData)
    

    // Default layout from 	PptxGenJS 		
    pres.layout = "LAYOUT_16x9";

    pres.theme = { headFontFace: "Arial" };
    pres.theme = { bodyFontFace: "Arial" };

    // Images used within the PPT Slides
    var image0 =  "../../../../pptGen/layer.png";
    var image1 =  "../../../../pptGen/Countries.png";
    var image2 =  "../../../../pptGen/footerESA.png";
    var image3 =  "../../../../pptGen/ESA.png";
    var image4 =  "../../../../pptGen/footerESAdark.png";
    var image5 =  "../../../../pptGen/ESAdark.png";
    var imageBg = "../../../../pptGen/background.jpg";

    
    // 2: Slide Master Title
    pres.defineSlideMaster({
      title: 'TITLE_SLIDE',
      background: { color: "000000"},
      objects: [
        { image: { x: 0.00, y:  0.00, w: '100%', h:'100%', path: imageBg } },
        { image: { x: 0.00, y:  0.00, w: '100%', h:'100%', path: image0 } },
        { image: { x: 0.19, y:  5.39, w: 7.88, h: 0.120, path: image1, placeholder: "footer" } },
        { image: { x: 8.46, y:  5.40, w: 1.34, h: 0.090, path: image2, placeholder: "footer" } },
        { image: { x: 8.45, y: -0.18, w: 1.71, h: 1.070, path: image3 } },
        { rect: {  x: 0.18, y:  3.37, w: 9.60, h: 0.001, fill: { color: 'FFFFFF' } } },
        { rect: {  x: 0.18, y:  5.27, w: 9.60, h: 0.001, fill: { color: 'FFFFFF' } } },
      ],
      slideNumber: { x: 9.46, y: 5.04, w: 0.42, h: 0.33, color: 'FFFFFF', fontSize: 6, align:'right' },
    });


    // 3: Slide Master Status of Ongoing Activities
    pres.defineSlideMaster({
      title: 'ONGOING',
      background: { color: 'FFFFFF' },
      margin: [0.60, 0.2, 0.13, 0.2],
      objects: [
        { image: { x: 0.19, y:  5.39, w: 7.88, h: 0.12, path: image1, placeholder: "footer" } },
        { image: { x: 8.46, y:  5.40, w: 1.34, h: 0.09, path: image4, placeholder: "footer" } },
        { image: { x: 8.45, y: -0.18, w: 1.71, h: 1.07, path: image5 } },
      ],
      slideNumber: { x: 9.46, y: 5.04, w:0.42, h:0.33, color: '8197A6', fontSize: 6, align:'right' },
    });

    
    // 4: Add Title Slide to the Presentation	
    let slideTitle = pres.addSlide({ masterName: "TITLE_SLIDE" });

    slideTitle.addText(
      storyData?.Title ?? "Test powerpoint generation",
      { x:0.12, y:2.74, w:9.66, h:0.61, align:'left', fontSize:29, color:'FFFFFF', bold: true }
    );

    slideTitle.addText(
      reviewDateLocale,
      { x:0.12, y:4.31, w:8.69, h:0.33, align:'right', fontSize:13, color:'FFFFFF' }
    );

    slideTitle.addText(
      'ESA UNCLASSIFIED - For ESA Official Use Only',
      { x:0.18, y:5.06, w:5.49, h:0.2, align:'left', fontSize:6, color:'8197A6' }
    );

    function addTableSlide( arr: Activity | Story ){

      // 5: Add a Slide to the presentation
      let slideOngoing = pres.addSlide({ masterName: "ONGOING" });

      // slideOngoing.addText(
      //   arr.Title,
      //   { x:0.17, y:0.46, w:'90%', h:0.48, align:'left', fontSize:11, color:'000000', bold: true }
      // );
  
      // let optsAlign = { bold: true, align: "right" };
      // let optsAlign2 = { align: "left" };
      // let optsColspan7 = { colspan: 7 };

      // Create table layout
      let tabOpts1 = {
        x: 0.19,
        y: 0.94,
        w: "90%",
        h: "70%",
        fontSize: 8,
        // colW: [1.5, 3, 0.5, 1, 1, 0.5, 1, 1],
        border: { pt: 0.5, color: "000000" },
        // align: "left" ,
        valign: "middle",
      };
      
      
      // Add three dots if content exceeds 1000 characters by checking the length 
      function truncateText(text: string, maxLength: number) {
        if (text) {
          return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        }
        return '';
      }

      // console.log("consoletext", arr); // this was added on 06/02/2025 to debug the column name of the list that is different than the displayed one in list settings
      
      // Create Table
      if (arr.type === 'activity') { // 
  
        // Add text to Slides
        slideOngoing.addText(
          arr.country + " - " + arr.title0,
          { x:0.17, y:0.11, w:8.26, h:0.48, align:'left', fontSize:20, color:'000000', bold: true }
        );

        let arrTabRows1 = [
          [
            { text: "Technical Officer:", options: { bold: true, align: "right" } },
            { text: arr.technicalOfficer, options: { bold: true, align: "right" } },
            { text: "Co: " + "XXX", options: { bold: true, align: "right" } },
            { text: "End TRL: " + arr.trls, options: { align: "left" } },
            { text: "Prog. Ref: " + arr.Title, options: { align: "left" } },
            { text: arr.ssapId, options: { align: "left" } }, // to update with Prog Ref
          ],
          [
            { text: "Supplier Name:", options: { colspan: 1, bold: true, align: "right" } },
            { text: arr.supplierName, options: { colspan: 3, bold: true, align: "right" } },
            { text: "Supplier Code\n" + arr.supplierCode, options: { bold: true, align: "right" } },
            { text: "Fundcode: " + arr.fundCode + "\nContract Number: " + arr.contractNumber, options: { bold: true, align: "right", colspan: 1 } },
          ],
          [
            { text: "Start of Activity:\n" + arr.arap_StartofActivity, options: { colspan: 1, bold: true, align: "right" } },
            { text: "Expected End of Activity:\n" + arr.arap_EED , options: { colspan: 1, bold: true, align: "right" } },
            { text: "Planned start TRL: " + arr.arap_PlannedStartTRL , options: { colspan: 1, align: "left" } },
            { text: "Planned end TRL: " + arr.arap_PlannedEndTRL , options: { colspan: 1, align: "left" } },
            { text: "Overall Amount: " + formatMoney(parseFloat(arr.arap_OverallAmount), { symbol: "€", precision: 2, thousand: ".", decimal: "," }) , options: { colspan: 2, align: "left" } },
          ],
          [
            { text: "Description:", options: { bold: true, align: "right" } },
            { text: arr.arap_Description , options: { colspan: 5, align: "left" } }, //"€ " + parseFloat(arr.field_9).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ],
          [
            { text: "Impact 1:", options: { bold: true, align: "right" } },
            { text:  arr.impact1, options: { colspan: 5, align: "left" } }, // truncateText(arr.description, 1000)
          ],
          [
            { text: "Impact 2:", options: { bold: true, align: "right" } },
            { text:  arr.impact2, options: { colspan: 5, align: "left" } }, // truncateText(arr.description, 1000)
          ],
          [
            { text: "Impact 3:", options: { bold: true, align: "right" } },
            { text:  arr.impact3, options: { colspan: 5, align: "left" } }, // truncateText(arr.description, 1000)
          ],
          // [
          //   { text: "Description:", options: { bold: true, align: "right" } },
          //   { text: arr.arap_Description , options: { colspan: 7, align: "left" } },
          // ],
          [
            { text: "Performance of Company:", options: { bold: true, align: "right" } },
            { text: arr.arap_PerformanceofCompagny, options: { colspan: 7, align: "left" } },
          ],
                    [
            { text: "Prospect for use:", options: { bold: true, align: "right" } },
            { text: arr.arap_ProspectforUse, options: { colspan: 7, align: "left" } },
          ],
          [
            { text: "Note:", options: { bold: true, align: "right" } },
            { text: arr.arap_Note, options: { colspan: 7, align: "left" } },
          ]
        ];
  
        // NOTE: Follow HTML conventions for colspan/rowspan cells - cells spanned are left out of arrays - see above				
        slideOngoing.addTable(arrTabRows1, tabOpts1);

      } else if ( arr.type === "story" ){ // arr.ssapId.split("_")[0] == 'story'
          
        // Add text to Slides
        slideOngoing.addText(
          arr.Title,
          { x:0.17, y:0.11, w:8.26, h:0.48, align:'left', fontSize:20, color:'000000', bold: true }
        );

        let arrTabRows1 = [
          [
            // { text: "Technical Officer:" , options: { bold: true, align: "right" } },
            // { text: arr.submittedBy , options: { bold: true, align: "right" } },
            // { text: "Co: " + "XXX", options: { bold: true, align: "right" } },
            // { text: "End TRL: " + arr.trls, options: { align: "left" } },
            // { text: "Prog. Ref: " + arr.Title, options: { align: "left" } },
            { text: arr.ssapId, options: { colspan: 8, align: "left" } }, // to update with Prog Ref
          ],
          [
            // { text: "Supplier Name:", options: { colspan: 1, bold: true, align: "right" } },
            // { text: arr.supplierName, options: { colspan: 3, bold: true, align: "right" } },
            { text: "Supplier Code:\n" + arr.supplierCode, options: { colspan: 4, bold: true, align: "right" } },
            { text: "Fundcode: " + arr.fundCode , options: { colspan: 4, bold: true, align: "right" } },
          ],
          [
            { text: "Description:", options: { bold: true, align: "right" } },
            { text: arr.storyDescription , options: { colspan: 7, align: "left" } }, //"€ " + parseFloat(arr.field_9).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ],
          [
            { text: "Impact 1:", options: { bold: true, align: "right" } },
            { text:  arr.impact1, options: { colspan: 7, align: "left" } }, // truncateText(arr.description, 1000)
          ],
          [
            { text: "Impact 2:", options: { bold: true, align: "right" } },
            { text:  arr.impact2, options: { colspan: 7, align: "left" } }, // truncateText(arr.description, 1000)
          ],
          [
            { text: "Impact 3:", options: { bold: true, align: "right" } },
            { text:  arr.impact3, options: { colspan: 7, align: "left" } }, // truncateText(arr.description, 1000)
          ],
          [
            { text: "Top 5 customers:", options: { colspan: 3, bold: true, align: "right" } },
            { text:  arr.customer1, options: { colspan: 1, align: "left" } }, // truncateText(arr.description, 1000)
            { text:  arr.customer2, options: { colspan: 1, align: "left" } },
            { text:  arr.customer3, options: { colspan: 1, align: "left" } },
            { text:  arr.customer4, options: { colspan: 1, align: "left" } },
            { text:  arr.customer5, options: { colspan: 1, align: "left" } },
          ],
          [
            { text: "Top 5 contracts:", options: { colspan: 3, bold: true, align: "right" } },
            { text:  arr.contractNumber1, options: { colspan: 1, align: "left" } }, // truncateText(arr.description, 1000)
            { text:  arr.contractNumber2, options: { colspan: 1, align: "left" } },
            { text:  arr.contractNumber3, options: { colspan: 1, align: "left" } },
            { text:  arr.contractNumber4, options: { colspan: 1, align: "left" } },
            { text:  arr.contractNumber5, options: { colspan: 1, align: "left" } },
          ],
          // [
          //   { text: "Start of Activity:", options: { bold: true, align: "right" } },
          //   { text: "" , options: { colspan: 7, align: "left" } },
          // ],
          // [
          //   { text: "(Expected) End of Activity:", options: { bold: true, align: "right" } },
          //   { text: arr?.yearAchievement , options: { colspan: 7, align: "left" } },
          // ],
          // [
          //   { text: "Performance of Company:", options: { bold: true, align: "right" } },
          //   { text: "", options: { colspan: 7, align: "left" } },
          // ],
          [
            { text: "Note:", options: { bold: true, align: "right" } },
            { text: "", options: { colspan: 7, align: "left" } },
          ]
        ];

        // NOTE: Follow HTML conventions for colspan/rowspan cells - cells spanned are left out of arrays - see above				
        slideOngoing.addTable(arrTabRows1, tabOpts1);
      }
    };

    // 5: Add story slide to prez
    if(storyData) {
      addTableSlide(storyData)
    }
    
    // 6: Add activity slides to prez
    activityData.map((item) => {
      addTableSlide(item)
    })
    
    // 7. Save the Presentation
    pres.writeFile({ fileName: prezName });

    console.log(`\n\n --------------------==~==~==~==[ ...PPT GEN COMPLETE ]==~==~==~==-------------------- \n\n`);
  }

  useEffect(() => {
    console.log("\n\n --------------------==~==~==~==[ PPT GEN RECEIVED DATA... ]==~==~==~==-------------------- \n\n")
    console.log("Story Data :\n", storyData)
    console.log("Activities Data :\n", activityData)
    console.log("\n\n --------------------==~==~==~==[ END OF DATA ]==~==~==~==-------------------- \n\n")
  }, [])


  return (
    <>
    

      {/* <a 
        href={'https://esait.sharepoint.com/sites/IndustryAnalyticsUserArea/Shared Documents/SSAP/stories/' + title +'/' + prezName}
        target="_blank"
      >
        {title}
      </a> */}

      {/* <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {
          uploadedFiles &&
          uploadedFiles.map((value, counter) => (
            <li key={counter+1} className="text-sm text-muted-foreground">
              <a 
                href={'https://esait.sharepoint.com/sites/IndustryAnalyticsUserArea/Shared Documents/SSAP/stories/' + propId +'/' + value}
                target="_blank"
              >
                File {counter+1} : {value}
              </a>
            </li>
          ))
        }
      </ul> */}
      <Button onClick={() => handleClick()}>Generate PPT</Button>
    </>
  )
}
