import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ isOpen, setIsOpen }) => {
const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard"
    },
    {
      name: "Tasks",
      icon: "CheckSquare",
      children: [
        { name: "Overview", href: "/tasks", icon: "List" },
        { name: "React", href: "/tasks/react", icon: "Zap" },
        { name: "Maintain", href: "/tasks/maintain", icon: "Settings" },
        { name: "Improve", href: "/tasks/improve", icon: "TrendingUp" }
      ]
    },
    {
      name: "Market",
      icon: "Target",
      children: [
        { name: "Brand Building", href: "/market/brand-building", icon: "Award" },
        { name: "Audience Growth", href: "/market/audience-growth", icon: "Users" },
        { name: "Lead Nurture", href: "/market/lead-nurture", icon: "UserPlus" }
      ]
    },
    {
      name: "Sell",
      icon: "TrendingUp",
      children: [
        { name: "Lead Qualification", href: "/sell/lead-qualification", icon: "Filter" },
        { name: "Lead Conversion", href: "/sell/lead-conversion", icon: "CheckCircle" }
      ]
    },
    {
      name: "Customer",
      icon: "Heart",
      children: [
        { name: "Experience", href: "/customer/experience", icon: "Star" },
        { name: "Fulfillment", href: "/customer/fulfillment", icon: "Package" },
        { name: "Retention", href: "/customer/retention", icon: "RefreshCw" }
      ]
    },
    {
      name: "Product",
      icon: "Box",
      children: [
        { name: "Research and Development", href: "/product/research-development", icon: "Search" },
        { name: "Logistics and Supply", href: "/product/logistics-supply", icon: "Truck" }
      ]
    },
    {
      name: "Team",
      icon: "Users",
      children: [
        { name: "Team Curation", href: "/team/team-curation", icon: "UserCheck" },
        { name: "Training and Development", href: "/team/training-development", icon: "BookOpen" },
        { name: "Comp and Engagement", href: "/team/comp-engagement", icon: "Zap" }
      ]
    },
    {
      name: "Structure",
      icon: "Building",
      children: [
        { name: "Data", href: "/structure/data", icon: "Database" },
        { name: "Tools and Tech", href: "/structure/tools-tech", icon: "Settings" }
      ]
    },
    {
      name: "Support",
      icon: "Shield",
      children: [
        { name: "Financial", href: "/support/financial", icon: "DollarSign" },
        { name: "Legal", href: "/support/legal", icon: "Scale" },
        { name: "Risk", href: "/support/risk", icon: "AlertTriangle" },
        { name: "Admin", href: "/support/admin", icon: "FileText" }
      ]
    },
    {
      name: "Legacy Toolbox",
      icon: "Wrench",
      children: [
        { name: "Processes", href: "/toolbox/processes", icon: "GitBranch" },
        { name: "Systems", href: "/toolbox/systems", icon: "Server" },
        { name: "Equipment", href: "/toolbox/equipment", icon: "Wrench" },
        { name: "Software", href: "/toolbox/software", icon: "Code" },
        { name: "Team", href: "/toolbox/team", icon: "Users" },
        { name: "Ideas", href: "/toolbox/ideas", icon: "Lightbulb" },
        { name: "Key Events", href: "/toolbox/events", icon: "Calendar" }
      ]
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "BarChart3"
    }
  ]

  const [expandedItems, setExpandedItems] = React.useState(["Tasks", "Toolbox"])

  const toggleExpanded = (name) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 pt-16">
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.href ? (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )
                    }
                  >
                    <ApperIcon
                      name={item.icon}
                      className="mr-3 h-5 w-5 flex-shrink-0"
                    />
                    {item.name}
                  </NavLink>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <ApperIcon
                        name={item.icon}
                        className="mr-3 h-5 w-5 flex-shrink-0"
                      />
                      {item.name}
                      <ApperIcon
                        name="ChevronDown"
                        className={cn(
                          "ml-auto h-4 w-4 transition-transform duration-200",
                          expandedItems.includes(item.name) ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    {expandedItems.includes(item.name) && (
                      <div className="mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <NavLink
                            key={child.name}
                            to={child.href}
                            className={({ isActive }) =>
                              cn(
                                "group flex items-center pl-11 pr-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                isActive
                                  ? "bg-primary text-white shadow-lg"
                                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                              )
                            }
                          >
                            <ApperIcon
                              name={child.icon}
                              className="mr-3 h-4 w-4 flex-shrink-0"
                            />
                            {child.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              OPS Hub
            </h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.href ? (
                  <NavLink
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )
                    }
                  >
                    <ApperIcon
                      name={item.icon}
                      className="mr-3 h-5 w-5 flex-shrink-0"
                    />
                    {item.name}
                  </NavLink>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <ApperIcon
                        name={item.icon}
                        className="mr-3 h-5 w-5 flex-shrink-0"
                      />
                      {item.name}
                      <ApperIcon
                        name="ChevronDown"
                        className={cn(
                          "ml-auto h-4 w-4 transition-transform duration-200",
                          expandedItems.includes(item.name) ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    {expandedItems.includes(item.name) && (
                      <div className="mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <NavLink
                            key={child.name}
                            to={child.href}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                              cn(
                                "group flex items-center pl-11 pr-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                isActive
                                  ? "bg-primary text-white shadow-lg"
                                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                              )
                            }
                          >
                            <ApperIcon
                              name={child.icon}
                              className="mr-3 h-4 w-4 flex-shrink-0"
                            />
                            {child.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar