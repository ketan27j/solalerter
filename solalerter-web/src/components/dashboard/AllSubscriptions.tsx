import { useState, useEffect } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  flexRender,
  createColumnHelper 
} from '@tanstack/react-table';
import {Subscription,SubscriptionStatus} from '../../model/subscription'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAtom } from 'jotai';
import { subscriptionsAtom } from '../../atom/subscriptionsAtom';
import { CircleStop, Play, Trash2 } from 'lucide-react';
import { apiGet, apiPost } from '../../utils/api';

const AllSubscriptions = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useAtom(subscriptionsAtom); 
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet(`api/subscription/all-subscriptions`);
        setData(response.subscriptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [count]);

  // Column definition
  const columnHelper = createColumnHelper<Subscription>();
  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => info.getValue(),
      meta: { 
        mobileHidden: true 
      }
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
      meta: {
        mobileHeader: true
      }
    }),
    columnHelper.accessor('transactionType', {
      header: 'Transaction Type',
      cell: info => info.getValue(),
      meta: {
        mobileHeader: true
      }
    }),
    columnHelper.accessor('addressType', {
        header: 'Address Type',
        cell: info => info.getValue(),
        meta: { 
          mobileHidden: true 
        }
      }),
    columnHelper.accessor('address', {
      header: 'Address',
      cell: info => {
        const address = info.getValue();
        return address ? `${address.substring(0, 20)}...` : '';
      },
      meta: { 
        mobileHidden: true 
      }
    }),
    columnHelper.accessor('twitterAlert', {
      header: 'Twitter Alert',
      cell: info => info.getValue(),
      meta: { 
        mobileHidden: true 
      }
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(info.getValue())}`}>
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const subscriptionRow = row.original as Subscription;
        return (
            <div className="flex space-x-2">
            <button 
              onClick={() => {
                if (subscriptionRow.status === SubscriptionStatus.RUNNING) {
                  stopSubscription(subscriptionRow);
                } else {
                  startSubscription(subscriptionRow);
                }
              }}
              className={`${
              subscriptionRow.status === SubscriptionStatus.RUNNING 
                ? 'bg-red-400 hover:bg-red-500' 
                : 'bg-green-400 hover:bg-green-500'
              } text-white rounded p-2`}>
              {subscriptionRow.status === SubscriptionStatus.RUNNING ? (
              <CircleStop className="h-5 w-5" />
              ) : (
              <Play className="h-5 w-5" />
              )}
            </button>
            <button 
              onClick={() => deleteRow(subscriptionRow)}
              className="bg-red-400 text-white rounded hover:bg-red-500 p-2">
              <Trash2 className="h-5 w-5" />
            </button>
            </div>
        );
      }
    })
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'RUNNING': return 'bg-green-100 text-green-800';
      case 'STOPPED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteRow = async (rowData: Subscription) => {
      console.log('Row action for:', rowData);
      try {
          const response = await apiPost(`api/subscription/delete-subscription`, { id: rowData.id });
          if (response && response.success) {
              toast.success('Subscription deleted successfully!');
              setCount(c => c + 1);
          }
      } catch (error) {
          console.error('Error deleting subscription:', error);
      }
  };

  const startSubscription = async (rowData: Subscription) => {
    try {           
        const response = await apiPost(`api/subscription/start-subscription`, { 
            id: rowData.id
        });
        
        if (response && response.success) {
            toast.success(`Subscription ${rowData.status === SubscriptionStatus.RUNNING ? 'stopped' : 'started'} successfully!`);
            setCount(c => c + 1);
        }
    } catch (error) {
        console.error('Error updating subscription status:', error);
        toast.error('Failed to update subscription status');
    }
  };

  const stopSubscription = async (rowData: Subscription) => {
    try {           
        const response = await apiPost(`api/subscription/stop-subscription`, { 
            id: rowData.id
        });
        
        if (response && response.success) {
            toast.success(`Subscription ${rowData.status === SubscriptionStatus.RUNNING ? 'stopped' : 'started'} successfully!`);
            setCount(c => c + 1);
        }
    } catch (error) {
        console.error('Error updating subscription status:', error);
        toast.error('Failed to update subscription status');
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Mobile card view for each row
  const MobileRowCard = ({ row }: { row: Subscription }) => {
    const subscriptionRow = row as Subscription;
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{row.id}</h3>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
            {row.status}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600 break-words">
          <p><strong>Name:</strong> {row.name}</p>
          <p><strong>Address Type:</strong> {row.addressType}</p>
          <p><strong>Transaction Type:</strong> {row.transactionType}</p>
          <p><strong>Twitter Alert:</strong> {row.twitterAlert}</p>
          <p><strong>Address:</strong> {row.address ? `${row.address.substring(0, 20)}...` : ''}</p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            // onClick={() => toggleSubscriptionStatus(row)}
            onClick={() => {
              if (subscriptionRow.status === SubscriptionStatus.RUNNING) {
                stopSubscription(subscriptionRow);
              } else {
                startSubscription(subscriptionRow);
              }
            }}
            className={`${
              row.status === SubscriptionStatus.RUNNING 
                ? 'bg-red-400 hover:bg-red-500' 
                : 'bg-green-400 hover:bg-green-500'
              } text-white rounded p-2`}
          >
            {row.status === SubscriptionStatus.RUNNING ? (
              <CircleStop className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
          <button 
            onClick={() => deleteRow(row)}
            className="bg-red-400 text-white rounded hover:bg-red-500 p-2"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
    <ToastContainer position="top-right" autoClose={5000} />
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto shadow rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                className="hover:bg-gray-50 border-b last:border-b-0"
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="px-4 py-3 text-sm"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {table.getRowModel().rows.map(row => (
          <MobileRowCard key={row.id} row={row.original as Subscription} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        {table.getPageOptions().map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => table.setPageIndex(pageNumber)}
            className={`
              px-4 py-2 rounded
              ${table.getState().pagination.pageIndex === pageNumber 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {pageNumber + 1}
          </button>
        ))}

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllSubscriptions;