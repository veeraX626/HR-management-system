import { useState } from 'react'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useAuthStore } from '@/stores/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card'
import { Input } from '@/components/UI/Input'
import { Button } from '@/components/UI/Button'
import { Camera, Mail, Phone, MapPin, Briefcase, DollarSign, FileText, Download, Copy, Zap } from 'lucide-react'
import { parseEmployeeId } from '@/utils/employeeIdHelper'

const profileSchema = z.object({
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export const ProfilePage = () => {
  const { user } = useAuthStore()
  const { data: profile, isLoading } = useProfile()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const [imagePreview, setImagePreview] = useState<string>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: profile?.phone,
      dateOfBirth: profile?.dateOfBirth,
      address: profile?.address,
      city: profile?.city,
      state: profile?.state,
      zipCode: profile?.zipCode,
      jobTitle: profile?.jobTitle,
      department: profile?.department,
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 p-4 md:p-8 md:ml-64">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-gray-300">Manage your personal and job information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="!bg-gradient-to-br !from-primary-500/20 !to-primary-600/20 !border-primary-400/30">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-white/10">
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 p-1">
                      <img
                        src={imagePreview || user?.profileImage || 'https://via.placeholder.com/128'}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white/20"
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg hover:shadow-xl">
                      <Camera size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-primary-300 mb-3 flex items-center gap-2 justify-center sm:justify-start">
                      <Mail size={16} />
                      {user?.email}
                    </p>

                    {/* Employee ID Badge */}
                    {user?.employeeId && (
                      <div className="mb-3 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-3 py-1 bg-primary-500/30 border border-primary-400/50 rounded-full text-primary-200 text-sm font-medium">
                            {user?.role}
                          </span>
                          <div className="group relative">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(user?.employeeId)
                                alert('Employee ID copied!')
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/50 rounded-full text-blue-200 text-sm font-medium hover:from-blue-500/40 hover:to-blue-600/40 transition-all"
                            >
                              <Zap size={14} />
                              {user?.employeeId}
                              <Copy size={12} />
                            </button>
                            <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-slate-900 border border-white/20 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Click to copy
                            </div>
                          </div>
                        </div>
                        {/* Employee ID Format Explanation */}
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-400/30 text-xs text-blue-300">
                          <p className="font-mono">Format: OI[Initials][Year][Serial]</p>
                          <p className="text-blue-400 text-xs mt-1">
                            {parseEmployeeId(user?.employeeId)?.companyCode} =
                            Odoo India • {parseEmployeeId(user?.employeeId)?.firstInitial}
                            {parseEmployeeId(user?.employeeId)?.lastInitial} = Your
                            initials • {parseEmployeeId(user?.employeeId)?.year} = Joining
                            year • {parseEmployeeId(user?.employeeId)?.serial} =
                            Serial #
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Information Summary */}
                <div className="mb-8 pb-8 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Briefcase className="text-primary-300" size={20} />
                    Job Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profile?.jobTitle && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Position</p>
                        <p className="text-white font-semibold">{profile?.jobTitle}</p>
                      </div>
                    )}
                    {profile?.department && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Department</p>
                        <p className="text-white font-semibold">{profile?.department}</p>
                      </div>
                    )}
                    {user?.employeeId && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Employee ID</p>
                        <p className="text-white font-semibold">{user?.employeeId}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Role</p>
                      <p className="text-white font-semibold">{user?.role}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Information Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <MapPin className="text-primary-300" size={20} />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Phone"
                        placeholder="(555) 123-4567"
                        {...register('phone')}
                        error={errors.phone?.message}
                        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
                      />
                      <Input
                        label="Date of Birth"
                        type="date"
                        {...register('dateOfBirth')}
                        error={errors.dateOfBirth?.message}
                        className="!bg-white/5 !border-white/10 !text-white focus:!border-primary-400 !rounded-lg"
                      />
                      <Input
                        label="Address"
                        placeholder="123 Main Street"
                        {...register('address')}
                        error={errors.address?.message}
                        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg md:col-span-2"
                      />
                      <Input
                        label="City"
                        placeholder="New York"
                        {...register('city')}
                        error={errors.city?.message}
                        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
                      />
                      <Input
                        label="State"
                        placeholder="NY"
                        {...register('state')}
                        error={errors.state?.message}
                        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
                      />
                      <Input
                        label="Zip Code"
                        placeholder="10001"
                        {...register('zipCode')}
                        error={errors.zipCode?.message}
                        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Job Information */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Briefcase className="text-primary-300" size={20} />
                      Job Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Job Title"
                        placeholder="Your job title"
                        {...register('jobTitle')}
                        error={errors.jobTitle?.message}
                        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
                      />
                      <Input
                        label="Department"
                        placeholder="Department"
                        {...register('department')}
                        error={errors.department?.message}
                        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending ? 'Updating...' : 'Save Changes'}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Right Column - Job & Salary Details */}
          <div className="space-y-6">
            {/* Job Details Card */}
            <Card className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="text-blue-300" size={20} />
                  Job Details
                </h4>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-white/10">
                    <p className="text-blue-200 text-sm uppercase tracking-wide">Employee ID</p>
                    <p className="text-white font-semibold">{user?.id}</p>
                  </div>
                  <div className="pb-4 border-b border-white/10">
                    <p className="text-blue-200 text-sm uppercase tracking-wide">Department</p>
                    <p className="text-white font-semibold">{profile?.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm uppercase tracking-wide">Joining Date</p>
                    <p className="text-white font-semibold">
                      {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Salary Info Card */}
            <Card className="!bg-gradient-to-br !from-green-500/20 !to-green-600/20 !border-green-400/30">
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="text-green-300" size={20} />
                  Salary Structure
                </h4>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-white/10">
                    <p className="text-green-200 text-sm uppercase tracking-wide">Base Salary</p>
                    <p className="text-white font-bold text-lg">${profile?.baseSalary?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="pb-4 border-b border-white/10">
                    <p className="text-green-200 text-sm uppercase tracking-wide">Allowances</p>
                    <p className="text-white font-semibold">${profile?.allowances?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <p className="text-green-200 text-sm uppercase tracking-wide">Deductions</p>
                    <p className="text-white font-semibold">${profile?.deductions?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Documents Card */}
            <Card className="!bg-gradient-to-br !from-purple-500/20 !to-purple-600/20 !border-purple-400/30">
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-purple-300" size={20} />
                  Documents
                </h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-purple-500/20 transition-colors group">
                    <span className="text-purple-200 group-hover:text-white transition-colors">Resume</span>
                    <Download size={18} className="text-purple-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-purple-500/20 transition-colors group">
                    <span className="text-purple-200 group-hover:text-white transition-colors">Certificate</span>
                    <Download size={18} className="text-purple-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-purple-500/20 transition-colors group">
                    <span className="text-purple-200 group-hover:text-white transition-colors">Contract</span>
                    <Download size={18} className="text-purple-300" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
