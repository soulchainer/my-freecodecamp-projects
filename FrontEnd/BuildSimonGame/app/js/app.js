!function t(e,r,n){function o(l,s){if(!r[l]){if(!e[l]){var i="function"==typeof require&&require;if(!s&&i)return i(l,!0);if(a)return a(l,!0);var u=new Error("Cannot find module '"+l+"'");throw u.code="MODULE_NOT_FOUND",u}var c=r[l]={exports:{}};e[l][0].call(c.exports,function(t){var r=e[l][1][t];return o(r?r:t)},c,c.exports,t,e,r,n)}return r[l].exports}for(var a="function"==typeof require&&require,l=0;l<n.length;l++)o(n[l]);return o}({1:[function(t,e,r){"use strict";!function(){function t(t){function e(){t.classList.add("pushed")}return e}function e(t){function e(){t.classList.remove("pushed")}return e}function r(r){var n=r.id;p[n]=c.createInstance(n);var a=p[n];a.on("succeeded",t(o[n])),a.on("complete",e(o[n]))}function n(){var t=new d;t.start()}for(var o=[],a=[0,1,2,3],l=0;l<a.length;l++){var s=a[l];o[s]=document.getElementById("tap"+s)}var i="/assets/audio/",u=[{id:"0",src:"tap0.ogg"},{id:"1",src:"tap1.ogg"},{id:"2",src:"tap2.ogg"},{id:"3",src:"tap3.ogg"}],c=createjs.Sound;c.alternateExtensions=["mp3"],c.on("fileload",r),c.registerSounds(u,i);var p=[],d=function(){function t(){return String(Math.floor(4*Math.random()))}function e(t){switch(t.target.id){case"power":i.on=!1;break;case"start":i.restart();break;default:i.strict=!0}}function r(t){t.hasAttribute("disabled")?(t.removeAttribute("disabled"),console.log("enabled")):(t.setAttribute("disabled","true"),console.log("disabled"))}var a=document.getElementById("power"),l=document.getElementById("start"),s=document.getElementById("strict"),i=this;this.on=!0,this.mode="Normal",this.strict=!1,this.started=!1,this.turn=0,this.turns="Normal"===i.mode?20:1/0,this.togglePower=function(){if(i.on=i.on?!1:!0,i.on)for(var t=[a,l,s],r=0;r<t.length;r++){var n=t[r];n.addEventListener("click",e)}else for(var o=[a,l,s],u=0;u<o.length;u++){var n=o[u];n.removeEventListener("click",e)}},this.start=function(){i.started=!0,i.cpuTurn()},this.restart=n,this.taps=[],this.currentPlayerTap=null,this.playerMiss=!1,this.cpuTurn=function(){function e(t){console.log(i.turn+" "+n),console.log(i.taps),console.log(n),p[i.taps[n]].play(),n++,n>=i.turn&&(clearInterval(a),o.forEach(r),setTimeout(i.playerTurn,400))}if(i.turn++,i.gameEnded())return void console.log("Game ended");console.log("entra cpu turn"),i.playerMiss&&i.taps.length||i.taps.push(t()),i.playerMiss&&(i.playerMiss=!1),console.log(i.taps);var n=0;o.forEach(r);var a=setInterval(e,600,a)},this.playerTurn=function(){function t(){console.log("You didn't tap any button or tap the wrong one"),i.turn=i.strict?0:--i.turn,i.playerMiss=!0,setTimeout(i.cpuTurn,200)}function e(r){console.log("Se ejecuta processMusicTap"),console.log(r),console.log(o),console.log("playerTap: "+i.currentPlayerTap);var n=r.target.getAttribute("data-btn"),a=p[n];a.play(),a.on("complete",function(){if(console.log("Al completar sonido → tapped: "+n+" taps["+i.currentPlayerTap+"]: "+i.taps[i.currentPlayerTap]+" turn: "+i.turn),n===i.taps[i.currentPlayerTap]){if(console.log("Correct button pressed"),i.currentPlayerTap++,console.log("playerTap: "+i.currentPlayerTap,"turn: "+i.turn),i.currentPlayerTap===i.turn){console.log("Lista de taps mostrada al completar sonido y alcanzar el final del turno del jugador:"),console.log(i.taps);var r=!0,a=!1,l=void 0;try{for(var s,u=o[Symbol.iterator]();!(r=(s=u.next()).done);r=!0){var c=s.value;c.removeEventListener("click",e)}}catch(p){a=!0,l=p}finally{try{!r&&u["return"]&&u["return"]()}finally{if(a)throw l}}setTimeout(i.cpuTurn,200)}}else{console.log("Al completar el sonido y pulsarse botón erroneamente, tapped !== self.taps[playerTap] →  tapped: "+n+" taps["+i.currentPlayerTap+"]: "+i.taps[i.currentPlayerTap]+" turn: "+i.turn);var d=!0,f=!1,g=void 0;try{for(var v,y=o[Symbol.iterator]();!(d=(v=y.next()).done);d=!0){var c=v.value;c.removeEventListener("click",e)}}catch(p){f=!0,g=p}finally{try{!d&&y["return"]&&y["return"]()}finally{if(f)throw g}}t()}},null,!0)}console.log("Entra player");i.turn;i.currentPlayerTap=0;var r=!0,n=!1,a=void 0;try{for(var l,s=o[Symbol.iterator]();!(r=(l=s.next()).done);r=!0){var u=l.value;u.addEventListener("click",e)}}catch(c){n=!0,a=c}finally{try{!r&&s["return"]&&s["return"]()}finally{if(n)throw a}}},this.gameEnded=function(){return i.turn>i.turns}};n()}()},{}]},{},[1]);
//# sourceMappingURL=app.js.map
