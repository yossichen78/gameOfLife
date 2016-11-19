
var app = angular.module("gameOfLife", []); 

app.controller("gameCtrl", function($scope,$interval) {
    $scope.board = [];
    $scope.gameOn = false;
    $scope.tic = 0;
    $scope.rows = 100;
    $scope.cols = 100;
    $scope.timeInterval = 200;
    $scope.cells = 0;

    var promise;
    // this will help calculate the neighbors of a certain cell
    var neighborsArray = [[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]];

	// initialize board
    $scope.initBoard = function(){
         for (var i = 0; i < $scope.rows; i++){
            $scope.board.push([]);  
            for (var j = 0; j < $scope.cols; j++){
                $scope.board[i].push(false);
            }
        }
    }
  
    var playTic = function(){ 
        var count = 0;
        var clonedBoard = [];
        for (var i = 0; i < $scope.rows; i++){
            clonedBoard.push([]);  
            for (var j = 0; j < $scope.cols; j++){
                clonedBoard[i].push(false);
            }
        }
        for (var i = 0; i < $scope.rows; i++){
            for (var j = 0; j < $scope.cols; j++){
                var numOfNeighbors = checkSurroundingCells(i,j);
                if ($scope.board[i][j]){
                    count++;
                    if (numOfNeighbors < 2 || numOfNeighbors > 3) clonedBoard[i][j] = false;
                    else clonedBoard[i][j] = true;
                } else {
                    if (numOfNeighbors == 3) clonedBoard[i][j] = true;
                }
            }
        }
        $scope.board = clonedBoard;
        $scope.cells = count;
    };

    $scope.mark = function(row,cell){ 
        if (!$scope.gameOn){
            if ($scope.board[row][cell]) {
                $scope.board[row][cell] = false;
                $scope.cells--;
            } else {
                $scope.board[row][cell] = true;
                $scope.cells++;
            } 
        }
    }
    
    $scope.invert = function(row,cell){ 
        for (var i = 0; i < $scope.rows; i++){
            for (var j = 0; j < $scope.cols; j++){
                $scope.board[i][j] = !$scope.board[i][j];
            }
        }
    }

    $scope.randomize = function(row,cell){ 
        for (var i = 0; i < $scope.rows; i++){
            for (var j = 0; j < $scope.cols; j++){
                $scope.board[i][j] = Math.random() >= 0.5;
            }
        }
    }


    var checkSurroundingCells = function(row,col){
        var count = 0, rowOffset, colOffset;
        for (var i = 0; i < neighborsArray.length; i++){
            rowOffset = row + neighborsArray[i][0];
            colOffset = col + neighborsArray[i][1];
            if (rowOffset >= 0 && rowOffset < $scope.rows &&
                colOffset >= 0 && colOffset < $scope.cols){
                if ($scope.board[rowOffset][colOffset]){
                    count++;
                }
            }
        }  
        return count;
    }


    $scope.play = function(row,cell){ 
        if ($scope.gameOn){
            $scope.gameOn = false;
            if (promise){
                $interval.cancel(promise);
            }
        } else {
            $scope.gameOn = true;
            promise = $interval(function(){
                playTic();
                $scope.tic++;
                if (!$scope.cells) $scope.play();
            }, $scope.timeInterval);
        }
    }

    $scope.resetGame = function(){
        $scope.gameOn = false;
        $scope.tic = 0;
		$scope.gameOn = false;
        $scope.board = [];
        $scope.cells = 0;
        $scope.initBoard();
    } 

    $scope.initBoard();
 	
});