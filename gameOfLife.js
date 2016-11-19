var app = angular.module("gameOfLife", []); 

app.controller("gameCtrl", function($scope) {

    //set game parameters: 

    $scope.gameOn = false;
    $scope.tic = 0;
    $scope.cells = 0;
    $scope.rows = 200, $scope.cols = 200;
    var cellSize = 4, timeInterval = 1, numOfCells = 0, tic = 0;
    var livingCells = {}, nextTicCells = {};

    // set canvas:

    var canvas = document.getElementById('board');
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    canvas.addEventListener("click", function (e) {
        mark(e.layerX,e.layerY);
    }, false);

    // this helper array will help find neighbors of a certain cell
    var neighborsArray = [[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]];

    function unmarkCell(row,col,arr){
        delete arr[row][col];
        ctx.fillStyle = "white";
        ctx.fillRect(row*cellSize, col*cellSize, cellSize, cellSize);
   }

    function markCell(row,col,arr){
        if (!arr[row]) arr[row] = {}
        arr[row][col] = true;
        ctx.fillStyle = "black";
        ctx.fillRect(row*cellSize, col*cellSize, cellSize, cellSize);
    }

    var makeMove = function(){
        tic++;
        nextTicCells = {};
        for (var a in livingCells){  // check every row with living cells
            for (var b in livingCells[a]){ // check every living cell in row
                var row = parseInt(a);
                var col = parseInt(b);
                for (var i = 0; i < 8; i++){ // check every neighbor
                    childRow = row + neighborsArray[i][0];
                    childCol = col + neighborsArray[i][1];
                    if (childRow >= 0 && childRow < $scope.rows && // check neighbours are inside board
                        childCol >= 0 && childCol < $scope.cols){
                        if((!livingCells[childRow] || 
                            (livingCells[childRow] && !livingCells[childRow][childCol])) && // neighbor is not in living cells
                            (!nextTicCells[childRow] || 
                            (nextTicCells[childRow] && !nextTicCells[childRow][childCol]))){ // neighbor is checked only once
                            if (checkSurroundingCells(childRow,childCol) == 3){
                                markCell(childRow,childCol,nextTicCells);
                                numOfCells++;
                            }
                        }
                    }
                } 
                var n = checkSurroundingCells(row,col); // check if the cell itself 
                if (n == 2 || n == 3){
                    markCell(row,col,nextTicCells); //cell stays
                } else {  //clear cell from board
                    ctx.fillStyle = "white";
                    ctx.fillRect(row*cellSize, col*cellSize, cellSize, cellSize);
                    numOfCells--;
                }
            }
        }
        livingCells = nextTicCells;
    }

    // checkSurroundingCells returns the number of living neighbors to a certain cell
    var checkSurroundingCells = function(row,col){
        var count = 0, rowOffset, colOffset;
        for (var i = 0; i < 8; i++){
            rowOffset = row + neighborsArray[i][0];
            colOffset = col + neighborsArray[i][1];
            if (rowOffset >= 0 && rowOffset < $scope.rows &&
                colOffset >= 0 && colOffset < $scope.cols){
                if (livingCells[rowOffset] && livingCells[rowOffset][colOffset]){
                    count++;
                }
            }
        }  
        return count;
    }

    var mark = function(row,col){ 
        row = (row - row % cellSize)/cellSize;
        col = (col - col % cellSize)/cellSize;
        if (!$scope.gameOn){
            if (livingCells[row] && livingCells[row][col]) {
                numOfCells--;
                unmarkCell(row,col,livingCells);
            }
            else {
                numOfCells++;
                markCell(row,col,livingCells);
            }
        }
    }

    // Page UI:

    $scope.play = function(row,cell){ 
        if ($scope.gameOn){ //pause
            $scope.tic = tic;
            $scope.cells = numOfCells;
            $scope.gameOn = false;
            if (promise){
                clearInterval(promise);
            }
        } else { //start game
            $scope.gameOn = true;
            promise = setInterval(function(){
                makeMove();
            }, timeInterval);
        }
    }

    $scope.randomize = function(row,cell){ 
        $scope.resetGame();
        for (var i = 0; i < $scope.rows; i++){
            for (var j = 0; j < $scope.cols; j++){
                if (Math.random() >= 0.5) {
                    numOfCells++;
                    markCell(i,j,livingCells)
                }
            }
        }
    }

    $scope.step = function(row,cell){ 
        makeMove();
        $scope.tic = tic;
        $scope.cells = numOfCells;
    }

    $scope.resetGame = function(){
        numOfCells = 0;
        tic = 0;
        $scope.tic = 0;
        $scope.cells = 0;
        $scope.gameOn = false;
        livingCells = {}
        ctx.closePath(); 
        ctx.beginPath(); 
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
    } 

    $scope.resetGame();
    
});
