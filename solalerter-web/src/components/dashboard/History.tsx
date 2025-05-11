import { useState, useEffect } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  flexRender,
  createColumnHelper 
} from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { apiGet } from '../../utils/api';

const History = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await apiGet(`api/subscription/helius-response`);
      setData(response.heliusResponse || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refreshInterval) {
      const intervalId = setInterval(fetchData, refreshInterval * 1000);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval]);

  // Function to format blockchain addresses in description
  const formatAddressesInDescription = (description: string): string => {
    const addressRegex = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g;
    
    return description.replace(addressRegex, (address) => {
      if (address.length > 10) {
        return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
      }
      return address; 
    });
  };

  // Column definition
  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor('response', {
      header: 'Response Description',
      cell: info => {
        const value = info.getValue();
        try {
          const parsedResponse = JSON.parse(value);
          const description = parsedResponse[0].description || 'No description available';
          return description.length > 100 ? `${formatAddressesInDescription(description)}` : description;
        } catch (error) {
          return 'Invalid JSON response';
        }
      },
    }),
    columnHelper.accessor('subscriptionId', {
      header: 'Subscription Id',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => new Date(info.getValue()).toLocaleString(),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Mobile card view for each row
  const MobileRowCard = ({ row }: { row: any }) => {
    let description = 'Invalid JSON response';
    try {
      const parsedResponse = JSON.parse(row.response);
      description = parsedResponse[0].description || 'No description available';
      if (description.length > 50) {
        description = `${formatAddressesInDescription(description)}`;
      }
    } catch (error) {}
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md">Subscription Id: {row.subscriptionId}</span>
          <span id='lblCreatedAt' className="text-sm text-gray-600">{new Date(row.createdAt).toLocaleString()}</span>
        </div>
        <div className="space-y-2 text-sm text-gray-600 break-words">
          <p><strong>Response Description:</strong> {description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={fetchData} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
        <div className="flex items-center space-x-2">
          <label htmlFor="refreshInterval" className="text-sm text-gray-600">
            Auto-refresh (seconds):
          </label>
          <input 
            id="refreshInterval"
            type="number"
            value={refreshInterval || ''}
            onChange={(e) => setRefreshInterval(e.target.value ? parseInt(e.target.value) : null)}
            className="px-2 py-1 border rounded"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto shadow rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                className="hover:bg-gray-50 bg-white border-b last:border-b-0"
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="px-2 py-3 text-sm text-left"                  >
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
          <MobileRowCard key={row.id} row={row.original} />
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

export default History;