Home
Yotam Mann edited this page on Sep 16, 2020 · 8 revisions
Tone.js Wiki
Working with Tone.js
To get started sequencing and synthesizing notes, take a look at a basic arpeggiator walkthrough.

Time
Time in Tone.js lets you think in musical timing instead of seconds. Every method which takes time as an argument also accepts Time. The value of Time is relative to the current tempo of the Tone.Transport.

Signals
Signals plays an important role in the library. Understanding Tone.Signal will help you create tightly synchronized and interestingly automated applications.

Transport
David Brochart edited this page on Mar 13, 2021 · 5 revisions
Tone.Transport is the master timekeeper, allowing for application-wide synchronization of sources, signals and events along a shared timeline. Callbacks scheduled with Tone.Transport will be invoked just before the scheduled time with the exact time of the event passed in as the first parameter to the callback.

Tone.Transport's callbacks pass time into the callback because, without the Web Audio API, Javascript timing can be quite imprecise. For example, setTimeout(callback, 100) will be invoked around 100 milliseconds later, but many musical applications require sub-millisecond accuracy. The Web Audio API provides sample-accurate scheduling for methods like start, stop and setValueAtTime, so we have to use the precise time parameter passed into the callback to schedule methods within the callback.

Additionally, by abstracting away the Web Audio clock, Tone.Transport lets you think in terms of musical timing. In the Web Audio API, all time values are in terms of the AudioContext's time, which starts at 0 when the page is loaded and counts upward in seconds. With Tone.Transport, you can schedule events in bars and beats without having to convert everything to seconds.

Basics
Tone.Transport.schedule(function(time){
	//time = sample accurate time of the event
}, "1m");
The above callback will be invoked each time the Transport reaches the first measure. If the Transport is set to loop, or stopped and restarted, the callback will fire each time it reaches the scheduled position along the timeline.

The callback won't fire until the Transport is started.

Tone.Transport.start();
Scheduling API
There are three basic methods for timing events with Tone.Transport; schedule, scheduleRepeat and scheduleOnce. All three of these methods return a unique ID which can be used to cancel the callback using clear.

schedule(callback, time)
Tone.Transport.schedule will add a callback event to a specific position along the Transport which will be invoked each time the Transport reaches that position.

Tone.Transport.schedule(function(time){
	//invoked when the Transport starts
}, 0);
scheduleRepeat(callback, interval, startTime, duration)
Schedule an event to be invoked at the given interval, starting at startTime and for the specified duration. If no startTime is passed in, the interval will start at the current tick if the Transport is started, or at 0 if the Transport is stopped. If no duration is given, the callback will repeat infinitely.

//play a note every eighth note starting from the first measure
Tone.Transport.scheduleRepeat(function(time){
	note.triggerAttack(time);
}, "8n", "1m");
scheduleOnce(callback, time)
Schedule an event which will only be invoked once. After the event is invoked, it will be removed. If the given time is before the current Transport's position, the event will be invoked immediately.

clear(eventID)
Each of the scheduling methods returns a unique ID. This ID can be used to cancel the event using clear.

Attributes
bpm
Tempo-relative values (like "1m") are evaluated against the Transport's bpm (beats per minute) value. Tone.Transport.bpm is a signal-rate value, which means that it's capable of smooth tempo-curves and automation. All callbacks scheduled with the Transport will adjust their timing to match the new tempo.

//smoothly ramp the tempo to 240 bpm over 4 seconds
Tone.Transport.bpm.rampTo(240, 4);
loop
When loop is set to true, the Transport will loop between loopStart and loopEnd.

timeSignature
The transport is capable of any time signature, but the value will be reduced to a number over 4. So for example, 4/4 time would be set as just 4, and 6/8 time would be set as 3.

If an array is given, it will be reduced to just the numerator value over 4 ([7, 8] becomes just 3.5).

swing
The transport has a swing attribute which is a number between 0-1. It controls how laid back the swingSubdivision.

swingSubdivision
The swingSubdivision sets which subdivision to apply the swing to. The default value is "16n". The subdivision can be set to anything less than a quarter note. The downbeat will never be swung.

Instruments
Yotam Mann edited this page on Jul 7, 2016 · 5 revisions
Tone.js has a number of pre-built synthesizers.

