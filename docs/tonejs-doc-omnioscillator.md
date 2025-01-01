Class OmniOscillator<OscType>
OmniOscillator aggregates all of the oscillator types into one.

Example
return Tone.Offline(() => {
    const omniOsc = new Tone.OmniOscillator("C#4", "pwm").toDestination().start();
}, 0.1, 1);
Copy
Type Parameters
OscType extends AnyOscillator
Hierarchy
Source<OmniOscillatorOptions>
OmniOscillator
Implements
Omit<ToneOscillatorInterface, "type">
Defined in Tone/source/oscillator/OmniOscillator.ts:91
Constructors
constructor
Properties
context
debug
detune
frequency
input
name
onstop
output
volume
version
Accessors
baseType
blockTime
channelCount
channelCountMode
channelInterpretation
count
disposed
harmonicity
modulationFrequency
modulationIndex
modulationType
mute
numberOfInputs
numberOfOutputs
partialCount
partials
phase
sampleTime
sourceType
spread
state
type
width
Methods
asArray
chain
connect
disconnect
dispose
fan
get
immediate
now
restart
set
start
stop
sync
toDestination
toFrequency
toMaster
toSeconds
toString
toTicks
unsync
getDefaults
Constructors
constructor
new OmniOscillator<OscType>(frequency?, type?): OmniOscillator<OscType>
Type Parameters
OscType extends AnyOscillator
Parameters
Optional frequency: Unit.Frequency
The initial frequency of the oscillator.

Optional type: OmniOscillatorType
The type of the oscillator.

Returns OmniOscillator<OscType>
Overrides Source<OmniOscillatorOptions>.constructor

Defined in Tone/source/oscillator/OmniOscillator.ts:114
new OmniOscillator<OscType>(options?): OmniOscillator<OscType>
Type Parameters
OscType extends AnyOscillator
Parameters
Optional options: Partial<OmniOscillatorOptions>
Returns OmniOscillator<OscType>
Overrides Source<OmniOscillatorOptions>.constructor

Defined in Tone/source/oscillator/OmniOscillator.ts:115
Properties
Readonly
context
context: BaseContext
The context belonging to the node.

Inherited from Source.context

Defined in Tone/core/context/ToneWithContext.ts:40
debug
debug: boolean = false
Set this debug flag to log all events that happen in this class.

Inherited from Source.debug

Defined in Tone/core/Tone.ts:49
Readonly
detune
detune: Signal<"cents">
Implementation of Omit.detune

Defined in Tone/source/oscillator/OmniOscillator.ts:98
Readonly
frequency
frequency: Signal<"frequency">
Implementation of Omit.frequency

Defined in Tone/source/oscillator/OmniOscillator.ts:97
input
input: undefined = undefined
Sources have no inputs

Inherited from Source.input

Defined in Tone/source/Source.ts:63
Readonly
name
name: string = "OmniOscillator"
Overrides Source.name

Defined in Tone/source/oscillator/OmniOscillator.ts:95
onstop
onstop: onStopCallback
The callback to invoke when the source is stopped.

Inherited from Source.onstop

Defined in Tone/source/Source.ts:76
output
output: OutputNode
The output node

Inherited from Source.output

Defined in Tone/source/Source.ts:58
volume
volume: Param<"decibels">
The volume of the output in decibels.

Example
const source = new Tone.PWMOscillator().toDestination();
source.volume.value = -6;
Copy
Inherited from Source.volume

Defined in Tone/source/Source.ts:71
Static
version
version: string = version
The version number semver

Inherited from Source.version

Defined in Tone/core/Tone.ts:28
Accessors
baseType
get baseType(): OscillatorType | "pulse" | "pwm"
The base type of the oscillator.

Returns OscillatorType | "pulse" | "pwm"
See
Oscillator.baseType

