import { useState, useEffect } from 'react'
import api from '@/lib/api'
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useTenant } from '@/context/TenantContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search, Plus, MoreHorizontal, Pencil, Trash2, GraduationCap, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, AlertTriangle, X
} from 'lucide-react'

const DEFAULT_CLASSES = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10']
const DEFAULT_SECTIONS = ['A', 'B', 'C']
const DEFAULT_SUBJECTS = ['Mathematics', 'English', 'Science', 'Urdu', 'Islamiat', 'Computer', 'History', 'Geography']
import { toast } from 'sonner'

export default function TeacherList() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const res = await api.get('/staff')
      if (res.data.success) {
        setStaff(res.data.data)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await api.delete(`/staff/${id}`)
      toast.success('Teacher removed')
      fetchStaff()
    } catch (err) {
      toast.error(err.message || 'Failed to remove teacher')
    } finally {
      setDeleting(false)
      setDeleteConfirmId(null)
    }
  }

  const columns = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Staff Name <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-xs">
            {row.original.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.user?.email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.employeeId}</span>,
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-[10px] tracking-wider">
          {row.original.designation}
        </Badge>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => <span className="text-sm">{row.original.department || '-'}</span>,
    },
    {
      accessorKey: 'phone',
      header: 'Contact',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone || '-'}</span>,
    },
    {
      accessorKey: 'assignments',
      header: 'Assignments',
      cell: ({ row }) => {
        const assignments = row.original.assignments || []
        if (assignments.length === 0) return <span className="text-xs text-muted-foreground">None</span>
        return (
          <div className="flex flex-col gap-1 max-w-[200px]">
            {assignments.map((a, i) => (
              <div key={i} className="text-xs border rounded p-1">
                <span className="font-semibold">{a.class}{a.section ? ` (${a.section})` : ''}:</span>{' '}
                <span className="text-muted-foreground">{a.subjects.join(', ')}</span>
              </div>
            ))}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => {
              setEditingStaff(row.original)
              setFormOpen(true)
            }}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10" onClick={() => setDeleteConfirmId(row.original._id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: staff,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-500" /> Teacher & Staff Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{staff.length} staff members registered</p>
        </div>
        <Button onClick={() => { setEditingStaff(null); setFormOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25">
          <Plus className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID..."
              className="pl-9"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id}>
                  {hg.headers.map(header => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No staff found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{' '}
            {table.getFilteredRowModel().rows.length}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <TeacherFormDialog 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        initialData={editingStaff} 
        onSuccess={fetchStaff} 
      />

      <Dialog open={!!deleteConfirmId} onOpenChange={(val) => !val && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            Are you sure you want to remove this teacher? This action cannot be undone.
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteConfirmId)} disabled={deleting}>
              {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TeacherFormDialog({ open, onClose, initialData, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const isEditing = !!initialData
  const { schoolConfig } = useTenant()

  const combinedClasses = [...new Set([...DEFAULT_CLASSES, ...(schoolConfig?.customClasses || [])])]
  const combinedSections = [...new Set([...DEFAULT_SECTIONS, ...(schoolConfig?.customSections || [])])]
  const combinedSubjects = [...new Set([...DEFAULT_SUBJECTS, ...(schoolConfig?.customSubjects || [])])]

  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    if (open) {
      if (initialData && initialData.assignments) {
        setAssignments(initialData.assignments)
      } else {
        setAssignments([])
      }
    }
  }, [open, initialData])

  const handleAddAssignment = () => {
    setAssignments([...assignments, { class: '', section: '', subjects: [] }])
  }

  const handleRemoveAssignment = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index))
  }

  const handleAssignmentClassChange = (index, val) => {
    const newAssignments = [...assignments]
    newAssignments[index].class = val
    setAssignments(newAssignments)
  }

  const handleAssignmentSectionChange = (index, val) => {
    const newAssignments = [...assignments]
    newAssignments[index].section = val
    setAssignments(newAssignments)
  }

  const handleAddSubjectToAssignment = (index, subject) => {
    const newAssignments = [...assignments]
    if (subject && !newAssignments[index].subjects.includes(subject)) {
      newAssignments[index].subjects.push(subject)
    }
    setAssignments(newAssignments)
  }

  const handleRemoveSubjectFromAssignment = (index, subject) => {
    const newAssignments = [...assignments]
    newAssignments[index].subjects = newAssignments[index].subjects.filter(s => s !== subject)
    setAssignments(newAssignments)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)
    
    payload.assignments = assignments.filter(a => a.class && a.section && a.subjects.length > 0)

    try {
      if (isEditing) {
        await api.put(`/staff/${initialData._id}`, payload)
        toast.success('Teacher updated successfully')
      } else {
        await api.post('/staff', payload)
        toast.success('Teacher added successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="name" defaultValue={initialData?.name} required />
            </div>
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input name="employeeId" defaultValue={initialData?.employeeId} required />
            </div>
          </div>
          
          {!isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" name="email" required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" name="password" placeholder="Default: school@123" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Designation</Label>
              <Select name="designation" defaultValue={initialData?.designation || 'teacher'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="librarian">Librarian</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input name="department" defaultValue={initialData?.department} placeholder="e.g. Science" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input name="phone" defaultValue={initialData?.phone} />
            </div>
            <div className="space-y-2">
              <Label>Join Date</Label>
              <Input type="date" name="joinDate" defaultValue={initialData?.joinDate?.split('T')[0]} />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base">Class & Subject Assignments</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddAssignment}>
                <Plus className="mr-1 h-3 w-3" /> Add Assignment
              </Button>
            </div>
            {assignments.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-md border border-dashed">
                No classes or subjects assigned yet.
              </div>
            )}
            {assignments.map((assignment, index) => (
              <div key={index} className="p-3 border rounded-md space-y-3 bg-muted/10 relative group">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveAssignment(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                
                <div className="grid grid-cols-3 gap-3 pr-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Class</Label>
                    <Select value={assignment.class} onValueChange={(val) => handleAssignmentClassChange(index, val)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {combinedClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Section</Label>
                    <Select value={assignment.section || ''} onValueChange={(val) => handleAssignmentSectionChange(index, val)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Section" /></SelectTrigger>
                      <SelectContent>
                        {combinedSections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Add Subject</Label>
                    <Select value="" onValueChange={(val) => handleAddSubjectToAssignment(index, val)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select to add" /></SelectTrigger>
                      <SelectContent>
                        {combinedSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {assignment.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {assignment.subjects.map(sub => (
                      <Badge key={sub} variant="secondary" className="text-[10px] py-0 font-normal">
                        {sub}
                        <button type="button" onClick={() => handleRemoveSubjectFromAssignment(index, sub)} className="ml-1 hover:text-destructive">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" disabled={submitting} className="w-full mt-4">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Add Teacher'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
