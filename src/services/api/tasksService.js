import tasksData from "@/services/mockData/tasks.json"

class TasksService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(item => item.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  }

  async getByCategory(category) {
    await this.delay()
    return this.tasks.filter(task => task.category === category).map(task => ({ ...task }))
  }

  async create(data) {
    await this.delay()
    const newId = Math.max(...this.tasks.map(item => item.Id)) + 1
    const newTask = {
      ...data,
      Id: newId
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, data) {
    await this.delay()
    const index = this.tasks.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    this.tasks[index] = {
      ...this.tasks[index],
      ...data
    }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    const deleted = this.tasks.splice(index, 1)[0]
    return { ...deleted }
  }

  async toggleStatus(id) {
    await this.delay()
    const index = this.tasks.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    const currentStatus = this.tasks[index].status
    let newStatus
    if (currentStatus === "completed") {
      newStatus = "pending"
    } else if (currentStatus === "pending") {
      newStatus = "in-progress"
    } else {
      newStatus = "completed"
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      status: newStatus
    }
    return { ...this.tasks[index] }
  }
}

export default new TasksService()