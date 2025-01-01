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