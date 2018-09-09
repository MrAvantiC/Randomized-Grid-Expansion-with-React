import { keyframes } from 'styled-components'

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

export default animationMap
