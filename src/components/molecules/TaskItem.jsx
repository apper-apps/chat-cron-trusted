import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "danger"
      case "medium": return "warning"
      case "low": return "success"
      default: return "default"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success"
      case "in-progress": return "warning"
      case "pending": return "default"
      default: return "default"
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "react": return "Zap"
      case "maintain": return "Settings"
      case "improve": return "TrendingUp"
      default: return "Circle"
    }
  }

  return (
    <div
    className="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
<div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name={getCategoryIcon(task.category_c)} className="w-4 h-4 text-primary" />
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {task.title_c}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to {task.assignee_c}
                </p></div>
        </div>
        <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(task.priority_c)} size="sm">
                {task.priority_c}
            </Badge>
            <Badge variant={getStatusColor(task.status_c)} size="sm">
                {task.status_c}
            </Badge>
        </div>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {task.description_c}
    </p>
    <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />Due: {format(new Date(task.due_date_c), "MMM dd, yyyy")}
        </div>
        <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={() => onToggleStatus(task.Id)}>
                <ApperIcon
                    name={task.status_c === "completed" ? "RotateCcw" : "Check"}
                    className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>
                <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.Id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400">
                <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
        </div>
    </div>
</div>
  )
}

export default TaskItem