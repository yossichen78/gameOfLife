#Game Of Life 2nd Implementation

In this implementation I used an object that contains all of the current living cells. 
In every iteration each cell's neighbors is checked - whether its going to be alive next tic or not.
All living cells are inserted into a new object and are drawn on the board. At the end of the iteration the objects are replaced.

What slows down this implementation is access to the DOM each time a cell is drawn into the board.