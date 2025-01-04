Tone.jsPolySynth
Class PolySynth<Voice>
PolySynth handles voice creation and allocation for any instruments passed in as the second parameter. PolySynth is not a synthesizer by itself, it merely manages voices of one of the other types of synths, allowing any of the monophonic synthesizers to be polyphonic.

Example
const synth = new Tone.PolySynth().toDestination();
// set the attributes across all the voices using 'set'
synth.set({ detune: -1200 });
// play a chord
synth.triggerAttackRelease(["C4", "E4", "A4"], 1);
Copy
Type Parameters
Voice extends Monophonic<any> = Synth
Hierarchy
Instrument<VoiceOptions<Voice>>
PolySynth
Defined in Tone/instrument/PolySynth.ts:76
Constructors
constructor
Properties
context
debug
input
maxPolyphony
name
output
volume
version
Accessors
activeVoices
blockTime
channelCount
channelCountMode
channelInterpretation
disposed
numberOfInputs
numberOfOutputs
sampleTime
Methods
chain
connect
disconnect
dispose
fan
get
immediate
now
releaseAll
set
sync
toDestination
toFrequency
toMaster
toSeconds
toString
toTicks
triggerAttack
triggerAttackRelease
triggerRelease
unsync
getDefaults
Constructors
constructor
new PolySynth<Voice>(voice?, options?): PolySynth<Voice>
Type Parameters
Voice extends Monophonic<any> = Synth<SynthOptions>
Parameters
Optional voice: VoiceConstructor<Voice>
The constructor of the voices

Optional options: RecursivePartial<OmitMonophonicOptions<VoiceOptions<Voice>>>
The options object to set the synth voice

Returns PolySynth<Voice>
Overrides Instrument<VoiceOptions<Voice>>.constructor

Defined in Tone/instrument/PolySynth.ts:134
new PolySynth<Voice>(options?): PolySynth<Voice>
Type Parameters
Voice extends Monophonic<any> = Synth<SynthOptions>
Parameters
Optional options: Partial<PolySynthOptions<Voice>>
Returns PolySynth<Voice>
Overrides Instrument<VoiceOptions<Voice>>.constructor

Defined in Tone/instrument/PolySynth.ts:138
Properties
Readonly
context
context: BaseContext
The context belonging to the node.

Inherited from Instrument.context

Defined in Tone/core/context/ToneWithContext.ts:40
debug
debug: boolean = false
Set this debug flag to log all events that happen in this class.

Inherited from Instrument.debug

Defined in Tone/core/Tone.ts:49
input
input: undefined
The instrument only has an output

Inherited from Instrument.input

Defined in Tone/instrument/Instrument.ts:31
maxPolyphony
maxPolyphony: number
The polyphony limit.

Defined in Tone/instrument/PolySynth.ts:108
Readonly
name
name: string = "PolySynth"
Overrides Instrument.name

Defined in Tone/instrument/PolySynth.ts:79
output
output: OutputNode
Inherited from Instrument.output

Defined in Tone/instrument/Instrument.ts:26
volume
volume: Param<"decibels">
The volume of the output in decibels.

Example
const amSynth = new Tone.AMSynth().toDestination();
amSynth.volume.value = -6;
amSynth.triggerAttackRelease("G#3", 0.2);
Copy
Inherited from Instrument.volume

Defined in Tone/instrument/Instrument.ts:40
Static
version
version: string = version
The version number semver

Inherited from Instrument.version

Defined in Tone/core/Tone.ts:28
Accessors
activeVoices
get activeVoices(): number
The number of active voices.

Returns number
Defined in Tone/instrument/PolySynth.ts:184
blockTime
get blockTime(): number
The number of seconds of 1 processing block (128 samples)

Returns number
Example
console.log(Tone.Destination.blockTime);
Copy
Inherited from Instrument.blockTime

Defined in Tone/core/context/ToneWithContext.ts:108
channelCount
get channelCount(): number
channelCount is the number of channels used when up-mixing and down-mixing connections to any inputs to the node. The default value is 2 except for specific nodes where its value is specially determined.

