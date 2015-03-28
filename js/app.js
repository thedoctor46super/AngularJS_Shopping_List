var myModule = angular.module('listApp', []);

myModule.controller('ListCtrl', ['$scope', 'CacheService', 'ArrayService', function ($scope, cs, as) {
    var state = cs.getState();

    $scope.list = [];

    if (state)
        $scope.list = state;

    $scope.$watch(function () { return angular.toJson($scope.list); },
        function () {
            cs.saveState($scope.list);
        });
    
    $scope.addOnReturn = function (evt) {
        if (evt.keyCode === 13) { $scope.add() }
    };

    $scope.remove = function (element) {
        as.removeElement($scope.list, element);
    };

    $scope.addToCart = function (element) {
        element.purchased = true;
    };

    $scope.removeFromCart = function (element) {
        element.purchased = false;
    };

    $scope.add = function () {
        var value = $('#input_name').val();
        if (value) {
            $scope.list.push({
                'name': value,
                'purchased': false
            });
        }
        $('#input_name').val('');
        $('#input_name').focus();
    };

    $scope.empty = function () {
        $scope.list = [];
        $('#input_name').val('');
        $('#input_name').focus();
    };
  
  	$('#input_name').focus();
}]);

myModule.service('CacheService', function() {
    this.key = "AngularJS.persistentshoppingList";

    this.saveState = function (list) {
        var jsonArr = JSON.stringify(list);

        var date = new Date();
        var days = 365;

        // Default at 365 days.
        days = days || 365;
        // Get unix milliseconds at current time plus number of days
        date.setTime(+date + (days * 86400000)); //24 * 60 * 60 * 1000
        window.document.cookie = this.key + "=" + jsonArr + "; expires=" + date.toGMTString() + "; path=/";
    }

    this.getState = function () {
        var value = "; " + document.cookie;
        var parts = value.split("; " + this.key + "=");
        if (parts.length == 2)
            return JSON.parse(parts.pop().split(";").shift());
    }
});

myModule.service('ArrayService', function() {
    this.removeElement = function (array, elemToRemove) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (array[i] === elemToRemove) {
                array.splice(i, 1);
            }
        }
    }
});