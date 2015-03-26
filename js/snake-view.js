(function() {
  window.Game = window.Game || {};

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

    bindEvents: function() {
      var that = this;
      $('body').keydown(this.handleKeyEvent.bind(this, event));
    },

    step: function() {
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
        this.$el.after("<h1 class='game-over'>Game over!</h1>");
      }
    },

    draw: function() {
      // this.$el.html('<pre>' + this.board.render() + '</pre>');
      var rows = "";
      var cells = "";
      for (var i = 0; i < this.board.grid.length; i++) {
        rows += '<div class="row clearfix">';
        for (var j = 0; j < this.board.grid[i].length; j++) {
          cells += '<div class="cell';
          var segments = _.filter(this.board.snake.segments, function(segment){
            return segment.equals([i, j])
          });
          if (segments.length > 0) {
            cells += ' snake" ';
          } else if (this.board.apple.equals([i, j])){
            cells += ' apple" ';
          } else {
            cells += '" ';
          }
          cells += 'data-pos="' + [i, j] + '"></div>';
        }
        rows += cells + '</div>';
        cells = "";
      }
      this.$el.html(rows);
    }
  };
})();
