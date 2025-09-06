class ToolboxService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'toolbox_item_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "last_updated_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "metadata_c" } }
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
        console.error("Error fetching toolbox items:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching toolbox items:", error)
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
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "last_updated_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "metadata_c" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (!response.data) {
        throw new Error("Item not found")
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching toolbox item with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching toolbox item with ID ${id}:`, error)
        throw error
      }
    }
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "last_updated_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "metadata_c" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [type]
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
        console.error("Error fetching toolbox items by type:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching toolbox items by type:", error)
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
            type_c: data.type_c || data.type || '',
            status_c: data.status_c || data.status || 'active',
            last_updated_c: data.last_updated_c || data.lastUpdated || new Date().toISOString(),
            description_c: data.description_c || data.description || '',
            metadata_c: data.metadata_c || (data.metadata ? JSON.stringify(data.metadata) : '')
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
          console.error(`Failed to create toolbox item ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating toolbox item:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error creating toolbox item:", error)
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
            ...(data.type_c !== undefined && { type_c: data.type_c }),
            ...(data.status_c !== undefined && { status_c: data.status_c }),
            ...(data.description_c !== undefined && { description_c: data.description_c }),
            ...(data.metadata_c !== undefined && { metadata_c: data.metadata_c }),
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
          console.error(`Failed to update toolbox item ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating toolbox item:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error updating toolbox item:", error)
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
          console.error(`Failed to delete toolbox item ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting toolbox item:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error deleting toolbox item:", error)
        throw error
      }
    }
  }

  async toggleStatus(id) {
    try {
      // First get the current item
      const currentItem = await this.getById(id)
      
      const newStatus = currentItem.status_c === "active" ? "inactive" : "active"
      
      return await this.update(id, { status_c: newStatus })
    } catch (error) {
      console.error("Error toggling toolbox item status:", error)
      throw error
    }
  }
}

export default new ToolboxService()