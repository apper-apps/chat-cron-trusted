import metricsData from "@/services/mockData/metrics.json"

class MetricsService {
  constructor() {
    this.metrics = [...metricsData]
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.metrics]
  }

  async getById(id) {
    await this.delay()
    const metric = this.metrics.find(item => item.Id === parseInt(id))
    if (!metric) {
      throw new Error("Metric not found")
    }
    return { ...metric }
  }

  async create(data) {
    await this.delay()
    const newId = Math.max(...this.metrics.map(item => item.Id)) + 1
    const newMetric = {
      ...data,
      Id: newId,
      lastUpdated: new Date().toISOString()
    }
    this.metrics.push(newMetric)
    return { ...newMetric }
  }

  async update(id, data) {
    await this.delay()
    const index = this.metrics.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Metric not found")
    }
    this.metrics[index] = {
      ...this.metrics[index],
      ...data,
      lastUpdated: new Date().toISOString()
    }
    return { ...this.metrics[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.metrics.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Metric not found")
    }
    const deleted = this.metrics.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new MetricsService()