
(function() {
    'use strict';

    angular
        .module('ga.core')
        .controller('ErrorCtrl', ErrorCtrl);

    /* @ngInject */
    function ErrorCtrl($log, $state, $window, $rootScope, $stateParams, $translate, ErrorsService, StorageService, loadingService) {
        var vm = this;

        vm.errResp = null;
        vm.errors = null;
        vm.errorHTML = null;
        
        activate();

        ////////////////


        function activate() {
            $log.debug('ErrorCtrl : activate() - loaded ErrorCtrl');
        }
    }
})();