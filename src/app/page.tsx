"use client";

import CardTool from "@/components/web-tools/card-tools";

const SSAP_description = 'Composed of one or several closed activities for which summary informations have been filled up by the team. Stories can be used as part of the annual review and can be used in the annual country report annex as well.'
const ATAP_description = 'Consult data from the Annual Review, generating the same report in draft version without triggering anything from the ARAP.'
const doc_dev_description = 'This documentation is intended for developpers to get their hands on IT tools used by the CIC-IC team, including this website.'


export default function Home() {

  return (
    <div>
      <div className="p-4 prose max-w-none prose-a:text-blue-600">
        <h1>CIC-IC Digital Workflow Sandbox</h1>
          <p>
            Welcome to the <strong>CIC-IC Digital Workflow Sandbox</strong>, a demo space where you can explore how CIC-IC automates its processes. 
            This site showcases the tools and data management used to streamline tenders and activity tracking, giving you a hands-on look at how everything works.
          </p>
      </div>

      <div className="grid grid-cols-3 gap-4 pr-24 pl-22 mt-12 mb-12">
        <CardTool
          cover='automation_cover.jpg'
          title='Success Story Application'
          state='On prod'
          security='CIC-IC'
          description={SSAP_description}
          link='/documentation/training'
        />
        <CardTool
          cover='commercialization_cover.jpg'
          title='Activity Tracking Application'
          state='On prod'
          security='CIC-IC'
          description={ATAP_description}
          link='/documentation/training-tools'
        />
        <CardTool
          cover='article_documentation.webp'
          title='Developpers Docs'
          state='On prod'
          security='Admins'
          description={doc_dev_description}
          button_text="Got to docs"
          link='/documentation/developpers'
        />
      </div>

      <div className="p-4 prose max-w-none prose-a:text-blue-600">
          <h2>Onboarding Tours</h2>
            <p>
              Start with the <strong>Onboarding Tours</strong> to get familiar with the platform. 
              These guides walk you through the key features, showing how documents, data, and workflows come together in a seamless digital process.
            </p>

          <h2>Success Story Application</h2>
            <p>
              Discover the <strong>Success Story</strong> application, where completed activities are turned into shareable stories. 
              Try creating a story by selecting activities, editing details, and even generating a presentation. 
              This feature demonstrates how achievements can be captured and presented in an engaging way.
            </p>

          <h2>Stories</h2>
            <p>
              Explore the <strong>Stories</strong> section to see examples of successful projects. 
              These stories highlight real outcomes and can be used in annual reviews, reports, or event showcases—perfect for demonstrating the impact of CIC-IC’s work.
            </p>

          <h2>Activities</h2>
            <p>
              Check out the <strong>Activities</strong> area to see how raw data becomes story material. 
              View activity details, edit key information like top contracts and impacts, and upload supporting documents. 
              An interactive dashboard lets you browse and manage activities just like the CIC-IC team does in real operations.
            </p>

            <p>
              This sandbox is your chance to experience the CIC-IC digital workflow in action—click around, explore, and see how success stories come to life.
            </p>
      </div>      
    </div>
  );
}
