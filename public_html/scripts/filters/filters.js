'use strict';

angular.module('App')
	.filter('pagination', [function() {
		return function(input, scroll) {
			if(input != null) {
				var start = (scroll.curPage - 1) * scroll.itemsPerPage;
				return input.slice(start, start + scroll.itemsPerPage);
			}
		};
}]);