const {abs} = require('./abs')

describe('abs', () => {
  describe("should return possite value", () => {
    it("should return possite value, if value = -1", () => {
      const value = -1;

      const result = abs(value)

      expect(result).toBe(1)
    })
    it("should return possite value, if value = -10", () => {
      const value = -10;

      const result = abs(value)

      expect(result).toBe(10)
    })
  }) 
  // describe("should return same value", () => {
  //   it("should return same value, if value = 11", () => {
  //     const value = 11;

  //     const result = abs(value)

  //     expect(result).toBe(11)
  //   })
  //   it("should return same value, if value = 2", () => {
  //     const value = 2;

  //     const result = abs(value)

  //     expect(result).toBe(2)
  //   })
  // }) 
});