import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import TasksOverview from "@/components/pages/TasksOverview"
import TasksReact from "@/components/pages/TasksReact"
import TasksMaintain from "@/components/pages/TasksMaintain"
import TasksImprove from "@/components/pages/TasksImprove"
import ToolboxProcesses from "@/components/pages/ToolboxProcesses"
import ToolboxSystems from "@/components/pages/ToolboxSystems"
import ToolboxEquipment from "@/components/pages/ToolboxEquipment"
import ToolboxSoftware from "@/components/pages/ToolboxSoftware"
import ToolboxTeam from "@/components/pages/ToolboxTeam"
import ToolboxIdeas from "@/components/pages/ToolboxIdeas"
import ToolboxEvents from "@/components/pages/ToolboxEvents"
import Reports from "@/components/pages/Reports"
import { ThemeProvider } from "@/hooks/useTheme"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<TasksOverview />} />
              <Route path="tasks/react" element={<TasksReact />} />
              <Route path="tasks/maintain" element={<TasksMaintain />} />
              <Route path="tasks/improve" element={<TasksImprove />} />
              <Route path="toolbox/processes" element={<ToolboxProcesses />} />
              <Route path="toolbox/systems" element={<ToolboxSystems />} />
              <Route path="toolbox/equipment" element={<ToolboxEquipment />} />
              <Route path="toolbox/software" element={<ToolboxSoftware />} />
              <Route path="toolbox/team" element={<ToolboxTeam />} />
              <Route path="toolbox/ideas" element={<ToolboxIdeas />} />
              <Route path="toolbox/events" element={<ToolboxEvents />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 9999 }}
            theme="light"
          />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App