import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import TaskFormModal from "@/components/molecules/TaskFormModal"
import TaskItem from "@/components/molecules/TaskItem"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"
import tasksService from "@/services/api/tasksService"

const TasksMaintain = () => {
const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const loadMaintainTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await tasksService.getByCategory("maintain")
      setTasks(data)
    } catch (err) {
      setError(err.message || "Failed to load maintain tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMaintainTasks()
  }, [])

  const handleToggleStatus = async (id) => {
    try {
      const updatedTask = await tasksService.toggleStatus(id)
      setTasks(prev => prev.map(task => task.Id === id ? updatedTask : task))
      toast.success("Task status updated successfully")
    } catch (err) {
      toast.error(err.message || "Failed to update task status")
    }
  }

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    try {
      await tasksService.delete(id)
      setTasks(prev => prev.filter(task => task.Id !== id))
      toast.success("Task deleted successfully")
    } catch (err) {
      toast.error(err.message || "Failed to delete task")
    }
  }

const handleEditTask = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadMaintainTasks} />

  const activeTasks = tasks.filter(task => task.status !== "completed")
  const completedTasks = tasks.filter(task => task.status === "completed")
  const overdueTasksCount = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== "completed"
  ).length

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Settings" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Maintenance Tasks
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Regular maintenance and upkeep activities to ensure smooth operations
          </p>
        </div>
<Button onClick={() => setIsTaskModalOpen(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
New Maintenance Task
        </Button>
        
        <TaskFormModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false)
            setEditingTask(null)
          }}
          initialCategory="maintain"
          editingTask={editingTask}
          onTaskCreated={() => {
            // Refresh maintenance tasks after creation or update
            loadMaintainTasks()
            setEditingTask(null)
            loadMaintainTasks()
          }}
        />
      </div>

      {/* Alert for Overdue Tasks */}
      {overdueTasksCount > 0 && (
        <Card className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
          <div className="flex items-center">
            <ApperIcon name="Clock" className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                {overdueTasksCount} overdue maintenance task{overdueTasksCount !== 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                These maintenance tasks are past their due date and should be prioritized.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {tasks.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Settings" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {activeTasks.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedTasks.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
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
                {overdueTasksCount}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Overdue
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ApperIcon name="AlertCircle" className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Maintenance Schedule Info */}
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Maintenance Schedule
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Keep your operations running smoothly with regular maintenance tasks. 
              These tasks ensure equipment reliability, system performance, and operational efficiency.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1 text-green-500" />
                Preventive maintenance
              </span>
              <span className="flex items-center">
                <ApperIcon name="Wrench" className="w-4 h-4 mr-1 text-blue-500" />
                Equipment servicing
              </span>
              <span className="flex items-center">
                <ApperIcon name="RefreshCw" className="w-4 h-4 mr-1 text-purple-500" />
                System updates
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Empty
          title="No maintenance tasks found"
          description="Create maintenance tasks to keep your operations running smoothly."
          icon="Settings"
          action={() => toast.info("New maintenance task creation would open here")}
          actionLabel="Create Maintenance Task"
        />
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <TaskItem
              key={task.Id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TasksMaintain