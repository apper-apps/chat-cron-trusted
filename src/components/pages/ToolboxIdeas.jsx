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

const ToolboxIdeas = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadIdeas = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await toolboxService.getByType("idea")
      setItems(data)
      setFilteredItems(data)
    } catch (err) {
      setError(err.message || "Failed to load ideas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIdeas()
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
      toast.success("Idea status updated successfully")
    } catch (err) {
      toast.error(err.message || "Failed to update idea status")
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return

    try {
      await toolboxService.delete(id)
      setItems(prev => prev.filter(item => item.Id !== id))
      toast.success("Idea deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete idea")
    }
  }

  const handleEditItem = (item) => {
    toast.info("Edit functionality would open a modal here")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadIdeas} />

  const activeIdeas = items.filter(item => item.status === "active")
  const implementedIdeas = items.filter(item => item.status === "active")
  const pendingIdeas = items.filter(item => item.status === "inactive")

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <ApperIcon name="Lightbulb" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Ideas
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Capture, evaluate, and implement innovative ideas to improve operations
          </p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Idea
        </Button>
      </div>

      {/* Innovation Pipeline */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Innovation Pipeline
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeIdeas.length} ideas in development, {pendingIdeas.length} awaiting review
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {items.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Ideas</div>
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
                Total Ideas
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Lightbulb" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {implementedIdeas.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Implemented
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
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {pendingIdeas.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Under Review
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ApperIcon name="Clock" className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Innovation Focus Areas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <ApperIcon name="Target" className="w-5 h-5 mr-2 text-yellow-600" />
          Innovation Focus Areas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ApperIcon name="Zap" className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Efficiency</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Process improvements</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <ApperIcon name="DollarSign" className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Cost Reduction</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resource optimization</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <ApperIcon name="Sparkles" className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Innovation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">New technologies</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ApperIcon name="Shield" className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Safety</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Risk mitigation</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search ideas..."
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
            <option value="active">Implemented</option>
            <option value="inactive">Under Review</option>
          </Select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredItems.length} of {items.length} ideas
          </div>
        </div>
      </Card>

      {/* Ideas Grid */}
      {filteredItems.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No ideas found" : "No ideas yet"}
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your filters to see more ideas." 
            : "Submit your first innovative idea to start improving operations."
          }
          icon="Lightbulb"
          action={() => toast.info("New idea submission would open here")}
          actionLabel="Submit First Idea"
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

export default ToolboxIdeas