Returns number
Inherited from Instrument.channelCount

Defined in Tone/core/context/ToneAudioNode.ts:153
set channelCount(channelCount): void
Parameters
channelCount: number
Returns void
Inherited from Instrument.channelCount

Defined in Tone/core/context/ToneAudioNode.ts:156
channelCountMode
get channelCountMode(): ChannelCountMode
channelCountMode determines how channels will be counted when up-mixing and down-mixing connections to any inputs to the node. The default value is "max". This attribute has no effect for nodes with no inputs.

"max" - computedNumberOfChannels is the maximum of the number of channels of all connections to an input. In this mode channelCount is ignored.
"clamped-max" - computedNumberOfChannels is determined as for "max" and then clamped to a maximum value of the given channelCount.
"explicit" - computedNumberOfChannels is the exact value as specified by the channelCount.
Returns ChannelCountMode
Inherited from Instrument.channelCountMode

Defined in Tone/core/context/ToneAudioNode.ts:170
set channelCountMode(channelCountMode): void
Parameters
channelCountMode: ChannelCountMode
Returns void
Inherited from Instrument.channelCountMode

Defined in Tone/core/context/ToneAudioNode.ts:173
channelInterpretation
get channelInterpretation(): ChannelInterpretation
channelInterpretation determines how individual channels will be treated when up-mixing and down-mixing connections to any inputs to the node. The default value is "speakers".

Returns ChannelInterpretation
Inherited from Instrument.channelInterpretation

Defined in Tone/core/context/ToneAudioNode.ts:184
set channelInterpretation(channelInterpretation): void
Parameters
channelInterpretation: ChannelInterpretation
Returns void
Inherited from Instrument.channelInterpretation

Defined in Tone/core/context/ToneAudioNode.ts:187
disposed
get disposed(): boolean
Indicates if the instance was disposed. 'Disposing' an instance means that all of the Web Audio nodes that were created for the instance are disconnected and freed for garbage collection.

Returns boolean
Inherited from Instrument.disposed

Defined in Tone/core/Tone.ts:96
numberOfInputs
get numberOfInputs(): number
The number of inputs feeding into the AudioNode. For source nodes, this will be 0.

Returns number
Example
const node = new Tone.Gain();
console.log(node.numberOfInputs);
Copy
Inherited from Instrument.numberOfInputs

Defined in Tone/core/context/ToneAudioNode.ts:52
numberOfOutputs
get numberOfOutputs(): number
The number of outputs of the AudioNode.

Returns number
Example
const node = new Tone.Gain();
console.log(node.numberOfOutputs);
Copy
Inherited from Instrument.numberOfOutputs

Defined in Tone/core/context/ToneAudioNode.ts:70
sampleTime
get sampleTime(): number
The duration in seconds of one sample.

Returns number
Inherited from Instrument.sampleTime

Defined in Tone/core/context/ToneWithContext.ts:99
Methods
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
Inherited from Instrument.chain

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
Inherited from Instrument.connect

Defined in Tone/core/context/ToneAudioNode.ts:205
disconnect
disconnect(destination?, outputNum?, inputNum?): this
disconnect the output

Parameters
Optional destination: InputNode
outputNum: number = 0
inputNum: number = 0
Returns this
Inherited from Instrument.disconnect

Defined in Tone/core/context/ToneAudioNode.ts:234
dispose
dispose(): this
Returns this
Overrides Instrument.dispose

Defined in Tone/instrument/PolySynth.ts:468
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
Inherited from Instrument.fan

Defined in Tone/core/context/ToneAudioNode.ts:264
get
get(): VoiceOptions<Voice>
Returns VoiceOptions<Voice>
Overrides Instrument.get

Defined in Tone/instrument/PolySynth.ts:452
immediate
immediate(): number
Return the current time of the Context clock without any lookAhead.

Returns number
Example
setInterval(() => {
    console.log(Tone.immediate());
}, 100);
Copy
Inherited from Instrument.immediate

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
Inherited from Instrument.now

