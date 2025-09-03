import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import TaskItem from "@/components/molecules/TaskItem"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"
import tasksService from "@/services/api/tasksService"

const TasksReact = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadReactTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await tasksService.getByCategory("react")
      setTasks(data)
    } catch (err) {
      setError(err.message || "Failed to load react tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReactTasks()
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
    toast.info("Edit functionality would open a modal here")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadReactTasks} />

  const urgentTasks = tasks.filter(task => task.priority === "high" && task.status !== "completed")
  const completedTasks = tasks.filter(task => task.status === "completed")

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ApperIcon name="Zap" className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              React Tasks
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Urgent response tasks requiring immediate attention
          </p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New React Task
        </Button>
      </div>

      {/* Alert Banner for Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <Card className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {urgentTasks.length} urgent task{urgentTasks.length !== 1 ? "s" : ""} requiring immediate attention
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                High priority react tasks should be addressed as soon as possible.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {tasks.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total React Tasks
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Zap" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {urgentTasks.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Urgent Tasks
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 dark:text-red-400" />
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
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Empty
          title="No react tasks found"
          description="React tasks for urgent operational responses will appear here."
          icon="Zap"
          action={() => toast.info("New react task creation would open here")}
          actionLabel="Create React Task"
        />
      ) : (
        <div className="space-y-6">
          {/* Urgent Tasks Section */}
          {urgentTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 mr-2" />
                Urgent Tasks ({urgentTasks.length})
              </h2>
              <div className="grid gap-6">
                {urgentTasks.map((task) => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Tasks Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <ApperIcon name="List" className="w-5 h-5 mr-2" />
              All React Tasks ({tasks.length})
            </h2>
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
          </div>
        </div>
      )}
    </div>
  )
}

export default TasksReact