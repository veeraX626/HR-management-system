# Dayflow HRMS Frontend

Complete React 18 + Vite + TypeScript frontend for Dayflow HRMS with role-based access control, real-time data management, and responsive design.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **TanStack Query (React Query)** - Data fetching & caching
- **Axios** - HTTP client
- **Zustand** - State management (JWT tokens, auth)
- **React Hook Form + Zod** - Form validation
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Day.js** - Date manipulation
- **React Hot Toast** - Notifications

## Features

### Authentication
- Login & Signup with JWT
- Protected routes
- Role-based access (ADMIN/EMPLOYEE)
- Persistent sessions (localStorage)

### User Roles

**Employee:**
- View personal dashboard
- Manage attendance (check-in/out)
- Apply for leaves
- View payslips
- Edit profile information

**Admin:**
- View all employees
- Monitor attendance
- Approve/reject leave requests
- Manage employee salaries
- System overview dashboard

### Pages

- `/login` - Login form
- `/signup` - Registration form
- `/dashboard` - Role-based dashboard
- `/profile` - User profile management
- `/attendance` - Check-in/out & records
- `/leaves` - Leave requests management
- `/payroll` - Salary information

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Configure in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

## API Integration

### Axios Interceptors
- Automatic JWT token injection
- 401 error handling (redirects to login)
- Error response transformation

### API Hooks

#### Authentication
- `useLogin()` - Sign in
- `useSignup()` - Register
- `useVerifyEmail()` - Email verification
- `useCurrentUser()` - Fetch logged-in user

#### Profile
- `useProfile()` - Fetch profile
- `useUpdateProfile()` - Update profile
- `useUploadProfileImage()` - Image upload

#### Attendance
- `useCheckIn()` - Check in
- `useCheckOut()` - Check out
- `useAttendanceRecords()` - Fetch records
- `useAttendanceStats()` - Statistics

#### Leaves
- `useMyLeaves()` - My leave requests
- `useAllLeaves()` - All requests (admin)
- `useApplyLeave()` - Apply for leave
- `useApproveLeave()` - Approve request
- `useRejectLeave()` - Reject request

## State Management

### Auth Store (Zustand)
```typescript
const { user, token, isAuthenticated } = useAuthStore()
useAuthStore.getState().setAuth(user, token)
useAuthStore.getState().logout()
```

## Component Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   ├── Dashboard/
│   │   └── (dashboard-specific components)
│   └── UI/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProfile.ts
│   ├── useAttendance.ts
│   └── useLeaves.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── AttendancePage.tsx
│   ├── LeavesPage.tsx
│   └── PayrollPage.tsx
├── stores/
│   └── auth.ts
├── types/
│   └── index.ts
├── utils/
│   └── axios.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Styling

### Tailwind Theme
- **Primary** - Blue (#0284c7)
- **Success** - Green (#22c55e)
- **Responsive** - Mobile-first design

### Key Classes
- `md:ml-64` - Sidebar offset
- `md:hidden` - Mobile menu toggle
- Gradient backgrounds
- Custom animations

## Error Handling

- **401** - Redirects to login
- **4xx** - User-friendly error messages
- **5xx** - Server error notifications
- **Form** - Real-time validation with Zod

## Performance

- React Query caching (5-minute stale time)
- Code splitting with React Router
- Image lazy loading
- Bundle optimization

## Development Tips

### Add New Hook
```typescript
// src/hooks/useNewFeature.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/utils/axios'

export const useNewFeature = () => {
  return useQuery({
    queryKey: ['newFeature'],
    queryFn: async () => {
      const response = await apiClient.get('/endpoint')
      return response.data
    },
  })
}
```

### Add New Page
```typescript
// src/pages/NewPage.tsx
export const NewPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-64">
      {/* Content */}
    </div>
  )
}

// Add to src/App.tsx routes
```

## Security Considerations

- JWT stored in localStorage (consider httpOnly cookies for production)
- CORS configured for backend
- Passwords hashed on backend
- Role-based access control on routes and API calls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Support

For issues or features, contact the development team.