Example
const omniOsc = new Tone.OmniOscillator(440, "fmsquare4");
console.log(omniOsc.sourceType, omniOsc.baseType, omniOsc.partialCount);
Copy
Implementation of Omit.baseType

Defined in Tone/source/oscillator/OmniOscillator.ts:338
set baseType(baseType): void
Parameters
baseType: OscillatorType | "pulse" | "pwm"
Returns void
Implementation of Omit.baseType

Defined in Tone/source/oscillator/OmniOscillator.ts:341
blockTime
get blockTime(): number
The number of seconds of 1 processing block (128 samples)

Returns number
Example
console.log(Tone.Destination.blockTime);
Copy
Inherited from Source.blockTime

Defined in Tone/core/context/ToneWithContext.ts:108
channelCount
get channelCount(): number
channelCount is the number of channels used when up-mixing and down-mixing connections to any inputs to the node. The default value is 2 except for specific nodes where its value is specially determined.

Returns number
Inherited from Source.channelCount

Defined in Tone/core/context/ToneAudioNode.ts:153
set channelCount(channelCount): void
Parameters
channelCount: number
Returns void
Inherited from Source.channelCount

Defined in Tone/core/context/ToneAudioNode.ts:156
channelCountMode
get channelCountMode(): ChannelCountMode
channelCountMode determines how channels will be counted when up-mixing and down-mixing connections to any inputs to the node. The default value is "max". This attribute has no effect for nodes with no inputs.

"max" - computedNumberOfChannels is the maximum of the number of channels of all connections to an input. In this mode channelCount is ignored.
"clamped-max" - computedNumberOfChannels is determined as for "max" and then clamped to a maximum value of the given channelCount.
"explicit" - computedNumberOfChannels is the exact value as specified by the channelCount.
Returns ChannelCountMode
Inherited from Source.channelCountMode

Defined in Tone/core/context/ToneAudioNode.ts:170
set channelCountMode(channelCountMode): void
Parameters
channelCountMode: ChannelCountMode
Returns void
Inherited from Source.channelCountMode

Defined in Tone/core/context/ToneAudioNode.ts:173
channelInterpretation
get channelInterpretation(): ChannelInterpretation
channelInterpretation determines how individual channels will be treated when up-mixing and down-mixing connections to any inputs to the node. The default value is "speakers".

Returns ChannelInterpretation
Inherited from Source.channelInterpretation

Defined in Tone/core/context/ToneAudioNode.ts:184
set channelInterpretation(channelInterpretation): void
Parameters
channelInterpretation: ChannelInterpretation
Returns void
Inherited from Source.channelInterpretation

Defined in Tone/core/context/ToneAudioNode.ts:187
count
get count(): IsFatOscillator<OscType, number>
The number of detuned oscillators when sourceType === "fat".

Returns IsFatOscillator<OscType, number>
See
FatOscillator.count

Defined in Tone/source/oscillator/OmniOscillator.ts:374
set count(count): void
Parameters
count: IsFatOscillator<OscType, number>
Returns void
Defined in Tone/source/oscillator/OmniOscillator.ts:381
disposed
get disposed(): boolean
Indicates if the instance was disposed. 'Disposing' an instance means that all of the Web Audio nodes that were created for the instance are disconnected and freed for garbage collection.

Returns boolean
Inherited from Source.disposed

Defined in Tone/core/Tone.ts:96
harmonicity
get harmonicity(): IsAmOrFmOscillator<OscType, Signal<"positive">>
Harmonicity is the frequency ratio between the carrier and the modulator oscillators.

Returns IsAmOrFmOscillator<OscType, Signal<"positive">>
See
AMOscillator or FMOscillator

Defined in Tone/source/oscillator/OmniOscillator.ts:450
modulationFrequency
get modulationFrequency(): IsPWMOscillator<OscType, Signal<"frequency">>
The modulationFrequency Signal of the oscillator when sourceType === "pwm" see PWMOscillator

