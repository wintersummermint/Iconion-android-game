(function() {
	'use strict';

	angular.module('memory.controllers', [])

	.controller('AppCtrl', ['$scope', '$ionicModal', '$ionicPopup', '$state', 'Settings', function($scope, $ionicModal, $ionicPopup, $state, Settings) {
		Settings.set('gameOn','false');
		$scope.settings = Settings.getSettings();
		/*** Settings modal ***/
		$scope.showSettings = function() {
			if(!$scope.settingsModal) {
				// Load the modal from the given template URL
				$ionicModal.fromTemplateUrl('templates/settings.html', function(modal) {
					$scope.settingsModal = modal;
					$scope.settingsModal.show();
				}, {
					// The animation we want to use for the modal entrance
					animation: 'slide-in-up'
				});
			} else {
				$scope.settingsModal.show();
			}
		};
		/*** Info modal ***/
		$scope.showInfo = function() {
			if(!$scope.infoModal) {
				// Load the modal from the given template URL
				$ionicModal.fromTemplateUrl('templates/info.html', function(modal) {
					$scope.infoModal = modal;
					$scope.infoModal.show();
				}, {
					// The animation we want to use for the modal entrance
					animation: 'slide-in-up'
				});
			} else {
				$scope.infoModal.show();
			}
		};
		/*** Check if a game is in progress ***/
		$scope.checkGame = function() {
			var stateName = $state.current.name.substring(0, 4);
			var gameState = Settings.get('gameOn');
			console.log('checkGame: ',stateName, gameState);
			if (stateName === 'game' && gameState) {
				$scope.showConfirm();
			} else {
				$state.go('home');
			}
		};
		/*** Game Quit Confirmation popup ***/
		$scope.showConfirm = function() {
			console.log('showConfirm');
			var confirmPopup = $ionicPopup.confirm({
				title: 'Are you sure you want to quit?',
				cancelText: 'Yes',
				cancelType: 'button-outline',
				okText: 'No',
				okType: 'button-positive',
	  			scope: $scope,

			});
			confirmPopup.then(function(res) {
				if(res) {
					$state.go($state.current, {}, { reload: false });
				} else {
					Settings.set('gameOn','false');
					$state.go('home');
				}
			});
		};
	}])

	.controller('HomeCtrl', ['$scope', 'Settings', function($scope, Settings) {
		$scope.settings = Settings.getSettings();
		$scope.theme = Settings.get('theme');
	}])

	.controller('GameCtrl', ['$scope', '$state', '$ionicPopup', 'icons', 'Settings', function($scope, $state, $ionicPopup, icons, Settings) {
		//	Retrieve tile icons and save to $scope & local settings
		$scope.icons = icons;
		Settings.set('icons', icons);

	  	$scope.settings = Settings.getSettings();

		// Listeners for game events triggered by angular-memory-game
		$scope.$on('memoryGameUnmatchedPairEvent', function() {
			$scope.message = 'Try again!';
			console.log($scope.message);
		});
		$scope.$on('memoryGameMatchedPairEvent', function() {
			$scope.message = 'Good match!';
			console.log($scope.message);
		});
		$scope.$on('memoryGameCompletedEvent', function() {
			$scope.message = 'Success!';
			$scope.showFinale();
			console.log($scope.message);
		});
		$scope.$on('memoryGameIconErrorEvent', function() {
			$scope.message = 'ERROR: # of available tiles is less than the grid requires';
			$scope.showIconError();
			console.log($scope.message);
		});

		/*** Game Over popup ***/
		$scope.showFinale = function() {
			var finalePopup = $ionicPopup.confirm({
				title: '<h2>Congratulations!</h2><h4>You matched all the tiles!</h4>',
				cancelText: 'Main Menu',
				cancelType: 'button-dark',
				okText: 'Play Again',
				okType: 'button-balanced',
	  			scope: $scope,
			});
			finalePopup.then(function(res) {
				if(res) {
					console.log('Play Again');
					$state.go($state.current, {}, { reload: true });
				} else {
					console.log('Main Menu');
					$state.go('home');
				}
			});
		};

		/*** Error popup ***/
		$scope.showIconError = function() {
			var errorPopup = $ionicPopup.confirm({
				title: '<h2>ERROR:</h2><h4>there was a problem loading the icons.</h4>',
				cancelText: 'Main Menu',
				cancelType: 'button-dark',
				okText: 'Try Again?',
				okType: 'button-balanced',
	  			scope: $scope,
			});
			errorPopup.then(function(res) {
				if(res) {
					console.log('Try Again?');
					$state.go($state.current, {}, { reload: true });
				} else {
					console.log('Main Menu');
					$state.go('home');
				}
			});
		};

	}])

	.controller('FinaleCtrl', ['$scope', '$state', 'Settings', function($scope, $state, Settings) {
		$scope.settings = Settings.getSettings();
		$scope.restartBtn = function() {
			console.log('restartBtn');
			$state.go($state.current, {}, { reload: false });
			$scope.modal.hide();
		};

		$scope.closeInfo = function() {
			$scope.modal.hide();
		};
	}])

	.controller('InfoCtrl', ['$scope', 'Settings', function($scope, Settings) {
		$scope.settings = Settings.getSettings();
		$scope.closeInfo = function() {
			$scope.modal.hide();
		};
	}])

	.controller('SettingsCtrl', ['$scope', 'Settings', function($scope, Settings) {
		$scope.settings = Settings.getSettings();
	    $scope.themes = Settings.getAllThemes();

		// Watch deeply for settings changes, and save them if necessary
		$scope.$watch('settings', function(v) {
			Settings.save();
			console.log('settings.change', Settings.get('theme'));
		}, true);

		$scope.closeSettings = function() {
			$scope.modal.hide();
		};
	}]);
}());