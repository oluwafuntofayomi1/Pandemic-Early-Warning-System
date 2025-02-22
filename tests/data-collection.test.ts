import { describe, it, beforeEach, expect } from "vitest"

describe("Data Collection Contract", () => {
  let mockStorage: Map<string, any>
  let nextDataId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextDataId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "submit-health-data":
        const [location, symptoms, severity] = args
        nextDataId++
        mockStorage.set(`health-data-${nextDataId}`, {
          source: sender,
          location,
          timestamp: 123, // Mock block height
          symptoms,
          severity,
        })
        return { success: true, value: nextDataId }
      
      case "get-health-data":
        return { success: true, value: mockStorage.get(`health-data-${args[0]}`) }
      
      case "get-latest-data-id":
        return { success: true, value: nextDataId }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should submit health data", () => {
    const result = mockContractCall("submit-health-data", ["New York", ["fever", "cough"], 3], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should get health data", () => {
    mockContractCall("submit-health-data", ["New York", ["fever", "cough"], 3], "user1")
    const result = mockContractCall("get-health-data", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      source: "user1",
      location: "New York",
      timestamp: 123,
      symptoms: ["fever", "cough"],
      severity: 3,
    })
  })
  
  it("should get latest data id", () => {
    mockContractCall("submit-health-data", ["New York", ["fever", "cough"], 3], "user1")
    mockContractCall("submit-health-data", ["Los Angeles", ["headache"], 2], "user2")
    const result = mockContractCall("get-latest-data-id", [], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toBe(2)
  })
})

