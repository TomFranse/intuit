Class Players
Players combines multiple Player objects.

Hierarchy (view full)
ToneAudioNode<PlayersOptions>
Players
Defined in Tone/source/buffer/Players.ts:32
Constructors
constructor
Properties
context
debug
input
name
output
volume
version
Accessors
blockTime
channelCount
channelCountMode
channelInterpretation
disposed
fadeIn
fadeOut
loaded
mute
numberOfInputs
numberOfOutputs
sampleTime
state
Methods
add
chain
connect
disconnect
dispose
fan
get
has
immediate
now
player
set
stopAll
toDestination
toFrequency
toMaster
toSeconds
toString
toTicks
getDefaults
Constructors
constructor
new Players(urls?, onload?): Players
Parameters
Optional urls: ToneAudioBuffersUrlMap
An object mapping a name to a url.

Optional onload: (() => void)
The function to invoke when all buffers are loaded.

(): void
Returns void
Returns Players
Overrides ToneAudioNode.constructor

Defined in Tone/source/buffer/Players.ts:79
new Players(urls?, options?): Players
Parameters
Optional urls: ToneAudioBuffersUrlMap
An object mapping a name to a url.

Optional options: Partial<Omit<PlayersOptions, "urls">>
The remaining options associated with the players

Returns Players
Overrides ToneAudioNode.constructor

Defined in Tone/source/buffer/Players.ts:84
new Players(options?): Players
Parameters
Optional options: Partial<PlayersOptions>
Returns Players
Overrides ToneAudioNode<PlayersOptions>.constructor

Defined in Tone/source/buffer/Players.ts:88
Properties
Readonly
context
context: BaseContext
The context belonging to the node.

Inherited from ToneAudioNode.context

Defined in Tone/core/context/ToneWithContext.ts:40
debug
debug: boolean = false
Set this debug flag to log all events that happen in this class.

Inherited from ToneAudioNode.debug

Defined in Tone/core/Tone.ts:49
Readonly
input
input: undefined = undefined
Players has no input.

Overrides ToneAudioNode.input

Defined in Tone/source/buffer/Players.ts:53
Readonly
name
name: string = "Players"
The name of the class

Overrides ToneAudioNode.name

Defined in Tone/source/buffer/Players.ts:33
Readonly
output
output: OutputNode
The combined output of all of the players

Overrides ToneAudioNode.output

Defined in Tone/source/buffer/Players.ts:48
Readonly
volume
volume: Param<"decibels">
The volume of the output in decibels.

Defined in Tone/source/buffer/Players.ts:43
Static
version
version: string = version
The version number semver

Inherited from ToneAudioNode.version

Defined in Tone/core/Tone.ts:28
Accessors
blockTime
get blockTime(): number
The number of seconds of 1 processing block (128 samples)

Returns number
Example
console.log(Tone.Destination.blockTime);
Copy
Inherited from ToneAudioNode.blockTime

Defined in Tone/core/context/ToneWithContext.ts:108
channelCount
get channelCount(): number
channelCount is the number of channels used when up-mixing and down-mixing connections to any inputs to the node. The default value is 2 except for specific nodes where its value is specially determined.

Returns number
Inherited from ToneAudioNode.channelCount

Defined in Tone/core/context/ToneAudioNode.ts:153
set channelCount(channelCount): void
Parameters
channelCount: number
Returns void
Inherited from ToneAudioNode.channelCount

Defined in Tone/core/context/ToneAudioNode.ts:156
channelCountMode
get channelCountMode(): ChannelCountMode
channelCountMode determines how channels will be counted when up-mixing and down-mixing connections to any inputs to the node. The default value is "max". This attribute has no effect for nodes with no inputs.

"max" - computedNumberOfChannels is the maximum of the number of channels of all connections to an input. In this mode channelCount is ignored.
"clamped-max" - computedNumberOfChannels is determined as for "max" and then clamped to a maximum value of the given channelCount.
"explicit" - computedNumberOfChannels is the exact value as specified by the channelCount.
Returns ChannelCountMode
Inherited from ToneAudioNode.channelCountMode

Defined in Tone/core/context/ToneAudioNode.ts:170
set channelCountMode(channelCountMode): void
Parameters
channelCountMode: ChannelCountMode
Returns void
Inherited from ToneAudioNode.channelCountMode

Defined in Tone/core/context/ToneAudioNode.ts:173
channelInterpretation
get channelInterpretation(): ChannelInterpretation
channelInterpretation determines how individual channels will be treated when up-mixing and down-mixing connections to any inputs to the node. The default value is "speakers".

Returns ChannelInterpretation
Inherited from ToneAudioNode.channelInterpretation

Defined in Tone/core/context/ToneAudioNode.ts:184
set channelInterpretation(channelInterpretation): void
Parameters
channelInterpretation: ChannelInterpretation
Returns void
Inherited from ToneAudioNode.channelInterpretation

Defined in Tone/core/context/ToneAudioNode.ts:187
disposed
get disposed(): boolean
Indicates if the instance was disposed. 'Disposing' an instance means that all of the Web Audio nodes that were created for the instance are disconnected and freed for garbage collection.

Returns boolean
Inherited from ToneAudioNode.disposed

Defined in Tone/core/Tone.ts:96
fadeIn
get fadeIn(): Unit.Time
The fadeIn time of the envelope applied to the source.

Returns Unit.Time
Defined in Tone/source/buffer/Players.ts:146
set fadeIn(fadeIn): void
Parameters
fadeIn: Unit.Time
Returns void
Defined in Tone/source/buffer/Players.ts:149
fadeOut
get fadeOut(): Unit.Time
The fadeOut time of the each of the sources.

