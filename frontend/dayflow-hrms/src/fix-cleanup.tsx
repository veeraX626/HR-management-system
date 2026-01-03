/*
🚨 HRMS EMERGENCY CLEANUP - Fix duplicate files + loading issue

1. DELETE ALL DUPLICATES:
rm -rf src/frontend/  # if exists
rm src/components/*duplicate*
rm src/pages/*duplicate*

2. CORRECT FOLDER STRUCTURE (create these EMPTY):
src/
├── components/
│   └── Sidebar.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Attendance.tsx
│   └── Leaves.tsx
├── contexts/
│   └── AuthContext.tsx
├── App.tsx
├── main.tsx
└── index.css

3. FIX main.tsx - Remove frontend/ import mess:
*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
