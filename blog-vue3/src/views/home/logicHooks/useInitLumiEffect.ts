import type { VirtualScrollData } from "lenis";
import { ELumiState } from "../constant";
import { ELumiTopic } from "../core/constant";
import { useHomeStore } from "../store";

interface IUseInitLumiEffectProps {
    target: HTMLElement;
    cardDoms: {
        card: HTMLElement;
        img: HTMLImageElement;
        media: HTMLElement;
        glass: HTMLElement;
        blur: HTMLElement;
    }
    textDoms: {
        text: HTMLElement;
        title: HTMLElement;
        description: HTMLElement;
    }
}
/**
 * 设置动画要用到的dom
 * @param payload 
 */
export const useInitLumiEffect = (payload: IUseInitLumiEffectProps) => {
    const {
        lumiStore: { initailLumiEffect, scene },
        lumiStateMachine
    } = useHomeStore()
    initailLumiEffect(payload)
    scene.value?.subPubIns && lumiStateMachine.setSubPub(scene.value.subPubIns)
    scene.value!.subPubIns.subscribe<VirtualScrollData>(ELumiTopic.switch, (payload) => {
        lumiStateMachine.send({
            type: ELumiState.switching,
            payload
        })
    })
}