Returns IsPWMOscillator<OscType, Signal<"frequency">>
Min
0.1

Max
5

Defined in Tone/source/oscillator/OmniOscillator.ts:470
modulationIndex
get modulationIndex(): IsFMOscillator<OscType, Signal<"positive">>
The modulation index when the sourceType === "fm"

Returns IsFMOscillator<OscType, Signal<"positive">>
See
FMOscillator.

Defined in Tone/source/oscillator/OmniOscillator.ts:435
modulationType
get modulationType(): IsAmOrFmOscillator<OscType, ToneOscillatorType>
The type of the modulator oscillator. Only if the oscillator is set to "am" or "fm" types.

Returns IsAmOrFmOscillator<OscType, ToneOscillatorType>
See
AMOscillator or FMOscillator

Defined in Tone/source/oscillator/OmniOscillator.ts:408
set modulationType(mType): void
Parameters
mType: IsAmOrFmOscillator<OscType, ToneOscillatorType>
Returns void
Defined in Tone/source/oscillator/OmniOscillator.ts:421
mute
get mute(): boolean
Mute the output.

Returns boolean
Example
const osc = new Tone.Oscillator().toDestination().start();
// mute the output
osc.mute = true;
Copy
Inherited from Source.mute

Defined in Tone/source/Source.ts:159
set mute(mute): void
Parameters
mute: boolean
Returns void
Inherited from Source.mute

Defined in Tone/source/Source.ts:162
numberOfInputs
get numberOfInputs(): number
The number of inputs feeding into the AudioNode. For source nodes, this will be 0.

Returns number
Example
const node = new Tone.Gain();
console.log(node.numberOfInputs);
Copy
Inherited from Source.numberOfInputs

Defined in Tone/core/context/ToneAudioNode.ts:52
numberOfOutputs
get numberOfOutputs(): number
The number of outputs of the AudioNode.

Returns number
Example
const node = new Tone.Gain();
console.log(node.numberOfOutputs);
Copy
Inherited from Source.numberOfOutputs

Defined in Tone/core/context/ToneAudioNode.ts:70
partialCount
get partialCount(): number
Returns number
Implementation of Omit.partialCount

Defined in Tone/source/oscillator/OmniOscillator.ts:232
set partialCount(partialCount): void
Parameters
partialCount: number
Returns void
Implementation of Omit.partialCount

Defined in Tone/source/oscillator/OmniOscillator.ts:235
partials
get partials(): number[]
The value is an empty array when the type is not "custom". This is not available on "pwm" and "pulse" oscillator types.

Returns number[]
See
Oscillator.partials

Implementation of Omit.partials

Defined in Tone/source/oscillator/OmniOscillator.ts:220
set partials(partials): void
Parameters
partials: number[]
Returns void
Implementation of Omit.partials

Defined in Tone/source/oscillator/OmniOscillator.ts:223
phase
get phase(): number
Returns number
Implementation of Omit.phase

Defined in Tone/source/oscillator/OmniOscillator.ts:282
set phase(phase): void
Parameters
phase: number
Returns void
Implementation of Omit.phase

Defined in Tone/source/oscillator/OmniOscillator.ts:285
sampleTime
get sampleTime(): number
The duration in seconds of one sample.

Returns number
Inherited from Source.sampleTime

Defined in Tone/core/context/ToneWithContext.ts:99
sourceType
get sourceType(): keyof OmniOscillatorSource
The source type of the oscillator.

Returns keyof OmniOscillatorSource
Example
const omniOsc = new Tone.OmniOscillator(440, "fmsquare");
console.log(omniOsc.sourceType); // 'fm'
Copy
Defined in Tone/source/oscillator/OmniOscillator.ts:295
set sourceType(sType): void
Parameters
sType: keyof OmniOscillatorSource
Returns void
Defined in Tone/source/oscillator/OmniOscillator.ts:298
spread
get spread(): IsFatOscillator<OscType, number>
The detune spread between the oscillators when sourceType === "fat".

