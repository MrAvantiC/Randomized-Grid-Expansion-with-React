import styled from 'styled-components'

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.nrOfColumns}, 20px);
  grid-template-rows: repeat(${props => props.nrOfRows}, 20px);
  grid-gap: 2px;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: lightgrey;
  border: 2px solid lightgrey;
`

export default GridContainer
