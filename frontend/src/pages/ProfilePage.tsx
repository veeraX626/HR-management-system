import { useState } from 'react'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useAuthStore } from '@/stores/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card'
import { Input } from '@/components/UI/Input'
import { Button } from '@/components/UI/Button'
import { Camera } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-64">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

        <Card>
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b">
            <div className="relative w-24 h-24 mb-4">
              <img
                src={imagePreview || user?.profileImage || 'https://via.placeholder.com/96'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {/* Personal Information */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  placeholder="Phone number"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  {...register('dateOfBirth')}
                  error={errors.dateOfBirth?.message}
                />
                <Input
                  label="Address"
                  placeholder="Street address"
                  {...register('address')}
                  error={errors.address?.message}
                />
                <Input
                  label="City"
                  placeholder="City"
                  {...register('city')}
                  error={errors.city?.message}
                />
                <Input
                  label="State"
                  placeholder="State"
                  {...register('state')}
                  error={errors.state?.message}
                />
                <Input
                  label="Zip Code"
                  placeholder="Zip code"
                  {...register('zipCode')}
                  error={errors.zipCode?.message}
                />
              </div>
            </div>

            {/* Job Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Job Title"
                  placeholder="Your job title"
                  {...register('jobTitle')}
                  error={errors.jobTitle?.message}
                />
                <Input
                  label="Department"
                  placeholder="Department"
                  {...register('department')}
                  error={errors.department?.message}
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
