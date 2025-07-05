import { appendUint8Array } from './append-uint8-array.util'

describe('appendUint8Array', () => {
  it('should append the newData to the data', () => {
    const data = new Uint8Array([1, 2, 3])
    const newData = new Uint8Array([4, 5])

    const result = appendUint8Array(data, newData)

    expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5]))
  })

  it('should return data when appending empty newData to data', () => {
    const data = new Uint8Array([7, 8])
    const newData = new Uint8Array([])

    const result = appendUint8Array(data, newData)

    expect(result).toEqual(new Uint8Array([7, 8]))
  })

  it('should return newData when empty data is appended to newData', () => {
    const data = new Uint8Array([])
    const newData = new Uint8Array([9, 10])

    const result = appendUint8Array(data, newData)

    expect(result).toEqual(new Uint8Array([9, 10]))
  })

  it('should work when data & newData are empty', () => {
    const data = new Uint8Array([])
    const newData = new Uint8Array([])

    const result = appendUint8Array(data, newData)

    expect(result).toEqual(new Uint8Array([]))
  })
})
