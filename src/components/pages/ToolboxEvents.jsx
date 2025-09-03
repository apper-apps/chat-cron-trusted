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

const ToolboxEvents = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await toolboxService.getByType("event")
      setItems(data)
      setFilteredItems(data)
    } catch (err) {
      setError(err.message || "Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
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
      toast.success("Event status updated successfully")
    } catch (err) {
      toast.error(err.message || "Failed to update event status")
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return

    try {
      await toolboxService.delete(id)
      setItems(prev => prev.filter(item => item.Id !== id))
      toast.success("Event deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete event")
    }
  }

  const handleEditItem = (item) => {
    toast.info("Edit functionality would open a modal here")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadEvents} />

  const upcomingEvents = items.filter(item => item.status === "active")
  const pastEvents = items.filter(item => item.status === "inactive")
  const totalAttendees = items.reduce((sum, item) => sum + (item.metadata?.attendees || 0), 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ApperIcon name="Calendar" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Key Events
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Plan and track important operational events and milestones
          </p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Event Planning Overview */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <ApperIcon name="CalendarDays" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Event Planning Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {upcomingEvents.length} upcoming events with {totalAttendees} expected attendees
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalAttendees}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Attendees</div>
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
                Total Events
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {upcomingEvents.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Upcoming
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ApperIcon name="Clock" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                {pastEvents.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Event Categories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <ApperIcon name="Tag" className="w-5 h-5 mr-2 text-purple-600" />
          Event Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ApperIcon name="GraduationCap" className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Training</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Skills development</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <ApperIcon name="Shield" className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Safety</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Safety reviews</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <ApperIcon name="Wrench" className="w-8 h-8 text-orange-600 dark:text-orange-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Maintenance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled maintenance</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <ApperIcon name="Users" className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Team Building</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Staff engagement</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search events..."
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
            <option value="all">All Events</option>
            <option value="active">Upcoming</option>
            <option value="inactive">Completed</option>
          </Select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredItems.length} of {items.length} events
          </div>
        </div>
      </Card>

      {/* Events Grid */}
      {filteredItems.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No events found" : "No events yet"}
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your filters to see more events." 
            : "Schedule your first key event to start planning operational activities."
          }
          icon="Calendar"
          action={() => toast.info("New event creation would open here")}
          actionLabel="Schedule First Event"
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

export default ToolboxEvents