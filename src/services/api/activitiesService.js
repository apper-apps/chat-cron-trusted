import activitiesData from "@/services/mockData/activities.json"

class ActivitiesService {
  constructor() {
    this.activities = [...activitiesData]
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getRecent(limit = 10) {
    await this.delay()
    return [...this.activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  }

  async create(data) {
    await this.delay()
    const newId = Math.max(...this.activities.map(item => item.Id)) + 1
    const newActivity = {
      ...data,
      Id: newId,
      timestamp: new Date().toISOString()
    }
    this.activities.push(newActivity)
    return { ...newActivity }
  }
}

export default new ActivitiesService()