(function() {
  'use strict';

  angular.module('memory.services', [])

  .constant('DEFAULT_SETTINGS', {
    'TEMP_THEME': 'dark',
    'LOCAL_STORAGE': 'settings'
  })

  //  Data for Settings modal
  .factory('Settings', ['$rootScope', 'DEFAULT_SETTINGS', function($rootScope, DEFAULT_SETTINGS) {
    var _settings = {},
      themes = [
      // { text: 'Light', value: 'light' },
      { text: 'Stable', value: 'stable' },
      { text: 'Positive', value: 'positive' },
      { text: 'Calm', value: 'calm' },
      { text: 'Balanced', value: 'balanced' },
      { text: 'Energized', value: 'energized' },
      { text: 'Assertive', value: 'assertive' },
      { text: 'Royal', value: 'royal' },
      { text: 'Dark', value: 'dark' }
    ];

    var obj = {
      getSettings: function() {
        return _settings;
      },
      // Save the settings to localStorage
      save: function() {
        window.localStorage[DEFAULT_SETTINGS.LOCAL_STORAGE] = JSON.stringify(_settings);
        $rootScope.$broadcast('settings.changed', _settings);
      },
      // Get a settings val
      get: function(k) {
        return _settings[k];
      },
      // Set a settings val
      set: function(k, v) {
        _settings[k] = v;
        this.save();
      },
      getAllThemes: function() {
        return themes;
      },
      getTheme: function() {
        return _settings.theme;
      }
    };

    try
    {
      _settings = JSON.parse(window.localStorage[DEFAULT_SETTINGS.LOCAL_STORAGE]);
      } catch(e) {
    }
    // Just in case we have new settings that need to be saved
    _settings = angular.extend({}, DEFAULT_SETTINGS, _settings);

    if(!_settings)
    {
      // Initialize with default settings 
      obj.set('theme', DEFAULT_SETTINGS.TEMP_THEME);
      window.localStorage[DEFAULT_SETTINGS.LOCAL_STORAGE] = JSON.stringify(_settings);
    }

    // Save the settings to be safe
    obj.save();
    return obj;
  }])

  .factory('iconFactory', ['$http', function($http)
  {
    return {
    	getIcons: function()
      {
        // return $http.get('http://wwww.segramedia.com/assets/ionicmemory/icons.json').then(function(response) {
      	return $http.get('js/icons.json').then(function(response) {
          return response.data;
      	});
      }
    };
  }]);

}());