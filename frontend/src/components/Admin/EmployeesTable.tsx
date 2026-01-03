import { useMemo, useState } from 'react'
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown, Edit2, Trash2, Eye } from 'lucide-react'
import { Employee } from '@/hooks/useAdmin'
import { Button } from '@/components/UI/Button'

interface EmployeesTableProps {
  employees: Employee[]
  isLoading: boolean
  onView?: (employee: Employee) => void
  onEdit?: (employee: Employee) => void
  onDelete?: (employee: Employee) => void
  pageSize?: number
}

export const EmployeesTable = ({
  employees = [],
  isLoading,
  onView,
  onEdit,
  onDelete,
  pageSize = 50
}: EmployeesTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('')
  // const { mutate: deleteEmployee } = useDeleteEmployee('')

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'employeeId',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Employee ID
            {column.getIsSorted() === 'asc' && <ChevronUp size={16} />}
            {column.getIsSorted() === 'desc' && <ChevronDown size={16} />}
          </button>
        ),
        cell: (info) => <span className="font-semibold text-primary-600">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'profile',
        header: 'Name',
        cell: (info) => {
          const profile = info.getValue() as Employee['profile']
          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white">
                {profile?.firstName} {profile?.lastName}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'profile',
        header: 'Department',
        cell: (info) => {
          const profile = info.getValue() as Employee['profile']
          return <span className="text-gray-600 dark:text-gray-400">{profile?.department || '—'}</span>
        },
      },
      {
        accessorKey: 'profile',
        header: 'Job Title',
        cell: (info) => {
          const profile = info.getValue() as Employee['profile']
          return <span className="text-gray-600 dark:text-gray-400">{profile?.jobTitle || '—'}</span>
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView?.(row.original)}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded transition"
              title="View"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => onEdit?.(row.original)}
              className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 rounded transition"
              title="Edit"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${row.original.profile?.firstName}?`)) {
                  onDelete?.(row.original)
                }
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  )

  const [sorting, setSorting] = useState<any>([])
  const [columnFilters, setColumnFilters] = useState<any>([])

  const table = useReactTable({
    data: employees,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId)
      const stringValue = String(cellValue ?? '').toLowerCase()
      return stringValue.includes(String(filterValue).toLowerCase())
    },
  })

  table.setPageSize(pageSize)

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading employees...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No employees found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4 text-gray-900 dark:text-white">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && employees.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm text-gray-600 dark:text-gray-400">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
