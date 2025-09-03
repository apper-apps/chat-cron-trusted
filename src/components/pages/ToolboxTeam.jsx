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

const ToolboxTeam = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadTeams = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await toolboxService.getByType("team")
      setItems(data)
      setFilteredItems(data)
    } catch (err) {
      setError(err.message || "Failed to load teams")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
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
      toast.success("Team status updated successfully")
    } catch (err) {
      toast.error(err.message || "Failed to update team status")
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return

    try {
      await toolboxService.delete(id)
      setItems(prev => prev.filter(item => item.Id !== id))
      toast.success("Team deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete team")
    }
  }

  const handleEditItem = (item) => {
    toast.info("Edit functionality would open a modal here")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTeams} />

  const activeItems = items.filter(item => item.status === "active")
  const totalMembers = items.reduce((sum, item) => sum + (item.metadata?.members || 0), 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ApperIcon name="Users" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Teams
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and manage your operational teams and workforce
          </p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Team
        </Button>
      </div>

      {/* Team Overview */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Workforce Overview
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeItems.length} active teams with {totalMembers} total members
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalMembers}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Members</div>
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
                Total Teams
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Users" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                Active Teams
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
              <p className="text-2xl font-bold text-primary">
                {totalMembers}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Team Members
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="UserCheck" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Team Structure */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <ApperIcon name="Layers" className="w-5 h-5 mr-2 text-green-600" />
          Team Structure
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ApperIcon name="Settings" className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Operations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Production teams</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <ApperIcon name="Wrench" className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Maintenance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Equipment service</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <ApperIcon name="ShieldCheck" className="w-8 h-8 text-orange-600 dark:text-orange-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Quality</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inspection teams</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ApperIcon name="Headphones" className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer service</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search teams..."
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
            Showing {filteredItems.length} of {items.length} teams
          </div>
        </div>
      </Card>

      {/* Teams Grid */}
      {filteredItems.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No teams found" : "No teams yet"}
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your filters to see more teams." 
            : "Create your first team to start organizing your workforce."
          }
          icon="Users"
          action={() => toast.info("New team creation would open here")}
          actionLabel="Create First Team"
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

export default ToolboxTeam