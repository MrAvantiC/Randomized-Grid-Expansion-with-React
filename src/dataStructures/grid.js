import deepEqual from 'deep-equal'

function Grid({ nrOfRows, nrOfColumns } = { nrOfRows: 2, nrOfColumns: 2 }) {
  this.initialNrOfRows = nrOfRows
  this.initialNrOfColumns = nrOfColumns

  // TODO: is there a better way to generate a 2-dimensional array?
  this.grid = Array.from(new Array(nrOfRows)).map((_, rowIndex) =>
    Array.from(new Array(nrOfColumns)).map((_, columnIndex) => {
      return { rowIndex, columnIndex }
    })
  )
}

Grid.prototype.getRowCount = function() {
  return this.grid.length
}

Grid.prototype.getColumnCount = function({ rowIndex }) {
  return this.grid[rowIndex].length
}

Grid.prototype.findElement = function(searchElement) {
  const { rowIndex } = searchElement

  return this.grid[rowIndex]
    ? this.grid[rowIndex].find(el => deepEqual(el, searchElement))
    : undefined
}

Grid.prototype.copyDeep = function() {
  const clone = new Grid({
    nrOfRows: this.initialNrOfRows,
    nrOfColumns: this.initialNrOfColumns,
  })
  clone.grid = JSON.parse(JSON.stringify(this.grid))

  return clone
}

Grid.prototype.getRandomItem = function() {
  const rowIndex = Math.floor(Math.random() * this.getRowCount())
  const columnIndex = Math.floor(
    Math.random() * this.getColumnCount({ rowIndex })
  )

  return this.grid[rowIndex][columnIndex]
}

Grid.prototype.removeElement = function(elementToRemove) {
  for (let rowIndex = 0; rowIndex < this.getRowCount(); rowIndex++) {
    this.grid[rowIndex].forEach((el, columnIndex) => {
      if (deepEqual(el, elementToRemove)) {
        this.grid[rowIndex].splice(columnIndex, 1)

        if (this.getColumnCount({ rowIndex }) === 0)
          this.grid.splice(rowIndex, 1)

        return
      }
    })
  }
}

Grid.prototype.filter = function(callback) {
  const clone = this.copyDeep()

  for (let rowIndex = 0; rowIndex < clone.getRowCount(); rowIndex++) {
    clone.grid[rowIndex] = clone.grid[rowIndex].filter(callback)
  }

  return clone
}

Grid.prototype.getNeighbours = function(originElement) {
  const { rowIndex, columnIndex } = originElement

  return [
    this.grid[rowIndex - 1] ? this.grid[rowIndex - 1][columnIndex] : undefined,
    this.grid[rowIndex][columnIndex + 1],
    this.grid[rowIndex + 1] ? this.grid[rowIndex + 1][columnIndex] : undefined,
    this.grid[rowIndex][columnIndex - 1],
  ].filter(el => el)
}

Grid.prototype.flatten = function() {
  return this.grid.reduce((acc, curr) => [...acc, ...curr], [])
}

Grid.prototype.length = function() {
  return this.flatten().length
}

Grid.prototype.getDirection = function({ source, target }) {
  if (target.rowIndex === source.rowIndex) {
    if (target.columnIndex - source.columnIndex === 1) {
      return 'toRight'
    } else {
      return 'toLeft'
    }
  } else {
    if (target.rowIndex - source.rowIndex === 1) {
      return 'toBottom'
    } else {
      return 'toTop'
    }
  }
}

export default Grid
