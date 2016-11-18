
var app = angular.module("gameOfLife", []); 

app.controller("gameCtrl", function($scope,$interval) {
    $scope.board = [];
    $scope.gameOn = false;
    $scope.rows = 100;
    $scope.cols = 100;
    $scope.timeInterval = 10;

    var livingCells = {};
    var nextTicCells = {};
    var livingCellsNum = 0;

    var promise;
    // this will help calculate the neighbors of a certain cell
    var neighborsArray = [[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]];

    // initialize board
    initBoard = function(){
        $scope.board = [];  
        livingCells = []
        livingCellsNum = 0;
        for (var i = 0; i < $scope.rows; i++){
            $scope.board.push([]);  
            for (var j = 0; j < $scope.cols; j++){
                $scope.board[i].push(false);
            }
        }
    }

    function unmarkCell(row,col,arr){
        delete arr[row+"-"+col];
        livingCellsNum--;
        angular.element(document.getElementById(row+'-'+col)).removeClass('full');
    }

    function markCell(row,col,arr){
        arr[row+"-"+col] = true;
        livingCellsNum++;
        angular.element(document.getElementById(row+'-'+col)).addClass('full');
    }

    var makeMove = function(){
        livingCellsNum = 0;
        nextTicCells = {};
        for (a in livingCells){
            var coor = a.split("-");
            var counter = 0;
            var row = parseInt(coor[0]);
            var col = parseInt(coor[1]);
            for (var i = 0; i < 8; i++){
                childRow = row + neighborsArray[i][0];
                childCol = col + neighborsArray[i][1];
                if (childRow >= 0 && childRow < $scope.rows &&
                    childCol >= 0 && childCol < $scope.cols){
                    if(!livingCells[childRow+'-'+childCol] && !nextTicCells[childRow+'-'+childCol]){
                        if (checkSurroundingCells(childRow,childCol) == 3){
                            markCell(childRow,childCol,nextTicCells);
                        }
                    }
                }
            }
            var n = checkSurroundingCells(row,col);
            if (n == 2 || n == 3){
                markCell(row,col,nextTicCells);
            } else {
                angular.element(document.getElementById(row+'-'+col)).removeClass('full')
            }
        }
        livingCells = nextTicCells;
    }



    var checkSurroundingCells = function(row,col){
        var count = 0, rowOffset, colOffset;
        for (var i = 0; i < 8; i++){
            rowOffset = row + neighborsArray[i][0];
            colOffset = col + neighborsArray[i][1];
            if (rowOffset >= 0 && rowOffset < $scope.rows &&
                colOffset >= 0 && colOffset < $scope.cols){
                if (livingCells[rowOffset+"-"+colOffset]){
                    count++;
                }
            }
        }  
        return count;
    }

    $scope.mark = function(row,col){ 
        if (!$scope.gameOn){
            if (livingCells[row+"-"+col]) {
                unmarkCell(row,col,livingCells);
            }
            else {
                markCell(row,col,livingCells);
            }
        }
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
                makeMove();
            }, $scope.timeInterval);
        }
    }

    $scope.randomize = function(row,cell){ 
        for (var i = 0; i < $scope.rows; i++){
            for (var j = 0; j < $scope.cols; j++){
                if (Math.random() >= 0.5) markCell(i,j,livingCells)
            }
        }
    }

    $scope.resetGame = function(){
        $scope.gameOn = false;
        $scope.gameOn = false;
        $scope.board = [];
        initBoard();
    } 

    initBoard();
    
});

// app.controller("gameCtrl", function($scope,$interval) {
//     $scope.board = [];
//     $scope.gameOn = false;
//     $scope.tic = 0;
//     $scope.rows = 100;
//     $scope.cols = 100;
//     $scope.timeInterval = 200;
//     $scope.cells = 0;

//     var promise;
//     // this will help calculate the neighbors of a certain cell
//     var neighborsArray = [[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]];

// 	// initialize board
//     $scope.initBoard = function(){
//          for (var i = 0; i < $scope.rows; i++){
//             $scope.board.push([]);  
//             for (var j = 0; j < $scope.cols; j++){
//                 $scope.board[i].push(false);
//             }
//         }
//     }
  
//     var playTic = function(){ 
//         var count = 0;
//         var clonedBoard = [];
//         for (var i = 0; i < $scope.rows; i++){
//             clonedBoard.push([]);  
//             for (var j = 0; j < $scope.cols; j++){
//                 clonedBoard[i].push(false);
//             }
//         }
//         for (var i = 0; i < $scope.rows; i++){
//             for (var j = 0; j < $scope.cols; j++){
//                 var numOfNeighbors = checkSurroundingCells(i,j);
//                 if ($scope.board[i][j]){
//                     count++;
//                     if (numOfNeighbors < 2 || numOfNeighbors > 3) clonedBoard[i][j] = false;
//                     else clonedBoard[i][j] = true;
//                 } else {
//                     if (numOfNeighbors == 3) clonedBoard[i][j] = true;
//                 }
//             }
//         }
//         $scope.board = clonedBoard;
//         $scope.cells = count;
//     };

//     $scope.mark = function(row,cell){ 
//         if (!$scope.gameOn){
//             if ($scope.board[row][cell]) {
//                 $scope.board[row][cell] = false;
//                 $scope.cells--;
//             } else {
//                 $scope.board[row][cell] = true;
//                 $scope.cells++;
//             } 
//         }
//     }
    
//     $scope.invert = function(row,cell){ 
//         for (var i = 0; i < $scope.rows; i++){
//             for (var j = 0; j < $scope.cols; j++){
//                 $scope.board[i][j] = !$scope.board[i][j];
//             }
//         }
//     }

//     $scope.randomize = function(row,cell){ 
//         for (var i = 0; i < $scope.rows; i++){
//             for (var j = 0; j < $scope.cols; j++){
//                 $scope.board[i][j] = Math.random() >= 0.5;
//             }
//         }
//     }


//     var checkSurroundingCells = function(row,col){
//         var count = 0, rowOffset, colOffset;
//         for (var i = 0; i < neighborsArray.length; i++){
//             rowOffset = row + neighborsArray[i][0];
//             colOffset = col + neighborsArray[i][1];
//             if (rowOffset >= 0 && rowOffset < $scope.rows &&
//                 colOffset >= 0 && colOffset < $scope.cols){
//                 if ($scope.board[rowOffset][colOffset]){
//                     count++;
//                 }
//             }
//         }  
//         return count;
//     }


//     $scope.play = function(row,cell){ 
//         if ($scope.gameOn){
//             $scope.gameOn = false;
//             if (promise){
//                 $interval.cancel(promise);
//             }
//         } else {
//             $scope.gameOn = true;
//             promise = $interval(function(){
//                 playTic();
//                 $scope.tic++;
//                 if (!$scope.cells) $scope.play();
//             }, $scope.timeInterval);
//         }
//     }

//     $scope.resetGame = function(){
//         $scope.gameOn = false;
//         $scope.tic = 0;
// 		$scope.gameOn = false;
//         $scope.board = [];
//         $scope.cells = 0;
//         $scope.initBoard();
//     } 

//     $scope.initBoard();
 	
// });