Defined in Tone/core/context/ToneWithContext.ts:81
releaseAll
releaseAll(time?): this
Trigger the release portion of all the currently active voices immediately. Useful for silencing the synth.

Parameters
Optional time: Unit.Time
Returns this
Defined in Tone/instrument/PolySynth.ts:460
set
set(options): this
Set a member/attribute of the voices

Parameters
options: RecursivePartial<VoiceOptions<Voice>>
Returns this
Example
const poly = new Tone.PolySynth().toDestination();
// set all of the voices using an options object for the synth type
poly.set({
    envelope: {
        attack: 0.25
    }
});
poly.triggerAttackRelease("Bb3", 0.2);
Copy
Overrides Instrument.set

Defined in Tone/instrument/PolySynth.ts:439
sync
sync(): this
Returns this
Overrides Instrument.sync

Defined in Tone/instrument/PolySynth.ts:409
toDestination
toDestination(): this
Connect the output to the context's destination node.

Returns this
Example
const osc = new Tone.Oscillator("C2").start();
osc.toDestination();
Copy
Inherited from Instrument.toDestination

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
Inherited from Instrument.toFrequency

Defined in Tone/core/context/ToneWithContext.ts:132
toMaster
toMaster(): this
Connect the output to the context's destination node.

Returns this
See
toDestination

Deprecated
Inherited from Instrument.toMaster

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
Inherited from Instrument.toSeconds

Defined in Tone/core/context/ToneWithContext.ts:121
toString
toString(): string
Convert the class to a string

Returns string
Example
const osc = new Tone.Oscillator();
console.log(osc.toString());
Copy
Inherited from Instrument.toString

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
Inherited from Instrument.toTicks

Defined in Tone/core/context/ToneWithContext.ts:142
triggerAttack
triggerAttack(notes, time?, velocity?): this
Trigger the attack portion of the note

Parameters
notes: Unit.Frequency | Unit.Frequency[]
The notes to play. Accepts a single Frequency or an array of frequencies.

Optional time: Unit.Time
The start time of the note.

Optional velocity: number
The velocity of the note.

Returns this
Example
const synth = new Tone.PolySynth(Tone.FMSynth).toDestination();
// trigger a chord immediately with a velocity of 0.2
synth.triggerAttack(["Ab3", "C4", "F5"], Tone.now(), 0.2);
Copy
Overrides Instrument.triggerAttack

Defined in Tone/instrument/PolySynth.ts:333
triggerAttackRelease
triggerAttackRelease(notes, duration, time?, velocity?): this
Trigger the attack and release after the specified duration

Parameters
notes: Unit.Frequency | Unit.Frequency[]
The notes to play. Accepts a single Frequency or an array of frequencies.

duration: Unit.Time | Unit.Time[]
the duration of the note

Optional time: Unit.Time
if no time is given, defaults to now

Optional velocity: number
the velocity of the attack (0-1)

Returns this
Example
const poly = new Tone.PolySynth(Tone.AMSynth).toDestination();
// can pass in an array of durations as well
poly.triggerAttackRelease(["Eb3", "G4", "Bb4", "D5"], [4, 3, 2, 1]);
Copy
Overrides Instrument.triggerAttackRelease

Defined in Tone/instrument/PolySynth.ts:378
triggerRelease
triggerRelease(notes, time?): this
Trigger the release of the note. Unlike monophonic instruments, a note (or array of notes) needs to be passed in as the first argument.

Parameters
notes: Unit.Frequency | Unit.Frequency[]
The notes to play. Accepts a single Frequency or an array of frequencies.

Optional time: Unit.Time
When the release will be triggered.

Returns this
Example
const poly = new Tone.PolySynth(Tone.AMSynth).toDestination();
poly.triggerAttack(["Ab3", "C4", "F5"]);
// trigger the release of the given notes.
poly.triggerRelease(["Ab3", "C4"], "+1");
poly.triggerRelease("F5", "+3");
Copy
Overrides Instrument.triggerRelease

