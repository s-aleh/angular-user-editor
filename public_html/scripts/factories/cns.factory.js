/*
 * CnsPagination module
 */
'use strict';

angular.module('App')

	.factory('CnsDataFactory' ,['$rootScope', function($rootScope) {
		return function() {
			var items = [];
			var trashItems = [];
			var item = {};
			var curItem = {};
			var status = {
				show: false,
				edit: false,
				new: false,
				trash: false
			};
			// Repair item from trash
			this.repairTrash = function(trashItem) {
				for(var i = 0; i < trashItems.length; i++) {
					if(trashItem.id == trashItems[i].id) {
						items.push(angular.copy(trashItem));
						trashItems.splice(i, 1);
						$rootScope.$broadcast('items.repair');
						if(trashItems.length == 0) {
							status.trash = false;
						}
						break;
					}
				}
			};
			// Delete item form trash
			this.removeTrash = function(trashItem) {
				for(var i = 0; i < trashItems.length; i++) {
					if(trashItem.id == trashItems[i].id) {
						trashItems.splice(i, 1);
						$rootScope.$broadcast('items.repair');
						if(trashItems.length == 0) {
							status.trash = false;
						}
						break;
					}
				}
			};
			// Get trash items
			this.getTrashItems = function() {
				return trashItems;
			};
			// Show items trash
			this.showTrash = function() {
				status.trash = true;
			};
			// Reset form
			this.reset = function() {
				curItem = angular.copy(copyItemToCurItem(curItem, items));
			};
			// Set edit form
			this.showEditForm = function() {
				status.edit = true;
			};
			// Set current item
			this.setCurItem = function(data) {
				if(status.new || status.edit) {
					return;
				}
				curItem = angular.copy(data);
				status.show = true;
				status.trash = false;
			};
			// Get items
			this.getItems = function() {
				return items;
			};
			// Get current item
			this.getCurItem = function() {
				return curItem;
			};
			// Count items
			this.countItems = function() {
				return items.length;
			};
			// Trash count items
			this.trashCountItems = function() {
				return trashItems.length;
			};
			// Get cancel edit
			this.cancel = function() {
				if(status.new) {
					clear(curItem);
					status.show = false;
					status.new = false;
				} else {
					curItem = angular.copy(copyItemToCurItem(curItem, items));
				}
				status.edit = false;
			};
			// Remove item
			this.remove = function(removeItem) {
				for(var i = 0; i < items.length; i++) {
					if(items[i].id == removeItem.id) {
						trashItems.push(removeItem);
						items.splice(i, 1);
						curItem = angular.copy(item);
						status.show = false;
						$rootScope.$broadcast('items.change');
					}
				}
			};
			// Save item
			this.save = function() {
				if(curItem.id !== null) {
					saveItem(curItem, items);
					status.edit = false;
				} else {
					if(curItem.name.first != null && curItem.name.last != null) {
						curItem.id = getNewItemId(items, trashItems);
						items.push(angular.copy(curItem));
						status.new = false;
						status.edit = false;
						$rootScope.$broadcast('items.save');
					} else {
						console.log('First and/or last names are empty');
					}
				}
			};
			// Get trash
			this.trash = function() {
				return status.trash;
			};
			// Get new item
			this.new = function() {
				return status.new;
			};
			// Get edit form
			this.edit = function() {
				return status.edit;
			};
			// Get visibility form
			this.show = function() {
				return status.show;
			};
			// Add new user
			this.add = function() {
				if(!status.new && !status.edit) {
					status.show = true;
					status.edit = true;
					status.new = true;
					curItem = angular.copy(item);
				}
			};
			// Init
			this.init = function(data) {
				items = angular.copy(data);
				item = angular.copy(items[0]);
				clear(item);
				curItem = angular.copy(item);
			};
		};
		// Get items.id
		function getNewItemId(items, trashItems) {
			var tmpItems = items;
			tmpItems.concat(trashItems);
			var itemIds = [];
			for(var i = 0; i < tmpItems.length; i++) {
				itemIds.push(items[i].id);
			}
			itemIds.sort(function(a, b) { return a - b });
			return itemIds.pop() + 1;			
		}
		// Save item to items
		function saveItem(curItems, items) {
			for(var i = 0; i < items.length; i++) {
				if(curItems.id == items[i].id) {
					items[i] = angular.copy(curItems);
					break;
				}
			}
		}
		// copy item to current item
		function copyItemToCurItem(curItem, items) {
			for(var i = 0; i < items.length; i++)
			{
				if(curItem.id == items[i].id) {
					return items[i];
				}
			}
		}
		// Clear object
		function clear(data) {
			for(var key in data) {
				switch (typeof data[key]) {
					case 'object':
						clear(data[key]);
						break;
					default:
						data[key] = null;
						break;
				}
			}
		};
	}])
	
	.factory('CnsPagination' ,[function() {
		return function() {
			// Pagination object
			var pagination = {
				curPage: 1, // Current page
				itemsPerPage: 10, // Items per page
				pages: 0, // Total page
				countItems: 0 // Total items
			};
			// Init pagination object: {itemsPerPage: 10, countItems: 0}
			this.init = function(params) {
				if(params.itemsPerPage !== undefined) {
					pagination.itemsPerPage = params.itemsPerPage;
				}
				if(params.countItems !== undefined) {
					pagination.countItems = params.countItems;
				}
				pagination.pages = Math.ceil(pagination.countItems / pagination.itemsPerPage);
			};
			// Set current page
			this.setCurPage = function(page) {
				switch (page) {
					case 'first':
						pagination.curPage = 1;
						break;
					case 'last':
						pagination.curPage = pagination.pages;
						break;
					default:
						pagination.curPage = page;
						break;
				}
			};
			// Set count items
			this.setCountItems = function(count) {
				pagination.countItems = count;
				this.reinit();
			};
			// Change count items
			this.change = function(count) {
				pagination.countItems = count;
			};
			// Reinit pagination
			this.reinit = function() {
				pagination.pages = Math.ceil(pagination.countItems / pagination.itemsPerPage);
				if(pagination.curPage > pagination.pages) {
					pagination.curPage = pagination.pages;
				}
			};
			// Set page
			this.setPage = function(page) {
				pagination.curPage = page;
			};
			// Get pages array
			this.getPages = function() {
				return new Array(pagination.pages);
			};
			// Return pagination object
			this.get = function() {
				return pagination;
			};
			// Set previous page
			this.prev = function() {
				if(pagination.curPage > 1) {
					pagination.curPage--;
				}
			};
			// Set next page
			this.next = function() {
				if(pagination.curPage < pagination.pages) {
					pagination.curPage++;
				}
			};
		};
}]);
