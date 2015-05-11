(function() {
  'use strict';

  angular.module('memory.directives', ['memory.services'])
    .directive('memoryGame', ['Settings', '$timeout', function(Settings, $timeout) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          columns: '@',
          rows: '@'
        },
        templateUrl: 'templates/memory-game.html',

        link: function(scope, elements, attr) {

          var isPairFlipped = false;

          scope.init = function() {
            Settings.set('gameOn',false);
            //  Init a master set of tiles from Factory
            scope.tiles = Settings.get('icons');
            scope.settings = Settings.getSettings();

            //  Wait for nav-view to animate in before starting game
            $timeout( function(){
              scope.start();
            }, 700);
            
          };

          scope.start = function() {
            // Check coherence between numbers of rows*columns, and number of available tiles
            if (scope.tiles.length * 2 < attr.rows * attr.columns) {
              scope.$emit('memoryGameIconErrorEvent');
            }
            scope.tilePairs = attr.rows * attr.columns * 0.5;

            //  Make a new deck based off of number of tilePairs
            var deck = makeDeck(scope.tiles);

            //  Create the grid of tiles
            scope.grid = makeGrid(deck);
            scope.firstPick = scope.secondPick = undefined;
            scope.unmatchedPairs = scope.tilePairs;
          };
          /**
           * Define Tile object
           * @param {string} title Filename of the icon associated to the tile
          */
          function Tile(title) {
            this.title = title;
            this.flipped = false;
            this.matched = false;
          }
          /*** Method flip for Tile ***/
          Tile.prototype.flip = function() {
            this.flipped = !this.flipped;
         };
          /*** Method match for Tile ***/
          Tile.prototype.match = function() {
            this.matched = !this.matched;
          };
          /**
           * Function called when player click on a Tile
           * @param {Tile} tile Tile picked by the player
          */
          scope.flipTile = function(tile) {
            // Set Game state to active
            if (!scope.gameOn) {Settings.set('gameOn','true');}

            //  Check if tile is already flipped, or a tile pair is flipped
            if (tile.flipped || isPairFlipped ) {
              return;
            }
            tile.flip();

            if (!scope.firstPick) {
              scope.firstPick = tile;
            } else {
                isPairFlipped = true;

                $timeout(function() {
                  //  Check if there's a matching pair
                  if (scope.firstPick.title === tile.title) {
                    scope.unmatchedPairs--;
                    scope.firstPick.match();
                    tile.match();
                    isPairFlipped = false;

                    scope.$emit('memoryGameMatchedPairEvent');
                    //  Check if it's the last matching pair
                    if (scope.unmatchedPairs === 0) {
                      $timeout(function() {
                        scope.$emit('memoryGameCompletedEvent');
                      }, 1000);
                    }
                  } else {
                    scope.secondPick = tile;
                    scope.$emit('memoryGameUnmatchedPairEvent');
                    var tmpFirstPick = scope.firstPick;
                    var tmpSecondPick = scope.secondPick;
                    $timeout(function() {
                      tmpFirstPick.flip();
                      tmpSecondPick.flip();
                      isPairFlipped = false;
                    }, 800);
                  }
                  scope.firstPick = scope.secondPick = undefined;
                }, 300);
            }
          };
          /**
           * Create deck of tiles based off of number of tilePairs
           * @return {array} tileDeck Array of Tiles
          */
          function makeDeck() {
            var tileDeck = [],
                rndTile;
            for (var i = 0; i < scope.tilePairs; i++) {
              rndTile = removeRandomTile(scope.tiles);
              tileDeck.push(new Tile(rndTile));
              tileDeck.push(new Tile(rndTile));
            }
            return tileDeck;
          }
          /**
           * Arrange a set of Tiles on a two-dimensionnal grid
           * @param {array} tileDeck Array of Tiles
           * @return {array} grid Two-dimensional array of Tiles
          */
          function makeGrid(tileDeck) {
            var grid = [];
            for (var row = 0; row < attr.rows; row++) {
              grid[row] = [];
              for (var col = 0; col < attr.columns; col++) {
                  grid[row][col] = removeRandomTile(tileDeck);
              }
            }
            return grid;
          }
          /**
           * Pick a random Tile from a deck to put it on a grid
           * @param {array} tileDeck Array of Tiles
           * @return {tile} Randomly picked Tile
           */
          function removeRandomTile(tileDeck) {
            var i = Math.floor(Math.random()*tileDeck.length);
            return tileDeck.splice(i, 1)[0];
          }

          // init the game
          scope.init();
        }
      };
    }]);
}());