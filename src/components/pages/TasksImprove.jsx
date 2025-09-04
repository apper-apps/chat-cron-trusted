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

const TasksImprove = () => {
const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const loadImproveTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await tasksService.getByCategory("improve")
      setTasks(data)
    } catch (err) {
      setError(err.message || "Failed to load improve tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImproveTasks()
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
  if (error) return <Error message={error} onRetry={loadImproveTasks} />

  const activeTasks = tasks.filter(task => task.status !== "completed")
  const completedTasks = tasks.filter(task => task.status === "completed")
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Improvement Tasks
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Strategic initiatives to enhance operations and drive efficiency gains
          </p>
        </div>
<Button onClick={() => setIsTaskModalOpen(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Improvement Task
        </Button>
<TaskFormModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false)
            setEditingTask(null)
          }}
          initialCategory="improve"
          editingTask={editingTask}
          onTaskCreated={() => {
            // Refresh improvement tasks after creation or update
            loadImproveTasks()
            setEditingTask(null)
          }}
        />
      </div>

      {/* Progress Banner */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <ApperIcon name="Target" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Improvement Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {completionRate}% of improvement initiatives completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedTasks.length}/{tasks.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {tasks.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Initiatives
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                In Progress
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <ApperIcon name="Play" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
              <p className="text-2xl font-bold text-primary">
                {completionRate}%
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="BarChart3" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Improvement Focus Areas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <ApperIcon name="Target" className="w-5 h-5 mr-2 text-green-600" />
          Focus Areas for Improvement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ApperIcon name="Zap" className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Process Efficiency</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Streamline workflows</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <ApperIcon name="Users" className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Team Performance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enhance capabilities</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <ApperIcon name="LineChart" className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Quality Standards</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Raise benchmarks</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Empty
          title="No improvement tasks found"
          description="Create improvement initiatives to drive operational excellence and efficiency gains."
          icon="TrendingUp"
          action={() => toast.info("New improvement task creation would open here")}
          actionLabel="Create Improvement Task"
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

export default TasksImprove