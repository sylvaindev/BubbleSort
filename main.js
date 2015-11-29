/**
* Init Angular module
* @type @exp;angular@call;module@call;controller
*/
app = angular.module("app", []).controller('mainCtrl', ['$scope', function ($scope) {

  //init default quantity
  $scope.quantity = 50;

  //init current id (for each bubble)
  $scope.current_id = 0;

  //init numbers limits
  $scope.number_min = 1;
  $scope.number_max = 500;
  $scope.exec_time_precision = Math.pow(10, 6);
  $scope.update_bubble_time = 50;
  $scope.toast_time = 10000;


  //init dataset
  $scope.data = [];

  /**
  * Generate random array of "quantity" elements
  * @returns void
  */
  $scope.generate = function () {

    //reset dataset
    $scope.data = [];

    var unique = [];
    var val;

    //init gradient spectre
    var rainbow = new Rainbow();
    rainbow.setNumberRange($scope.number_min, $scope.number_max);
    rainbow.setSpectrum('#f8cad7', '#c2a1da', '#8ca4d4', '#bae3f7', '#c5d9a6', '#ffdfba', '#f25e42');

    for (var i = 0; i < $scope.quantity; i++) {

      //generate unique value
      do {
        val = $scope.genRandomValue();
      } while (unique.indexOf(val) !== -1 && unique.length < $scope.number_max);

      //add value to unique
      unique.push(val);

      //get gradient color for current val
      var color = "#" + rainbow.colourAt(val);

      //init object
      var o = {
        'id': i,
        'val': val,
        'color': color
      };

      //add element to dataset
      $scope.data.push(o);

    }

    //call srawing bubbles method
    $scope.drawBubbles();


  };

  /**
  * Drawing bubbles method
  * @returns void
  */
  $scope.drawBubbles = function () {

    //get "items" container
    var items = $('.items');

    //clean items
    $(items).html('');

    //for ech bubbles
    for (var e in $scope.data) {

      //create div (bubble)
      var div = document.createElement('div');
      $(div).addClass('item z-depth-1');
      $(div).attr('id', 'bubble_' + $scope.data[e].id);
      $(div).css('background-color', $scope.data[e].color);

      //create span
      var span = document.createElement('span');
      $(span).addClass('item-num');
      $(span).html($scope.data[e].val);

      //add span to div
      $(div).append(span);

      //add bubble to items
      $(items).append(div);
    }
  };

  /**
  * Updating bubbles method (positions)
  * @returns void
  */
  $scope.updateBubbles = function (moves) {

    //get "items" container
    var items = $('.items');

    //si mouvements restants
    if (moves.length > 0) {
      var cur = $('.item').eq(moves[0]);
      var next = $('.item').eq(moves[0] + 1);

      //adding class on current & next elements
      $(cur).addClass('sort-move-current');
      $(next).addClass('sort-move-next');

      //delay next anim
      setTimeout(function () {

        //invert current element with right element
        $(next).after(cur);
        
        //removing class on current & next elements
        $(cur).removeClass('sort-move-current');
        $(next).removeClass('sort-move-next');

        //remove done movement
        moves.shift();

        //update bubbles
        $scope.updateBubbles(moves);

      }, $scope.update_bubble_time);

    }
    else {
      //enabling all buttons during sorting
      $('button').removeClass('disabled');

      //show toast
      Materialize.toast("Graphic sorting done !", $scope.toast_time);
    }

  };


  /**
  * BubbleSort Method (not optimized)
  * @returns {undefined}
  */
  $scope.sort = function () {

    //disabling all buttons during sorting
    $('button').addClass('disabled');

    //set start timer
    var timer1 = new Date().getTime();

    //check if array is valid
    if ($scope.data.length == 0 || !Array.isArray($scope.data)) {
      throw new Error();
    }

    //init moves array
    var moves = [];

    //sort !
    for (var i = 0; i < $scope.data.length - 1; i++) {
      for (var x = 0; x < $scope.data.length - 1; x++) {
        if ($scope.data[x].val > $scope.data[x + 1].val) {
          moves.push(x);
          $scope.switch(x);
        }
      }
    }

    //set finish timer
    var timer2 = new Date().getTime();

    //get time execution & convert millisecondes into seconds
    var sec = (timer2 - timer1) / 1000;

    //round value to show (x decimals)
    sec = Math.round(sec * $scope.exec_time_precision) / $scope.exec_time_precision;

    //make result message
    var msg = "Execution Time: " + sec + " second(s) <br>";
    var msg = msg + "Moves count: " + moves.length + " move(s)";

    //show toast
    Materialize.toast(msg, $scope.toast_time);

    //update bubbles position
    $scope.updateBubbles(moves);

  };


  /**
  * Optimized BubbleSort Method
  * @returns {undefined}
  */
  $scope.optimizedSorting = function () {

    //disabling all buttons during sorting
    $('button').addClass('disabled');

    //set timer1
    var timer1 = new Date().getTime();

    //init moves array
    var moves = [];

    //init sort vars
    var i = $scope.data.length;
    var trade = true;

    //sort !
    while (i > 0 && trade) {
      trade = false;
      for (var j = 0; j < i - 1; j++) {
        if ($scope.data[j].val > $scope.data[j + 1].val) {
          moves.push(j);
          $scope.switch(j);
          trade = true;
        }
      }
      i--;
    }

    //set timer2
    var timer2 = new Date().getTime();

    //get execution time & convert milliseconds to seconds
    var sec = (timer2 - timer1) / 1000;

    //round value to show (4 decimals)
    sec = Math.round(sec * $scope.exec_time_precision) / $scope.exec_time_precision;

    //make result message
    var msg = "Execution Time: " + sec + " second(s) <br>";
    var msg = msg + "Moves count: " + moves.length + " move(s)";

    //show toast
    Materialize.toast(msg, $scope.toast_time);

    //update bubbles position
    $scope.updateBubbles(moves);

  };


  /**
  * Fusion Sort Method
  * @returns {undefined}
  */
  $scope.fusionSorting = function (arr) {

    //disabling all buttons during sorting
    $('button').addClass('disabled');

    //set timer1
    var timer1 = new Date().getTime();

    //init moves array
    var moves = [];

    //sort -> update data
    $scope.data = $scope.fusionSort($scope.data);

    //set timer2
    var timer2 = new Date().getTime();

    //get execution time & convert milliseconds to seconds
    var sec = (timer2 - timer1) / 1000;

    //round value to show (4 decimals)
    sec = Math.round(sec * $scope.exec_time_precision) / $scope.exec_time_precision;

    //make result message
    var msg = "Execution Time: " + sec + " second(s) <br>";
    var msg = msg + "Moves count: " + moves.length + " move(s)";

    //show toast
    Materialize.toast(msg, $scope.toast_time);

    //update bubbles
    $scope.drawBubbles();

    //disabling all buttons during sorting
    $('button').removeClass('disabled');

  };


  /**
  * fusionSort
  */
  $scope.fusionSort = function(arr) {

    if (arr.length < 2) return arr;

    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);

    return $scope.fusionSortMerge($scope.fusionSort(left), $scope.fusionSort(right));
  };

  /**
  * fusionSortMerge
  */
  $scope.fusionSortMerge = function(left, right) {

    var result = [];

    while (left.length && right.length) {
      if (left[0].val <= right[0].val) {
        result.push(left.shift());
      } else {
        result.push(right.shift());
      }
    }

    while (left.length)
    result.push(left.shift());

    while (right.length)
    result.push(right.shift());

    return result;
  };

  /**
  * DEBUG
  * @param {type} arr
  * @returns {undefined}
  */
  $scope.debug = function(arr) {
    var tmp = [];
    for (var e in arr) tmp.push(arr[e].val);
    return tmp.join(',');
  };



  /**
  * Switch to "cell" of an array
  * @param {type} x
  * @returns {undefined}
  */
  $scope.switch = function (x) {

    //mem values for switch
    var tmp_color = $scope.data[x].color;
    var tmp_val = $scope.data[x].val;
    var tmp_id = $scope.data[x].id;

    //swicth value
    $scope.data[x].val = $scope.data[x + 1].val;
    $scope.data[x + 1].val = tmp_val;

    //swicth color
    $scope.data[x].color = $scope.data[x + 1].color;
    $scope.data[x + 1].color = tmp_color;

    //swicth id
    //$scope.data[x].id = $scope.data[x + 1].id;
    //$scope.data[x + 1].id = tmp_id;

  };

  /**
  * Return random value
  * @returns int random value
  */
  $scope.genRandomValue = function () {
    return Math.floor((Math.random() * $scope.number_max) + 1);
  };


  //initial generation
  $scope.generate();


}]);