Returns Unit.Time
Defined in Tone/source/buffer/Players.ts:159
set fadeOut(fadeOut): void
Parameters
fadeOut: Unit.Time
Returns void
Defined in Tone/source/buffer/Players.ts:162
loaded
get loaded(): boolean
If all the buffers are loaded or not

Returns boolean
Defined in Tone/source/buffer/Players.ts:211
mute
get mute(): boolean
Mute the output.

Returns boolean
Defined in Tone/source/buffer/Players.ts:136
set mute(mute): void
Parameters
mute: boolean
Returns void
Defined in Tone/source/buffer/Players.ts:139
numberOfInputs
get numberOfInputs(): number
The number of inputs feeding into the AudioNode. For source nodes, this will be 0.

Returns number
Example
const node = new Tone.Gain();
console.log(node.numberOfInputs);
Copy
Inherited from ToneAudioNode.numberOfInputs

Defined in Tone/core/context/ToneAudioNode.ts:52
numberOfOutputs
get numberOfOutputs(): number
The number of outputs of the AudioNode.

Returns number
Example
const node = new Tone.Gain();
console.log(node.numberOfOutputs);
Copy
Inherited from ToneAudioNode.numberOfOutputs

Defined in Tone/core/context/ToneAudioNode.ts:70
sampleTime
get sampleTime(): number
The duration in seconds of one sample.

Returns number
Inherited from ToneAudioNode.sampleTime

Defined in Tone/core/context/ToneWithContext.ts:99
state
get state(): BasicPlaybackState
The state of the players object. Returns "started" if any of the players are playing.

Returns BasicPlaybackState
Defined in Tone/source/buffer/Players.ts:172
Methods
add
add(name, url, callback?): this
Add a player by name and url to the Players

Parameters
name: string
A unique name to give the player

url: string | AudioBuffer | ToneAudioBuffer
Either the url of the bufer or a buffer which will be added with the given name.

Optional callback: (() => void)
The callback to invoke when the url is loaded.

(): void
Returns void
Returns this
Example
const players = new Tone.Players();
players.add("gong", "https://tonejs.github.io/audio/berklee/gong_1.mp3", () => {
    console.log("gong loaded");
    players.player("gong").start();
});
Copy
Defined in Tone/source/buffer/Players.ts:227
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
Inherited from ToneAudioNode.chain

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
Inherited from ToneAudioNode.connect

Defined in Tone/core/context/ToneAudioNode.ts:205
disconnect
disconnect(destination?, outputNum?, inputNum?): this
disconnect the output

Parameters
Optional destination: InputNode
outputNum: number = 0
inputNum: number = 0
Returns this
Inherited from ToneAudioNode.disconnect

Defined in Tone/core/context/ToneAudioNode.ts:234
dispose
dispose(): this
Dispose and disconnect

Returns this
Overrides ToneAudioNode.dispose

Defined in Tone/source/buffer/Players.ts:249
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
Inherited from ToneAudioNode.fan

Defined in Tone/core/context/ToneAudioNode.ts:264
get
get(): PlayersOptions
Get the object's attributes.

Returns PlayersOptions
Example
const osc = new Tone.Oscillator();
console.log(osc.get());
Copy
Inherited from ToneAudioNode.get

Defined in Tone/core/context/ToneWithContext.ts:170
has
has(name): boolean
True if the buffers object has a buffer by that name.

Parameters
name: string
The key or index of the buffer.

Returns boolean
Defined in Tone/source/buffer/Players.ts:183
immediate
immediate(): number
Return the current time of the Context clock without any lookAhead.

Returns number
Example
setInterval(() => {
    console.log(Tone.immediate());
}, 100);
Copy
Inherited from ToneAudioNode.immediate

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
Inherited from ToneAudioNode.now

Defined in Tone/core/context/ToneWithContext.ts:81
player
player(name): Player
Get a player by name.

Parameters
name: string
The players name as defined in the constructor object or add method.

Returns Player
Defined in Tone/source/buffer/Players.ts:191
set
set(props): this
Set multiple properties at once with an object.

Parameters
props: RecursivePartial<PlayersOptions>
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
Inherited from ToneAudioNode.set

Defined in Tone/core/context/ToneWithContext.ts:215
stopAll
stopAll(time?): this
Stop all of the players at the given time

Parameters
Optional time: Unit.Time
The time to stop all of the players.

Returns this
Defined in Tone/source/buffer/Players.ts:244
toDestination
toDestination(): this
Connect the output to the context's destination node.

Returns this
Example
const osc = new Tone.Oscillator("C2").start();
osc.toDestination();
Copy
Inherited from ToneAudioNode.toDestination

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
Inherited from ToneAudioNode.toFrequency

Defined in Tone/core/context/ToneWithContext.ts:132
toMaster
toMaster(): this
Connect the output to the context's destination node.

Returns this
See
toDestination

Deprecated
Inherited from ToneAudioNode.toMaster

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
Inherited from ToneAudioNode.toSeconds

Defined in Tone/core/context/ToneWithContext.ts:121
toString
toString(): string
Convert the class to a string

Returns string
Example
const osc = new Tone.Oscillator();
console.log(osc.toString());
Copy
Inherited from ToneAudioNode.toString

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
Inherited from ToneAudioNode.toTicks

Defined in Tone/core/context/ToneWithContext.ts:142
Static
getDefaults
getDefaults(): PlayersOptions
Returns PlayersOptions
Overrides ToneAudioNode.getDefaults

Defined in Tone/source/buffer/Players.ts:120