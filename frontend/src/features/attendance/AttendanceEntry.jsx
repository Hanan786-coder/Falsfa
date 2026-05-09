import { useState, useCallback } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { CalendarDays, Save, CheckCircle2, Loader2 } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

const CLASSES = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10']
const SECTIONS = ['A', 'B', 'C']
const STATUSES = ['present', 'absent', 'late', 'excused']

export default function AttendanceEntry() {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [entries, setEntries] = useState([])
  const [showGrid, setShowGrid] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { schoolConfig } = useTenant()

  const combinedClasses = [...new Set([...CLASSES, ...(schoolConfig?.customClasses || [])])]
  const combinedSections = [...new Set([...SECTIONS, ...(schoolConfig?.customSections || [])])]

  const loadStudents = async () => {
    if (!selectedClass || !selectedSection || !date) return
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await api.get('/exams/students', {
        params: { class: selectedClass, section: selectedSection }
      })
      const students = res.data.data || []
      const data = students.map(s => ({
        student: s._id,
        studentName: s.name,
        rollNumber: s.rollNo,
        status: 'present',
        note: ''
      }))
      setEntries(data)
      setShowGrid(true)
      setSaved(false)
    } catch (err) {
      console.error('Failed to load students:', err)
      setErrorMsg('Failed to load students.')
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = useCallback((index, newStatus) => {
    setEntries(prev => {
      const next = [...prev]
      next[index].status = newStatus
      return next
    })
    setSaved(false)
  }, [])

  const updateNote = useCallback((index, note) => {
    setEntries(prev => {
      const next = [...prev]
      next[index].note = note
      return next
    })
    setSaved(false)
  }, [])

  const handleSave = async () => {
    if (entries.length === 0) return
    setSaving(true)
    setErrorMsg('')
    try {
      await api.post('/attendance', {
        class: selectedClass,
        section: selectedSection,
        date,
        records: entries.map(e => ({ student: e.student, status: e.status, note: e.note }))
      })
      setSaved(true)
    } catch (err) {
      console.error('Save failed:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to save attendance.')
    } finally {
      setSaving(false)
    }
  }

  const markAll = (status) => {
    setEntries(prev => prev.map(e => ({ ...e, status })))
    setSaved(false)
  }

  const presentCount = entries.filter(e => e.status === 'present').length
  const absentCount = entries.filter(e => e.status === 'absent').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" /> Daily Attendance
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Mark attendance for a class</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>{combinedClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger><SelectValue placeholder="Section" /></SelectTrigger>
              <SelectContent>{combinedSections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button onClick={loadStudents} disabled={!selectedClass || !selectedSection || !date || loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Load Class
            </Button>
          </div>
        </CardContent>
      </Card>

      {errorMsg && (
        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {showGrid && entries.length === 0 && !loading && (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No students found for this class/section.</CardContent></Card>
      )}

      {showGrid && entries.length > 0 && (
        <>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className="text-sm py-1 px-3">Total: {entries.length}</Badge>
            <Badge variant="outline" className="text-sm py-1 px-3 bg-emerald-50 text-emerald-700">Present: {presentCount}</Badge>
            <Badge variant="outline" className="text-sm py-1 px-3 bg-red-50 text-red-700">Absent: {absentCount}</Badge>
            {saved && <Badge variant="success" className="text-sm py-1 px-3"><CheckCircle2 className="mr-1 h-3 w-3" /> Saved</Badge>}
          </div>

          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-3">
                  {selectedClass} - Section {selectedSection} | {new Date(date).toLocaleDateString()}
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm" onClick={() => markAll('present')} className="h-7 text-xs">Mark All Present</Button>
                     <Button variant="outline" size="sm" onClick={() => markAll('absent')} className="h-7 text-xs">Mark All Absent</Button>
                  </div>
                </CardTitle>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Attendance
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead className="w-24">Roll No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="w-48">Status</TableHead>
                      <TableHead>Note (Optional)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry, i) => (
                      <TableRow key={entry.student}>
                        <TableCell className="text-center text-muted-foreground text-xs">{i + 1}</TableCell>
                        <TableCell className="font-mono text-xs">{entry.rollNumber}</TableCell>
                        <TableCell className="font-medium text-sm">{entry.studentName}</TableCell>
                        <TableCell>
                          <Select value={entry.status} onValueChange={(val) => updateStatus(i, val)}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                           <Input 
                             value={entry.note} 
                             onChange={(e) => updateNote(i, e.target.value)} 
                             className="h-8" 
                             placeholder="e.g. sick leave" 
                           />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
