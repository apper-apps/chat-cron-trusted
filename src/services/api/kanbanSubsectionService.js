// Service for managing kanban subsections using ApperClient
class KanbanSubsectionService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'kanban_subsection_c';
  }

  // Fetch all subsections
  async fetchSubsections() {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "display_order_c"
            }
          },
          {
            field: {
              Name: "kanban_section_c"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "display_order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching kanban subsections:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Get subsections by section ID
  async getSubsectionsBySection(sectionId) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "display_order_c"
            }
          },
          {
            field: {
              Name: "kanban_section_c"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          }
        ],
        where: [
          {
            FieldName: "kanban_section_c",
            Operator: "EqualTo",
            Values: [parseInt(sectionId)]
          }
        ],
        orderBy: [
          {
            fieldName: "display_order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching subsections by section:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Get subsection by ID
  async getSubsectionById(id) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "display_order_c"
            }
          },
          {
            field: {
              Name: "kanban_section_c"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching subsection with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Create new subsection
  async createSubsection(subsectionData) {
    try {
      const params = {
        records: [
          {
            Name: subsectionData.Name,
            display_order_c: subsectionData.display_order_c || 0,
            kanban_section_c: parseInt(subsectionData.kanban_section_c),
            Tags: subsectionData.Tags || ""
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create subsection ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating kanban subsection:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Update subsection
  async updateSubsection(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...Object.fromEntries(
              Object.entries(updateData).filter(([key, value]) => 
                ['Name', 'display_order_c', 'kanban_section_c', 'Tags'].includes(key) && 
                value !== undefined
              )
            )
          }
        ]
      };

      // Convert kanban_section_c to integer if present
      if (params.records[0].kanban_section_c !== undefined) {
        params.records[0].kanban_section_c = parseInt(params.records[0].kanban_section_c);
      }

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update subsection ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating kanban subsection:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Delete subsection
  async deleteSubsection(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete subsection ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting kanban subsection:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
}

export default new KanbanSubsectionService();
// Service for managing kanban subsections using ApperClient
class KanbanSubsectionService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'kanban_subsection_c';
  }

  // Fetch all subsections
  async fetchSubsections() {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "display_order_c"
            }
          },
          {
            field: {
              Name: "kanban_section_c"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "display_order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching kanban subsections:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Get subsections by section ID
  async getSubsectionsBySection(sectionId) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "display_order_c"
            }
          },
          {
            field: {
              Name: "kanban_section_c"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          }
        ],
        where: [
          {
            FieldName: "kanban_section_c",
            Operator: "EqualTo",
            Values: [parseInt(sectionId)]
          }
        ],
        orderBy: [
          {
            fieldName: "display_order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching subsections by section:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Get subsection by ID
  async getSubsectionById(id) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "display_order_c"
            }
          },
          {
            field: {
              Name: "kanban_section_c"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching subsection with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  // Create new subsection
  async createSubsection(subsectionData) {
    try {
      const params = {
        records: [
          {
            Name: subsectionData.Name,
            display_order_c: subsectionData.display_order_c || 0,
            kanban_section_c: parseInt(subsectionData.kanban_section_c),
            Tags: subsectionData.Tags || ""
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create subsection ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating kanban subsection:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Update subsection
  async updateSubsection(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...Object.fromEntries(
              Object.entries(updateData).filter(([key, value]) => 
                ['Name', 'display_order_c', 'kanban_section_c', 'Tags'].includes(key) && 
                value !== undefined
              )
            )
          }
        ]
      };

      // Convert kanban_section_c to integer if present
      if (params.records[0].kanban_section_c !== undefined) {
        params.records[0].kanban_section_c = parseInt(params.records[0].kanban_section_c);
      }

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update subsection ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating kanban subsection:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  // Delete subsection
  async deleteSubsection(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete subsection ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting kanban subsection:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
}

export default new KanbanSubsectionService();