Tone.jsLoop
Class Loop<Options>
Loop creates a looped callback at the specified interval. The callback can be started, stopped and scheduled along the Transport's timeline.

Example
const loop = new Tone.Loop((time) => {
    // triggered every eighth note.
    console.log(time);
}, "8n").start(0);
Tone.Transport.start();
Copy
Type Parameters
Options extends LoopOptions = LoopOptions
Hierarchy (view full)
ToneWithContext<Options>
Loop
Pattern
Defined in Tone/event/Loop.ts:40
Constructors
constructor
Properties
callback
context
debug
name
version
Accessors
blockTime
disposed
humanize
interval
iterations
mute
playbackRate
probability
progress
sampleTime
state
Methods
cancel
dispose
get
immediate
now
set
start
stop
toFrequency
toSeconds
toString
toTicks
getDefaults
Constructors
constructor
new Loop<Options>(callback?, interval?): Loop<Options>
Type Parameters
Options extends LoopOptions = LoopOptions
Parameters
Optional callback: ((time) => void)
The callback to invoke at the time.

(time): void
Parameters
time: number
Returns void
Optional interval: Unit.Time
The time between successive callback calls.

Returns Loop<Options>
Overrides ToneWithContext<Options>.constructor

Defined in Tone/event/Loop.ts:59
new Loop<Options>(options?): Loop<Options>
Type Parameters
Options extends LoopOptions = LoopOptions
Parameters
Optional options: Partial<LoopOptions>
Returns Loop<Options>
Overrides ToneWithContext<Options>.constructor

Defined in Tone/event/Loop.ts:60
Properties
callback
callback: ((time) => void)
The callback to invoke with the next event in the pattern

Type declaration
(time): void
Parameters
time: number
Returns void
Defined in Tone/event/Loop.ts:53
Readonly
context
context: BaseContext
The context belonging to the node.

Inherited from ToneWithContext.context

Defined in Tone/core/context/ToneWithContext.ts:40
debug
debug: boolean = false
Set this debug flag to log all events that happen in this class.

Inherited from ToneWithContext.debug

Defined in Tone/core/Tone.ts:49
Readonly
name
name: string = "Loop"
Overrides ToneWithContext.name

Defined in Tone/event/Loop.ts:43
Static
version
version: string = version
The version number semver

Inherited from ToneWithContext.version

Defined in Tone/core/Tone.ts:28
Accessors
blockTime
get blockTime(): number
The number of seconds of 1 processing block (128 samples)

Returns number
Example
console.log(Tone.Destination.blockTime);
Copy
Inherited from ToneWithContext.blockTime

Defined in Tone/core/context/ToneWithContext.ts:108
disposed
get disposed(): boolean
Indicates if the instance was disposed. 'Disposing' an instance means that all of the Web Audio nodes that were created for the instance are disconnected and freed for garbage collection.

Returns boolean
Inherited from ToneWithContext.disposed

Defined in Tone/core/Tone.ts:96
humanize
get humanize(): boolean | Unit.Time
Random variation +/-0.01s to the scheduled time. Or give it a time value which it will randomize by.

Returns boolean | Unit.Time
Defined in Tone/event/Loop.ts:172
set humanize(variation): void
Parameters
variation: boolean | Unit.Time
Returns void
Defined in Tone/event/Loop.ts:175
interval
get interval(): Unit.Time
The time between successive callbacks.

Returns Unit.Time
Example
const loop = new Tone.Loop();
loop.interval = "8n"; // loop every 8n
Copy
Defined in Tone/event/Loop.ts:150
set interval(interval): void
Parameters
interval: Unit.Time
Returns void
Defined in Tone/event/Loop.ts:153
iterations
get iterations(): number
The number of iterations of the loop. The default value is Infinity (loop forever).

Returns number
Defined in Tone/event/Loop.ts:204
set iterations(iters): void
Parameters
iters: number
Returns void
Defined in Tone/event/Loop.ts:211
mute
get mute(): boolean
Muting the Loop means that no callbacks are invoked.

Returns boolean
Defined in Tone/event/Loop.ts:193
set mute(mute): void
Parameters
mute: boolean
Returns void
Defined in Tone/event/Loop.ts:197
playbackRate
get playbackRate(): number
The playback rate of the loop. The normal playback rate is 1 (no change). A playbackRate of 2 would be twice as fast.

Returns number
Defined in Tone/event/Loop.ts:161
set playbackRate(rate): void
Parameters
rate: number
Returns void
Defined in Tone/event/Loop.ts:164
probability
get probability(): number
The probably of the callback being invoked.

