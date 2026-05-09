import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building, Phone, Mail, Globe, MapPin, Calendar, Loader2, Save, BookOpen, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useTenant } from '@/context/TenantContext'
import { useAuth } from '@/context/AuthContext'

export default function SchoolSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { schoolConfig } = useTenant()
  const { updateUserData } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    currentSession: '',
    address: { street: '', city: '', state: '', zip: '', country: 'Pakistan' },
    customClasses: [],
    customSections: [],
    customSubjects: []
  })
  
  const [newClassInput, setNewClassInput] = useState('')
  const [newSectionInput, setNewSectionInput] = useState('')
  const [newSubjectInput, setNewSubjectInput] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/schools/settings/my', { params: { schoolId: schoolConfig?.id } })
        if (res.data.success) {
          const s = res.data.data
          setFormData({
            name: s.name || '',
            email: s.email || '',
            phone: s.phone || '',
            website: s.website || '',
            currentSession: s.currentSession || '',
            address: s.address || { street: '', city: '', state: '', zip: '', country: 'Pakistan' },
            customClasses: s.customClasses || [],
            customSections: s.customSections || [],
            customSubjects: s.customSubjects || []
          })
        }
      } catch (err) {
        toast.error('Failed to load school settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const key = name.split('.')[1]
      setFormData(prev => ({ ...prev, address: { ...prev.address, [key]: value } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddCustomClass = () => {
    if (newClassInput.trim() && !formData.customClasses.includes(newClassInput.trim())) {
      setFormData(prev => ({ ...prev, customClasses: [...prev.customClasses, newClassInput.trim()] }))
      setNewClassInput('')
    }
  }

  const handleRemoveCustomClass = (cls) => {
    setFormData(prev => ({ ...prev, customClasses: prev.customClasses.filter(c => c !== cls) }))
  }

  const handleAddCustomSection = () => {
    if (newSectionInput.trim() && !formData.customSections.includes(newSectionInput.trim())) {
      setFormData(prev => ({ ...prev, customSections: [...prev.customSections, newSectionInput.trim()] }))
      setNewSectionInput('')
    }
  }

  const handleRemoveCustomSection = (sec) => {
    setFormData(prev => ({ ...prev, customSections: prev.customSections.filter(s => s !== sec) }))
  }

  const handleAddCustomSubject = () => {
    if (newSubjectInput.trim() && !formData.customSubjects.includes(newSubjectInput.trim())) {
      setFormData(prev => ({ ...prev, customSubjects: [...prev.customSubjects, newSubjectInput.trim()] }))
      setNewSubjectInput('')
    }
  }

  const handleRemoveCustomSubject = (sub) => {
    setFormData(prev => ({ ...prev, customSubjects: prev.customSubjects.filter(s => s !== sub) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.put('/schools/settings/my', formData)
      toast.success('School settings updated successfully')
      
      const userRes = await api.get('/auth/me')
      if (userRes.data.success) {
        updateUserData(userRes.data.data)
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to update settings')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">School Settings</h1>
        <p className="text-muted-foreground">Manage your school profile, contact details, and academic session.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* General Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" /> General Information
              </CardTitle>
              <CardDescription>Basic details about your institution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Current Academic Session</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="currentSession" value={formData.currentSession} onChange={handleChange} className="pl-9" placeholder="e.g. 2024-2025" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500" /> Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} className="pl-9" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="phone" value={formData.phone} onChange={handleChange} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="website" value={formData.website} onChange={handleChange} className="pl-9" placeholder="https://..." />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" /> Physical Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input name="address.street" value={formData.address.street} onChange={handleChange} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input name="address.city" value={formData.address.city} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>State/Province</Label>
                  <Input name="address.state" value={formData.address.state} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>ZIP/Postal Code</Label>
                  <Input name="address.zip" value={formData.address.zip} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Classes & Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-500" /> Custom Classes & Sections
              </CardTitle>
              <CardDescription>Add classes or sections specific to your school that are not in the default lists.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Custom Classes</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newClassInput} 
                    onChange={e => setNewClassInput(e.target.value)} 
                    placeholder="e.g. Pre-Nursery" 
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomClass())}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddCustomClass}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.customClasses.map(cls => (
                    <Badge key={cls} variant="outline" className="text-sm py-1">
                      {cls}
                      <button type="button" onClick={() => handleRemoveCustomClass(cls)} className="ml-2 hover:bg-muted rounded-full">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.customClasses.length === 0 && <span className="text-sm text-muted-foreground">No custom classes added.</span>}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Custom Sections</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newSectionInput} 
                    onChange={e => setNewSectionInput(e.target.value)} 
                    placeholder="e.g. Blue, Red" 
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSection())}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddCustomSection}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.customSections.map(sec => (
                    <Badge key={sec} variant="outline" className="text-sm py-1">
                      {sec}
                      <button type="button" onClick={() => handleRemoveCustomSection(sec)} className="ml-2 hover:bg-muted rounded-full">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.customSections.length === 0 && <span className="text-sm text-muted-foreground">No custom sections added.</span>}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Custom Subjects</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newSubjectInput} 
                    onChange={e => setNewSubjectInput(e.target.value)} 
                    placeholder="e.g. Robotics, AI" 
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSubject())}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddCustomSubject}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.customSubjects.map(sub => (
                    <Badge key={sub} variant="outline" className="text-sm py-1">
                      {sub}
                      <button type="button" onClick={() => handleRemoveCustomSubject(sub)} className="ml-2 hover:bg-muted rounded-full">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.customSubjects.length === 0 && <span className="text-sm text-muted-foreground">No custom subjects added.</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto shadow-lg">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Configuration
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
