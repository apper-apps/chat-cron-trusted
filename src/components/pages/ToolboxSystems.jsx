import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import ToolboxItemCard from "@/components/molecules/ToolboxItemCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"
import toolboxService from "@/services/api/toolboxService"

const ToolboxSystems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [draggedItem, setDraggedItem] = useState(null)

  // Define Kanban board sections with their subsections
  const kanbanSections = [
    {
      id: "market",
      name: "Market",
      color: "blue",
      icon: "Target",
      subsections: [
        { id: "brand-building", name: "Brand Building" },
        { id: "audience-growth", name: "Audience Growth" },
        { id: "lead-nurture", name: "Lead Nurture" }
      ]
    },
    {
      id: "sell",
      name: "Sell", 
      color: "green",
      icon: "DollarSign",
      subsections: [
        { id: "lead-qualification", name: "Lead Qualification" },
        { id: "lead-conversion", name: "Lead Conversion" }
      ]
    },
    {
      id: "customer",
      name: "Customer",
      color: "purple",
      icon: "Users",
      subsections: [
        { id: "experience", name: "Experience" },
        { id: "fulfillment", name: "Fulfillment" },
        { id: "retention", name: "Retention" }
      ]
    },
    {
      id: "product",
      name: "Product",
      color: "orange",
      icon: "Package",
      subsections: [
        { id: "research-development", name: "Research and Development" },
        { id: "logistics-supply", name: "Logistics and Supply" }
      ]
    },
    {
      id: "notes",
      name: "Notes",
      color: "yellow",
      icon: "StickyNote",
      subsections: []
    },
    {
      id: "team",
      name: "Team",
      color: "red",
      icon: "Users2",
      subsections: [
        { id: "team-curation", name: "Team Curation" },
        { id: "training-development", name: "Training and Development" },
        { id: "comp-engagement", name: "Comp and Engagement" }
      ]
    },
    {
      id: "structure",
      name: "Structure",
      color: "indigo",
      icon: "Building",
      subsections: [
        { id: "data", name: "Data" },
        { id: "tools-tech", name: "Tools and Tech" }
      ]
    },
    {
      id: "support",
      name: "Support",
      color: "gray",
      icon: "HelpCircle",
      subsections: [
        { id: "financial", name: "Financial" },
        { id: "legal", name: "Legal" },
        { id: "risk", name: "Risk" },
        { id: "admin", name: "Admin" }
      ]
    }
  ]

  const loadSystems = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await toolboxService.getAll()
      setItems(data)
    } catch (err) {
      setError(err.message || "Failed to load systems")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSystems()
  }, [])

  const handleToggleStatus = async (id) => {
    try {
      const updatedItem = await toolboxService.toggleStatus(id)
      setItems(prev => prev.map(item => item.Id === id ? updatedItem : item))
      toast.success("System status updated successfully")
    } catch (err) {
      toast.error(err.message || "Failed to update system status")
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return

    try {
      await toolboxService.delete(id)
      setItems(prev => prev.filter(item => item.Id !== id))
      toast.success("Item deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete item")
    }
  }

  const handleEditItem = (item) => {
    toast.info("Edit functionality would open a modal here")
  }

  const handleDragStart = (item) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, sectionId, subsectionId = null) => {
    e.preventDefault()
    if (draggedItem) {
      // Here we would update the item's section/subsection in the database
      toast.success(`Moved "${draggedItem.Name}" to ${sectionId}${subsectionId ? ` - ${subsectionId}` : ''}`)
      setDraggedItem(null)
    }
  }

  // Filter items based on search term
  const getFilteredItems = () => {
    if (!searchTerm) return items
    return items.filter(item =>
      item.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description_c?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filteredItems = getFilteredItems()
if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSystems} />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ApperIcon name="Columns3" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Systems Kanban Board
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and manage your operational systems across business areas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost">
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Item
          </Button>
        </div>
      </div>

      {/* Board Stats */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <ApperIcon name="LayoutDashboard" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Operational Systems Overview
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredItems.length} items across {kanbanSections.length} business areas
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {kanbanSections.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Business Areas</div>
          </div>
        </div>
      </Card>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search across all sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Badge variant="secondary">
            {filteredItems.length} items
          </Badge>
        </div>
      </Card>

      {/* Kanban Board */}
      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto pb-6 min-h-[600px]" style={{ scrollSnapType: 'x mandatory' }}>
          {kanbanSections.map((section) => (
            <div
              key={section.id}
              className="flex-shrink-0 w-80"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Section Header */}
              <div className={`bg-${section.color}-50 dark:bg-${section.color}-900/20 border-${section.color}-200 dark:border-${section.color}-800 border rounded-lg mb-4`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-${section.color}-100 dark:bg-${section.color}-900/40 rounded-lg`}>
                        <ApperIcon name={section.icon} className={`w-5 h-5 text-${section.color}-600 dark:text-${section.color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {section.name}
                        </h3>
                        <div className={`text-xs text-${section.color}-600 dark:text-${section.color}-400`}>
                          {section.subsections.length > 0 ? `${section.subsections.length} areas` : 'Notes & Ideas'}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ApperIcon name="MoreVertical" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div 
                className="space-y-4 min-h-[500px] p-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section.id)}
              >
                {section.subsections.length > 0 ? (
                  // Render subsections
                  section.subsections.map((subsection) => (
                    <Card 
                      key={subsection.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4"
                      style={{ borderLeftColor: `var(--${section.color}-500)` }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, section.id, subsection.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {subsection.name}
                        </h4>
                        <Badge variant="secondary" size="sm">
                          0
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Drop items here or add new ones
                      </p>
                      <div className="space-y-2">
                        {/* Placeholder for items in this subsection */}
                        <div className="text-center py-8">
                          <ApperIcon name="Plus" className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Add first item
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  // Notes section - blank cards for freeform content
                  <div className="space-y-4">
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-dashed border-yellow-300 dark:border-yellow-700">
                      <div className="text-center py-8">
                        <ApperIcon name="StickyNote" className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Add your notes here
                        </p>
                        <Button size="sm" variant="ghost">
                          <ApperIcon name="Edit3" className="w-4 h-4 mr-2" />
                          Add Note
                        </Button>
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-dashed border-yellow-300 dark:border-yellow-700">
                      <div className="text-center py-6">
                        <ApperIcon name="Plus" className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">
                          New note card
                        </p>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Show filtered items for this section if any */}
                {filteredItems.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Available Items
                    </div>
                    {filteredItems.slice(0, 2).map((item) => (
                      <div
                        key={item.Id}
                        draggable
                        onDragStart={() => handleDragStart(item)}
                        className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {item.Name}
                          </h5>
                          <Badge variant={item.status_c === "active" ? "success" : "default"} size="sm">
                            {item.status_c}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {item.description_c}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="GripVertical" className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">Drag to move</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)}>
                              <ApperIcon name="Edit2" className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.Id)}>
                              <ApperIcon name="Trash2" className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
          <Button size="sm" variant="ghost" className="bg-white/80 dark:bg-gray-800/80 shadow-md">
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
          <Button size="sm" variant="ghost" className="bg-white/80 dark:bg-gray-800/80 shadow-md">
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ToolboxSystems