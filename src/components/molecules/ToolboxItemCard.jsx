import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const ToolboxItemCard = ({ item, onEdit, onDelete, onToggleStatus, isDragging = false, onDragStart }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "process": return "GitBranch"
      case "system": return "Server"
      case "equipment": return "Wrench"
      case "software": return "Code"
      case "team": return "Users"
      case "idea": return "Lightbulb"
      case "event": return "Calendar"
      default: return "Circle"
    }
  }

  return (
<Card 
      className={`p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, item)}
    >
<div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ApperIcon name={getTypeIcon(item.type_c)} className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {item.Name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {item.type_c}
            </p>
            {item.kanban_subsection_c && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {item.kanban_subsection_c.Name || item.kanban_subsection_c}
              </p>
            )}
          </div>
        </div>
        
        <Badge variant={item.status_c === "active" ? "success" : "default"} size="sm">
          {item.status_c}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {item.description_c}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
          Updated {format(new Date(item.last_updated_c), "MMM dd, yyyy")}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleStatus(item.Id)}
          >
            <ApperIcon name={item.status_c === "active" ? "Pause" : "Play"} className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(item)}
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(item.Id)}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ToolboxItemCard