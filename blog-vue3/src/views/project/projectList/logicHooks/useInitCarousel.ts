import { ECarouselPhase } from "../constant"
import { CarouselAccumulator } from "../core/CarouselAccumulator"
import { CarouselGlue } from "../core/CarouselGlue"
import { useProjectStore } from "../store"
import { ProjectCarouseInputBuilder } from "../utils/ProjectCarouseInput"

interface IUseInitCarouselProps {
  target: HTMLElement
  track: HTMLElement
}
export const useInitCarousel = ({ target, track }: IUseInitCarouselProps) => {
  const {
    projectCarouselStore: { defineCarouselGlueIns },
    projectSubPub: { subPubIns },
    projectCardECarouselPhaseStateMachineRef,
  } = useProjectStore()
  // console.log(target);

  const carouselInputIns = new ProjectCarouseInputBuilder().defineSubPub(subPubIns).defineTarget(target).build()
  const carouselAccumulatorIns = new CarouselAccumulator()
  const gluer = new CarouselGlue(carouselAccumulatorIns, subPubIns)
    .defineOnSwitch((dir) => {
      projectCardECarouselPhaseStateMachineRef.current?.send({
        type: ECarouselPhase.switching,
        payload: {
          dir,
        },
      })
    })
    .defineApply(({ progress, dir }) => {
      if (projectCardECarouselPhaseStateMachineRef.current?.getState() !== ECarouselPhase.ready) return
      track.style.setProperty("--p", String(progress))
      track.style.setProperty("--dir", String(dir))
    })
  gluer.start()
  defineCarouselGlueIns(gluer)
}
