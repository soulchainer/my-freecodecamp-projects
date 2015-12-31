(function(){
  var simon = function() {
    function getTapSerie(taps) {
      var moves = Array(tap);
      for (let i = 0; i < tap; i++) {
        moves[i] = Math.floor(Math.random()*4);
      }
    }
    this.mode = "Normal"; // Modes available: Normal, Millenium Survivor
    this.strict = false;  // Additive mode: after a fail, the game resets
    this.turn = 0;
    this.turns = (this.mode === "Normal")? 20: 1000;
    this.taps = getTapSerie(this.turns);
    this.play = function() {
      for (let i = 0; i <= this.turn; i++) {
        // play sound
        // highlight the button, triggering the click event in the proper button
      }
      this.turn++;
    }
    this.gameEnded = function() {
      return (this.turn === this.turns);
    }
  };

  function game() {
    let simonGame = new simon();
    while (true) {
      cpuTurn(simonGame);
      playerTurn(simonGame);
      if (simonGame.gameEnded) {
        console.log("You win!");
        break;
      }
      if (simonGame.turn === 0) {
        console.log("You miss");
        if (simonGame.strict) {
          simonGame = new simon();
        }
        simonGame.play();
      }
    }
  }
})();