Defined in Tone/instrument/PolySynth.ts:358
unsync
unsync(): this
Unsync the instrument from the Transport

Returns this
Inherited from Instrument.unsync

Defined in Tone/instrument/Instrument.ts:133
Static
getDefaults
getDefaults(): PolySynthOptions<Synth<SynthOptions>>
Returns PolySynthOptions<Synth<SynthOptions>>
Overrides Instrument.getDefaults

Defined in Tone/instrument/PolySynth.ts:173

IMPORTANT: 
Tone.PolySynth
↳ EXTENDS Tone.Instrument
Tone.PolySynth handles voice creation and allocation for any instruments passed in as the second paramter. PolySynth is not a synthesizer by itself, it merely manages voices of one of the other types of synths, allowing any of the monophonic synthesizers to be polyphonic.

CONSTRUCTOR
new Tone.PolySynth ( [ polyphony = 4 ] , [ voice = Tone.Synth ] )
polyphony	
The number of voices to create

type: number or Object
default: 4
voice	
The constructor of the voices uses Tone.Synth by default.

type: function
default: Tone.Synth
DEFAULTS
{
polyphony : 4 ,
volume : 0 ,
detune : 0 ,
voice : Tone.Synth
}
EXAMPLE
//a polysynth composed of 6 Voices of Synth
var synth = new Tone.PolySynth(6, Tone.Synth).toMaster();
//set the attributes using the set interface
synth.set("detune", -1200);
//play a chord
synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
MEMBERS
detune
voices
channelInterpretation
context
numberOfInputs
numberOfOutputs
channelCount
channelCountMode
volume
METHODS
set
dispose
triggerAttack
triggerAttackRelease
triggerRelease
get
releaseAll
sync
chain
connect
disconnect
fan
toMaster
unsync
Members
∿ .detune ↝ Cents #
The detune in cents

</>
.voices ↝ Array #
the array of voices

</>
↳inherited from Tone.AudioNode
.channelInterpretation ↝ String READONLY #
channelInterpretation determines how individual channels will be treated when up-mixing and down-mixing connections to any inputs to the node. The default value is “speakers”.

</>
↳inherited from Tone.AudioNode
.context ↝ Tone.Context READONLY #
Get the audio context belonging to this instance.

</>
↳inherited from Tone.AudioNode
.numberOfInputs ↝ Number READONLY #
The number of inputs feeding into the AudioNode. For source nodes, this will be 0.

</>
↳inherited from Tone.AudioNode
.numberOfOutputs ↝ Number READONLY #
The number of outputs coming out of the AudioNode.

</>
↳inherited from Tone.AudioNode
.channelCount ↝ Number READONLY #
channelCount is the number of channels used when up-mixing and down-mixing connections to any inputs to the node. The default value is 2 except for specific nodes where its value is specially determined.

</>
↳inherited from Tone.AudioNode
.channelCountMode ↝ String READONLY #
channelCountMode determines how channels will be counted when up-mixing and down-mixing connections to any inputs to the node. The default value is “max”. This attribute has no effect for nodes with no inputs.

</>
↳inherited from Tone.Instrument
∿ .volume ↝ Decibels #
The volume of the output in decibels.

EXAMPLE
source.volume.value = -6;
</>
Methods
.set ( ) #
params	
type: Object or string
value	
type: number
optional
rampTime	
type: Time
optional
↪ returns Tone.PolySynth	
this

Set a member/attribute of the voices.

EXAMPLE
poly.set({
	"filter" : {
		"type" : "highpass"
	},
	"envelope" : {
		"attack" : 0.25
	}
});
</>
.dispose ( ) #
↪ returns Tone.PolySynth	
this

Clean up.

</>
.triggerAttack ( ) #
notes	
The notes to play. Accepts a single Frequency or an array of frequencies.

type: Frequency or Array
time	
The start time of the note.

type: Time
default: now
velocity	
The velocity of the note.

type: number
default: 1
↪ returns Tone.PolySynth	
this

