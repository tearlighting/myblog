import type { CarouselGlue } from "../core/CarouselGlue"

interface IUseProjectCarouselProps {

}

interface IUseProjectCarousel extends IDisposableStore<IUseProjectCarouselProps> {
    carouselGlueIns: {
        current: null | CarouselGlue
    }
    defineCarouselGlueIns: (ins: CarouselGlue) => void
}


export const useProjectCarousel = (): IUseProjectCarousel => {
    const carouselGlueIns = {
        current: null as null | CarouselGlue
    }

    const defineCarouselGlueIns = (ins: CarouselGlue) => {
        carouselGlueIns.current = ins
    }
    const init: IUseProjectCarousel['init'] = () => {

    }
    const dispose: IUseProjectCarousel['dispose'] = () => {

    }
    return {
        carouselGlueIns,
        init,
        dispose,
        defineCarouselGlueIns
    }
}