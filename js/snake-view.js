(function() {
  window.Game = window.Game || {};

  var View = window.Game.View = function($el, size) {
    this.$el = $el;
    this.board = new Game.Board(size);
    this.bindEvents();
    this.draw();
    setInterval(this.step.bind(this), 500);
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

    bindEvents: function() {
      var that = this;
      $('body').keydown(this.handleKeyEvent.bind(this, event));
    },

    step: function() {
      this.board.snake.move();
      this.draw();
    },

    draw: function() {
      // this.$el.html('<pre>' + this.board.render() + '</pre>');
      var rows = "";
      var cells = "";
      for (var i = 0; i < this.board.grid.length; i++) {
        rows += '<div class="row clearfix">';
        for (var j = 0; j < this.board.grid[i].length; j++) {
          cells += '<div class="cell';
          this.board.snake.segments.forEach(function(segment) {
            if (segment.pos[0] === i && segment.pos[1] === j) {
              cells += ' snake" ';
            } else {
              cells += '" ';
            }
          });
          cells += 'data-pos="' + [i, j] + '"></div>';
        }
        rows += cells + '</div>';
        cells = "";
      }
      this.$el.html(rows);
    }
  };
})();
