import Grid from './grid'

describe('Grid', () => {
  describe('constructor', () => {
    it('creates a default 2x2 grid if no arguments are specified', () => {
      const grid = new Grid()

      expect(grid.grid).toEqual([
        [{ rowIndex: 0, columnIndex: 0 }, { rowIndex: 0, columnIndex: 1 }],
        [{ rowIndex: 1, columnIndex: 0 }, { rowIndex: 1, columnIndex: 1 }],
      ])
    })

    it('creates new Grid with correct amount of elements', () => {
      const grid = new Grid({
        nrOfRows: 1,
        nrOfColumns: 2,
      })
      expect(grid.getRowCount()).toBe(1)
      expect(grid.getColumnCount({ rowIndex: 0 })).toBe(2)
    })

    it('fills elements with object containing rowIndex and columnIndex', () => {
      const grid = new Grid({
        nrOfRows: 1,
        nrOfColumns: 2,
      })
      expect(grid.grid[0][0]).toEqual({ rowIndex: 0, columnIndex: 0 })
      expect(grid.grid[0][1]).toEqual({ rowIndex: 0, columnIndex: 1 })
    })
  })

  describe('counting', () => {
    const grid = new Grid({
      nrOfRows: 3,
      nrOfColumns: 2,
    })

    it('returns the correct rowCount', () => {
      const rowCount = grid.getRowCount()
      expect(rowCount).toBe(3)
    })

    it('returns the correct columnCount', () => {
      const rowCount = grid.getColumnCount({ rowIndex: 2 })
      expect(rowCount).toBe(2)
    })
  })

  describe('findElement', () => {
    const grid = new Grid({
      nrOfRows: 3,
      nrOfColumns: 3,
    })

    it('finds a given element in the grid', () => {
      const searchElement = { rowIndex: 1, columnIndex: 1 }
      const found = grid.findElement(searchElement)
      expect(found).toEqual(searchElement)
    })

    it('returns undefined if element is not in grid', () => {
      const searchElement = { rowIndex: 3, columnIndex: 3 }
      const found = grid.findElement(searchElement)
      expect(found).toBeUndefined()
    })
  })

  describe('copyDeep', () => {
    it('returns a deepCopy of the grid', () => {
      const grid = new Grid({
        nrOfRows: 1,
        nrOfColumns: 2,
      })
      const copy = grid.copyDeep()
      expect(copy).not.toBe(grid)
    })
  })

  describe('getRandomItem', () => {
    it('returns a valid, available item of the grid (1x1)', () => {
      const grid = new Grid({
        nrOfRows: 1,
        nrOfColumns: 1,
      })
      const index = grid.getRandomItem()
      expect(index).toEqual({ rowIndex: 0, columnIndex: 0 })
    })

    it('returns a valid, available index of the grid (2x2)', () => {
      const grid = new Grid({
        nrOfRows: 2,
        nrOfColumns: 2,
      })
      const index = grid.getRandomItem()
      const validElements = [
        { rowIndex: 0, columnIndex: 0 },
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 1, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
      ]
      expect(validElements).toContainEqual(index)
    })
  })

  describe('removeElement', () => {
    it('removes a given element from the grid', () => {
      const grid = new Grid({
        nrOfRows: 3,
        nrOfColumns: 3,
      })
      const elementToRemove = { rowIndex: 1, columnIndex: 1 }
      grid.removeElement(elementToRemove)

      expect(grid.findElement(elementToRemove)).toBeUndefined()
      expect(grid.getColumnCount({ rowIndex: 1 })).toBe(2)
    })

    it('removes the row if no element is left', () => {
      const grid = new Grid({
        nrOfRows: 2,
        nrOfColumns: 2,
      })
      let elementToRemove = { rowIndex: 1, columnIndex: 0 }
      grid.removeElement(elementToRemove)
      elementToRemove = { rowIndex: 1, columnIndex: 1 }
      grid.removeElement(elementToRemove)

      expect(grid.getRowCount()).toBe(1)
    })
  })

  describe('filter', () => {
    const grid = new Grid({
      nrOfRows: 2,
      nrOfColumns: 2,
    })

    it('executes a given callback function on each element of the grid', () => {
      const callback = jest.fn()
      grid.filter(callback)
      expect(callback).toHaveBeenCalledTimes(4)
    })

    it('filters elements according to the given callback function', () => {
      const redElement = grid.findElement({ rowIndex: 0, columnIndex: 0 })
      redElement.status = 'red'
      const blueElement = grid.findElement({ rowIndex: 1, columnIndex: 1 })
      blueElement.status = 'blue'

      const statusGrid = grid.filter(el => el.status)
      // // verify that elements without a status have been filtered out
      expect(statusGrid.findElement(redElement)).toBeDefined()
      expect(statusGrid.getColumnCount({ rowIndex: 0 })).toEqual(1)
      expect(statusGrid.findElement(blueElement)).toBeDefined()
      expect(statusGrid.getColumnCount({ rowIndex: 1 })).toEqual(1)

      const noStatusGrid = grid.filter(el => !el.status)
      expect(noStatusGrid.findElement(redElement)).toBeUndefined()
      expect(noStatusGrid.getColumnCount({ rowIndex: 0 })).toEqual(1)
      expect(noStatusGrid.findElement(blueElement)).toBeUndefined()
      expect(noStatusGrid.getColumnCount({ rowIndex: 1 })).toEqual(1)
    })
  })

  describe('getNeighbours', () => {
    const grid = new Grid({
      nrOfRows: 3,
      nrOfColumns: 3,
    })

    it('finds all valid neighbour-elements to a given element (central)', () => {
      const originElement = { rowIndex: 1, columnIndex: 1 }
      const neighbours = grid.getNeighbours(originElement)

      expect(neighbours).toEqual([
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 1, columnIndex: 2 },
        { rowIndex: 2, columnIndex: 1 },
        { rowIndex: 1, columnIndex: 0 },
      ])
    })

    it('finds all valid neighbour-elements to a given element (edge)', () => {
      const originElement = { rowIndex: 0, columnIndex: 2 }
      const neighbours = grid.getNeighbours(originElement)

      expect(neighbours).toEqual([
        { rowIndex: 1, columnIndex: 2 },
        { rowIndex: 0, columnIndex: 1 },
      ])
    })
  })

  describe('flatten', () => {
    it('returns the flattened grid', () => {
      const grid = new Grid({
        nrOfRows: 2,
        nrOfColumns: 2,
      })
      const flattened = grid.flatten()

      expect(flattened).toEqual([
        { rowIndex: 0, columnIndex: 0 },
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 1, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
      ])
    })

    it('does not break when grid is empty', () => {
      const grid = new Grid({
        nrOfRows: 1,
        nrOfColumns: 1,
      })
      grid.removeElement({ rowIndex: 0, columnIndex: 0 })

      const flattened = grid.flatten()
      expect(flattened).toEqual([])
    })
  })

  describe('length', () => {
    it('returns the amount of items in the grid', () => {
      const grid = new Grid({
        nrOfRows: 2,
        nrOfColumns: 2,
      })
      expect(grid.length()).toBe(4)
      grid.removeElement({ rowIndex: 0, columnIndex: 0 })
      expect(grid.length()).toBe(3)
    })
  })

  describe('getDirection', () => {
    it('determines the direction for a source and a target element', () => {
      const grid = new Grid({
        nrOfRows: 2,
        nrOfColumns: 2,
      })
      const zero_zero = { rowIndex: 0, columnIndex: 0 }
      const zero_one = { rowIndex: 0, columnIndex: 1 }
      const one_zero = { rowIndex: 1, columnIndex: 0 }
      const one_one = { rowIndex: 1, columnIndex: 1 }

      expect(
        grid.getDirection({ source: zero_zero, target: zero_one })
      ).toEqual('toRight')
      expect(
        grid.getDirection({ source: zero_one, target: zero_zero })
      ).toEqual('toLeft')
      expect(
        grid.getDirection({ source: zero_zero, target: one_zero })
      ).toEqual('toBottom')
      expect(
        grid.getDirection({ source: one_zero, target: zero_zero })
      ).toEqual('toTop')
    })
  })
})