Methods
All instruments have the same basic methods for triggering the attack and release of the envelopes.

triggerAttack
triggerAttack takes the note value as the first argument. If no time value is passed in for the second argument, the attack will be triggered immediately. The third argument is the velocity of the attack. The velocity is a value between 0 and 1 which will scale the envelope's attack and sustain values.

//trigger the start of a note.
synth.triggerAttack("C4");

//trigger the start of a note at `time`
synth.triggerAttack("C4", time);

//trigger the start of a note at `time` with a velocity of 50%
synth.triggerAttack("C4", time, 0.5);
triggerRelease
After the attack, the note will stay at the sustain level until triggerRelease is called.

//trigger the release portion of the envelope immediately
synth.triggerRelease();

//trigger the release at `time`
synth.triggerRelease(time);
triggerAttackRelease
To schedule an attack and release together, use triggerAttackRelease.

//trigger "C4" and then 1 second later trigger the release
synth.triggerAttackRelease("C4", 1);
Polyphony with Tone.PolySynth
Each of the synthesizers is monophonic, meaning it can only produce a single note at a time. Tone.PolySynth will turn any of the synthesizers into a polyphonic synthesizer by producing multiple copies of a synth and then handling the triggering of attacks and releases on those synth voices. Tone.PolySynth is not a synth by itself, but just a vessel for constructing multiple voices of any of the other synthesizer types.

The name of the synth is fed to the second argument of Tone.PolySynth to turn the monophonic voice into a polyphonic synthesizer like so:

//to make a 4 voice MonoSynth
var synth = new Tone.PolySynth(4, Tone.MonoSynth);
To set attributes of all the voices, use the set method.

synth.set({
	"envelope" : {
		"attack" : 0.1
	}
});
Unlike the rest of the synthesizers, PolySynth's triggerRelease method needs to be called with the note you want to release.

Effects
Yotam Mann edited this page on Jul 7, 2016 · 5 revisions
Tone.js also has a bunch of stereo and mono effects.

To add an effect to your audio signal, simply connect the effect in between your source and destination. Here is an example which routes a Tone.SimpleSynth through a Tone.Distortion.

//create an effect and connect it to the master output
var dist = new Tone.Distortion().toMaster();
//create a synth and connect it to the effect
var synth = new Tone.SimpleSynth().connect(dist);
//and play a note to hear the distortion
synth.triggerAttackRelease("C4", "8n");
dry/wet
All effects have a dry/wet control called wet which controls how much of the effected ("wet") signal is output compared to the uneffected ("dry") signal. The default value for the effects is 100% wet.

// 50/50 mix
effect.wet.value = 0.5;
//fade to 100% wet over 3 seconds.
effect.wet.rampTo(1, 3);

Autoplay
Yotam Mann edited this page on Apr 16, 2020 · 2 revisions
Autoplay is the source of a lot of weird Tone.js bugs, but luckily the fix is quite simple

Solution
Make sure that you don't start the Transport or play any sounds until the page receives a user gesture (e.g. a button click). Tone.js has a start method which will kick off the audio for your page.

document.querySelector('button').addEventListener('click', async () => {
    await Tone.start()
    // your page is ready to play sounds
})
Problem
Pretty much all browsers won't play any sound on page load anymore. This is known as autoplay. There's a little more background here. Basically the AudioContext (which is responsible for rendering audio in the Web Audio API), starts out as "suspended".

You can check verify this for your page:

// before a user gesture
Tone.context.state === "suspended"
Only after a user gesture in which the user creates a sound or invokes Tone.start() will the AudioContext change its state to "running".

// after Tone.start() is invoked from a user gesture
Tone.context.state === "running"
The way that autoplay is handled can be pretty inconsistent and what counts as a user gesture might be different for different platforms or situations. The most reliable solution is to invoke Tone.start() after a button click.

Background
The purpose of the Autoplay policy is to stop pages from making a sound as soon as it loads. The intention is to give users greater playback control and a good user experience where pages aren't making unwanted sounds at them before they give permission. This has been the case for mobile browsers for quite a while. And in the past few years, desktop browsers have adopted stricter autoplay as well.

Performance
Marcel Blum edited this page on Nov 9, 2021 · 11 revisions
This article provides some resources and best practices for working with Web Audio and Tone.js