Returns IsFatOscillator<OscType, number>
See
FatOscillator.count

Defined in Tone/source/oscillator/OmniOscillator.ts:391
set spread(spread): void
Parameters
spread: IsFatOscillator<OscType, number>
Returns void
Defined in Tone/source/oscillator/OmniOscillator.ts:398
state
get state(): BasicPlaybackState
Returns the playback state of the source, either "started" or "stopped".

Returns BasicPlaybackState
Example
const player = new Tone.Player("https://tonejs.github.io/audio/berklee/ahntone_c3.mp3", () => {
    player.start();
    console.log(player.state);
}).toDestination();
Copy
Inherited from Source.state

Defined in Tone/source/Source.ts:138
type
get type(): OmniOscillatorType
The type of the oscillator. Can be any of the basic types: sine, square, triangle, sawtooth. Or prefix the basic types with "fm", "am", or "fat" to use the FMOscillator, AMOscillator or FatOscillator types. The oscillator could also be set to "pwm" or "pulse". All of the parameters of the oscillator's class are accessible when the oscillator is set to that type, but throws an error when it's not.

Returns OmniOscillatorType
Example
const omniOsc = new Tone.OmniOscillator().toDestination().start();
omniOsc.type = "pwm";
// modulationFrequency is parameter which is available
// only when the type is "pwm".
omniOsc.modulationFrequency.value = 0.5;
Copy
Defined in Tone/source/oscillator/OmniOscillator.ts:183
set type(type): void
Parameters
type: OmniOscillatorType
Returns void
Defined in Tone/source/oscillator/OmniOscillator.ts:190
width
get width(): IsPulseOscillator<OscType, Signal<"audioRange">>
The width of the oscillator when sourceType === "pulse".

Returns IsPulseOscillator<OscType, Signal<"audioRange">>
See
PWMOscillator

Defined in Tone/source/oscillator/OmniOscillator.ts:356
Methods
asArray
asArray(length?): Promise<Float32Array>
Parameters
length: number = 1024
Returns Promise<Float32Array>
Implementation of Omit.asArray

Defined in Tone/source/oscillator/OmniOscillator.ts:481
chain
chain(...nodes): this
Connect the output of this node to the rest of the nodes in series.

Parameters
Rest ...nodes: InputNode[]
Returns this
Example
const player = new Tone.Player("https://tonejs.github.io/audio/drum-samples/handdrum-loop.mp3");
player.autostart = true;
const filter = new Tone.AutoFilter(4).start();
const distortion = new Tone.Distortion(0.5);
// connect the player to the filter, distortion and then to the master output
player.chain(filter, distortion, Tone.Destination);
Copy
Inherited from Source.chain

Defined in Tone/core/context/ToneAudioNode.ts:249
connect
connect(destination, outputNum?, inputNum?): this
connect the output of a ToneAudioNode to an AudioParam, AudioNode, or ToneAudioNode

Parameters
destination: InputNode
The output to connect to

outputNum: number = 0
The output to connect from

inputNum: number = 0
The input to connect to

Returns this
Inherited from Source.connect

Defined in Tone/core/context/ToneAudioNode.ts:205
disconnect
disconnect(destination?, outputNum?, inputNum?): this
disconnect the output

Parameters
Optional destination: InputNode
outputNum: number = 0
inputNum: number = 0
Returns this
Inherited from Source.disconnect

Defined in Tone/core/context/ToneAudioNode.ts:234
dispose
dispose(): this
Returns this
Overrides Source.dispose

Defined in Tone/source/oscillator/OmniOscillator.ts:485
fan
fan(...nodes): this
connect the output of this node to the rest of the nodes in parallel.

