'use strict';

/*//////////////////////////////

	angular app bootstrapping

//////////////////////////////*/



//``````````````````````````````
//	Declare the App with dependencies
//	and the sub-modules
//
angular.module('app', [
	'ngRoute',
	'ngAnimate',
	
	'appServices',
	'appProviders',
	'appDirectives',
	'appControllers',
	
	'angular-loading-bar'
]);

angular.module('appServices', [] );
angular.module('appProviders', [] );
angular.module('appDirectives', [] );
angular.module('appControllers', [] );



//``````````````````````````````
//	Configure
//
angular.module('app').config(['$locationProvider', 'cfpLoadingBarProvider', function( $locationProvider, cfpLoadingBarProvider ) {

	//	Utilize the HTML 5 History API
	//
	$locationProvider.html5Mode( true );

	cfpLoadingBarProvider.includeSpinner = false;

}]);



//``````````````````````````````
//	Run on app init
//
angular.module('app').run(['$rootScope', '$route', '$location', '$window', '$timeout', function( $rootScope, $route, $location, $window, $timeout ) {

	//``````````````````````````````
	//	Define some useful root scope
	//	variables and methods
	//
	$rootScope.host = window.location.host;
	$rootScope.protocol = window.location.protocol;

	$rootScope.go = function( path ) {
		$location.path( path );
	};


	$rootScope
		.$on('$routeChangeStart', function( evt, curr, prev ) {

			$rootScope.mainNavAutocloseTimer = $timeout(function(){
				$rootScope.mainNavOpen = false;
				$rootScope.mainIsOverlayed = false;
			}, 500 );

		});

	$rootScope
		.$on('$routeChangeSuccess', function( evt, curr, prev ) {
		
			//``````````````````````````````
			//	Set dynamic {{ viewClass }}
			//	on ng-view derived from the
			//	controller name. eg:
			//	FilmDetailsController → .film-details
			//
			var viewClass = $route.current.$$route && $route.current.$$route.controller ?
								$route.current.$$route.controller
									.replace(/controller/gi, '')
									.replace(/([a-z])([A-Z])/g, '$1-$2')
									.toLowerCase()
								: 'error404';

			$rootScope.viewClass = viewClass;
			$rootScope.navState = viewClass;

			if ( viewClass == 'home' ) {
				$rootScope.mainNavOpen = false;
				$rootScope.mainIsOverlayed = false;
			}
		
			//``````````````````````````````
			//	Trigger ‘routeChangeSuccess’
			//	event for jQuery to catch
			//
			/*angular.element( document ).triggerHandler('routeChangeSuccess');*/
		
		});


	//``````````````````````````````
	//	Watch server connection
	//
	if ( navigator ) {

		$rootScope.online = navigator.onLine;
		
		$window.addEventListener('offline', function() {
			$rootScope.$apply(function() {
				$rootScope.online = false;
			});
		}, false );
		
		$window.addEventListener("online", function() {
			$rootScope.$apply(function() {
				$rootScope.online = true;
			});
		}, false );

	}
	
}]);


