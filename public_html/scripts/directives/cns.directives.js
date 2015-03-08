'use strict';

angular.module('App')

	.directive('cnsPagination', [function() {
		return {
			restrict: 'E',
			scope: {
				pagination: '=',
				pages: '=',
				curpage: '=',
				counttrashitems: '='
			},
			templateUrl: 'templates/directives/cns.pagination.html',
			link: function(scope) {
			}
		};
	}])

	.directive('cnsUserTrash', [function(){
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/cns.user.trash.html',
			scope: {
				items: '=',
				countries: '=',
				states: '=',
				filter: '='
			}
		};
	}])

	.directive('cnsUserEdit', [function(){
		return {
			restrict: 'E',
			scope: {
				user: '=',
				items: '=',
				edit: '=',
				countries: '=',
				states: '='
			},
			templateUrl: 'templates/directives/cns.user.edit.html',
			link: function (scope) {
				// Set state value
				scope.$watch("user.address.country.code", function() {
					if(scope.user !== undefined) {
						if(scope.user.address.country.code !== 'US') {
							scope.user.address.country.stateCode = '';
						}
					}
				});
			}
		};
	}])

	.directive('cnsPaginationScrollBar', [function() {
		// Get element by class name
		function getElementByClassName(className) {
			return angular.element(document.getElementsByClassName(className));
		}
		// Set visibility
		function setVisibility(pages) {
			if(pages > 1) {
				return { visibility: 'visible' };
			} else {
				return { visibility: 'hidden' };
			}
		}
		// Set left and width
		function setStyle(pages, curpage) {
				var style = { left: 0, width: 0 };
				var cls = { container: 'scroll-bar-main', left: 'scroll-bar-left', right: 'scroll-bar-rigth' };
				var size = { width: {} };
				for(var key in cls) {
					var el = getElementByClassName(cls[key]);
					size.width[key] = el[0].clientWidth;
				}
				var runner = (size.width.container - size.width.left - size.width.right) / pages;
				style.left = Math.ceil(size.width.left + runner * (curpage - 1)) + 'px';
				style.width = Math.ceil(runner) + 'px';
				return style;
		}
		
		return {
			restrict: 'E',
			scope: {
				pagination: '=',
				pages: '=',
				itemsperpage: '=',
				curpage: '='
			},
			template: '<div class="scroll-bar-main" ng-style="visibility">' +
						'<div ng-click="pagination.prev()" class="scroll-bar-left"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></div>' +
						'<div class="scroll-bar" ng-style="style"></div>' +
						'<div ng-click="pagination.next()" class="scroll-bar-rigth"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>' +
						'</div>',

			link: function(scope) {
				// Attribute "pages" change
				scope.$watch("pages", function(newPages, oldPages) {
					scope.style = setStyle(scope.pagination.get().pages, scope.pagination.get().curPage);
					scope.visibility = setVisibility(scope.pagination.get().pages);
				});
				// Attribute "curpage" change
				scope.$watch("curpage", function(newCurPage, oldCurPage){
					scope.style = setStyle(scope.pagination.get().pages, scope.pagination.get().curPage);
				});
			}
		};
}]);