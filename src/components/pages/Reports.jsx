import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"
import tasksService from "@/services/api/tasksService"
import toolboxService from "@/services/api/toolboxService"
import metricsService from "@/services/api/metricsService"

const Reports = () => {
  const [reportData, setReportData] = useState({
    tasks: [],
    toolboxItems: [],
    metrics: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const loadReportData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [tasksData, toolboxData, metricsData] = await Promise.all([
        tasksService.getAll(),
        toolboxService.getAll(),
        metricsService.getAll()
      ])
      
      setReportData({
        tasks: tasksData,
        toolboxItems: toolboxData,
        metrics: metricsData
      })
    } catch (err) {
      setError(err.message || "Failed to load report data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadReportData} />

  const { tasks, toolboxItems, metrics } = reportData

  // Calculate report metrics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
    highPriority: tasks.filter(t => t.priority === "high").length
  }

  const toolboxStats = {
    total: toolboxItems.length,
    active: toolboxItems.filter(t => t.status === "active").length,
    inactive: toolboxItems.filter(t => t.status === "inactive").length,
    byType: {
      process: toolboxItems.filter(t => t.type === "process").length,
      system: toolboxItems.filter(t => t.type === "system").length,
      equipment: toolboxItems.filter(t => t.type === "equipment").length,
      software: toolboxItems.filter(t => t.type === "software").length,
      team: toolboxItems.filter(t => t.type === "team").length,
      idea: toolboxItems.filter(t => t.type === "idea").length,
      event: toolboxItems.filter(t => t.type === "event").length
    }
  }

  const taskCompletionRate = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0
  const systemUptime = toolboxStats.total > 0 ? Math.round((toolboxStats.active / toolboxStats.total) * 100) : 0

  const handleExportReport = (format) => {
    toast.success(`Exporting report in ${format.toUpperCase()} format...`)
  }

  const handleScheduleReport = () => {
    toast.info("Schedule report functionality would open here")
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Comprehensive operational reporting and performance insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-40"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </Select>
          <Button variant="secondary" size="sm" onClick={handleScheduleReport}>
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button size="sm" onClick={() => handleExportReport("pdf")}>
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {taskCompletionRate}%
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Task Completion Rate
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {systemUptime}%
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                System Uptime
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ApperIcon name="Activity" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {taskStats.highPriority}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                High Priority Tasks
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {toolboxStats.total}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Resources
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="Database" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Analytics */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 mr-2 text-blue-600" />
              Task Analytics
            </h3>
            <Button variant="ghost" size="sm" onClick={() => handleExportReport("csv")}>
              <ApperIcon name="ExternalLink" className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-card rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Completed</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-gray-100">{taskStats.completed}</div>
                <div className="text-sm text-gray-500">{taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-card rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-gray-100">In Progress</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-gray-100">{taskStats.inProgress}</div>
                <div className="text-sm text-gray-500">{taskStats.total > 0 ? Math.round((taskStats.inProgress / taskStats.total) * 100) : 0}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-card rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Pending</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-gray-100">{taskStats.pending}</div>
                <div className="text-sm text-gray-500">{taskStats.total > 0 ? Math.round((taskStats.pending / taskStats.total) * 100) : 0}%</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Resource Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <ApperIcon name="PieChart" className="w-5 h-5 mr-2 text-purple-600" />
              Resource Distribution
            </h3>
            <Button variant="ghost" size="sm" onClick={() => handleExportReport("xlsx")}>
              <ApperIcon name="ExternalLink" className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {Object.entries(toolboxStats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-card rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={
                      type === "process" ? "GitBranch" :
                      type === "system" ? "Server" :
                      type === "equipment" ? "Wrench" :
                      type === "software" ? "Code" :
                      type === "team" ? "Users" :
                      type === "idea" ? "Lightbulb" :
                      type === "event" ? "Calendar" : "Circle"
                    } 
                    className="w-4 h-4 text-primary" 
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {type}
                  </span>
                </div>
                <div className="font-bold text-gray-900 dark:text-gray-100">{count}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Metrics Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-green-600" />
            System Metrics
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => toast.info("Filter options would open here")}>
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleExportReport("json")}>
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {metrics.length === 0 ? (
          <Empty
            title="No metrics data available"
            description="System metrics will appear here once data collection begins."
            icon="BarChart3"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Metric
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Trend
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.Id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {metric.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {metric.value}
                        {metric.unit && <span className="text-gray-500 ml-1">{metric.unit}</span>}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`flex items-center ${
                        metric.trend === "up" ? "text-green-600 dark:text-green-400" :
                        metric.trend === "down" ? "text-red-600 dark:text-red-400" :
                        "text-gray-500 dark:text-gray-400"
                      }`}>
                        <ApperIcon 
                          name={
                            metric.trend === "up" ? "TrendingUp" :
                            metric.trend === "down" ? "TrendingDown" :
                            "Minus"
                          } 
                          className="w-4 h-4 mr-1" 
                        />
                        <span className="capitalize">{metric.trend}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                      {new Date(metric.lastUpdated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Report Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Report Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => handleExportReport("pdf")}>
            <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
            Generate PDF Report
          </Button>
          <Button variant="secondary" onClick={() => handleExportReport("xlsx")}>
            <ApperIcon name="FileSpreadsheet" className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button variant="ghost" onClick={handleScheduleReport}>
            <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
            Schedule Automated Reports
          </Button>
          <Button variant="ghost" onClick={() => toast.info("Email sharing would open here")}>
            <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
            Email Report
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Reports