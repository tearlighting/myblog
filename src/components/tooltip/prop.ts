import { PropOptions, PropType } from "vue"
export type TTrigger = keyof typeof ETrigger
export type TDirection = keyof typeof EDirection

interface ITooltipProp {
  trigger: PropOptions<TTrigger>
  direction: PropOptions<TDirection>
}

export enum ETrigger {
  hover = "hover",
  click = "click",
}
export enum EDirection {
  left = "left",
  right = "right",
  top = "top",
  bottom = "bottom",
}

export const props: ITooltipProp = {
  trigger: {
    type: String as PropType<TTrigger>,
    default: ETrigger.hover,
  },
  direction: {
    type: String as PropType<TDirection>,
    default: EDirection.bottom,
  },
}
