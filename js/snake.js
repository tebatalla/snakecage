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

    move: function(apple) {
      var head = this.segments[0];
      var previousPos = head.pos.concat([]);
      head.plus(this.dir);

      for (var i = 1; i < this.segments.length; i++) {
        var currentPos = this.segments[i].pos.concat([]);
        this.segments[i].pos = previousPos;
        previousPos = currentPos;
      }

      if (apple) {
        this.segments.push(new Coord(previousPos));
      }
    },

    isOpposite: function(dir) {
      return (Game.DIRS[this.dir][0] + Game.DIRS[dir][0]) === 0 ||
            (Game.DIRS[this.dir][1] + Game.DIRS[dir][1]) === 0
    }

  };

  var Coord = function (pos) {
    this.pos = pos;
  };

  Coord.prototype = {
    plus: function(dir) {
      this.pos[0] += Game.DIRS[dir][0];
      this.pos[1] += Game.DIRS[dir][1];
      return this;
    },

    equals: function(pos) {
      return this.pos[0] === pos[0] && this.pos[1] === pos[1];
    },

    isOpposite: function(pos) {
      return this.pos[0] === pos[1] && this.pos[1] === pos[0];
    }
  };

  var Board = window.Game.Board = function (size) {
    this.rowWidth = size;
    this.grid = this.makeGrid(size);
    var half = Math.floor(size / 2);
    this.snake = new Snake(new Coord([half, half]));
    this.apple = this.makeApple();
  };

  Board.prototype = {
    render: function() {
      var display = [];
      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          this.snake.segments.forEach(function(segment) {
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
      var appleCoord;
      var x, y;
      do {
        x = Math.floor(Math.random() * this.rowWidth);
        y = Math.floor(Math.random() * this.rowWidth);
        console.log(!this.isOccupied([x, y]));
      } while (this.isOccupied([x, y]));

      return new Coord([x, y]);
    },

    isNextMoveApple: function() {
      var headPos = this.snake.segments[0].pos.concat([]);
      var headDup = new Coord(headPos);
      if (headDup.plus(this.snake.dir).equals(this.apple.pos)) {
        return true;
      } else {
        return false;
      }
    },

    isOccupied: function(pos) {
      for (var i = 0; i < this.snake.segments.length; i++) {
        if (this.snake.segments[i].equals(pos)) {
          return true;
        }
      }
      return false;
    }
  };

})();
