import { useState } from 'react'
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage'

export function App() {
  const [projectCount, setProjectCount] = useState(0)

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <div className="mx-auto max-w-[1540px] px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 flex items-center justify-between px-1 text-xs font-semibold text-slate-400">
          <span>Понедельник, 1 октября 2026</span>
          <span>{projectCount} проектов</span>
        </div>
        <DashboardPage onProjectCountChange={setProjectCount} />
      </div>
    </div>
  )
}
