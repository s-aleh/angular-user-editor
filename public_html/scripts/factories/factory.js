'use strict';

angular.module('App')

	.factory('scroll', [function() {
		var srv = {
			init: init,
			prev: prev,
			next: next,
			style: {
				left: 0,
				width: 0
			},
			visibility: {
				visibility: 'hidden'
			},
			curPage: 1,
			itemsPerPage: 10,
			pages: 0,
			totalUsers: 0
		};
		return srv;
		
		function init() {
			srv.pages = Math.ceil(srv.totalUsers / srv.itemsPerPage);
			if(srv.pages < srv.curPage) {
				srv.curPage = srv.pages;
			}
			srv.visibility = getVisibility(srv.pages);
			srv.style = getStyle(srv.pages, srv.curPage);
		}
		
		function getStyle(pages, curPage) {
			var style = { left: 0, width: 0 };
			var cls = { container: 'scroll-bar-main', left: 'scroll-bar-left', right: 'scroll-bar-rigth' };
			var size = { width: {} };
			for(var key in cls) {
				var el = getElementByClassName(cls[key]);
				size.width[key] = el[0].clientWidth;
			}
			var runner = (size.width.container - size.width.left - size.width.right) / pages;
			style.left = Math.ceil(size.width.left + runner * (curPage - 1)) + 'px';
			style.width = Math.ceil(runner) + 'px';
			return style;
		}
		
		function getVisibility(pages) {
			if(pages > 1) {
				return { visibility: 'visible' };
			} else {
				return { visibility: 'hidden' };
			}
		}

		function prev() {
			if(srv.curPage > 1) {
				srv.curPage--;
				init();
			}
		}

		function next() {
			if(srv.curPage < srv.pages) {
				srv.curPage++;
				init();
			}
		}

		function getElementByClassName(className) {
			return angular.element(document.getElementsByClassName(className));
		}
	}])
	
	.factory('UserFactory', ['$http', '$rootScope', function($http, $rootScope) {
		var config = {
			urlUsers: 'data/users.json',
			urlCountries: 'data/countries_compact.json',
			urlStates: 'data/us_compact.json'
		};
		var emptyItem = {
			id: null,
			name: {	first: "", last: ""	},
			address: { street: "", city: "", country: { code: "", stateCode: "" }, zip: null },
			phone: { mobile: null, home: null }
		};
		var st = { new: false, form: false, edit: false };
		var srv = {
			getItemsFromDB: getItemsFromDB,
			getCountriesFromDB: getCountriesFromDB,
			getStatesFromDB: getStatesFromDB,
			getCountries: getCountries,
			getStates: getStates,
			getItems: getItems,
			getCountItems: getCountItems,
			getItem: getItem,
			getNewItem: getNewItem,
			enableEditItem: enableEditItem,
			getStatus: getStatus,
			cancel: cancel,
			reset: reset,
			save: save,
			remove: remove,
			getCountTrashItems: getCountTrashItems
		};
		var items = [];
		var countries = [];
		var states = [];
		var trash = [];
		return srv;
		
		function getCountTrashItems() {
			return trash.length;
		}
		
		function remove(item) {
			for(var i = 0; i < items.length; i++) {
				if(items[i].id == item.id) {
					trash.push(items[i]);
					items.splice(i, 1);
					disable('form');
					return null;
				}
			}
		}
		
		function save(item) {
			if(item.id == null) {
				item.id = getNewItemId();
				items.push(angular.copy(item));
			} else {
				for(var i = 0; i < items.length; i++) {
					if(items[i].id == item.id) {
						items[i] = item;
						disable(['edit']);
						return item;
					}
				}
			}
			disable(['new', 'edit']);
			console.log(item);
			return item;
		}
		
		function reset(user) {
			for(var i = 0; i < items.length; i++) {
				if(items[i].id == user.id) {
					return items[i];
				}
			}
			var item = emptyItem;
			item.id = getNewItemId();
			return item;
		}
		
		function cancel(item) {
			disable('edit');
			for(var i = 0; i < items.length; i++) {
				if(items[i].id == item.id) {
					return items[i];
				}
			}
			disable(['new', 'form']);
			return null;
		}
		
		function enableEditItem() {
			enable(['edit', 'form']);
		}
		
		function getNewItem() {
			enable(['new', 'edit', 'form']);
			return angular.copy(emptyItem);
		}
		
		function getNewItemId() {
			var tmpItems = items;
			tmpItems.concat(trash);
			var itemIds = [];
			for(var i = 0; i < tmpItems.length; i++) {
				itemIds.push(items[i].id);
			}
			itemIds.sort(function(a, b) { return a - b });
			return itemIds.pop() + 1;
		}
		
		function getItem(user) {
			if(!getStatus('new') && !getStatus('edit')) {
				enable('form');
				return user;
			}
			return null;
		}
		
		function getCountItems() {
			return items.length;
		}
		
		function getStatus(name) {
			return st[name];
		}

		function enable(options) {
			if(typeof(options) === 'object') {
				for(var i = 0; i < options.length; i++) {
					st[options[i]] = true;
				}
			} else {
				st[options] = true;
			}
		}
		
		function disable(options) {
			if(typeof(options) === 'object') {
				for(var i = 0; i < options.length; i++) {
					st[options[i]] = false;
				}
			} else {
				st[options] = false;
			}
		}
		
		function getStatesFromDB() {
			return $http.get(config.urlStates)
				.then(statesComplete)
				.catch(failed);
		}

		function statesComplete(response) {
			states = response.data;
			$rootScope.$broadcast('states.list', response.data);
		}
		
		function getStates() {
			return states;
		}

		function getCountriesFromDB() {
			return $http.get(config.urlCountries)
				.then(countriesComplete)
				.catch(failed);
		}
		
		function countriesComplete(response) {
			countries = response.data;
			$rootScope.$broadcast('countries.list', response.data);
		}

		function getCountries() {
			return countries;
		}
		
		function getItemsFromDB() {
			return $http.get(config.urlUsers)
				.then(itemsComplete)
				.catch(failed);
		}
		
		function itemsComplete(response) {
			items = response.data;
			$rootScope.$broadcast('items.list');
		}

		function getItems() {
			return items;
		}
		
		function failed(error) {
			console.log(error);
		}
	}])
	;