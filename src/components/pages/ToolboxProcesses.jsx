import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import ToolboxItemCard from "@/components/molecules/ToolboxItemCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"
import toolboxService from "@/services/api/toolboxService"

const ToolboxProcesses = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadProcesses = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await toolboxService.getByType("process")
      setItems(data)
      setFilteredItems(data)
    } catch (err) {
      setError(err.message || "Failed to load processes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProcesses()
  }, [])

  useEffect(() => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    setFilteredItems(filtered)
  }, [items, searchTerm, statusFilter])

  const handleToggleStatus = async (id) => {
    try {
      const updatedItem = await toolboxService.toggleStatus(id)
      setItems(prev => prev.map(item => item.Id === id ? updatedItem : item))
      toast.success("Process status updated successfully")
    } catch (err) {
      toast.error(err.message || "Failed to update process status")
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this process?")) return

    try {
      await toolboxService.delete(id)
      setItems(prev => prev.filter(item => item.Id !== id))
      toast.success("Process deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete process")
    }
  }

  const handleEditItem = (item) => {
    toast.info("Edit functionality would open a modal here")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProcesses} />

  const activeItems = items.filter(item => item.status === "active")
  const inactiveItems = items.filter(item => item.status === "inactive")

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="GitBranch" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Processes
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your operational processes and procedures
          </p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Process
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
                Total Processes
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="GitBranch" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
              <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                {inactiveItems.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Inactive
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ApperIcon name="Pause" className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Process Management Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-500 rounded-lg">
            <ApperIcon name="Workflow" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Process Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Document, standardize, and optimize your operational processes to ensure consistency 
              and efficiency across your organization.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1 text-green-500" />
                Standard Operating Procedures
              </span>
              <span className="flex items-center">
                <ApperIcon name="GitBranch" className="w-4 h-4 mr-1 text-blue-500" />
                Workflow Documentation
              </span>
              <span className="flex items-center">
                <ApperIcon name="Target" className="w-4 h-4 mr-1 text-purple-500" />
                Process Optimization
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search processes..."
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
            Showing {filteredItems.length} of {items.length} processes
          </div>
        </div>
      </Card>

      {/* Processes Grid */}
      {filteredItems.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No processes found" : "No processes yet"}
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your filters to see more processes." 
            : "Create your first process to start documenting your operational procedures."
          }
          icon="GitBranch"
          action={() => toast.info("New process creation would open here")}
          actionLabel="Create First Process"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ToolboxItemCard
              key={item.Id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ToolboxProcesses