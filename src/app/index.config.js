(function () {
    'use strict';

    angular
        .module('starter')
        .run(runIonic)
        .config(configCompile)
        .config(configIonic);

    function configCompile($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

    function runIonic($ionicPlatform, $cordovaSplashscreen) {

        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
                window.StatusBar.styleLightContent();
            }

            if (navigator && navigator.splashscreen) {
                $cordovaSplashscreen.hide();
            }

            // Remove back button android
            $ionicPlatform.registerBackButtonAction(function (event) {
                event.preventDefault();
            }, 100);
        });


    }

    function configIonic($ionicConfigProvider) {
        $ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
        //$ionicConfigProvider.views.swipeBackEnabled (true);
        $ionicConfigProvider.backButton.text(' ').icon('ion-ios-arrow-left');
        //$ionicConfigProvider.backButton.previousTitleText (false).text ('Voltar').icon ('ion-ios-arrow-left');
        //$ionicConfigProvider.views.transition ('platform');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.views.maxCache(1);
    }

})();
