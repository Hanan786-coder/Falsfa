import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClipboardList, Loader2, Award } from 'lucide-react'

const GRADE_COLORS = {
  'A+': 'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  'A': 'bg-green-500/15 text-green-700 border-green-200',
  'B': 'bg-blue-500/15 text-blue-700 border-blue-200',
  'C': 'bg-amber-500/15 text-amber-700 border-amber-200',
  'D': 'bg-orange-500/15 text-orange-700 border-orange-200',
  'F': 'bg-red-500/15 text-red-700 border-red-200',
}

export default function MyResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchResults = async () => {
    setLoading(true)
    try {
      const res = await api.get('/exams/my-results')
      setResults(res.data.data || [])
    } catch (err) {
      console.error('Failed to load results:', err)
      setErrorMsg('Failed to load your examination results.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  // Group results by examType
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.examType]) {
      acc[result.examType] = []
    }
    acc[result.examType].push(result)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> My Results
        </h1>
        <p className="text-muted-foreground text-sm mt-1">View your academic performance and grades</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <Card>
          <CardContent className="flex justify-center items-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center flex flex-col items-center">
            <Award className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="text-lg font-medium text-foreground">No Results Available</h3>
            <p className="text-muted-foreground mt-1">Your examination results have not been published yet.</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedResults).map(([examType, examResults]) => {
          const totalMarks = examResults.reduce((sum, r) => sum + r.marksObtained, 0)
          const totalMax = examResults.reduce((sum, r) => sum + r.maxMarks, 0)
          const overallPercentage = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0

          return (
            <Card key={examType} className="overflow-hidden">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize flex items-center gap-2">
                    {examType} Examination
                    <Badge variant="outline" className="ml-2 font-normal">Class {examResults[0]?.class}</Badge>
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{overallPercentage}%</div>
                    <div className="text-xs text-muted-foreground">Overall Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Marks Obtained</TableHead>
                      <TableHead className="text-center">Total Marks</TableHead>
                      <TableHead className="text-center">Percentage</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examResults.map((result) => (
                      <TableRow key={result._id}>
                        <TableCell className="font-medium capitalize">{result.subject}</TableCell>
                        <TableCell className="text-center font-semibold">{result.marksObtained}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{result.maxMarks}</TableCell>
                        <TableCell className="text-center">{result.percentage}%</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center justify-center min-w-[2.5rem] rounded-md px-2 py-1 text-xs font-bold border ${GRADE_COLORS[result.grade] || 'bg-gray-100 text-gray-800'}`}>
                            {result.grade}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
