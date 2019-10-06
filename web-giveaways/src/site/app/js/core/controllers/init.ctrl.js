(function() {
    'use strict';

    angular
        .module('ga.core')
        .controller('InitCtrl', InitCtrl);

    /* @ngInject */
    function InitCtrl($log, $state, $cookies, InitService, initDetails) {
        /*jshint validthis: true */
        var vm = this;

        activate();


        ///// PRIVATE ////////////////////

        function activate() {
            //Check registered modules for $state routing, based on the response values
            $log.debug('InitCtrl: gotta check it and if its bad...');
            $log.debug(initDetails);

            if (!initDetails) {
                $state.go('error-unknown');
            }

            if (!initDetails.config.campaignCode) {
                $log.debug('InitCtrl: legacy dto, set campain code to program code');
                initDetails.config.campaignCode = initDetails.config.programCode;
            }

            InitService.routeInit(initDetails);

        }

    }
})();