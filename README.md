Datamonster v.1.4
======

Datamonster is a JavaScript addon for [DripStat](https://dripstat.com/game/).

This is not for cheating, it simply displays information you can find out on your own (if you wanted to do all the calculations) and cleans-up the UI a bit (if enabled). Everything in Datamonster is an option that is disabled by default so you can pick and choose what you'd like see/change.

How to Use/Install
-----
Create a Bookmark and name it "Datamonster" (or whatever you want to call it) then copy & paste the below code into the URL text box and click Save. Next, go [DripStat](https://dripstat.com/game/) (wait for the page to fully load) and click the Bookmark you just created. If done correctly, you should see a new option on DripStat's navigation bar that reads "Datamonster".
```JavaScript
javascript:(function(){
	$.getScript('https://rawgit.com/chall8908/Datamonster/v.1.4/datamonster.js')
}());
```

Alternatively, you can copy & paste the `$.getScript` function directly into the browser's console. Information on how to open your browser's console can be found [here](http://webmasters.stackexchange.com/questions/8525/how-to-open-the-javascript-console-in-different-browsers).
```JavaScript
$.getScript('https://rawgit.com/chall8908/Datamonster/v.1.4/datamonster.js')
```

Lastly, if you would prefer the latest changes, use the following for your bookmark:
```JavaScript
javascript:(function(){
	$.getScript('https://rawgit.com/chall8908/Datamonster/master/datamonster.js')
}());
```

Or paste this into your browser's console:
```JavaScript
$.getScript('https://rawgit.com/chall8908/Datamonster/master/datamonster.js')
```

Features/Config Options
-----
* __Show Bottom Bar__
  * Displays a bar on the bottom of the screen that displays the Income, Cost Per Income, and Time Left of each store item
    * __Income__ - The amount of memory generated by the store item
    * __Cost Per Income__ - The amount of memory it costs to gain 1 byte per second
    * __Time Left__ - The amount of time left before you can afford the store item
* __Re-Style/Clean DripStat's UI__
  * Changes some of the styling of DripStat's UI _(mainly just to make thing's fit better)_
* __Use Datamonster's Tooltips__
  * Makes the store item/upgrade tooltips a little more detailed and 'screen-friendly'
* __Color-Code Store Items__
  * Colors all store items/upgrades to reflect their cost per income
    * __Green__ _(best)_ - Has the best cost per income
    * __Yellow__ _(good)_ - Closer to the best than it is to the worst cost per income
    * __Orange__ _(bad)_ - Closer to the worst than it is to the best cost per income
    * __Red__ _(worst)_ - Has the worst cost per income
* __Show Global Income Averages__
  * Creates a small display underneath the global progress bar to show averages of how much memory is being dripped 1 Minute, 3 Minute, 5 Minute, and 10 Minute
* __Show Personal Income Averages__
  * Creates a small display underneath the top progress bar to show averages of how much memory you are making every 1 Second, 10 Seconds, 30 Seconds, and 1 Minute
* __Calculate "Time Left" From 10 Second Average__
  * Calculates the time left (displayed on Datamonster's bottom bar & tooltips) based on the '10 Second' personal income average
* __Show Global Time Left Estimate__
  * Calculates an estimate of the time left before the current level finishes _(displays on the global progress bar)_
* __"Drip Memory" Confirmation__
  * Creates a confirmation window when clicking "Drip Memory" for you to answer Yes or No to dripping your memory
* __Show "Player Scores" Tab__
  * Enables a new tab that shows a list of the next 5 people ahead of you in score _(updates every 30 seconds)_
