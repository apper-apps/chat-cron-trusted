class TasksService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'task_c'
  }

  async getAll() {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "task_type_c" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (!response.data || response.data.length === 0) {
        return []
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching tasks:", error)
        throw error
      }
    }
  }

  async getById(id) {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "task_type_c" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (!response.data) {
        throw new Error("Task not found")
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching task with ID ${id}:`, error)
        throw error
      }
    }
  }

  async getByCategory(category) {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "task_type_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by category:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching tasks by category:", error)
        throw error
      }
    }
  }

async create(data) {
    try {
      const params = {
        records: [
          {
            // Only include Updateable fields
            Name: data.Name || data.title_c || '',
            Tags: data.Tags || '',
            title_c: data.title_c || data.title || '',
            category_c: data.category_c || data.category || '',
            status_c: data.status_c || data.status || 'pending',
            priority_c: data.priority_c || data.priority || 'medium',
            due_date_c: data.due_date_c || data.dueDate || new Date().toISOString(),
            description_c: data.description_c || data.description || '',
            assignee_c: data.assignee_c || data.assignee || '',
            task_type_c: data.task_type_c || data.taskType || 'One-off'
          }
        ]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        return successfulRecords[0]?.data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error creating task:", error)
        throw error
      }
    }
  }

  async update(id, data) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
// Only include Updateable fields that are being updated
            ...(data.Name !== undefined && { Name: data.Name }),
            ...(data.Tags !== undefined && { Tags: data.Tags }),
            ...(data.title_c !== undefined && { title_c: data.title_c }),
            ...(data.category_c !== undefined && { category_c: data.category_c }),
            ...(data.status_c !== undefined && { status_c: data.status_c }),
            ...(data.priority_c !== undefined && { priority_c: data.priority_c }),
            ...(data.due_date_c !== undefined && { due_date_c: data.due_date_c }),
            ...(data.description_c !== undefined && { description_c: data.description_c }),
            ...(data.assignee_c !== undefined && { assignee_c: data.assignee_c }),
            ...(data.task_type_c !== undefined && { task_type_c: data.task_type_c })
          }
        ]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        return successfulUpdates[0]?.data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error updating task:", error)
        throw error
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error deleting task:", error)
        throw error
      }
    }
  }

  async toggleStatus(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id)
      
      const currentStatus = currentTask.status_c
      let newStatus
      if (currentStatus === "completed") {
        newStatus = "pending"
      } else if (currentStatus === "pending") {
        newStatus = "in-progress"
      } else {
        newStatus = "completed"
      }
      
      return await this.update(id, { status_c: newStatus })
    } catch (error) {
      console.error("Error toggling task status:", error)
      throw error
    }
  }
}

export default new TasksService()