Trigger the attack portion of the note

EXAMPLE
//trigger a chord immediately with a velocity of 0.2
poly.triggerAttack(["Ab3", "C4", "F5"], undefined, 0.2);
</>
.triggerAttackRelease ( ) #
notes	
The notes to play. Accepts a single Frequency or an array of frequencies.

type: Frequency or Array
duration	
the duration of the note

type: Time
time	
if no time is given, defaults to now

type: Time
default: now
velocity	
the velocity of the attack (0-1)

type: number
default: 1
↪ returns Tone.PolySynth	
this

Trigger the attack and release after the specified duration

EXAMPLE
//trigger a chord for a duration of a half note
poly.triggerAttackRelease(["Eb3", "G4", "C5"], "2n");
 
EXAMPLE
//can pass in an array of durations as well
poly.triggerAttackRelease(["Eb3", "G4", "C5"], ["2n", "4n", "4n"]);
</>
.triggerRelease ( ) #
notes	
The notes to play. Accepts a single Frequency or an array of frequencies.

type: Frequency or Array
time	
When the release will be triggered.

type: Time
default: now
↪ returns Tone.PolySynth	
this

Trigger the release of the note. Unlike monophonic instruments, a note (or array of notes) needs to be passed in as the first argument.

EXAMPLE
poly.triggerRelease(["Ab3", "C4", "F5"], "+2n");
</>
.get ( ) #
params	
the parameters to get, otherwise will return all available.

type: Array
optional
Get the synth’s attributes. Given no arguments get will return all available object properties and their corresponding values. Pass in a single attribute to retrieve or an array of attributes. The attribute strings can also include a “.” to access deeper properties.

</>
.releaseAll ( ) #
time	
When the notes should be released.

type: Time
default: now
↪ returns Tone.PolySynth	
this

Trigger the release portion of all the currently active voices.

</>
.sync ( ) #
↪ returns Tone.Instrument	
this

Sync the instrument to the Transport. All subsequent calls of triggerAttack and triggerRelease will be scheduled along the transport.

EXAMPLE
synth.sync()
//schedule 3 notes when the transport first starts
synth.triggerAttackRelease('8n', 0)
synth.triggerAttackRelease('8n', '8n')
synth.triggerAttackRelease('8n', '4n')
//start the transport to hear the notes
Transport.start()
</>
↳inherited from Tone.AudioNode
.chain ( ) #
nodes	
type: AudioParam or Tone or AudioNode
↪ returns Tone.AudioNode	
this

Connect the output of this node to the rest of the nodes in series.

EXAMPLE
//connect a node to an effect, panVol and then to the master output
 node.chain(effect, panVol, Tone.Master);
 
</>
↳inherited from Tone.AudioNode
.connect ( ) #
unit	
type: Tone or AudioParam or AudioNode
outputNum	
optionally which output to connect from

type: number
default: 0
inputNum	
optionally which input to connect to

type: number
default: 0
↪ returns Tone.AudioNode	
this

connect the output of a ToneNode to an AudioParam, AudioNode, or ToneNode

</>
↳inherited from Tone.AudioNode
.disconnect ( ) #
output	
Either the output index to disconnect if the output is an array, or the node to disconnect from.

type: Number or AudioNode
↪ returns Tone.AudioNode	
this

disconnect the output

</>
↳inherited from Tone.AudioNode
.fan ( ) #
nodes	
type: AudioParam or Tone or AudioNode
↪ returns Tone.AudioNode	
this

connect the output of this node to the rest of the nodes in parallel.

</>
↳inherited from Tone.AudioNode
.toMaster ( ) #
↪ returns Tone.AudioNode	
this

Connect ‘this’ to the master output. Shorthand for this.connect(Tone.Master)

EXAMPLE
//connect an oscillator to the master output
var osc = new Tone.Oscillator().toMaster();
</>
↳inherited from Tone.Instrument
.unsync ( ) #
↪ returns Tone.Instrument	
this

Unsync the instrument from the Transport