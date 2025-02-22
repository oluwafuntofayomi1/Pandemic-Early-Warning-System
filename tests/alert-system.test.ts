import { describe, it, beforeEach, expect } from "vitest"

describe("Alert System Contract", () => {
  let mockStorage: Map<string, any>
  let nextAlertId: number
  const CONTRACT_OWNER = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
  
  beforeEach(() => {
    mockStorage = new Map()
    nextAlertId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "issue-alert":
        if (sender !== CONTRACT_OWNER) return { success: false, error: 403 }
        const [patternId, severity, message] = args
        nextAlertId++
        mockStorage.set(`alert-${nextAlertId}`, {
          pattern_id: patternId,
          severity,
          timestamp: 123, // Mock block height
          message,
        })
        return { success: true, value: nextAlertId }
      
      case "get-alert":
        return { success: true, value: mockStorage.get(`alert-${args[0]}`) }
      
      case "get-latest-alert-id":
        return { success: true, value: nextAlertId }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should issue an alert", () => {
    const result = mockContractCall("issue-alert", [1, 3, "Potential outbreak detected"], CONTRACT_OWNER)
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should not allow non-owners to issue alerts", () => {
    const result = mockContractCall("issue-alert", [1, 3, "Potential outbreak detected"], "user1")
    expect(result.success).toBe(false)
    expect(result.error).toBe(403)
  })
  
  it("should get an alert", () => {
    mockContractCall("issue-alert", [1, 3, "Potential outbreak detected"], CONTRACT_OWNER)
    const result = mockContractCall("get-alert", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      pattern_id: 1,
      severity: 3,
      timestamp: 123,
      message: "Potential outbreak detected",
    })
  })
  
  it("should get latest alert id", () => {
    mockContractCall("issue-alert", [1, 3, "Potential outbreak detected"], CONTRACT_OWNER)
    mockContractCall("issue-alert", [2, 2, "Monitoring situation"], CONTRACT_OWNER)
    const result = mockContractCall("get-latest-alert-id", [], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toBe(2)
  })
})

