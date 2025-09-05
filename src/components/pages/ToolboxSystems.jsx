import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import toolboxService from "@/services/api/toolboxService";
import ApperIcon from "@/components/ApperIcon";
import ToolboxItemCard from "@/components/molecules/ToolboxItemCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const ToolboxSystems = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverSection, setDragOverSection] = useState(null)

  // Kanban sections
  const sections = [
    { id: 'market', name: 'Market', color: 'bg-blue-100 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-800', icon: 'Target' },
    { id: 'sell', name: 'Sell', color: 'bg-green-100 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-800', icon: 'DollarSign' },
    { id: 'customer', name: 'Customer', color: 'bg-purple-100 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-800', icon: 'Users' },
    { id: 'product', name: 'Product', color: 'bg-orange-100 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800', icon: 'Package' },
    { id: 'team', name: 'Team', color: 'bg-pink-100 dark:bg-pink-900/20', borderColor: 'border-pink-200 dark:border-pink-800', icon: 'Users2' },
    { id: 'structure', name: 'Structure', color: 'bg-indigo-100 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-800', icon: 'Building' },
    { id: 'support', name: 'Support', color: 'bg-yellow-100 dark:bg-yellow-900/20', borderColor: 'border-yellow-200 dark:border-yellow-800', icon: 'HelpCircle' }
  ]

  const loadSystems = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await toolboxService.getByType("system")
      setItems(data)
      setFilteredItems(data)
    } catch (err) {
      setError(err.message || "Failed to load systems")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSystems()
  }, [])

  useEffect(() => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description_c.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status_c === statusFilter)
    }

    setFilteredItems(filtered)
  }, [items, searchTerm, statusFilter])

  const getItemSection = (item) => {
    try {
      const metadata = item.metadata_c ? JSON.parse(item.metadata_c) : {}
      return metadata.section || 'market'
    } catch {
      return 'market'
    }
  }

  const getItemsBySection = (sectionId) => {
    return filteredItems.filter(item => getItemSection(item) === sectionId)
  }

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
    if (!window.confirm("Are you sure you want to delete this system?")) return

    try {
      await toolboxService.delete(id)
      setItems(prev => prev.filter(item => item.Id !== id))
      toast.success("System deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete system")
    }
  }

  const handleEditItem = (item) => {
    toast.info("Edit functionality would open a modal here")
  }

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, sectionId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverSection(sectionId)
  }

  const handleDragLeave = () => {
    setDragOverSection(null)
  }

  const handleDrop = async (e, sectionId) => {
    e.preventDefault()
    setDragOverSection(null)
    
    if (!draggedItem) return

    try {
      const currentMetadata = draggedItem.metadata_c ? JSON.parse(draggedItem.metadata_c) : {}
      const updatedMetadata = { ...currentMetadata, section: sectionId }
      
      const updatedItem = await toolboxService.update(draggedItem.Id, {
        metadata_c: JSON.stringify(updatedMetadata)
      })
      
      setItems(prev => prev.map(item => 
        item.Id === draggedItem.Id 
          ? { ...item, metadata_c: JSON.stringify(updatedMetadata) }
          : item
      ))
      
      toast.success(`Moved to ${sections.find(s => s.id === sectionId)?.name}`)
    } catch (err) {
      toast.error("Failed to move item")
    } finally {
      setDraggedItem(null)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSystems} />

  const activeItems = items.filter(item => item.status_c === "active")
  const inactiveItems = items.filter(item => item.status_c === "inactive")

return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ApperIcon name="Columns" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Systems Kanban Board
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and manage your systems across business functions
          </p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New System
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {items.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Systems
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Server" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {activeItems.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {inactiveItems.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Inactive
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredItems.length} of {items.length} systems
          </div>
        </div>
      </Card>

      {/* Kanban Board */}
      {filteredItems.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No systems found" : "No systems yet"}
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your filters to see more systems." 
            : "Add your first system to start organizing by business function."
          }
          icon="Columns"
          action={() => toast.info("New system creation would open here")}
          actionLabel="Add First System"
        />
      ) : (
        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-6" style={{ minWidth: '1400px' }}>
            {sections.map((section) => {
              const sectionItems = getItemsBySection(section.id)
              return (
                <div
                  key={section.id}
                  className={`flex-1 min-w-80 ${section.color} rounded-lg border-2 ${
                    dragOverSection === section.id 
                      ? 'border-primary border-dashed' 
                      : section.borderColor
                  } transition-colors duration-200`}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section.id)}
                >
                  {/* Section Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          <ApperIcon name={section.icon} className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {section.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {sectionItems.length} item{sectionItems.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-4 space-y-4 min-h-96">
                    {sectionItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <ApperIcon name={section.icon} className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No systems in {section.name}</p>
                        <p className="text-xs mt-1">Drag items here to organize</p>
                      </div>
                    ) : (
                      sectionItems.map((item) => (
                        <div key={item.Id}>
                          <ToolboxItemCard
                            item={item}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                            onToggleStatus={handleToggleStatus}
                            onDragStart={handleDragStart}
                            isDragging={draggedItem?.Id === item.Id}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
export default ToolboxSystems