import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ Name, value_c, unit_c, trend_c, icon, description }) => {
  const getTrendColor = () => {
    switch (trend_c) {
      case "up": return "text-green-600 dark:text-green-400"
      case "down": return "text-red-600 dark:text-red-400"
      default: return "text-gray-500 dark:text-gray-400"
    }
  }

const getTrendIcon = () => {
    switch (trend_c) {
      case "up": return "TrendingUp"
      case "down": return "TrendingDown"
      default: return "Minus"
    }
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <ApperIcon name={icon} className="w-6 h-6 text-primary" />
        </div>
        <ApperIcon 
          name={getTrendIcon()} 
          className={`w-4 h-4 ${getTrendColor()}`} 
        />
      </div>
      
      <div className="space-y-2">
<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value_c}
          {unit_c && <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">{unit_c}</span>}
        </h3>
<p className="text-sm font-medium text-gray-600 dark:text-gray-400">{Name}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
        )}
      </div>
    </Card>
  )
}

export default MetricCard