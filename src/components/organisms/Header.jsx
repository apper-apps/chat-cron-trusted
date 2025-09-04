import React, { useContext } from "react"
import { AuthContext } from '@/App'
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { useTheme } from "@/hooks/useTheme"

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-dark-surface shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Mobile menu + Logo */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              OPS Hub
            </h1>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            <ApperIcon 
              name={isDarkMode ? "Sun" : "Moon"} 
              className="w-5 h-5" 
            />
          </Button>
          
<Button
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ApperIcon name="Bell" className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ApperIcon name="Search" className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
className="p-2"
            onClick={async () => {
              const authMethods = useContext(AuthContext)
              if (authMethods?.logout) {
                authMethods.logout()
              }
            }}
          >
            <ApperIcon name="LogOut" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header