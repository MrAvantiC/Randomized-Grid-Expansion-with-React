import React, { Component, Fragment } from 'react'
import styled, { css } from 'styled-components'
import animationMap from '../helpers/gridElementAnimations'

class GridElement extends Component {
  setNodeRef = element => {
    this.nodeRef = element
  }

  handleClick = () => {
    this.props.showColorPicker({
      node: this.nodeRef,
      element: this.props.element,
    })
  }

  render() {
    const { className } = this.props

    return (
      <span
        className={className}
        ref={this.setNodeRef}
        onClick={this.handleClick}
      />
    )
  }
}

const StyledGridElement = styled(GridElement)`
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

export default StyledGridElement
