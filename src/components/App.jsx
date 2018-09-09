import React, { Component, Fragment } from 'react'
import { ChromePicker } from 'react-color'
import DimensionInput from './DimensionInput'
import GridContainer from './GridContainer'
import GridElement from './GridElement'
import Grid from '../dataStructures/grid'
import delay from '../helpers/delay'

class App extends Component {
  state = {
    nrOfRows: 10,
    nrOfColumns: 10,
    grid: new Grid(),
    isPickerVisible: false,
    pickerPosition: {},
  }

  componentDidMount() {
    this.generateGrid()
    window.addEventListener('click', event => {
      const { target } = event

      // only close if we do not click inside the grid
      if (target.nodeName !== 'SPAN') {
        this.closeColorPicker()
      }
    })
  }

  changeGridDimension = event => {
    this.setState(
      {
        [event.target.name]:
          event.target.value > 1 ? Number(event.target.value) : 1,
      },
      this.generateGrid
    )
  }

  generateGrid = () => {
    const { nrOfRows, nrOfColumns } = this.state
    const grid = new Grid({ nrOfColumns, nrOfRows })

    this.setState({ grid })
  }

  populateGrid = () => {
    const { grid } = this.state
    let availableFields = grid.copyDeep()

    const colors = ['blue', 'yellow', 'red', 'green', 'purple', 'brown']
    for (let i = 0; i < colors.length; i++) {
      let randomElement = availableFields.getRandomItem()
      grid.findElement(randomElement).status = colors[i]
      availableFields.removeElement(randomElement)
    }

    this.setState({ grid })
  }

  startFieldExpansion = async () => {
    const { grid } = this.state
    const availableFields = grid.filter(el => !el.status)

    function pickRandom(candidates) {
      return candidates[Math.floor(Math.random() * candidates.length)]
    }

    while (availableFields.length()) {
      let randomElement = availableFields.getRandomItem()
      let candidates = grid.getNeighbours(randomElement).filter(el => el.status)

      if (candidates.length) {
        const selected = pickRandom(candidates)
        const original = grid.findElement(randomElement)
        original.direction = grid.getDirection({
          source: selected,
          target: original,
        })
        original.status = selected.status
        availableFields.removeElement(randomElement)

        this.setState({ grid })
        await delay(100)
      }
    }
  }

  showColorPicker = ({ node }) => {
    this.setState({
      isPickerVisible: true,
      pickerPosition: { x: node.offsetLeft, y: node.offsetTop },
    })
  }

  closeColorPicker = () => {
    this.setState({ isPickerVisible: false })
  }

  render() {
    const {
      nrOfColumns,
      nrOfRows,
      grid,
      isPickerVisible,
      pickerPosition,
    } = this.state

    return (
      <Fragment>
        <DimensionInput
          title="Columns"
          type="number"
          name="nrOfColumns"
          value={nrOfColumns}
          onChange={this.changeGridDimension}
        />
        <DimensionInput
          title="Rows"
          type="number"
          name="nrOfRows"
          value={nrOfRows}
          onChange={this.changeGridDimension}
        />

        <button type="button" onClick={this.populateGrid}>
          Populate Grid!
        </button>

        <button type="button" onClick={this.startFieldExpansion}>
          Start Expansion!
        </button>

        <GridContainer nrOfColumns={nrOfColumns} nrOfRows={nrOfRows}>
          {grid.flatten().map(element => (
            <GridElement
              key={`[${element.rowIndex}][${element.columnIndex}]`}
              direction={element.direction}
              status={element.status}
              showColorPicker={this.showColorPicker}
            />
          ))}

          {isPickerVisible && (
            <div
              style={{
                position: 'absolute',
                top: pickerPosition.y + 22,
                left: pickerPosition.x - 112.5,
              }}
            >
              <ChromePicker />
            </div>
          )}
        </GridContainer>
      </Fragment>
    )
  }
}

export default App
