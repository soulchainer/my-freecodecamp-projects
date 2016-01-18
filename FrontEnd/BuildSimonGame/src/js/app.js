(function(){
  function playingMusicButton(e) {  // what to do when music of button starts
    function playing() {
      e.classList.add('pushed');
    }
    return playing;
  }
  function unpressButton(e) {  // what to do when music of button ends
    function unpressed() {
      e.classList.remove('pushed');
    }
    return unpressed;
  }

  // get the music buttons
  var musicBtns = [];
  for (let i of [0,1,2,3]) {
    musicBtns[i] = document.getElementById("tap"+i);
  }

  // create and load the sounds
  var assetPath = "/assets/audio/";
  var sounds = [
    {id: "0", src: "tap0.ogg"},
    {id: "1", src: "tap1.ogg"},
    {id: "2", src: "tap2.ogg"},
    {id: "3", src: "tap3.ogg"}
  ];
  var cs = createjs.Sound;
  cs.alternateExtensions = ["mp3"];
  cs.on("fileload", onSoundLoaded);
  cs.registerSounds(sounds, assetPath);
  var snds = [];
  function onSoundLoaded(e) {
    // run when all sounds are ready
    var id = e.id;
    snds[id] = cs.createInstance(id);
    var snd = snds[id];
    snd.on("succeeded", playingMusicButton(musicBtns[id]));
    snd.on("complete", unpressButton(musicBtns[id]));
  }

  // simon device function
  var simon = function() {
    function getRandomTap() {
        return String(Math.floor(Math.random()*4));
    }
    function processFunctionButton(e) {
      switch (e.target.id) {
        case 'power':
          self.on = false;
          break;
        case 'start':
          self.restart();
          break;
        default:
          self.strict = true;
      }
    }
    function toggleDisabled(e) {
      if (e.hasAttribute('disabled')) {
        e.removeAttribute('disabled');
        console.log("enabled");
      } else {
        e.setAttribute('disabled','true');
        console.log("disabled");
      }
    }
    var power = document.getElementById('power');
    var start = document.getElementById('start');
    var strict = document.getElementById('strict');
    var self = this;

    this.on = true; // Is the Simon device turned on?
    this.mode = "Normal"; // Modes available: Normal, Survivor
    this.strict = false;  // Additive mode: after a fail, the game resets
    this.started = false; // Is the Simon game started?
    this.turn = 0;
    this.turns = (self.mode === "Normal")? 20: Infinity; // debe ser 20, pruebas
    this.togglePower = function(){
      self.on = (self.on)? false: true;
      if (self.on) {
        for (let btn of [power, start, strict]) {
          btn.addEventListener('click', processFunctionButton);
        }
      } else {
        for (let btn of [power, start, strict]) {
          btn.removeEventListener('click', processFunctionButton);
        }
      }
    };
    this.start = function() {
      self.started = true;
      self.cpuTurn();
    };
    this.restart = game;
    this.taps = [];
    this.currentPlayerTap = null;
    this.playerMiss = false;
    this.cpuTurn = function() {
      self.turn++;
      if (!self.gameEnded()) {
        console.log("entra cpu turn");
        if (!self.playerMiss || !self.taps.length) {
          self.taps.push(getRandomTap());
        }
        if (self.playerMiss) {
          self.playerMiss = false;
        }
        console.log(self.taps);
        var tap = 0;
        musicBtns.forEach(toggleDisabled);
        var round = setInterval(play, 600, round);
      } else {
        console.log("Game ended");
        return;
      }
      function play(interval) {
        console.log(self.turn + " "+ tap);
        console.log(self.taps);
        console.log(tap);
        snds[self.taps[tap]].play();
        tap++;
        if (tap >= self.turn) {
          clearInterval(round);
          musicBtns.forEach(toggleDisabled);
          setTimeout(self.playerTurn, 400);
        }
      }
    };
    this.playerTurn = function() {
      function musicTapError() {
        console.log("You didn't tap any button or tap the wrong one");
        self.turn = (self.strict)? 0: --self.turn;
        self.playerMiss = true;
        setTimeout(self.cpuTurn, 200);
      }
      function processMusicTap(e) {
        console.log("Se ejecuta processMusicTap");
        console.log(e);
        console.log(musicBtns);
        console.log("playerTap: " + self.currentPlayerTap);
        var tapped = e.target.getAttribute("data-btn");
        var snd = snds[tapped];
        snd.play();
        snd.on('complete', function(){
          console.log("Al completar sonido → tapped: "+tapped+" taps["+self.currentPlayerTap+"]: "+self.taps[self.currentPlayerTap] +" turn: "+ self.turn);
          if (tapped === self.taps[self.currentPlayerTap]) {
            console.log("Correct button pressed");
            self.currentPlayerTap++;
            console.log("playerTap: " + self.currentPlayerTap, "turn: "+ self.turn);
            if (self.currentPlayerTap === self.turn) {
              console.log("Lista de taps mostrada al completar sonido y alcanzar el final del turno del jugador:");
              console.log(self.taps);
              for (let btn of musicBtns) {
                btn.removeEventListener('click', processMusicTap);
              }
              setTimeout(self.cpuTurn, 200);
            }
          } else {
            console.log("Al completar el sonido y pulsarse botón erroneamente, tapped !== self.taps[playerTap] →  tapped: "+tapped+" taps["+self.currentPlayerTap+"]: "+self.taps[self.currentPlayerTap] +" turn: "+ self.turn);
            for (let btn of musicBtns) {
              btn.removeEventListener('click', processMusicTap);
            }
            musicTapError();
          }
        }, null, true);
      }
      console.log("Entra player");
      var taps = self.turn;
      self.currentPlayerTap = 0;
      // declare actions to trigger when a music button is pressed
      for (let btn of musicBtns) {
        btn.addEventListener('click', processMusicTap);
      }
    };
    this.gameEnded = function() {
      return (self.turn > self.turns);
    };
  };
  // game function
  function game() {
    let simonGame = new simon();
    simonGame.start();
  }
  game();
})();
