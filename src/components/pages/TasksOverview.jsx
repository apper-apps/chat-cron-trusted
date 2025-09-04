import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import TaskFormModal from "@/components/molecules/TaskFormModal"
import TaskItem from "@/components/molecules/TaskItem"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"
import tasksService from "@/services/api/tasksService"

const TasksOverview = () => {
const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await tasksService.getAll()
      setTasks(data)
      setFilteredTasks(data)
    } catch (err) {
      setError(err.message || "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter])

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
  if (error) return <Error message={error} onRetry={loadTasks} />

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.status === "completed").length
    const inProgress = tasks.filter(task => task.status === "in-progress").length
    const pending = tasks.filter(task => task.status === "pending").length
    
    return { total, completed, inProgress, pending }
  }

  const stats = getTaskStats()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Tasks Overview
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all your operational tasks in one place
          </p>
        </div>
<Button onClick={() => setIsTaskModalOpen(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Task
        </Button>
        
<TaskFormModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false)
            setEditingTask(null)
          }}
          editingTask={editingTask}
          onTaskCreated={() => {
            // Refresh tasks after creation or update
            loadTasks()
            setEditingTask(null)
          }}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.total}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.completed}
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
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.inProgress}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                In Progress
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
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {stats.pending}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ApperIcon name="Pause" className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search tasks..."
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
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="sm:w-48"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ApperIcon name="SlidersHorizontal" className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description={searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
            ? "Try adjusting your filters to see more tasks." 
            : "Create your first task to get started with operations management."
          }
          icon="CheckSquare"
          action={() => toast.info("New task creation would open here")}
          actionLabel="Create First Task"
        />
      ) : (
        <div className="grid gap-6">
          {filteredTasks.map((task) => (
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

export default TasksOverview