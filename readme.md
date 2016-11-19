#Game Of Life 3rd Implementation

Instructions: 
Download css/html/js files, open gameOfLife.html in browser

This is the fastest implementation so far.
Improvements:

- Use html canvas instead of updating the DOM with angularJS. Angular is only used for the layout + game controls
- To speed things up the current number of tics/cells is displayed only when the game is not running (when paused, or when using "Step")
- The living cells list is now 2d, so search is easier. 

The slower versions are in the other folders.

#Game Of Life 2nd Implementation

In this implementation I used an object that contains all of the current living cells. 
In every iteration each cell's neighbors is checked - whether its going to be alive next tic or not.
All living cells are inserted into a new object and are drawn on the board. At the end of the iteration the objects are replaced.

What slows down this implementation is access to the DOM each time a cell is drawn into the board.

#Game Of Life 1st Implementation

This is the naive approach which I tried at the beginning - holding the enitre board in a 2d matrix.
Every iteration I go over the entire board - checking each cell's 8 neighbors and marking them in a 2nd matrix.
