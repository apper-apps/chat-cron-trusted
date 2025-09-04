import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import ApperIcon from "@/components/ApperIcon"
import MetricCard from "@/components/molecules/MetricCard"
import ActivityItem from "@/components/molecules/ActivityItem"
import TaskFormModal from "@/components/molecules/TaskFormModal"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import metricsService from "@/services/api/metricsService"
import activitiesService from "@/services/api/activitiesService"
import tasksService from "@/services/api/tasksService"

const Dashboard = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [metrics, setMetrics] = useState([])
  const [activities, setActivities] = useState([])
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [metricsData, activitiesData, tasksData] = await Promise.all([
        metricsService.getAll(),
        activitiesService.getRecent(6),
        tasksService.getAll()
      ])
      
      setMetrics(metricsData)
      setActivities(activitiesData)
      setRecentTasks(tasksData.slice(0, 5))
    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

const getMetricIcon = (name) => {
    if (!name || typeof name !== 'string') {
      return "Activity"
    }
    switch (name.toLowerCase()) {
      case "active tasks": return "CheckSquare"
      case "completion rate": return "TrendingUp"
      case "system uptime": return "Server"
      case "team members": return "Users"
      default: return "Activity"
    }
  }

  const getTaskStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-600 dark:text-green-400"
      case "in-progress": return "text-yellow-600 dark:text-yellow-400"
      case "pending": return "text-gray-500 dark:text-gray-400"
      default: return "text-gray-500"
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to your operations control center
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export Data
          </Button>
<Button size="sm" onClick={() => setIsTaskModalOpen(true)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.Id}
            title={metric.name}
            value={metric.value}
            unit={metric.unit}
            trend={metric.trend}
            icon={getMetricIcon(metric.name)}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm">
                <ApperIcon name="ExternalLink" className="w-4 h-4" />
              </Button>
            </div>
            
            {activities.length === 0 ? (
              <Empty
                title="No recent activity"
                description="Activity will appear here as your team works on tasks and updates."
                icon="Activity"
              />
            ) : (
              <div className="space-y-1">
                {activities.map((activity) => (
                  <ActivityItem key={activity.Id} activity={activity} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Stats & Tasks */}
        <div className="space-y-6">
          {/* Task Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Task Overview
              </h2>
              <Button variant="ghost" size="sm">
                <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
              </Button>
            </div>
            
            {recentTasks.length === 0 ? (
              <Empty
                title="No tasks yet"
                description="Create your first task to get started."
                icon="CheckSquare"
              />
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task.Id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-card rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.assignee}
                      </p>
                    </div>
                    <div className={`text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                      {task.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
<Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setIsTaskModalOpen(true)}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-3" />
                Create New Task
              </Button>
              
              <TaskFormModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={() => {
                  // Refresh dashboard data after task creation
                  loadDashboardData()
                }}
              />
              <Button variant="ghost" className="w-full justify-start">
                <ApperIcon name="FileText" className="w-4 h-4 mr-3" />
                Generate Report
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ApperIcon name="Settings" className="w-4 h-4 mr-3" />
                System Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ApperIcon name="Users" className="w-4 h-4 mr-3" />
                Team Management
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard