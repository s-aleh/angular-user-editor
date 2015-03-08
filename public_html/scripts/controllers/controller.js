'use strict';

angular.module('App')
	.controller('UsersController', ['$scope', 'CnsJsonFactory', 'CnsPagination', 'CnsDataFactory',
		function($scope, CnsJsonFactory, CnsPagination, CnsDataFactory) {
		CnsJsonFactory.getItemsFromDB();
		CnsJsonFactory.getCountriesFromDB();
		CnsJsonFactory.getStatesFromDB();
		$scope.itemsPagination = new CnsPagination();
		$scope.trashItemsPagination = new CnsPagination();
		$scope.items = new CnsDataFactory();

		$scope.$on('states.list', function(event, data) {
			$scope.states = angular.copy(data);
		});

		$scope.$on('countries.list', function(event, data) {
			$scope.countries = angular.copy(data);
		});
		
		$scope.$on('items.repair', function() {
			$scope.itemsPagination.change($scope.items.countItems());
			$scope.itemsPagination.reinit();
			$scope.itemsPagination.setCurPage('last');
			$scope.trashItemsPagination.init({countItems: $scope.items.trashCountItems()});
			$scope.trashItemsPagination.reinit();
		});

		$scope.$on('items.change', function() {
			$scope.itemsPagination.change($scope.items.countItems());
			$scope.itemsPagination.reinit();
			$scope.trashItemsPagination.init({countItems: $scope.items.trashCountItems()});
			$scope.trashItemsPagination.reinit();
		});
		
		$scope.$on('items.save', function() {
			$scope.itemsPagination.change($scope.items.countItems());
			$scope.itemsPagination.reinit();
			$scope.itemsPagination.setCurPage('last');
		});

		$scope.$on('items.list', function(event, data) {
			$scope.itemsPagination.init({countItems: data.length});
			$scope.trashItemsPagination.init({countItems: 0, itemsPerPage: 2});
			$scope.items.init(angular.copy(data));
		});
	}])
	;