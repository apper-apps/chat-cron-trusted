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

const ToolboxSoftware = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadSoftware = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await toolboxService.getByType("software")
      setItems(data)
      setFilteredItems(data)
    } catch (err) {
      setError(err.message || "Failed to load software")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSoftware()
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
      toast.success("Software status updated successfully")
    } catch (err) {
      toast.error(err.message || "Failed to update software status")
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this software?")) return

    try {
      await toolboxService.delete(id)
      setItems(prev => prev.filter(item => item.Id !== id))
      toast.success("Software deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete software")
    }
  }

  const handleEditItem = (item) => {
    toast.info("Edit functionality would open a modal here")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSoftware} />

  const activeItems = items.filter(item => item.status === "active")
  const inactiveItems = items.filter(item => item.status === "inactive")

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <ApperIcon name="Code" className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Software
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your business software applications and licenses
          </p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Software
        </Button>
      </div>

      {/* Software License Overview */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500 rounded-lg">
              <ApperIcon name="Key" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Software License Status
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeItems.length} active licenses out of {items.length} total software
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {items.length > 0 ? Math.round((activeItems.length / items.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {items.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Software
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Code" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                Active Licenses
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
                Inactive/Expired
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Software Categories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <ApperIcon name="Package" className="w-5 h-5 mr-2 text-indigo-600" />
          Software Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ApperIcon name="BarChart3" className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Business Intelligence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Analytics & reporting</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <ApperIcon name="Building" className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">ERP Systems</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise resource planning</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <ApperIcon name="Users" className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Collaboration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Communication tools</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <ApperIcon name="Shield" className="w-8 h-8 text-orange-600 dark:text-orange-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Protection & monitoring</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search software..."
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
            Showing {filteredItems.length} of {items.length} software applications
          </div>
        </div>
      </Card>

      {/* Software Grid */}
      {filteredItems.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No software found" : "No software yet"}
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your filters to see more software." 
            : "Add your first software application to start tracking your business tools."
          }
          icon="Code"
          action={() => toast.info("New software creation would open here")}
          actionLabel="Add First Software"
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

export default ToolboxSoftware