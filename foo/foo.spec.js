const {biggestThan} = require("./foo")

describe('biggestThan', () => {
  describe("should return true if a greater than b", () => {
    it("should return true if a greater than b, if a = 10, b = 5", () => {
      const a = 1
      const b = 5 

      const result = biggestThan(a, b)

      expect(result).toBe(true)
    })
    it("should return true if a greater than b, if a = 3, b = 2", () => {
      const a = 3
      const b = 2

      const result = biggestThan(a, b)

      expect(result).toBe(true)
    })
  })

  // describe("should return false a is less than b", () => {
  //   it("should return false if a is less than b, if a = 5, b = 10", () => {
  //     const a = 5
  //     const b = 10 

  //     const result = biggestThan(a, b)

  //     expect(result).toBe(false)
  //   })
  //   it("should return false a is less than b, if a = 7, b = 8", () => {
  //     const a = 7
  //     const b = 8

  //     const result = biggestThan(a, b)

  //     expect(result).toBe(false)
  //   })
  // })
});