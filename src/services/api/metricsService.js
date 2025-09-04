class MetricsService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'metric_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "value_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "trend_c" } },
          { field: { Name: "last_updated_c" } }
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
        console.error("Error fetching metrics:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching metrics:", error)
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
          { field: { Name: "value_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "trend_c" } },
          { field: { Name: "last_updated_c" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (!response.data) {
        throw new Error("Metric not found")
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching metric with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching metric with ID ${id}:`, error)
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
            Name: data.Name || data.name || '',
            Tags: data.Tags || '',
            value_c: parseFloat(data.value_c || data.value || 0),
            unit_c: data.unit_c || data.unit || '',
            trend_c: data.trend_c || data.trend || 'stable',
            last_updated_c: data.last_updated_c || data.lastUpdated || new Date().toISOString()
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
          console.error(`Failed to create metric ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating metric:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error creating metric:", error)
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
            ...(data.value_c !== undefined && { value_c: parseFloat(data.value_c) }),
            ...(data.unit_c !== undefined && { unit_c: data.unit_c }),
            ...(data.trend_c !== undefined && { trend_c: data.trend_c }),
            last_updated_c: new Date().toISOString()
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
          console.error(`Failed to update metric ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating metric:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error updating metric:", error)
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
          console.error(`Failed to delete metric ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting metric:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error deleting metric:", error)
        throw error
      }
    }
  }
}

export default new MetricsService()