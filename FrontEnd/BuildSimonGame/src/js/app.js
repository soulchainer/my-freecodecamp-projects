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
  function unpressed(e) {
    e.classList.remove('pushed');
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
    var powerBtn = document.getElementById('power');
    var startBtn = document.getElementById('start');
    var strictBtn = document.getElementById('strict');
    var  led = document.getElementById('led');
    var self = this;
    this.cpuInterval = null;
    powerBtn.addEventListener('click', togglePower);
    this.on = false; // Is the Simon device turned on?
    this.mode = "Normal"; // Modes available: Normal, Survivor
    this.strict = false;  // Additive mode: after a fail, the game resets
    this.started = false; // Is the Simon game started?
    this.turn = 0;
    this.turns = (self.mode === "Normal")? 20: Infinity; // debe ser 20, pruebas
    this.start = function() {
      self.started = true;
      self.cpuTurn();
    };
    this.taps = [];
    this.currentPlayerTap = null;
    this.playerMiss = false;
    this.cpuTurn = function() {
      self.turn++;
      if (!self.gameEnded()) {
        console.log("entra cpu turn");
        if (!self.playerMiss || !self.taps.length) {
          self.taps.push(getRandomTap());
          updateLed(self.turn);
        }
        self.playerMiss = false;
        console.log(self.taps);
        var tap = 0;
        musicBtns.forEach(disableMusicBtns);
        self.cpuInterval = window.setInterval(play, 600, self.cpuInterval);
      } else {
        console.log("Game ended");
        return;
      }
      function play() {
        console.log(self.turn + " "+ tap);
        console.log(self.taps);
        console.log(tap);
        snds[self.taps[tap]].play();
        tap++;
        console.log("turn " + self.turn + " tap "+ tap);
        if ((tap >= self.turn)) {
          window.clearInterval(self.cpuInterval);
          self.cpuInterval = null;
          window.setTimeout(self.playerTurn, 400);
        }
      }
    };
    this.playerTurn = function() {
      console.log("Entra player");
      musicBtns.forEach(enableMusicBtns);
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

    // helper functions
    function getRandomTap() {
        return String(Math.floor(Math.random()*4));
    }
    function processFunctionButton(e) {
      console.log("pulsado "+ e.target.id);
      switch (e.target.id) {
        case 'start':
          if (self.started) {
            resetGame();
          } else {
            self.start();
          }
          break;
        default:
          if (self.strict) {
            self.strict = false;
            strictBtn.classList.remove('pushed');
          } else {
            self.strict = true;
            strictBtn.classList.add('pushed');
          }
      }
    }
    function enableMusicBtns(e) {
      if (e.hasAttribute('disabled')) {
        e.removeAttribute('disabled');
      }
    }
    function disableMusicBtns(e) {
      if (!e.hasAttribute('disabled')) {
        e.setAttribute('disabled','true');
      }
    }
    function togglePower(e){
      self.on = (self.on)? false: true;
      if (self.on) {
        console.log("Power on");
        powerBtn.classList.add('right');
        for (let btn of [startBtn, strictBtn]) {
          btn.addEventListener('click', processFunctionButton);
        }
      } else {
        console.log("Power off");
        powerBtn.classList.remove('right');
        stopGame();
      }
    }
    function musicTapError() {
      console.log("You didn't tap any button or tap the wrong one");
      console.log(self.strict);
      if (self.strict) {
        resetGame();
      } else {
        self.playerMiss = true;
        self.turn--;
        window.setTimeout(self.cpuTurn, 200);
      }
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
            window.setTimeout(self.cpuTurn, 200);
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
    function updateLed(value="--") {
      led.textContent = value;
    }
    function baseReset(){
      window.clearInterval(self.cpuInterval);
      self.cpuInterval = null;
      cs.stop();
      musicBtns.forEach(unpressed);
      // borrar los escuchadores de eventos click
      for (let btn of musicBtns) {
        btn.removeEventListener('click', processMusicTap);
      }
      updateLed();
      self.turn = 0;
      self.taps = [];
      self.currentPlayerTap = null;
      self.playerMiss = false;
    }
    function stopGame() {
      baseReset();
      for (let btn of [startBtn, strictBtn]) {
        btn.removeEventListener('click', processFunctionButton);
      }
      self.on = false;
      self.started = false;
    }
    function resetGame() {
      baseReset();
      self.on = true;
      self.start();
    }
  };

  // launch the game
  var simonGame = new simon();
})();
