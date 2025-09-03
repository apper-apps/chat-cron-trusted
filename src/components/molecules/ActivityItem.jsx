import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const ActivityItem = ({ activity }) => {
  const getActionIcon = (type) => {
    switch (type) {
      case "task_created": return "Plus"
      case "task_completed": return "CheckCircle"
      case "task_updated": return "Edit"
      case "item_added": return "PlusSquare"
      case "item_updated": return "Settings"
      case "system_alert": return "AlertTriangle"
      default: return "Activity"
    }
  }

  const getActionColor = (type) => {
    switch (type) {
      case "task_completed": return "text-green-600 dark:text-green-400"
      case "system_alert": return "text-yellow-600 dark:text-yellow-400"
      case "task_created":
      case "item_added": return "text-blue-600 dark:text-blue-400"
      default: return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${getActionColor(activity.type)}`}>
        <ApperIcon name={getActionIcon(activity.type)} className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {activity.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  )
}

export default ActivityItem