$(document).ready(function(){
  // time related variables
  var $stime = $("#stime");
  var $btime = $("#btime");
  var stime = $stime.attr("data-time")*60;
  var stime4 = stime/4;
  var btime = $btime.attr("data-time")*60;
  // timelines for animations & related events
  var tl = new TimelineMax({paused: true});
  tl.to("#kw", stime4, {width:"8%", ease:Linear.easeNone})
    .to("#rw", stime4, {width:"7%", ease:Linear.easeNone})
    .to("#ow", stime4, {width:"6%", ease:Linear.easeNone})
    .to("#ww", stime4, {width:"5%", ease:Linear.easeNone})
    .to("#rr", stime4, {width:"100%", ease:Linear.easeNone}, 0)
    .to("#er", stime4, {width:"98%", ease:Linear.easeNone}, stime4)
    .to("#sr", stime4, {width:"97%", ease:Linear.easeNone}, stime4*2)
    .to("#tr", stime4, {width:"99%", ease:Linear.easeNone}, stime4*3);

  tl.eventCallback("onStart", function(){
    if (tictac) {
      tictac.play();
    }
  });
  tl.eventCallback("onComplete", function(){
    if (alarm) {
      alarm.play();
    } else {
      tl.duration(btime).reverse(0);
    }
  });
  tl.eventCallback("onReverseComplete", function(){
    if (alarm) {
      if (tictac){
        tictac.paused = true;
      }
      if (!tl.paused()){
        alarm.play();
      }
    } else {
      tl.duration(stime).play(0).delay(4);
    }
  });
  var mtl = new TimelineMax({paused: true});
  mtl.to("#modal", 0.4, {rotation:0, ease: Sine.easeInOut});
  mtl.eventCallback("onReverseComplete", function(){
    mtl.progress(0).pause();
  });
  var shake = new TimelineMax({paused: true, repeat: -1});
  shake.fromTo(".timer-text", 0.1, {x: "-=10px"}, {x: "+=10px"});
  // Sounds: initialization & events related
  var alarmStarted;
  var assetPath = "./assets/";
  var tictac, alarm;
  var sounds = [
    {id: "tictac", src: "tictac.ogg"},
    {id: "alarm", src: "alarm.ogg"},
  ];
  createjs.Sound.alternateExtensions = ["mp3"];
  createjs.Sound.on("fileload", onSoundLoaded);
  createjs.Sound.registerSounds(sounds, assetPath);
  function onSoundLoaded(e) {
    if (e.id === "tictac") {
      tictac = createjs.Sound.createInstance(e.id);
      tictac.loop = -1;
      tictac.paused = true;
      tictac.volume = 1;
    } else {
      alarm = createjs.Sound.createInstance(e.id);
      alarm.paused = true;
      alarm.volume = 1;
      alarm.on("complete", onAlarmEnd);
      alarm.on("succeeded", onAlarmStart);
    }
  }
  function onAlarmEnd(event) {
    alarmStarted = false;
    shake.progress(0).pause();
    if (tl.reversed()){
      tl.duration(stime).play(0);
    } else {
      if (tictac) {
        tictac.play();
      }
      tl.duration(btime).reverse(0);
    }
  }
  function onAlarmStart(event) {
    shake.play();
    alarmStarted = true;
    if (tictac) {
      tictac.paused = true;
    }
  }
// All about the buttons for increment and decrement time
  var plusMinusBtns = "#sminus,#splus,#bminus,#bplus";
  $(plusMinusBtns).click(function(e){
    var value = (e.currentTarget.id.indexOf("plus") > 0)? 1:-1;
    var changeSessionTime, changeBreakTime;
    $(this).siblings(".time").attr("data-time", function(i,v){
      // convertir tiempo a minutos
      var min = 1, max = 999;
      var result = Number(v);
      if (tl.paused()) {
        var $parent = $(this).parent();
        var isStartedTL = $playpause.attr("title") !== "Start";
        changeSessionTime = $parent.hasClass("session") && !tl.reversed();
        changeBreakTime = $parent.hasClass("break") && (tl.reversed() || !isStartedTL);
        if (changeSessionTime || changeBreakTime) {
          result += value;
          if (changeSessionTime) {
            stime = $stime.attr("data-time")*60;
            tl.duration(stime).progress(0).pause();
          } else {
            btime = $btime.attr("data-time")*60;
            if (isStartedTL){
              tl.duration(btime).reverse(0).pause();
            }
          }
        }
      }
      return ((result >= min) && (result <= max))? result: v;
    });
  });
  var $playpause = $("#playpause");
  function togglePlay() {
    // Handle what needs to be done when playpause button is clicked.
    // Return string with the new label for the button.
    var nextAction = "Pause";
    if (alarmStarted) {
      if (alarm.paused) {
        alarm.paused = false;
        shake.resume();
      } else {
        alarm.paused = true;
        shake.pause();
      }
    } else if (tl.paused()) {
      tl.resume();
      if (tictac) {
        tictac.paused = false;
      }
    } else {
      tl.pause();
      if (tictac){
        tictac.paused = true;
      }
      nextAction = "Continue";
    }
    return nextAction;
  }
  $playpause.click(function(){ // Animate the word timers
    var btnTitle = togglePlay();
    $(this).attr("title", btnTitle)
    .children().toggleClass("ion-ios-pause ion-ios-play");
  });
  // Reset the timer button feature
  $("#reset").click(function(){
    tl.duration(stime).restart().pause();
    shake.progress(0).pause();
    $playpause.attr("title", "Start").children()
    .removeClass("ion-ios-pause ion-ios-play")
    .addClass("ion-ios-play");
    if (alarmStarted) {
      alarmStarted = false;
      alarm.stop();
    } else if (tictac) {
      tictac.paused = true;
    }
  });
  // Sound on/off button feature
  $("#sound").click(function() {
    var $this = $(this);
    var title;
    $this.toggleClass("ion-ios-volume-high ion-ios-volume-low");
    if ($this.hasClass("ion-ios-volume-low")) {
      title = "Muted";
      if (tictac) {
        tictac.muted = true;
      }
      if (alarm) {
        alarm.muted = true;
      }
    } else {
      title = "Play sound";
      if (tictac) {
        tictac.muted = false;
      }
      if (alarm) {
        alarm.muted = false;
      }
    }
    $this.attr("title", title);
  });
  // Button for getting info of the page
  $("#info").click(function(){
    mtl.play();
  });
  // Button for closing the info modal
  $("#close").click(function(){
    mtl.reverse(0);
  });
});
