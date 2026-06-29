'use client';


import React, { SetStateAction, useState } from 'react';
import { useMemo } from 'react';

import { useRouter } from 'next/navigation'

import { Activity, dataPayload, inputsPostApi, outputsPostApi } from "@/lib/types"

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
import { Box, Button, Flex, Menu, Text, Title } from '@mantine/core';
import { IconUserCircle, IconSend } from '@tabler/icons-react';

// @ts-ignore
import { formatMoney } from 'accounting-js'; // Add a manual type declaration (recommended)

import { PostApi } from '@/components/PostApi';


type rowSelection = {
  [x: string]: boolean; 
}

interface StoryTableProps {
  data: Activity[],
  relatedStory: string,
  rowSelection: rowSelection;
  setRowSelectionAction: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
  openModalAction: () => void,
  openDrawerAction: () => void,
  setActivityAction: (payload: SetStateAction<{ssapId: string, title: string}>) => void,
  onDissociated?: (ids: string[]) => void,
}


export function StoryActivityTable({
  data,
  relatedStory,
  rowSelection,
  setRowSelectionAction,
  openModalAction,
  openDrawerAction,
  setActivityAction,
  onDissociated,
}: StoryTableProps) {

  const router = useRouter()
  const [status, setStatus] = useState<'initial' | 'uploading' | 'success' | 'fail'>('initial');

  const columns = useMemo<MRT_ColumnDef<Activity>[]>(
    () => [
      {
        accessorKey: "scheme",
        header: "Scheme",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
        size: 50,
      },
      {
        accessorKey: "Title",
        header: "Prog Ref",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "country",
        header: "Country",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
        size: 50,
      },
      {
        accessorKey: "fundCode",
        header: "Fund Code",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
        size: 100,
      },
      {
        accessorKey: "supplierName",
        header: "Supplier Name",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "title0",
        header: "Title",
        Cell: ({ cell }: {cell: any}) => {
          return <div className='w-200'>
                  {cell.getValue() !== "null" ? cell.getValue() : ""}
                  </div>;
        },
      },
      {
        accessorKey: "status",
        header: "Last Modified Date",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "contractNumber",
        header: "Contract Number",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
        size: 100,
      },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "supplierCode",
        header: "Supplier Code",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
        size: 100,
      },
      {
        accessorKey: "arap_OverallAmount",
        header: "Overall Amount",
        filterVariant: 'range-slider',
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? formatMoney(parseFloat(cell.getValue()), { symbol: "€", precision: 2, thousand: ".", decimal: "," }) : ""}</div>;
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
        accessorKey: "ssapId",
        header: "Activity Id",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },

      // Unused
      {
        accessorKey: "trls",
        header: "TRLs",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "yearAchievement",
        header: "Year Achievement",
        Cell: ({ cell }: {cell: any}) => {
          return <div>{cell.getValue() !== "null" ? cell.getValue() : ""}</div>;
        },
      },
      {
        accessorKey: "submissionDate",
        header: "Submission Date",
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
      {
        accessorKey: "author0",
        header: "Author",
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
    ],
    []
    // [averageSalary, maxAge],
  );

  //pass table options to useMantineReactTable
  const table = useMantineReactTable({
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        console.info(event, row.original.ssapId);
        openDrawerAction();
        setActivityAction({ssapId: row.original.ssapId, title: row.original.Title});
        // router.push("/tools/success-story/activities/edit-activity/" + row.original.ssapId + "/")
      },
      sx: {
        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
      },
    }),
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    defaultColumn: {
      minSize: 100, //allow columns to get smaller than default
      maxSize: 9001, //allow columns to get larger than default
      size: 100, //make columns wider by default
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
      columnPinning: { left: ['mrt-row-select', 'scheme', 'Title', 'fundCode', 'contractNumber', 'supplierCode'] },
      // columnPinning: { left: ['country', 'supplierName', 'rowSelection', 'mrt-row-select', 'mrt-row-actions'] } 
      // grouping: ['state'],
      pagination: { pageIndex: 0, pageSize: 200 },
      sorting: [{ id: 'scheme', desc: false }],
      columnVisibility: {
        ssapId: true,
        Title: true,
        status: false,
        description: false,
        trls: false,
        yearAchievement: false,
        submissionDate: false,
        submittedBy: false,
        author0: false,
        lastAuthor: false,
        country: false,
      }
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
      placeholder: 'Search Employees',
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
    //       <a href={("/tools/success-story/activity/edit-activity/" + row.original.activityId + "/")}>
    //         Edit
    //       </a>
    //     </Menu.Item>

    //   </>
    // ),
    renderTopToolbar: ({ table }) => {
      async function handleDissociate() {
        const dissociatedActivities: string[] = [];

        table.getSelectedRowModel().flatRows.map((row) => {
          dissociatedActivities.push(row.getValue("ssapId"))
        });

        const dataTableUpdate: dataPayload = {
          payload: {
            dissociatedActivities: dissociatedActivities,
            slug: relatedStory,
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
          toastSuccessDescription: "Dissociated activities\n" + dissociatedActivities,
          toastErrorMessage: "Error fetching the python API.",
          toastErrorDescription:"When dissociating activities\n" + dissociatedActivities,
        })

        
        if (response.status === "success") {
          onDissociated?.(dissociatedActivities);
        }
      };


      return (
        <Flex p="xs" justify="space-between">
          <Flex justify="space-between">
            <Flex gap="xs" p="xs">
              {/* import MRT sub-components */}
              {/* <MRT_GlobalFilterTextInput table={table} />
              <MRT_ToggleFiltersButton table={table} /> */}
              <MRT_ToolbarInternalButtons table={table} />
            </Flex>
          </Flex>

          <Flex justify="space-between">
            <Flex sx={{ gap: '8px' }} p="xs">
              <Button
                color="red"
                disabled={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
                onClick={handleDissociate}
                variant="filled"
              >
                Dissociate activity
              </Button>
            </Flex>
            
            <Flex sx={{ gap: '8px' }} p="xs">
              <Button variant="default" onClick={openModalAction}>
                Associate activity
              </Button>
            </Flex>
          </Flex>
        </Flex>
      );
    },
  });

  //note: you can also pass table options as props directly to <MantineReactTable /> instead of using useMantineReactTable
  //but that is not recommended and will likely be deprecated in the future
  return <MantineReactTable table={table} />;
}
