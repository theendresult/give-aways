/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('ga.std', [
            'ga.core',
        ]);

    angular.module('ga.std').config(configure);
    angular.module('dto.std').run(runApp);

    /*@ngInject*/
    function configure($stateProvider) {

        $stateProvider
            .state('std', {
                url: '/ajs/std',
                abstract: true,
                templateUrl: 'app/js/std/views/master.html',
                resolve: {
                },
                onEnter: /*@ngInject*/ function($translatePartialLoader) {
                    $translatePartialLoader.addPart('std');
                }
            });
        
    }

    function runApp($log, $filter, $translate, InitService, TestDriveService, DealerService, StorageService) {
        //Register the program details router for the Rewards Platform module
        InitService.registerInitRouter(function(initDetails, options) {
            $log.debug('InitService-TD-ROUTE: registerInitRouter - initDetails, options: ', initDetails, options);

            if (initDetails && initDetails.isStd) {

                //Campagin is configured to use dto keys - forward to the key page
                if (initDetails.config.dtoKeys === 'Y' && !(options && options.fromKey)) {
                    return 'td.keyPage';
                }
                
                //Setting up landing page 
                var campaignWebConfig = angular.fromJson(initDetails.langCampaign),
                    userLandingPage = false;
                if(campaignWebConfig && campaignWebConfig.en) {
                    userLandingPage = (campaignWebConfig.en['td.control.show.landing.page'] === 'Y');
                    $log.debug('InitService-TD-ROUTE: forwarding to landing page');
                }

                
            }
        });
    }
})();