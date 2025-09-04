import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import sopUrlService from "@/services/api/sopUrlService";
import tasksService from "@/services/api/tasksService";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const TaskFormModal = ({ isOpen, onClose, onTaskCreated, initialCategory = '', editingTask = null }) => {
const [formData, setFormData] = useState({
    title_c: editingTask?.title_c || '',
    assignee_c: editingTask?.assignee_c || '',
    due_date_c: editingTask?.due_date_c ? new Date(editingTask.due_date_c).toISOString().slice(0, 16) : '',
    priority_c: editingTask?.priority_c || 'medium',
    category_c: editingTask?.category_c || initialCategory,
    task_type_c: editingTask?.task_type_c || 'One-off',
    description_c: editingTask?.description_c || '',
    related_processes: [],
    related_sops: [] // Array of {url: string, description: string}
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
const [newProcess, setNewProcess] = useState('')
  const [newSop, setNewSop] = useState('')
  const [newSopDescription, setNewSopDescription] = useState('')
  const [comment, setComment] = useState('')

  // Function to save SOP URLs to database
  const saveSopUrls = async (taskId) => {
    if (!formData.related_sops || formData.related_sops.length === 0) return;

    try {
      for (const sop of formData.related_sops) {
        if (typeof sop === 'string') {
          // Handle legacy format (just URL strings)
          await sopUrlService.create({
            Name: sop,
            url_c: sop,
            description_c: '',
            task_c: taskId
          });
        } else if (sop.url) {
          // Handle new format (URL + description objects)
          await sopUrlService.create({
            Name: sop.url,
            url_c: sop.url,
            description_c: sop.description || '',
            task_c: taskId
          });
        }
      }
      toast.success('SOP URLs saved successfully!');
    } catch (error) {
      console.error('Error saving SOP URLs:', error);
      toast.error('Failed to save SOP URLs: ' + error.message);
    }
  };

  // Update form data when editingTask changes
React.useEffect(() => {
    if (editingTask) {
      setFormData({
        title_c: editingTask.title_c || '',
        assignee_c: editingTask.assignee_c || '',
        due_date_c: editingTask.due_date_c ? new Date(editingTask.due_date_c).toISOString().slice(0, 16) : '',
        priority_c: editingTask.priority_c || 'medium',
        category_c: editingTask.category_c || initialCategory,
        task_type_c: editingTask.task_type_c || 'One-off',
        description_c: editingTask.description_c || '',
        related_processes: [],
        related_sops: [] // Will be loaded from database if needed
      })
    } else {
      setFormData({
        title_c: '',
        assignee_c: '',
        due_date_c: '',
        priority_c: 'medium',
        category_c: initialCategory,
        task_type_c: 'One-off',
        description_c: '',
        related_processes: [],
        related_sops: []
      })
    }
  }, [editingTask, initialCategory])
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title_c.trim()) {
      newErrors.title_c = 'Title is required'
    }
    
    if (!formData.assignee_c.trim()) {
      newErrors.assignee_c = 'Assignee is required'
    }
    
    if (!formData.due_date_c) {
      newErrors.due_date_c = 'Due date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleAddProcess = () => {
    if (newProcess.trim()) {
      setFormData(prev => ({
        ...prev,
        related_processes: [...prev.related_processes, newProcess.trim()]
      }))
      setNewProcess('')
    }
  }

  const handleRemoveProcess = (index) => {
    setFormData(prev => ({
      ...prev,
      related_processes: prev.related_processes.filter((_, i) => i !== index)
    }))
  }

const handleAddSop = () => {
    if (newSop.trim()) {
      const sopData = {
        url: newSop.trim(),
        description: newSopDescription.trim()
      };
      
      setFormData(prev => ({
        ...prev,
        related_sops: [...prev.related_sops, sopData]
      }))
      setNewSop('')
      setNewSopDescription('')
    }
  }

  const handleRemoveSop = (index) => {
    setFormData(prev => ({
      ...prev,
      related_sops: prev.related_sops.filter((_, i) => i !== index)
    }))
  }

const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setLoading(true)
    
    try {
      // Capture SOP URLs before any form operations to prevent timing issues
      const sopUrlsToSave = formData.related_sops && formData.related_sops.length > 0 ? [...formData.related_sops] : [];
      
      // Format due date for API
const taskData = {
        ...formData,
        due_date_c: new Date(formData.due_date_c).toISOString(),
        ...(editingTask ? {} : { status_c: 'pending' })
      }

      // Remove SOP URLs from task data as they'll be saved separately
      delete taskData.related_sops;
      delete taskData.related_processes;
      
let result
      let newTask
      
      if (editingTask) {
        result = await tasksService.update(editingTask.Id, taskData)
        newTask = { ...editingTask, ...taskData }
        toast.success('Task updated successfully!')
      } else {
        result = await tasksService.create(taskData)
        newTask = result?.data || { ...taskData, Id: result?.id }
        toast.success('Task created successfully!')
      }
      
      // Save SOP URLs to database for both create and update operations
      if (sopUrlsToSave.length > 0) {
        const taskId = newTask.Id || result?.id || editingTask?.Id;
        if (taskId) {
          await saveSopUrls(taskId);
        }
      }
      
      // Reset form only if creating (not editing)
      if (!editingTask) {
setFormData({
          title_c: '',
          assignee_c: '',
          due_date_c: '',
          priority_c: 'medium',
          category_c: initialCategory,
          task_type_c: 'One-off',
          description_c: '',
          related_processes: [],
          related_sops: []
        })
      }
      setComment('')
      setErrors({})
      
      // Notify parent component
      if (onTaskCreated) {
        onTaskCreated(newTask)
      }
      
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error(error.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div
        className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div
            className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" className="w-5 h-5" />
            </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Section 1: Task Data */}
            <div>
                <h3
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <ApperIcon name="CheckSquare" className="w-5 h-5 mr-2 text-primary" />Task Data
                                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Title *"
                        value={formData.title_c}
                        onChange={e => handleInputChange("title_c", e.target.value)}
                        error={errors.title_c}
                        placeholder="Enter task title" />
                    <Input
                        label="Assignee *"
                        value={formData.assignee_c}
                        onChange={e => handleInputChange("assignee_c", e.target.value)}
                        error={errors.assignee_c}
                        placeholder="Enter assignee name" />
                    <Input
                        type="date"
                        label="Due Date *"
                        value={formData.due_date_c}
                        onChange={e => handleInputChange("due_date_c", e.target.value)}
                        error={errors.due_date_c} />
                    <Select
                        label="Priority"
                        value={formData.priority_c}
                        onChange={e => handleInputChange("priority_c", e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </Select>
                    <Select
                        label="Category"
                        value={formData.category_c}
                        onChange={e => handleInputChange("category_c", e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="react">React</option>
                        <option value="maintain">Maintain</option>
                        <option value="improve">Improve</option>
                    </Select>
                    <Select
                        label="Task Type"
                        value={formData.task_type_c}
                        onChange={e => handleInputChange("task_type_c", e.target.value)}>
                        <option value="One-off">One-off</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Repeated">Repeated</option>
                    </Select>
                </div>
            </div>
            {/* Section 2: Task Information */}
            <div>
                <h3
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-primary" />Task Information
                                </h3>
                <div className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description
                                            </label>
                        <textarea
                            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-gray-600 dark:bg-dark-card dark:text-gray-100 resize-none"
                            value={formData.description_c}
                            onChange={e => handleInputChange("description_c", e.target.value)}
                            placeholder="Enter task description" />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Related Processes
                                            </label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={newProcess}
                                onChange={e => setNewProcess(e.target.value)}
                                placeholder="Add a process"
                                className="flex-1" />
                            <Button type="button" size="sm" onClick={handleAddProcess}>
                                <ApperIcon name="Plus" className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.related_processes.map((process, index) => <div
                                key={index}
                                className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                                <span>{process}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProcess(index)}
                                    className="ml-2 text-gray-500 hover:text-red-500">
                                    <ApperIcon name="X" className="w-3 h-3" />
                                </button>
                            </div>)}
                        </div>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Related SOP URLs
                                            </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                            <Input
                                type="url"
                                value={newSop}
                                onChange={e => setNewSop(e.target.value)}
                                placeholder="Enter SOP URL"
                                className="md:col-span-2" />
                            <Input
                                value={newSopDescription}
                                onChange={e => setNewSopDescription(e.target.value)}
                                placeholder="Description (optional)" />
                        </div>
                        <div className="flex justify-end mb-2">
                            <Button type="button" size="sm" onClick={handleAddSop} disabled={!newSop.trim()}>
                                <ApperIcon name="Plus" className="w-4 h-4 mr-1" />Add SOP URL
                                                  </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.related_sops.map((sop, index) => {
                                const url = typeof sop === "string" ? sop : sop.url;
                                const description = typeof sop === "string" ? "" : sop.description;

                                return (
                                    <div
                                        key={index}
                                        className="flex items-start justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline block truncate text-sm font-medium">
                                                {url}
                                            </a>
                                            {description && <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                                {description}
                                            </p>}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSop(index)}
                                            className="ml-2 text-gray-500 hover:text-red-500 flex-shrink-0">
                                            <ApperIcon name="Trash2" className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* Section 3: Comments and Updates */}
                <div>
                    <h3
                        className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <ApperIcon name="MessageSquare" className="w-5 h-5 mr-2 text-primary" />Comments and Updates
                                    </h3>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Comment
                                          </label>
                        <textarea
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-gray-600 dark:bg-dark-card dark:text-gray-100 resize-none"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Add an initial comment (optional)" />
                    </div>
                </div>
                {/* Form Actions */}
                <div
                    className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel
                                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? <>
                            <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                            {editingTask ? "Updating..." : "Creating..."}
                        </> : <>
                            <ApperIcon name={editingTask ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                            {editingTask ? "Update Task" : "Create Task"}
                        </>}
                    </Button>
                </div>
            </div></form>
    </div>
</div>
  )
}

export default TaskFormModal