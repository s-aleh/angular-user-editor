'use strict';

angular.module('App')
	.controller('UsersController', ['$scope', 'UserFactory', 'scroll', function($scope, uf, scroll) {
		$scope.scroll = scroll;
		$scope.uf = uf;
		$scope.users = null;
		$scope.user = null;
		uf.getItemsFromDB();
		uf.getCountriesFromDB();
		uf.getStatesFromDB();
		
		$scope.updateState = function() {
			if($scope.user.address.country.code !== 'US') {
				$scope.user.address.country.stateCode = '';
			}
		};
		
		$scope.trash = function() {
			alert('Coming soon');
		};
		
		$scope.cancel = function() {
			$scope.user = angular.copy(uf.cancel($scope.user));
		};
		
		$scope.new = function() {
			$scope.user = angular.copy(uf.getNewItem());
			console.log($scope.user);
		};
		
		$scope.edit = function() {
			uf.enableEditItem();
		};
		
		$scope.setUser = function(user) {
			if(uf.getItem(user) != null) {
				$scope.user = angular.copy(uf.getItem(user));
			}
			$scope.userId = $scope.user.id;
		};
		
		$scope.save = function() {
			$scope.user = uf.save($scope.user);
			$scope.user = uf.getItems();
			$scope.scroll.totalUsers = uf.getCountItems();
			$scope.scroll.init();
		};
		
		$scope.remove = function() {
			$scope.user = uf.remove($scope.user);
			$scope.user = uf.getItems();
			$scope.scroll.totalUsers = uf.getCountItems();
			$scope.scroll.init();
		};

		$scope.reset = function() {
			$scope.user = angular.copy(uf.reset($scope.user));
		};
				
		$scope.$on('states.list', function() {
			$scope.states = uf.getStates();
		});

		$scope.$on('countries.list', function() {
			$scope.countries = uf.getCountries();
		});
		
		$scope.$on('items.list', function() {
			$scope.users = uf.getItems();
			$scope.scroll.totalUsers = uf.getCountItems();
			$scope.scroll.init();
		});
	}])
	;