Parameters
Rest ...nodes: InputNode[]
Returns this
Example
const player = new Tone.Player("https://tonejs.github.io/audio/drum-samples/conga-rhythm.mp3");
player.autostart = true;
const pitchShift = new Tone.PitchShift(4).toDestination();
const filter = new Tone.Filter("G5").toDestination();
// connect a node to the pitch shift and filter in parallel
player.fan(pitchShift, filter);
Copy
Inherited from Source.fan

Defined in Tone/core/context/ToneAudioNode.ts:264
get
get(): OmniOscillatorOptions
Get the object's attributes.

Returns OmniOscillatorOptions
Example
const osc = new Tone.Oscillator();
console.log(osc.get());
Copy
Inherited from Source.get

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
Inherited from Source.immediate

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
Inherited from Source.now

Defined in Tone/core/context/ToneWithContext.ts:81
restart
restart(time?, offset?, duration?): this
Restart the source.

Parameters
Optional time: Unit.Time
Optional offset: Unit.Time
Optional duration: Unit.Time
Returns this
Inherited from Source.restart

Defined in Tone/source/Source.ts:293
set
set(props): this
Parameters
props: Partial<OmniOscillatorOptions>
Returns this
Overrides Source.set

Defined in Tone/source/oscillator/OmniOscillator.ts:244
start
start(time?, offset?, duration?): this
Start the source at the specified time. If no time is given, start the source now.

Parameters
Optional time: Unit.Time
When the source should be started.

Optional offset: Unit.Time
Optional duration: Unit.Time
Returns this
Example
const source = new Tone.Oscillator().toDestination();
source.start("+0.5"); // starts the source 0.5 seconds from now
Copy
Inherited from Source.start

Defined in Tone/source/Source.ts:195
stop
stop(time?): this
Stop the source at the specified time. If no time is given, stop the source now.

Parameters
Optional time: Unit.Time
When the source should be stopped.

Returns this
Example
const source = new Tone.Oscillator().toDestination();
source.start();
source.stop("+0.5"); // stops the source 0.5 seconds from now
Copy
Inherited from Source.stop

Defined in Tone/source/Source.ts:264
sync
sync(): this
Sync the source to the Transport so that all subsequent calls to start and stop are synced to the TransportTime instead of the AudioContext time.

Returns this
Example
const osc = new Tone.Oscillator().toDestination();
// sync the source so that it plays between 0 and 0.3 on the Transport's timeline
osc.sync().start(0).stop(0.3);
// start the transport.
Tone.Transport.start();
// set it to loop once a second
Tone.Transport.loop = true;
Tone.Transport.loopEnd = 1;
Copy
Inherited from Source.sync

Defined in Tone/source/Source.ts:317
toDestination
toDestination(): this
Connect the output to the context's destination node.

Returns this
Example
const osc = new Tone.Oscillator("C2").start();
osc.toDestination();
Copy
Inherited from Source.toDestination

Defined in Tone/core/context/ToneAudioNode.ts:216
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
Inherited from Source.toFrequency

Defined in Tone/core/context/ToneWithContext.ts:132
toMaster
toMaster(): this
Connect the output to the context's destination node.

Returns this
See
toDestination

Deprecated
Inherited from Source.toMaster

Defined in Tone/core/context/ToneAudioNode.ts:226
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
Inherited from Source.toSeconds

Defined in Tone/core/context/ToneWithContext.ts:121
toString
toString(): string
Convert the class to a string

Returns string
Example
const osc = new Tone.Oscillator();
console.log(osc.toString());
Copy
Inherited from Source.toString

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
Inherited from Source.toTicks

Defined in Tone/core/context/ToneWithContext.ts:142
unsync
unsync(): this
Unsync the source to the Transport.

Returns this
See
sync

Inherited from Source.unsync

Defined in Tone/source/Source.ts:368
Static
getDefaults
getDefaults(): OmniOscillatorOptions
Returns OmniOscillatorOptions
Overrides Source.getDefaults

Defined in Tone/source/oscillator/OmniOscillator.ts:140