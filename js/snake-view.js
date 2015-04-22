(function() {
  window.Game = window.Game || {};

  $.snakeGame = function (el) {
    this.$game = $('<form class="game-play" action="index.html" method="post">' +
          '<label>Number of rows? ' +
            '<input type="text" class="rows" value="16">' +
          '</label>' +
          '<label>Difficulty ' +
            '<select class="difficulty" name="">' +
              '<option value="500">Easy</option>' +
              '<option value="200" selected>Medium</option>' +
              '<option value="100">Hard</option>' +
              '<option value="50">Crazy Mode</option>' +
            '</select>' +
          '</label>' +
          '<input type="submit" class="submit" value="Start the game!">' +
        '</form>');
    this.$el = $(el);
    this.$el.html(this.$game);
    this.$el.on('click', '.restart', this.restartGame.bind(this, event));
    this.$el.on('submit', '.game-play', this.playGame.bind(this, event));
  };

  $.snakeGame.prototype = {
    playGame: function(e, event){
      event.preventDefault();
      var interval = parseInt($('.difficulty').val());
      var rows = parseInt($('.rows').val());
      this.$el.html($('<div class="snake-board clearfix">'));
      var view = new Game.View(this.$el.find('.snake-board'), rows, interval);
    },

    restartGame: function(e, event) {
      event.preventDefault();
      this.$el.html(this.$game);
    },
  };

  var View = window.Game.View = function($el, size, interval) {
    this.$el = $el;
    this.board = new Game.Board(size);
    this.bindEvents();
    this.draw();
    this.setParentWidth();
    this.interval = setInterval(this.step.bind(this), interval);
  };

  View.prototype = {
    handleKeyEvent: function(context, event) {
      switch (event.keyCode) {
        case (40):
          this.board.snake.turn("S");
          break;
        case (37):
          this.board.snake.turn("W");
          break;
        case (39):
          this.board.snake.turn("E");
          break;
        case (38):
          this.board.snake.turn("N");
          break;
      }
    },

    setParentWidth: function() {
      var width = 0;
      this.$el.children().first().children().width(function(i, w){ width += w; });
      this.$el.children().width(width);
      this.$el.width(width);
    },

    bindEvents: function () {
      $('body').keydown(this.handleKeyEvent.bind(this, event));
    },

    step: function () {
      try {
        if (this.board.isNextMoveApple()) {
          this.board.snake.move(true);
          this.board.apple = this.board.makeApple();
        } else {
          this.board.snake.move();
        }
        this.board.isOutOfBounds();
        this.draw();
      } catch(e) {
        clearInterval(this.interval);
        this.$el.after("<h1 class='game-over'>NOT THE BEES!</h1>");
        setTimeout(function() {
          $('.game-over').after('<a href="#" class="restart">Play again?</a>');
        }.bind(this), 1000);
      }
    },

    draw: function () {
      var rows = "";
      var cells = "";
      for (var i = 0; i < this.board.grid.length; i++) {
        rows += '<div class="row clearfix">';
        for (var j = 0; j < this.board.grid[i].length; j++) {
          cells += '<div class="cell';
          var segments = _.filter(this.board.snake.segments, function(segment) {
            return segment.equals([i, j]);
          });
          if (this.board.snake.head.equals([i, j])) {
            cells += ' head ' + this.board.snake.dir;
          }
          if (segments.length > 0) {
            cells += ' snake" ';
          } else if (this.board.apple.equals([i, j])){
            cells += ' apple" ';
          } else {
            cells += '" ';
          }
          cells += 'data-pos="' + [i, j] + '">';
          if (this.board.snake.head.equals([i, j])) {
            cells += '<img class="cage-face" src="./img/cage.png">';
          }
          cells += '</div>';
        }
        rows += cells + '</div>';
        cells = "";
      }
      this.$el.html(rows);
    }
  };

  $.fn.snakeGame = function () {
  return this.each(function () {
    new $.snakeGame(this);
  });
};
})();
