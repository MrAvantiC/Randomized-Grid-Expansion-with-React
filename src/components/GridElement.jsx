import styled, { css, keyframes } from 'styled-components'

const toLeft = keyframes`
  from {
    transform: translateX(+22px);
  }

  to {
    transform: translateX(0)
  }
`
const toRight = keyframes`
  from {
    transform: translateX(-22px);
  }

  to {
    transform: translateX(0)
  }
`
const toTop = keyframes`
  from {
    transform: translateY(+22px);
  }

  to {
    transform: translateX(0)
  }
`
const toBottom = keyframes`
  from {
    transform: translateY(-22px);
  }

  to {
    transform: translateX(0)
  }
`

const animationMap = {
  toLeft: toLeft,
  toRight: toRight,
  toTop: toTop,
  toBottom: toBottom,
}

const GridElement = styled.span`
  position: relative;
  background-color: white;

  &:after {
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    background: ${props => props.status || 'white'};
  }

  ${props =>
    props.direction &&
    css`
      &:after {
        animation: ${animationMap[props.direction]} 0.1s forwards;
      }
    `};
`

export default GridElement
