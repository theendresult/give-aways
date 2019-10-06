(function() {
    'use strict';

    angular
        .module('ga.core')
        .factory('InitService', InitService);

    /* @ngInject */
    function InitService($http, $log, $q, $rootScope, $state, $timeout, $translate, LangFactory, StorageService, 
        ErrorsService, TrackingService, InitModel) {

        var service = {
            routeInit: routeInit,
            routeError: routeError,
            pageInit: pageInit,
            registerInitRouter: registerInitRouter,
            switchLang: switchLang
        };

        var initRouters = [];

        var langFallbacks = [],
            defaultLang = 'en',
            currentLang = defaultLang,
            languages = { 'en': true },
            programCode,
            campaignCode,
            programLangs,
            campaignLangs,
            programDetails;


        return service;

        ///////////////////////////


        /**
         * Initialize the service state and route the user to the next $state required.
         * 
         * @param  {object} initDetails The program detail response
         * @param  {object} options     Any passed options
         * @return {void}
         */
        function routeInit(initDetails, options) {
        	var state = getState(initDetails, options);
            StorageService.sessionAdd('InitService.programDetails', angular.toJson(initDetails));
            programDetails = initDetails;
            initialize().then(function() {
                if(state) {
                    $log.debug('InitService: state found: ', state);
                    $state.go(state.state, state.data);
                } else {
                    $log.error('InitService: Could not locate a valid router state');
                    $state.go('error-unknown');
                }
            });
        }

        /**
         * Route errors
         * @param  {object} errors Errors object from service response
         * @param  {boolean} keyPage True if call is from key page
         * @param  {string} key   The key used when this error occurred
         * @param  {string} payload  The payload used when this error occurred
         * @return {boolean}        True if $state.go is called
         */
        function routeError(errors, keyPage, key, payload, campaignCode) {
            $log.debug('InitService: route error: ', errors, keyPage);
            $log.debug('InitService: route error key: ', key);
            $rootScope.key = key;
            $log.debug('InitService: route error rootscope: ', $rootScope.key);
            var defer = $q.defer(),
                fetchMethod, req;
            if(key) {
                fetchMethod = InitModel.detailsByKey;
                req = { key: key, catalogType : 'DLRREGASSOC' };
            } else if(payload) {
                fetchMethod = InitModel.detailsByPayload;
                req = {payload: payload, catalogType : 'DLRREGASSOC' };
            } else if(campaignCode) {
                fetchMethod = InitModel.detailsByCode;
                req = {code: campaignCode, catalogType : 'DLRREGASSOC' };
            }
            fetchMethod(req, function(initDetails) {
                StorageService.sessionAdd('InitService.programDetails', angular.toJson(initDetails));
                programDetails = initDetails;
                initialize().then(function() {
                    // The $timeout here should not be needed, but for some reason loading
                    // non-xhr JSON properties into the translate store is not instantaneous
                    // and without a slight pause, the loaded properties will not resolve
                    // the error route
                    $timeout(function() {
                        defer.resolve(errorRoute(errors, keyPage));
                    }, 50);
                });
            }, function(errResponse) {
                //couldn't fetch campaign details, go generic
                $timeout(function() {
                    defer.resolve(errorRoute(errors, keyPage));
                }, 50);
            });
            
            return defer.promise;
        }

        /**
         * Initializes the program details on page refresh, by trying to load them from sessions storage.
         * @return {void}
         */
        function pageInit() {
            var details = StorageService.sessionGet('InitService.programDetails');
            if(details) {
                programDetails = angular.fromJson(details);
            }
            currentLang = StorageService.localGet('InitService.currentLang', defaultLang);
            if(programDetails) {
                $log.debug('InitService: loaded programDetails from storage: ', programDetails);
                initialize(true);
            } else {
                switchLang(currentLang);
            }
        }

        /**
         * Register a module router. This function should take the program details object,
         * and be able to inspect it to determine if it's module can handle it, and if so,
         * the $state required to direct the user to.
         * 
         * @param  {Function} fn The router function
         * @return {void}
         */
        function registerInitRouter(fn) {
        	if(typeof fn === 'function') {
        		initRouters.push(fn);
        	}
        }

        /**
         * Switch the user's main language. Called initially to setup the main language and fallbacks.
         * This allows programs and campaigns to override the default values.
         * 
         * @param  {string} lang The lang to switch to, or nothing if we should use the default lang
         * @return {void}
         */
        function switchLang(lang) {
            var i,
                langKey,
                useProgLang,
                useLang = lang || currentLang;

            langFallbacks = [];

            if(lang && languages[lang]) {
                currentLang = lang;
            }
            $log.debug('InitService: saving currentLang to storage: ' + currentLang);
            StorageService.localAdd('InitService.currentLang', currentLang);
            
            if(programCode && programLangs && programLangs.length) {
                for(i = 0; i < programLangs.length; i++) {
                    langKey = programCode + '_' + programLangs[i];
                    if(programLangs[i] === currentLang) {
                        useLang = useProgLang = langKey;
                    } else if(programLangs[i] === defaultLang) {
                        langFallbacks.push(langKey);
                    }
                }
            }
            if(campaignCode && campaignLangs && campaignLangs.length) {
                for(i = 0; i < campaignLangs.length; i++) {
                    langKey = campaignCode + '_' + campaignLangs[i];
                    if(campaignLangs[i] === currentLang) {
                        useLang = langKey;
                        if(useProgLang) {
                            //register the program lang as a fallback if its set as the lang to use
                            langFallbacks.push(useProgLang);
                        }
                    } else if(campaignLangs[i] === defaultLang) {
                        langFallbacks.push(langKey);
                    }
                }
            }

            if(defaultLang !== currentLang) {
                langFallbacks.push(currentLang);
            }
            langFallbacks.push(defaultLang);

            $log.debug('InitService: Register fallbacks: ', langFallbacks);
            $log.debug('InitService: Use language: ' + useLang);
            $http.defaults.headers.common['userlang'] = currentLang;
            $translate.fallbackLanguage(langFallbacks);
            $translate.use(useLang);
        }

       

        ///// PRIVATE /////////////
        

        function initialize(noWait) {
            var defer = $q.defer();
            TrackingService.initialize(programDetails).then(function() {
                $log.debug('InitService: initialize running');
                if(!noWait) {
                    setupProgramLang(programDetails);
                    switchLang();
                }
                defer.resolve();
            });
            if(noWait) {
                setupProgramLang(programDetails);
                switchLang();
            }
            return defer.promise;
        }
 

        /**
         * Add the program language packs to the current translate object. These will override the default packs.
         * 
         * @param  {object} initDetails The program details response
         * @return {void}
         */
        function setupProgramLang(initDetails) {
            //TODO handle current lang settings...
            var l,
                langKey,
                langs;
            programLangs = [];
            campaignLangs = [];
            if(initDetails.langProgram) {
                langs = angular.fromJson(initDetails.langProgram);
                for(l in langs) {
                    programCode = initDetails.config.programCode;
                    programLangs.push(l);
                    langKey = initDetails.config.programCode + '_' + l;
                    LangFactory().addLang(langKey, langs[l]);
                    $translate.use(langKey);  //load the lang, switchLang() will handle the real setting
                }
            }
            if(initDetails.langCampaign) {
                langs = angular.fromJson(initDetails.langCampaign);
                for(l in langs) {
                    campaignCode = initDetails.config.campaignCode;
                    campaignLangs.push(l);
                    langKey = initDetails.config.campaignCode + '_' + l;
                    LangFactory().addLang(langKey, langs[l]);
                    $translate.use(langKey);  //load the lang, switchLang() will handle the real setting
                }
            }
        }

        /**
         * Iterate through the registered routers, and try and find a matching state to go to.
         * 
         * @param  {object} initDetails The program details response
         * @param  {object} options     Any passed options to pass to the router
         * @return {string}             $state to transition to
         */
        function getState(initDetails, options) {
            var state, errors, i;

            //check for generic DTO errors
            errors = ErrorsService.getErrors(initDetails);
            if(errors.hasErrors) {
                for(i = 0; i < errorStates.length; i++) {
                    if(errors.codes[errorStates[i]]) {
                        return { state: 'error', data: { code: errorStates[i] } };
                    }
                }
            }

            //check for routes from registered modules
            for(i = 0; i < initRouters.length; i++) {
                state = initRouters[i].call(window, initDetails, options);
                if(state) {
                    return { state: state };
                }
            }
        }

        /**
         * Handle routing for the error
         * @param  {array} errors  List of errors
         * @param  {boolean} keyPage   is this from the keypage
         * @return {boolean}         was this routed
         */
        function errorRoute(errors, keyPage) {
            var defer = $q.defer(),
                errRt,
                i,
                rtn = false,
                errRtKey;
            if(errors && errors.length) {
                for(i = 0; i < errors.length; i++) {
                    errRtKey = 'core.errorpage.route.' + errors[i].errorCode;
                    errRt = $translate.instant(errRtKey);
                    $log.debug('InitService: check error route: ' + errRtKey + ', Trans Reponse: ' + errRt);
                    if(errRt && errRt !== errRtKey) {
                        $log.debug('InitService: route error found: ' + errRt + ' : from key: ' + errRtKey);
                        $state.go(errRt, {code: errors[i].errorCode});
                        rtn = true;
                        break;
                    } else if (!keyPage) {
                        errRt = $state.go('error-page', {code: errors[i].errorCode});
                        rtn = true;
                    }
                }
            }
            return rtn;
        }

    }
})();