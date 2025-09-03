import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout