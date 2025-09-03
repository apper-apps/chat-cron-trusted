import toolboxData from "@/services/mockData/toolboxItems.json"

class ToolboxService {
  constructor() {
    this.items = [...toolboxData]
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.items]
  }

  async getById(id) {
    await this.delay()
    const item = this.items.find(item => item.Id === parseInt(id))
    if (!item) {
      throw new Error("Item not found")
    }
    return { ...item }
  }

  async getByType(type) {
    await this.delay()
    return this.items.filter(item => item.type === type).map(item => ({ ...item }))
  }

  async create(data) {
    await this.delay()
    const newId = Math.max(...this.items.map(item => item.Id)) + 1
    const newItem = {
      ...data,
      Id: newId,
      lastUpdated: new Date().toISOString()
    }
    this.items.push(newItem)
    return { ...newItem }
  }

  async update(id, data) {
    await this.delay()
    const index = this.items.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Item not found")
    }
    this.items[index] = {
      ...this.items[index],
      ...data,
      lastUpdated: new Date().toISOString()
    }
    return { ...this.items[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.items.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Item not found")
    }
    const deleted = this.items.splice(index, 1)[0]
    return { ...deleted }
  }

  async toggleStatus(id) {
    await this.delay()
    const index = this.items.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Item not found")
    }
    
    const newStatus = this.items[index].status === "active" ? "inactive" : "active"
    this.items[index] = {
      ...this.items[index],
      status: newStatus,
      lastUpdated: new Date().toISOString()
    }
    return { ...this.items[index] }
  }
}

export default new ToolboxService()