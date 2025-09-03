import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <div className="space-x-3">
            <Button onClick={onRetry} className="inline-flex items-center">
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="inline-flex items-center"
            >
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Error