app = angular.module("app",[]).controller('mainCtrl',['$scope',function($scope){

  $scope.quantity = 30;

  $scope.data =[];

  $scope.generate = function(){

    $scope.data =[];

    var rainbow = new Rainbow();

    rainbow.setNumberRange(1, 9999);
    rainbow.setSpectrum('#f8cad7','#c2a1da', '#8ca4d4', '#bae3f7', '#c5d9a6', '#ffdfba', '#f25e42');

    for ($i = 0; $i < $scope.quantity; $i++) {

      var val = Math.floor((Math.random() * 9999) + 1);

      var color = "#" + rainbow.colourAt(val);

      var o = {
        'val': val,
        'color': color
      }

      $scope.data.push(o);

    }
    console.log($scope.data);
  }

  $scope.sort = function(){

    var timer1 = new Date().getTime();

    if($scope.data.length == 0 || !Array.isArray($scope.data)) {
      throw new Error();
    }

    for(var i=0; i < $scope.data.length -1 ; i++) {
      for(var x=0; x < $scope.data.length - 1; x++) {
        if($scope.data[x].val > $scope.data[x+1].val) {

          $scope.invert(x);

        }
        $timeout(function() {
            $('#bubble_' + x).css('color','white');
        }, 3000, false)
      }
    }

    var timer2 = new Date().getTime();

    var sec = (timer2 - timer1) / 1000;

    sec = Math.round(sec * 10000) / 10000;

    Materialize.toast("Execution Time: " + sec + " seconds", 4000);

  }

  $scope.optimizedSorting = function(){

    var timer1 = new Date().getTime();
    var i = $scope.data.length;
    var trade = true;

    while(i > 0 && trade){
      trade = false;
      for(var j=0; j < i - 1; j++){
        if($scope.data[j].val > $scope.data[j + 1].val){

          $scope.invert(j);

          trade = true;

        }
      }
      i--;
    }

    var timer2 = new Date().getTime();

    var sec = (timer2 - timer1) / 1000;

    sec = Math.round(sec * 10000) / 10000;

    Materialize.toast("Execution Time: " + sec + " seconds", 4000);

  }

  $scope.invert = function(x){

    console.log($scope.data[x]);

    var tmp_color = $scope.data[x].color;
    var tmp_val = $scope.data[x].val;

    $scope.data[x].val = $scope.data[x + 1].val;
    $scope.data[x+1].val = tmp_val;

    $scope.data[x].color = $scope.data[x + 1].color;
    $scope.data[x+1].color = tmp_color;

  }

}])
