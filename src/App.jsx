import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "@/index.css";
import Layout from "@/components/organisms/Layout";
import ToolboxIdeas from "@/components/pages/ToolboxIdeas";
import TasksReact from "@/components/pages/TasksReact";
import ToolboxEquipment from "@/components/pages/ToolboxEquipment";
import ToolboxSoftware from "@/components/pages/ToolboxSoftware";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import Reports from "@/components/pages/Reports";
import Signup from "@/components/pages/Signup";
import ToolboxEvents from "@/components/pages/ToolboxEvents";
import TasksImprove from "@/components/pages/TasksImprove";
import ToolboxTeam from "@/components/pages/ToolboxTeam";
import TasksMaintain from "@/components/pages/TasksMaintain";
import Dashboard from "@/components/pages/Dashboard";
import ToolboxSystems from "@/components/pages/ToolboxSystems";
import TasksOverview from "@/components/pages/TasksOverview";
import ErrorPage from "@/components/pages/ErrorPage";
import Callback from "@/components/pages/Callback";
import ToolboxProcesses from "@/components/pages/ToolboxProcesses";
import Login from "@/components/pages/Login";
import { clearUser, setUser } from "@/store/userSlice";
import { ThemeProvider } from "@/hooks/useTheme";

// Create auth context
export const AuthContext = createContext(null)

function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    // Initialize but don't show login yet
ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true)
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
},
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    })
  }, []) // No props and state should be bound
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>
  }
  
  return (
<ThemeProvider>
      <AuthContext.Provider value={authMethods}>
        <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
            <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<TasksOverview />} />
              <Route path="tasks/react" element={<TasksReact />} />
              <Route path="tasks/maintain" element={<TasksMaintain />} />
              <Route path="tasks/improve" element={<TasksImprove />} />
              
              {/* Market Section */}
              <Route path="market/brand-building" element={<Dashboard />} />
              <Route path="market/audience-growth" element={<Dashboard />} />
              <Route path="market/lead-nurture" element={<Dashboard />} />
              
              {/* Sell Section */}
              <Route path="sell/lead-qualification" element={<Dashboard />} />
              <Route path="sell/lead-conversion" element={<Dashboard />} />
              
              {/* Customer Section */}
              <Route path="customer/experience" element={<Dashboard />} />
              <Route path="customer/fulfillment" element={<Dashboard />} />
              <Route path="customer/retention" element={<Dashboard />} />
              
              {/* Product Section */}
              <Route path="product/research-development" element={<Dashboard />} />
              <Route path="product/logistics-supply" element={<Dashboard />} />
              
              {/* Team Section */}
              <Route path="team/team-curation" element={<Dashboard />} />
              <Route path="team/training-development" element={<Dashboard />} />
              <Route path="team/comp-engagement" element={<Dashboard />} />
              
              {/* Structure Section */}
              <Route path="structure/data" element={<Dashboard />} />
              <Route path="structure/tools-tech" element={<Dashboard />} />
              
              {/* Support Section */}
              <Route path="support/financial" element={<Dashboard />} />
              <Route path="support/legal" element={<Dashboard />} />
              <Route path="support/risk" element={<Dashboard />} />
              <Route path="support/admin" element={<Dashboard />} />
              
              {/* Legacy Toolbox Routes */}
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
      </AuthContext.Provider>
    </ThemeProvider>
  )
}

export default App