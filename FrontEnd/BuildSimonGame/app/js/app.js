!function t(e,r,n){function o(l,s){if(!r[l]){if(!e[l]){var i="function"==typeof require&&require;if(!s&&i)return i(l,!0);if(a)return a(l,!0);var u=new Error("Cannot find module '"+l+"'");throw u.code="MODULE_NOT_FOUND",u}var c=r[l]={exports:{}};e[l][0].call(c.exports,function(t){var r=e[l][1][t];return o(r?r:t)},c,c.exports,t,e,r,n)}return r[l].exports}for(var a="function"==typeof require&&require,l=0;l<n.length;l++)o(n[l]);return o}({1:[function(t,e,r){"use strict";!function(){function t(t){function e(){t.classList.add("pushed")}return e}function e(t){function e(){t.classList.remove("pushed")}return e}function r(t){t.classList.remove("pushed")}function n(r){var n=r.id;d[n]=c.createInstance(n);var a=d[n];a.on("succeeded",t(o[n])),a.on("complete",e(o[n]))}for(var o=[],a=[0,1,2,3],l=0;l<a.length;l++){var s=a[l];o[s]=document.getElementById("tap"+s)}var i="/assets/audio/",u=[{id:"0",src:"tap0.ogg"},{id:"1",src:"tap1.ogg"},{id:"2",src:"tap2.ogg"},{id:"3",src:"tap3.ogg"}],c=createjs.Sound;c.alternateExtensions=["mp3"],c.on("fileload",n),c.registerSounds(u,i);var d=[],p=function(){function t(){return 0===L.mode?20:1/0}function e(){return String(Math.floor(4*Math.random()))}function n(e){switch(console.log("pulsado "+e.target.id),e.target.id){case"start":L.started?m():L.start();break;case"strict":L.strict?(L.strict=!1,h.classList.remove("pushed"),w.textContent=""):(L.strict=!0,h.classList.add("pushed"),w.textContent="(Strict)");break;default:L.mode=L.mode===x.length-1?0:L.mode+1,I.textContent=x[L.mode],L.turns=t()}}function a(t){t.hasAttribute("disabled")&&t.removeAttribute("disabled")}function l(t){t.hasAttribute("disabled")||t.setAttribute("disabled","true")}function s(t){if(L.on=L.on?!1:!0,L.on){b.textContent="On",y.classList.add("right");for(var e=[g,h,E],r=0;r<e.length;r++){var o=e[r];o.addEventListener("click",n)}}else b.textContent="Off",y.classList.remove("right"),v()}function i(){b.textContent="YOU MISS!!",console.log(L.strict),L.strict?m():(L.playerMiss=!0,L.turn--,window.setTimeout(L.cpuTurn,200))}function u(t){console.log("Se ejecuta processMusicTap"),console.log(t),console.log(o),console.log("playerTap: "+L.currentPlayerTap);var e=t.target.getAttribute("data-btn"),r=d[e];r.play(),r.on("complete",function(){if(console.log("Al completar sonido → tapped: "+e+" taps["+L.currentPlayerTap+"]: "+L.taps[L.currentPlayerTap]+" turn: "+L.turn),e===L.taps[L.currentPlayerTap]){if(console.log("Correct button pressed"),L.currentPlayerTap++,console.log("playerTap: "+L.currentPlayerTap,"turn: "+L.turn),L.currentPlayerTap===L.turn){console.log("Lista de taps mostrada al completar sonido y alcanzar el final del turno del jugador:"),console.log(L.taps);var t=!0,r=!1,n=void 0;try{for(var a,l=o[Symbol.iterator]();!(t=(a=l.next()).done);t=!0){var s=a.value;s.removeEventListener("click",u)}}catch(c){r=!0,n=c}finally{try{!t&&l["return"]&&l["return"]()}finally{if(r)throw n}}window.setTimeout(L.cpuTurn,200)}}else{console.log("Al completar el sonido y pulsarse botón erroneamente, tapped !== self.taps[playerTap] →  tapped: "+e+" taps["+L.currentPlayerTap+"]: "+L.taps[L.currentPlayerTap]+" turn: "+L.turn);var d=!0,p=!1,f=void 0;try{for(var v,m=o[Symbol.iterator]();!(d=(v=m.next()).done);d=!0){var s=v.value;s.removeEventListener("click",u)}}catch(c){p=!0,f=c}finally{try{!d&&m["return"]&&m["return"]()}finally{if(p)throw f}}i()}},null,!0)}function p(){var t=arguments.length<=0||void 0===arguments[0]?"--":arguments[0];T.textContent=t}function f(){window.clearInterval(L.cpuInterval),L.cpuInterval=null,c.stop(),o.forEach(r);var t=!0,e=!1,n=void 0;try{for(var a,l=o[Symbol.iterator]();!(t=(a=l.next()).done);t=!0){var s=a.value;s.removeEventListener("click",u)}}catch(i){e=!0,n=i}finally{try{!t&&l["return"]&&l["return"]()}finally{if(e)throw n}}p(),L.turn=0,L.taps=[],L.currentPlayerTap=null,L.playerMiss=!1}function v(){f();for(var t=[g,h],e=0;e<t.length;e++){var r=t[e];r.removeEventListener("click",n)}L.on=!1,L.started=!1,E.addEventListener("click",n)}function m(){f(),L.on=!0,L.start()}var y=document.getElementById("power"),g=document.getElementById("start"),h=document.getElementById("strict"),E=document.getElementById("modes"),T=document.getElementById("led"),I=document.getElementById("mode-label"),w=document.getElementById("strict-label"),b=document.getElementById("status"),x=["Normal","Survival"],L=this;this.cpuInterval=null,y.addEventListener("click",s),this.on=!1,this.mode=0,this.strict=!1,this.started=!1,this.turn=0,this.turns=t(),this.start=function(){E.removeEventListener("click",n),L.started=!0,L.cpuTurn()},this.taps=[],this.currentPlayerTap=null,this.playerMiss=!1,this.cpuTurn=function(){function t(){console.log(L.turn+" "+r),console.log(L.taps),console.log(r),d[L.taps[r]].play(),r++,console.log("turn "+L.turn+" tap "+r),r>=L.turn&&(window.clearInterval(L.cpuInterval),L.cpuInterval=null,window.setTimeout(L.playerTurn,400))}if(L.turn++,L.gameEnded())return void(b.textContent="YOU WIN!!");b.textContent="Machine turn",L.playerMiss&&L.taps.length||(L.taps.push(e()),p(L.turn)),L.playerMiss=!1,console.log(L.taps);var r=0;o.forEach(l),L.cpuInterval=window.setInterval(t,600,L.cpuInterval)},this.playerTurn=function(){b.textContent="Your turn",o.forEach(a);L.turn;L.currentPlayerTap=0;var t=!0,e=!1,r=void 0;try{for(var n,l=o[Symbol.iterator]();!(t=(n=l.next()).done);t=!0){var s=n.value;s.addEventListener("click",u)}}catch(i){e=!0,r=i}finally{try{!t&&l["return"]&&l["return"]()}finally{if(e)throw r}}},this.gameEnded=function(){return L.turn>L.turns}};new p}()},{}]},{},[1]);
//# sourceMappingURL=app.js.map
