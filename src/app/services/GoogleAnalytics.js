(function () {
  'use strict';
  angular.module('starter').factory('GoogleAnalytics', GoogleAnalyticsFactory);

  function GoogleAnalyticsFactory($cordovaGoogleAnalytics) {
    var TAG      = 'AnalyticsService';
    var canTrack = false;
    return {
      init          : init,
      trackView     : trackView,
      trackEvent    : trackEvent,
      trackException: trackException
    };

    function init(trackingId) {
      if (trackingId !== null && trackingId !== '' && window.cordova) {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId(trackingId);
        canTrack = true;
      } else {
        console.warn('[' + TAG + ']: Invalid Tracker ID or not using emulator');
      }
    }

    function trackEvent(category, action, label) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackEvent(category, action, label);
      }
    }

    function trackView(viewName) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackView(viewName);
      }
    }

    function trackException(description, isFatal) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackException(description, isFatal)
      }
    }
  }

})();
