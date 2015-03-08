'use strict';

angular.module('App')
	
	.factory('CnsJsonFactory', ['$http', '$rootScope', function($http, $rootScope) {
		var config = {
			urlUsers: 'data/users.json',
			urlCountries: 'data/countries_compact.json',
			urlStates: 'data/us_compact.json'
		};
		var srv = {
			getItemsFromDB: getItemsFromDB,
			getCountriesFromDB: getCountriesFromDB,
			getStatesFromDB: getStatesFromDB
		};
		return srv;
		
		function getStatesFromDB() {
			return $http.get(config.urlStates)
				.then(statesComplete)
				.catch(failed);
		}

		function statesComplete(response) {
			$rootScope.$broadcast('states.list', response.data);
		}

		function getCountriesFromDB() {
			return $http.get(config.urlCountries)
				.then(countriesComplete)
				.catch(failed);
		}
		
		function countriesComplete(response) {
			$rootScope.$broadcast('countries.list', response.data);
		}

		function getItemsFromDB() {
			return $http.get(config.urlUsers)
				.then(itemsComplete)
				.catch(failed);
		}
		
		function itemsComplete(response) {
			$rootScope.$broadcast('items.list', response.data);
		}
		
		function failed(error) {
			console.log(error);
		}
	}])
	;