Tone.jsContextOptions
Interface ContextOptions
interface ContextOptions {
    clockSource: TickerClockSource;
    context: AnyAudioContext;
    latencyHint: AudioContextLatencyCategory;
    lookAhead: number;
    updateInterval: number;
}
Defined in Tone/core/context/Context.ts:20
Properties
clockSource
context
latencyHint
lookAhead
updateInterval
Properties
clockSource
clockSource: TickerClockSource
Defined in Tone/core/context/Context.ts:21
context
context: AnyAudioContext
Defined in Tone/core/context/Context.ts:25
latencyHint
latencyHint: AudioContextLatencyCategory
Defined in Tone/core/context/Context.ts:22
lookAhead
lookAhead: number
Defined in Tone/core/context/Context.ts:23
updateInterval
updateInterval: number
Defined in Tone/core/context/Context.ts:24

Tone.jsgetContext
Function getContext
getContext(): BaseContext
Returns the default system-wide Context

Returns BaseContext
Defined in Tone/core/Global.ts:31

Interface ContextTimeoutEvent
interface ContextTimeoutEvent {
    callback: ((...args) => void);
    id: number;
    time: number;
}
Defined in Tone/core/context/Context.ts:28
Properties
callback
id
time
Properties
callback
callback: ((...args) => void)
Type declaration
(...args): void
Parameters
Rest ...args: any[]
Returns void
Defined in Tone/core/context/Context.ts:29
id
id: number
Defined in Tone/core/context/Context.ts:30
time
time: number
Defined in Tone/core/context/Context.ts:31