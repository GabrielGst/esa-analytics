'use client';

import React, { useState } from 'react';
import { useMemo } from 'react';

import { useRouter } from 'next/navigation'

import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef, //if using TypeScript (optional, but recommended)
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
  MRT_RowSelectionState,
  MRT_DefinedColumnDef,
  MRT_ToolbarInternalButtons
} from 'mantine-react-table';
import { Box, Button, Flex, Menu, Spoiler, Text, Title } from '@mantine/core';
import { IconUserCircle, IconSend } from '@tabler/icons-react';

import { dataPayload, outputsPostApi, Story } from "@/lib/types"
import { PostApi } from '@/components/PostApi';
import { Table } from '@tanstack/react-table';
import CustomSpoiler from '@/components/web-tools/customSpoiler';


type rowSelection = {
  [x: string]: boolean; 
}

interface StoryTableProps {
  data: Story[],
  rowSelection: rowSelection;
  setRowSelectionAction: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
}


export function StoryTable({
  data,
  rowSelection,
  setRowSelectionAction
}: StoryTableProps) {

  const router = useRouter()
  const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');

  const columns = useMemo<MRT_ColumnDef<Story>[]>(
    () => [
      {
        accessorKey: "ssapId",
        header: "Story Id",
        Cell: ({ cell }: {cell: any}) => {
          return <div>
              <Text size="sm" color="dimmed">
                {cell.getValue() !== "null" ? cell.getValue() : ""}
              </Text>
            </div>;
        },
      },
      {
        accessorKey: "Title",
        header: "Title",
        Cell: ({ cell }: {cell: any}) => {
          return <div className='w-100'>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "storyDescription",
        header: "Description",
        Cell: ({ cell }: {cell: any}) => {
          return <div className='w-200'>
                  <CustomSpoiler>
                    <Text>
                      {cell.getValue() !== "null" ? cell.getValue() : ""}
                    </Text>
                  </CustomSpoiler>
                  {/* <Spoiler
                    maxHeight={200}
                    showLabel="Show more"
                    hideLabel="Hide"
                  >
                  </Spoiler> */}
                </div>;
        },
      },
      {
        accessorKey: "numberOfActivities",
        header: "Number of Activities",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "esaInternal",
        header: "Esa Internal",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "Created On",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "storyAuthor",
        header: "Created By",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "lastModifiedOn",
        header: "Last Modified On",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "lastAuthor",
        header: "Last Modified By",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },

      // Unused
      {
        accessorKey: "yearAchievement",
        header: "Year Achievement",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "submissionDate",
        header: "Submitted on",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "submittedBy",
        header: "Submitted By",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
    ],
    []
    // [averageSalary, maxAge],
  );

  //pass table options to useMantineReactTable
  const table = useMantineReactTable({
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        console.info(event, row.original.ssapId);
        router.push("/tools/success-story/stories/edit-story/" + row.original.ssapId + "/")
      },
      sx: {
        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
      },
    }),
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    defaultColumn: {
      minSize: 50, //allow columns to get smaller than default
      maxSize: 9001, //allow columns to get larger than default
      size: 200, //make columns wider by default
    },
    // displayColumnDefOptions: { 'mrt-row-select': { size: 50 }, 'country': { size: 50 } }, 
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnDragging: false,
    enableColumnFilters: true,
    enableClickToCopy: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,
    enableRowActions: false,
    enableRowSelection: true,
    enableSelectAll: false,
    getRowId: (originalRow) => originalRow.ssapId,
    onRowSelectionChange: setRowSelectionAction,
    state: { rowSelection },
    // enableRowSelection: (row) => row.original.age > 18, //disable row selection for rows with age <= 18
    // enableColumnResizing: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: {
      density: 'md',
      expanded: true,
      // showColumnFilters: true,
      // showGlobalFilter: true,
      columnPinning: { left: ['mrt-row-select', 'Title' ] }, // 'storyAuthor', 'status', 
      // grouping: ['state'],
      // pagination: { pageIndex: 0, pageSize: 20 },
      // sorting: [{ id: 'state', desc: false }],
      pagination: { pageIndex: 0, pageSize: 200 },
      sorting: [{ id: 'lastModifiedOn', desc: false }],
      columnVisibility: {
        ssapId: false,
        Title: true,
        storyDescription: true,
        numberOfActivities: true, // Count of activities
        esaInternal: true,
        status: true, // Created On
        storyAuthor: true, // Created By
        lastModifiedOn : true, // Last modified on
        lastAuthor: true, // Last Modified by

        // Unused
        trls: false,
        yearAchievement: false,
        submissionDate: false,
        submittedBy: false,
      },
    },
    layoutMode: 'semantic',
    // paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      rowsPerPageOptions: ['10', '50', '100', '200', '500', '1000', '10000'],
      // radius: 'xl',
      // size: 'lg',
    },
    mantineSearchTextInputProps: {
      placeholder: 'Search',
    },
    mantineToolbarAlertBannerBadgeProps: { color: 'blue', variant: 'outline' },
    mantineTableContainerProps: { sx: { maxHeight: 700 } },
    
    // renderDetailPanel: ({ row }) => (
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       justifyContent: 'flex-start',
    //       alignItems: 'center',
    //       gap: '16px',
    //       padding: '16px',
    //     }}
    //   >
    //     <img
    //       alt="avatar"
    //       height={200}
    //       // src={row.original.avatar}
    //       style={{ borderRadius: '50%' }}
    //     />
    //     <Box sx={{ textAlign: 'center' }}>
    //       <Title>Signature Catch Phrase:</Title>
    //       {/* <Text>&quot;{row.original.signatureCatchPhrase}&quot;</Text> */}
    //     </Box>
    //   </Box>
    // ),
    // renderRowActionMenuItems: ({ row }) => (
    //   <>
    //     <Menu.Item icon={<IconSend />}>
    //       <a href={("/tools/success-story/stories/edit-story/" + row.original.id + "/")}>
    //         Edit
    //       </a>
    //     </Menu.Item>
    //   </>
    // ),
    
    renderTopToolbar: ({ table }) => {
      async function handleDelete() {
        const deletedStories: string[] = [];

        table.getSelectedRowModel().flatRows.map((row) => {
          deletedStories.push(row.getValue("ssapId"))
        });

        const dataTableUpdate: dataPayload = {
          payload: {
            deletedStories: deletedStories,
          },
          flags: {
            listName: "SSAP_list_of_stories",
          }
        }
        
        const response: outputsPostApi = await PostApi({
          route: "update-table/",
          inputData: dataTableUpdate,
          setstatus: setStatus,
          toastSuccessMessage: "Successfuly fetched the python API.",
          toastSuccessDescription: "Deleted stories\n" + deletedStories,
          toastErrorMessage: "Error fetching the python API.",
          toastErrorDescription:"When deleting stories\n" + deletedStories,
        })

        
        if (response) {
          console.log("Dissociated activities : ", deletedStories)
        } 
      };


      return (
        <Flex p="md" justify="space-between">
          <Flex gap="xs">
            {/* import MRT sub-components */}
            {/* <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} /> */}
            <MRT_ToolbarInternalButtons table={table} />
          </Flex>
          <Flex sx={{ gap: '8px' }}>
            <Button
              color="red"
              disabled={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
              onClick={handleDelete}
              variant="filled"
            >
              Delete Story
            </Button>
          </Flex>
        </Flex>
      );
    },
  });

  //note: you can also pass table options as props directly to <MantineReactTable /> instead of using useMantineReactTable
  //but that is not recommended and will likely be deprecated in the future
  return <MantineReactTable table={table} />;
}
