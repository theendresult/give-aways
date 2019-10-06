/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('ga.core', [
            'ngResource',
            'ngSanitize',
            'ngAnimate',
            'ngMessages',
            'ngCookies',
            'ui.router',
            'ui.bootstrap',
            'ui.mask',
            'pascalprecht.translate',
            'angulartics',
            'angulartics.google.analytics'
        ]);

    angular.module('ga.core').config(configure);
    angular.module('ga.core').run(runApp);

    angular.module('ga.core').constant('moment', moment);
    angular.module('ga.core').constant('constants', getConstants());

    /*@ngInject*/
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $logProvider, $translateProvider, $translatePartialLoaderProvider, $analyticsProvider ) {

        $stateProvider
            .state('error-unknown', {
                url: '/ajs/error/unknown',
                templateUrl: 'app/js/core/views/error-unknown.html',
                controller: 'ErrorCtrl as error',
                onEnter: /*@ngInject*/ function($rootScope) {
                    $rootScope.pageTitle = 'page.title.error.unknown';
                }
            });

        $urlRouterProvider.otherwise('/ajs/td/td-key');

        // setup the translate service
        $translatePartialLoaderProvider.addPart('core');
        $translatePartialLoaderProvider.addPart('errors');
        $translateProvider.useLoader('LangFactory');
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLoaderCache(true);
        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

        // log should be disabled in staging and production
        if (window.ngDebugEnabled !== false || hasDebugFlag()) {
            $logProvider.debugEnabled(true);
        } else {
            $logProvider.debugEnabled(false);
        }
        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');

        // disable IE ajax request caching
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

        // analytics configuration
        $analyticsProvider.trackExceptions(true);
    }

    // Even if $state is not used below, it cannot be removed, as injecting it here kickstarts the ui-router
    /*@ngInject*/
    function runApp($rootScope, $state, $translate, $log, $window, loadingService, LangFactory, InitService, TrackingService) {

        $rootScope.langService = LangFactory();
        $rootScope.loadingService = loadingService;

        //so we can display certain header/footer sections based on current state
        $rootScope.$state = $state;

        //prevent default drag-drop behavior
        $(document).on('drop dragover', function(e) {
            e.preventDefault();
        });

        $rootScope.scrollTop = function() {
            $window.scrollTo(0, 0);
        };

        //Refresh translations whenever a partial is loaded
        $rootScope.$on('$translatePartialLoaderStructureChanged', function() {
            $translate.refresh();
        });

        $log.debug('core.module: running InitService.pageInit()');
        //Initialize any saved state from storage;
        InitService.pageInit();

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $log.error('core.module: $stateChangeError', arguments);
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $log.debug('core.module: $stateChangeSuccess', arguments);
            
            $rootScope.hideDisclaimer = false;
            // check if route is in the list of routes configured to hide disclaimer
            $translate('core.disclaimer.hide.routes').then(function (val) {
                 if (val && (val.trim().length > 0)  && val !== 'td.resources.disclaimer.hide.routes' && val.split(',').indexOf(toState.name) !== -1) {
                    $log.debug('Hiding disclaimer for route ..' + toState.name);    
                    $rootScope.hideDisclaimer = true;
                }
            });
        
            // check if error code is configured to hide disclaimers
            $translate('core.disclaimer.hide.errorcodes').then(function (val) {
                   if (val && (val.trim().length > 0) && val !== 'td.resources.disclaimer.hide.errorcodes' && val.split(',').indexOf(toParams.code) !== -1) {
                     $log.debug('Hiding disclaimer for error code ..' + toParams.code);      
                        $rootScope.hideDisclaimer = true;
                   }
            });

        });
    }

    /*
     *  constants used through out the web app no matter the module loaded
     *
    */
    function getConstants() {
        return {
            //input masks
            masks: {
                name: '(?![^,]*,[^,]*,)\\x20?(?:[a-zA-Z\'-]+\\x20?)*',
                address: '(?!.*  )[a-zA-Z\\d#()+\'.,/\\- ]{1,50}',
                city: '[a-zA-Z\\s]*',
                zip: '[0-9]{5}',
                shortpostal: '[0-9]{3}',
                phone: /\([1-9]{1}[0-9]{2}\)[0-9]{3}-[0-9]{4}/,
                caPostal: '^[A-Za-z][0-9][A-Za-z]\\s?[0-9][A-Za-z][0-9]$',
                email: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
            },

            //ignore: (boolean) do not show the loading backdrop on these Regex URI matches
            //track: (string) track the load times for these urls under the given category
            handleURILoading: [],

        };
    }

    function hasDebugFlag() {
        return !!window.location.href.match(/(\?|&)debug/);
    }

})();