Returns number
Defined in Tone/event/Loop.ts:182
set probability(prob): void
Parameters
prob: number
Returns void
Defined in Tone/event/Loop.ts:186
progress
get progress(): number
The progress of the loop as a value between 0-1. 0, when the loop is stopped or done iterating.

Returns number
Defined in Tone/event/Loop.ts:140
sampleTime
get sampleTime(): number
The duration in seconds of one sample.

Returns number
Inherited from ToneWithContext.sampleTime

Defined in Tone/core/context/ToneWithContext.ts:99
state
get state(): BasicPlaybackState
The state of the Loop, either started or stopped.

Returns BasicPlaybackState
Defined in Tone/event/Loop.ts:133
Methods
cancel
cancel(time?): this
Cancel all scheduled events greater than or equal to the given time

Parameters
Optional time: Unit.Time
The time after which events will be cancel.

Returns this
Defined in Tone/event/Loop.ts:117
dispose
dispose(): this
Returns this
Overrides ToneWithContext.dispose

Defined in Tone/event/Loop.ts:219
get
get(): Options
Get the object's attributes.

Returns Options
Example
const osc = new Tone.Oscillator();
console.log(osc.get());
Copy
Inherited from ToneWithContext.get

Defined in Tone/core/context/ToneWithContext.ts:170
immediate
immediate(): number
Return the current time of the Context clock without any lookAhead.

Returns number
Example
setInterval(() => {
    console.log(Tone.immediate());
}, 100);
Copy
Inherited from ToneWithContext.immediate

Defined in Tone/core/context/ToneWithContext.ts:92
now
now(): number
Return the current time of the Context clock plus the lookAhead.

Returns number
Example
setInterval(() => {
    console.log(Tone.now());
}, 100);
Copy
Inherited from ToneWithContext.now

Defined in Tone/core/context/ToneWithContext.ts:81
set
set(props): this
Set multiple properties at once with an object.

Parameters
props: RecursivePartial<Options>
Returns this
Example
const filter = new Tone.Filter().toDestination();
// set values using an object
filter.set({
    frequency: "C6",
    type: "highpass"
});
const player = new Tone.Player("https://tonejs.github.io/audio/berklee/Analogsynth_octaves_highmid.mp3").connect(filter);
player.autostart = true;
Copy
Inherited from ToneWithContext.set

Defined in Tone/core/context/ToneWithContext.ts:215
start
start(time?): this
Start the loop at the specified time along the Transport's timeline.

Parameters
Optional time: Unit.Time
When to start the Loop.

Returns this
Defined in Tone/event/Loop.ts:99
stop
stop(time?): this
Stop the loop at the given time.

Parameters
Optional time: Unit.Time
When to stop the Loop.

Returns this
Defined in Tone/event/Loop.ts:108
toFrequency
toFrequency(freq): number
Convert the input to a frequency number

Parameters
freq: Unit.Frequency
Returns number
Example
const gain = new Tone.Gain();
console.log(gain.toFrequency("4n"));
Copy
Inherited from ToneWithContext.toFrequency

Defined in Tone/core/context/ToneWithContext.ts:132
toSeconds
toSeconds(time?): number
Convert the incoming time to seconds. This is calculated against the current TransportClass bpm

Parameters
Optional time: Unit.Time
Returns number
Example
const gain = new Tone.Gain();
setInterval(() => console.log(gain.toSeconds("4n")), 100);
// ramp the tempo to 60 bpm over 30 seconds
Tone.getTransport().bpm.rampTo(60, 30);
Copy
Inherited from ToneWithContext.toSeconds

Defined in Tone/core/context/ToneWithContext.ts:121
toString
toString(): string
Convert the class to a string

Returns string
Example
const osc = new Tone.Oscillator();
console.log(osc.toString());
Copy
Inherited from ToneWithContext.toString

Defined in Tone/core/Tone.ts:106
toTicks
toTicks(time?): number
Convert the input time into ticks

Parameters
Optional time: Unit.Time | TimeClass<number, TimeBaseUnit>
Returns number
Example
const gain = new Tone.Gain();
console.log(gain.toTicks("4n"));
Copy
Inherited from ToneWithContext.toTicks

Defined in Tone/core/context/ToneWithContext.ts:142
Static
getDefaults
getDefaults(): LoopOptions
Returns LoopOptions
Overrides ToneWithContext.getDefaults

Defined in Tone/event/Loop.ts:83