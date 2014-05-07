Datamonster v.1.1
======

Datamonster is a JavaScript addon for [DripStat](https://dripstat.com/game/).

This is not for cheating, it simply displays information you can find out on your own (if you wanted to do all the calculations) and cleans-up the UI a bit (if enabled). Everything in Datamonster is an option that is disabled by default so you can pick and choose what you'd like see/change.

How to Use/Install
-----
Create a Bookmark and name it "Datamonster" (or whatever you want to call it) then copy & paste the below code into the URL text box and click Save. Next, go [DripStat](https://dripstat.com/game/) (wait for the page to fully load) and click the Bookmark you just created. If done correctly, you should see a new option on DripStat's navigation bar that reads "Datamonster".
```JavaScript
javascript:(function(){
	$.getScript('https://raw.githubusercontent.com/FlyingKumquat/Datamonster/master/datamonster.js')
}());
```

Alternatively, you can copy & paste the `$.getScript` function directly into the browser's console (usually accessed by pressing CTRL+SHIFT+I).
```JavaScript
$.getScript('https://raw.githubusercontent.com/FlyingKumquat/Datamonster/master/datamonster.js')
```

Features/Config Options
-----
* Show Bottom Bar
  * Displays a bar on the bottom of the screen that displays the Income, Cost Per Income, and Time Left of each store item.
* Re-Style/Clean DripStat's UI
* Use Datamonster's Tooltips
* Show Personal Income Averages
* Calculate "Time Left" From 10 Second Average
* Color-Code Store Items
* "Drip Memory" Confirmation
