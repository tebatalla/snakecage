(function () {
  window.Game = window.Game || {};

  Game.DIRS = {
    "N": [-1, 0],
    "E": [0, 1],
    "S": [1, 0],
    "W": [0, -1]
  };

  var Snake = window.Game.Snake = function (starting) {
    this.dir = _.sample(Object.keys(Game.DIRS));
    this.segments = [starting];
  };

  Snake.prototype = {
    turn: function(dir) {
      this.dir = dir;
    },

    move: function() {
      var head = this.segments[0];
      var previousPos = head.pos.concat([]);
      head.plus(this.dir);

      for (var i = 1; i < this.segments.length; i++) {
        var currentPos = this.segments[i].pos.concat([]);
        this.segments[i].pos = previousPos;
        previousPos = currentPos;
      }
    }

  };

  var Coord = function (pos) {
    this.pos = pos;
  };

  Coord.prototype = {
    plus: function(dir) {
      this.pos[0] += Game.DIRS[dir][0];
      this.pos[1] += Game.DIRS[dir][1];
    },

    equals: function(pos) {
      return this.pos[0] === pos[0] && this.pos[1] === pos[1];
    },

    isOpposite: function(pos) {
      return this.pos[0] === pos[1] && this.pos[1] === pos[0];
    }
  };

  var Board = window.Game.Board = function (size) {
    this.snake = new Snake(new Coord([3,3]));
    this.grid = this.makeGrid(size);
  };

  Board.prototype = {
    render: function() {
      var display = [];
      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          this.snake.segments.forEach( function(segment) {
            if (segment.pos[0] === i && segment.pos[1] === j) {
              display += "S";
            } else {
              display += ".";
            }
          });
        }
        display += "\n";
      }
      return display;
    },

    makeGrid: function(size) {
      var array = new Array(size);
      for (var i = 0; i < array.length; i++) {
        array[i] = new Array(size);
      }
      return array;
    },

    makeApple: function() {

    },

    isOccupied: function(pos) {
      // for (var i = 0; i < this.grid.length; i++) {
      //   for (var j = 0; j < this.grid[i].length; j++) {
      //     if (this.render)
      //   }
      // }
    }
  };

})();
