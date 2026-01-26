import { createHookStore, createUseSubBub, withMergeDispose } from "@/utils"
import type { ELumiTopic, XAxisGlue } from "../core"
import { EXAxisPhase, EYAxisPhase, XAxisPhaseStateMachine, YAxisPhaseStateMachine } from "../utils"

export const useAboutMeStore = createHookStore(() => {
    const xAxisGlueIns = {
        current: null as null | XAxisGlue,
    }

    const yAxisGlueIns = {
        current: null as null | XAxisGlue,
    }
    const xAxisPhaseStateMachineRef = {
        current: null as null | XAxisPhaseStateMachine,
    }
    const yAxisPhaseStateMachineRef = {
        current: null as null | YAxisPhaseStateMachine,
    }

    const { init, initialized, dispose, aboutMeSubPub, ...rest } = withMergeDispose({
        aboutMeSubPub: createUseSubBub<ELumiTopic | EXAxisPhase | EYAxisPhase>()(),
    })

    const disposeWrapper = () => {
        if (initialized.current) {
            xAxisGlueIns.current = null
            yAxisGlueIns.current = null
            xAxisPhaseStateMachineRef.current = null
            yAxisPhaseStateMachineRef.current = null
        }
        dispose()
    }

    const initWrapper: typeof init = () => {
        if (!initialized.current) {
            xAxisPhaseStateMachineRef.current = new XAxisPhaseStateMachine(EXAxisPhase.xAxisIdle, aboutMeSubPub.subPubIns)
            yAxisPhaseStateMachineRef.current = new YAxisPhaseStateMachine(EYAxisPhase.yAxisIdle, aboutMeSubPub.subPubIns)
        }
        init({})
    }
    return {
        init: initWrapper,
        initialized,
        dispose: disposeWrapper,
        ...rest,
        xAxisGlueIns,
        yAxisGlueIns,
        aboutMeSubPub,
        xAxisPhaseStateMachineRef,
        yAxisPhaseStateMachineRef,
    }
})