Audio Node Performance
Audio failures result in pops, crackles, silence and other unwanted artifacts. Paul Adenot (the author of Firefox's Web Audio implementation) has a great article on the CPU, memory usage and incurred latency of most of the Web Audio nodes. It can be a helpful resource for pinpointing performance bottlenecks. The most processor intensive nodes are the ConvolverNode (Tone.Convolver) and PannerNode using HRTF (Tone.Panner3D). Other than the amount and types of nodes used, Web Audio does not currently offer much in the way of performance configuration and tuning.

context.latencyHint
If you're using the Transport to schedule events, the amount of time in advance events are scheduled is adjustable. Scheduling events farther in advance is easier for the audio thread to process and may improve performance.

The latencyHint of Tone.js's AudioContext can be adjusted by instantiating a new context to replace Tone.js's default context. latencyHint can have a value of "interactive" (default, prioritizes low latency), "playback" (prioritizes sustained playback), or "balanced" (balances latency and performance). Or set it to the number of seconds which events should be scheduled in advance.

Tone.setContext(new Tone.Context({ latencyHint : "playback" }))
context.lookAhead
By default a short lookAhead is used for scheduling everything in Tone.js. The native Web Audio's context.currentTime is summed with the value stored in context.lookAhead which defaults to 0.1 seconds. This performance benefit is obviously at the expense of latency, For lower latency you can either set the lookAhead to a smaller value or 0, or use Tone.immediate() or Tone.context.currentTime which are the same value.

Scheduling in advance
As mentioned, it's best to schedule audio events as in advance as possible. For this reason, it's good to invoke Tone.Transport.start a little bit in the future. Tone.Transport.start("+0.1") will start the Transport 100 milliseconds in the future which is not very perceptible, but can help avoid scheduling errors.

Scheduling further in advance works for triggering playback of sources and synths as well. For example, if you are hearing performance issues when triggering a synth from a mousedown callback, try scheduling the sound a little in advance. Values under 0.1 seconds won't be very noticeable, but could help reduce pops.

element.addEventListener('mousedown', function(){
	//instead of scheduling the synth immediately,
	//try scheduling 50ms in the future to avoid performance-related pops
	synth.triggerAttack('C4', '+0.05')
})
Syncing Visuals
If you're using Tone.Transport, it is important that you do not make draw calls or DOM manipulations inside of the callback provided by Tone.Transport or any of the classes that extend Tone.Event (Part, Sequence, Pattern, Loop). The callback for Tone.Transport uses a WebWorker, it is not synced to the animation frame. Also, Transport callbacks can occur many more times a second than animation frame callbacks and can be invoked in a background tab. Additionally, Transport events can be invoked well in advance of when the event is heard, so visuals triggered inside of one of these callbacks might not align with the audio event they are triggered with.

A solution to synchronizing visuals and audio is to use Tone.Draw. You can schedule a draw callback from within a Transport callback using the AudioContext time that the event is supposed to occur. Tone.Draw will invoke the callback on the nearest animation frame to the given time.

var loop = new Tone.Loop(function(time){
	//instead of scheduling visuals inside of here
	//schedule a deferred callback with Tone.Draw

	Tone.Draw.schedule(function(){
		//this callback is invoked from a requestAnimationFrame
		//and will be invoked close to AudioContext time

	}, time) //use AudioContext time of the event

}, "8n")
Loading and Decoding AudioBuffers
On memory constrained devices like mobile phones, loading many and/or large audio files can cause the browser to crash during the buffer decoding.

BasicSynth
Wayne Lytle edited this page on Aug 31, 2018 · 6 revisions
Basic Synthesis
We can make a basic synthesizer out of an oscillator and an envelope.

Oscillator
As our oscillator source, let's use an OmniOscillator.

var osc = new Tone.OmniOscillator();
Once we're able to (a) set the oscillator's frequency to a desired note, and (b) specify start and stop times, we have a crude synthesizer...

osc.frequency.value = "C4";
osc.start().stop("+8n");
But without further refinement, our synthesizer would have limited flexibility in terms of timbre and dynamics. Also, in its current state, it would emit an unpleasant "click" each time a note is triggered.

Envelope
We can get rid of the "click" (an artifact of the discontinuity resulting from instantaneously jumping from an amplitude of zero to full) by smoothing the onset of the sound. To do this we apply an envelope to the oscillator's amplitude using Tone.AmplitudeEnvelope.

Below we connect the oscillator to our newly created envelope, then route the envelope out directly to the master.

var env = new Tone.AmplitudeEnvelope();
osc.connect(env);
env.toMaster();
Upon starting the oscillator, no sound will be allowed thru until the envelope's Attack stage is triggered. (Note that the oscillator's signal is immediately made available to the envelope when start()'ed, but is suppressed until the Attack starts, then again after the Release stage completes.)

osc.start();
env.triggerAttack();
Read more about using envelopes here.

Tone.Synth
Tone.Synth combines an OmniOscillator and an AmplitudeEnvelope just like we did above, into a convenient package.

Portamento
SimpleSynth also exposes a portamento value. Portamento is the amount of time it takes to slide from one frequency to the next.

Play around with all of SimpleSynth's attributes here.

Arpeggiator
Garrett George edited this page on Apr 10, 2021 · 16 revisions
A Basic Arpeggiator
In this example, we'll create an arpeggiator which plays the next note in a series on every beat.

The Synthesizer
Tone.js has a number of instruments, each with nearly the same interface for triggering attacks and releases. Here we'll use Tone.Synth, but you can easily swap the SimpleSynth for any of the other instruments without changing any other code.

var synth = new Tone.Synth();
We'll also connect our synth to the Destination (formerly known as Master) so that we can hear it.

synth.toDestination();
Triggering Notes
We can trigger the synth to start the attack portion of the note using triggerAttack -- this method takes a note and a time as arguments. To start the release portion of the note, call triggerRelease. Read more about using envelopes here.

Let's trigger the note "C4" then trigger the release a quarter second later (all values are in seconds):

synth.triggerAttack("C4", time);
synth.triggerRelease(time + 0.25);
These two methods are combined into a single call to triggerAttackRelease which takes the note as the first argument, the duration as the second, and the start time as the third argument.

synth.triggerAttackRelease("C4", 0.25, time);
The Arpeggio
Next let's pick a set of notes to arpeggiate over, like a C pentatonic scale. We'll set an interval and get the next note from the array on every loop. If the last argument of triggerAttackRelease is omitted, it defaults to the current time.

var pattern = new Tone.Pattern(function(time, note){
	synth.triggerAttackRelease(note, 0.25);
}, ["C4", "D4", "E4", "G4", "A4"]);
Tone.Pattern will arpeggiate over the given array in a number of different ways ("up", "down", "upDown", "downUp", "random" and more). By default the pattern will iterate upward and then loop back to the beginning.

As with all Event classes, time is passed in as the first argument. This is very important because native Javascript timing is pretty loose. Callbacks scheduled with setInterval for example, will happen around the given time, but there is no guarantee on precision; that's not good enough for musical events.

The last thing to do is to start the pattern from the beginning of the Transport timeline.

// begin at the beginning
pattern.start(0);
And start the Transport to get the clock going.

Tone.Transport.start();

Glossary
Marcel Blum edited this page on Aug 24, 2020 · 6 revisions
Glossary of Terminology
Amplitude
Amplitude is the highest value of a wave.

Audio-Rate
Values that can be automated and scheduled on a single sample level.

see Sampling Rate.

Beat
The beat is the basic unit of time, the pulse. A regularly repeating event.

Bar
see Measure.

Buffer
A buffer is an array of audio data. Typically values are in the range of +1 to -1.

Bus
A bus is an audio pathway that allows you to move a sound from one part of the mixer to another. [link].

Callback
A callback is a function that is passed as an argument to other code, which is expected to call back (execute) the argument at some convenient time. [link]

Compressor
Dynamic range compression or simply compression reduces the volume of loud sounds or amplifies quiet sounds by narrowing or "compressing" an audio signal's dynamic range.

Convolution
Convolution is a process used for simulating the reverberation or effects. It is based on the mathematical convolution operation, and uses a pre-recorded audio sample of the impulse response of the space being modeled. [link]

Decibel
A Decibel is a logarithmic ratio between two values. Since we perceive loudness on a logarithmic scale, decibels are a useful quantifier for volume. [link]

Dry/Wet Control
"Dry" signal is the unprocessed, "clean" signal, while "wet" signal has effects or processes applied to it. the Dry/Wet knob cross-fades between the two signals.

Envelope
Temporal control over the loudness and spectral content of a sound. [link]

Feedback
Feeding the signal back into itself. For audio effects this is only effective if there is a delay signal in the mix, otherwise it leads to uncontrolled positive feedback.

Filter
Audio Filters amplify or attenuate an incoming signal based on its frequency. Common types are "lowpass" which only let frequencies below the "cutoff" pass through, and highpass which only lets high frequencies pass through. [link]

Gain
Gain is the ratio between the input and the output value of a signal. Volume and gain are related in that gain controls the volume, but volume is about the loudness of an acoustic signal as it's coming out of a speaker, gain a multiplication of any signal.

LFO
An Low Frequency Oscillator (LFO) is any oscillator with a frequency of less than 20 or 30hz. These are often used as control signals to modulate synthesis or effects parameters to produce effects such as vibrato, tremolo and phasing. [link]

Mid/Side
Mid/Side processing separates the the 'mid' signal (which comes out of both the left and the right channel) and the 'side' (which only comes out of the the side channels) and effects them separately before being recombined.

Measure
A segment of time corresponding to a specific number of beats (the number of beats is determined by the time signature. Dividing music into bars provides regular reference points to pinpoint locations within a piece of music.

Monophonic
A monophonic synthesizer plays only one note at a time. see Polyphonic.

Polyphonic
A polyphonic synthesizer can play multiple notes at once. see Monophonic.

Ramp
Like an animation tween for audio, a ramp is a smooth interpolation of value over a duration of time.

Sampling Rate
Sampling is the reduction of a continuous analog audio signal to a discrete signal. Typically audio is sampled at over 40,000 times per second as a consequence of the Nyquist Theorem. [link]

Signal
A signal is an audio-rate value which can be used to carry sound waves or sample-rate control data.

ScriptProcessorNode
The ScriptProcessorNode (now deprecated) was a Web Audio API standard for doing DSP in Javascript. While extremely powerful, the ScriptProcessorNode incurs a large performance and latency penalty.

Synthesis
Electrical or digital signals which represent sound.

Time Signature
Specifies how many beats are to be contained in each bar.

Transport
The transport refers to the controls over play/pause/stop/rewind in a Digital Audio Workstation.

Time
Akseli Palén edited this page on Dec 6, 2020 · 7 revisions
All methods which take time as an argument accept a String or Number. Time encoded as a Number is assumed to be seconds and returned. Time encoded as a String can take various forms in order to synchronize it to the Tone.Transport.

Examples:
Numbers
A number will be evaluated as the time (in seconds).

1.2 = 1.2 seconds
"3" = 3 seconds
Notation
Describes time in BPM and time signature relative values.

"4n" = quarter note
"8t" = eighth note triplet
"2m" = two measures
"8n." = dotted-eighth note
Transport Time
Tempo and time signature relative time in the form BARS:QUARTERS:SIXTEENTHS.

"32:0:0" = start of the 32nd measure.
"4:3:2" = 4 bars + 3 quarter notes + 2 sixteenth notes.
"1:2" = 1 bar + 2 quarter notes (sixteenth notes can be omitted)
Frequency
Seconds can also be described in Hz.

"1hz" = 1 second
"5hz" = 0.2 seconds
Ticks
A time relative to the Transport's PPQ (Pulse Per Quarter). The number before the 'i' needs to be an integer.

"1i" = 1 tick
"192i" = 1 quarter note at 192 PPQ
Now-Relative
Prefix any of the above with "+" and it will be interpreted as "the current time plus whatever expression follows"

"+1m" = 1 measure from now
"+0.5" = half a second from now
No Argument
Methods which accept time, no argument (undefined) will be interpreted as "now" (i.e. the audioContext.currentTime).

For example, Tone.MonoSynth's triggerAttack method will accept a time as the second argument, or if a value is ommitted, the it will default to "now".

synth.triggerAttack();//context.currentTime
synth.triggerRelease("+4n"); //a quarter-note from now
Quantization
Using the @ symbol, a Time can be quantized relative to the the Transport's grid.

"@1m" = If the Transport is started, this will return the time of the next measure
Conversion
To convert between seconds and BPM relative values, use Tone.Time

Tone.Time("4n").toSeconds();

TransportTime
George edited this page on Sep 27, 2022 · 4 revisions
This page describes the relationship between the AudioContext time and the Transport's Time.

Scheduling with AudioContext time
The AudioContext currentTime starts at 0 when the page is loaded and counts up in seconds. To schedule a sine wave to play for the first two seconds after a page loads you could do something like this:

var sine = new Tone.Oscillator(440, "sine").toDestination();
//start the oscillator at 0
sine.start(0);
//stop it at 2
sine.stop(2);
On Click
Let's do the same thing, but instead we'll schedule the sine wave to play for two seconds after a button is pressed. We can no longer start at 0 and end at 2 like the above example, since by the time the button is pressed the AudioContext time is greater than 0. The solution is to get the current time of the AudioContext when the button was clicked and schedule relative to that time.

document.querySelector("#theButton").addEventListener("click", function(){
	//get the current time
	var now = Tone.now();
	//schedule relative to 'now'
	sine.start(now);
	sine.stop(now + 2);
});
Now say, instead of just a sine tone, we scheduled an entire song that plays when the button was clicked. You may want to jump ahead to a particular moment in the song, or go back to the beginning, or pause it for a moment. But, the AudioContext provides no way to seek or set the AudioContext time. It is always just counting upwards.

Seekablility
Tone.Transport provides an abstraction over the AudioContext time which allows you to start, stop and seek within the Transport's timeline. For example you could schedule a bunch of events along this timeline which can be started, stopped, paused, resumed, looped, jump to a specific moment, and even change the global tempo while keeping all those events synchronized.

Another Clock
Essentially, the Transport provides another clock that you can use to schedule events without thinking too much about what the current AudioContext time is. In the end, all Web Audio events need to be scheduled using the AudioContext time because this number is necessary for sample-accurate scheduling. Tone.js make it so that you rarely need to use the AudioContext's time directly.

Scheduling with TransportTime
If we wanted to play a short sine tone every 2 seconds indefinitely we might use Tone.Loop.

var loop = new Tone.Loop(function(time){
	sine.start(time);
	sine.stop(time + 0.5);
}, 2);
One thing to notice here is that time is passed in as the first argument to the callback function. This time is the AudioContext time when the event should be scheduled. To make the duration a half-second, we schedule the stop 0.5 seconds after the passed in time just like the button-click example.

The loop we scheduled will not play until started. Tone.Loop and all classes which extend Tone.Event are scheduled with time values relative to the Transport time (and not the AudioContext time like the examples above). In the documentation this Transport timeline-relative positioning is called TransportTime. TransportTime has all the same tempo-relative encodings as Time, but the event is scheduled against a specific position along the Transport.

So we may want to schedule this loop to start from the beginning of the Transport (time = 0).

loop.start(0);
But even once we call start on the loop, our Transport has not been started yet, we must start the Transport in order to hear the loop start.

Tone.Transport.start();
Unlike the Tone.Event classes, Tone.Transport.start takes the AudioContext time as the argument and not the TransportTime. No argument evaluates to the currentTime of the AudioContext. No arguments for the start parameter of Tone.Event classes evaluates to the current position of the Transport.

Example
We've got many things that are being started and stopped in the loop example. Here's a similar snippet of code with a timeline showing when each of the events are invoked.

function loopCallback(time){
	console.log("loop");
}
var loop = new Tone.Loop(loopCallback, 2);
loop.start(0).stop(5);


function eventCallback(time){
	console.log("event");
}
var event = new Tone.Event(eventCallback).start(3);

//start the Transport 2 seconds after the page loads
Tone.Transport.start(2);
//stop it and restart it
Tone.Transport.stop(6);
Tone.Transport.start(8);
Timeline of Transport on AudioContext time

The Time Argument
The reason time is passed into the callback function is because the function does not actually fire precisely at the scheduled time; instead it is invoked slightly before the scheduled time. The small amount of time between the callback being invoked and the time passed into the callback function is called the lookAhead, and it's how we schedule sample-accurate events just in time.