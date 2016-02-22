"use strict";function debounce(e,t,n){var a;return function(){var o=this,r=arguments,s=function(){a=null,n||e.apply(o,r)},i=n&&!a;clearTimeout(a),a=setTimeout(s,t),i&&e.apply(o,r)}}function hasClass(e,t){return e.classList?e.classList.contains(t):e.className.indexOf(t)!==new RegExp("(^| )"+t+"( |$)","gi").test(e.className)}function addClass(e,t){e.classList?hasClass(e,t)||e.classList.add(t):e.className+=" "+t}function removeClass(e,t){hasClass(e,t)&&(e.classList?e.classList.remove(t):e.className.replace(new RegExp("(^| )"+t+"( |$)","g"),""))}var _slicedToArray=function(){function e(e,t){var n=[],a=!0,o=!1,r=void 0;try{for(var s,i=e[Symbol.iterator]();!(a=(s=i.next()).done)&&(n.push(s.value),!t||n.length!==t);a=!0);}catch(c){o=!0,r=c}finally{try{!a&&i["return"]&&i["return"]()}finally{if(o)throw r}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();!function(){function e(e){function t(t){var n=r[t.target.id],a=n.offsetTop,o=window.scrollY,s=(new Date).getTime(),i=setInterval(function(){var t=Math.min(1,((new Date).getTime()-s)/e);window.scrollTo(0,o+t*(a-o)+1),1===t&&clearInterval(i)},25);window.scrollTo(0,o+1)}return t}function t(e){e.target.openPopup()}function n(){var e=f.getAttribute("data-folded");return"true"===e?(f.setAttribute("data-folded","false"),void[v,y,h,w,E].forEach(function(e){return e.addEventListener("click",n)})):void f.setAttribute("data-folded","true")}function a(e,t,n){hasClass(e,n)||Array.prototype.forEach.call(t,function(e){return removeClass(e,n)}),addClass(e,n)}function o(e){var t=e.pageY+100;t<I.get("about")?a(v,g,"current-section"):t<I.get("skills")?a(y,g,"current-section"):t<I.get("projects")?(a(h,g,"current-section"),Array.prototype.forEach.call(A,function(e){return addClass(e,"animate-bar")})):t<I.get("contact")?a(w,g,"current-section"):a(E,g,"current-section")}var r={"btn-home":document.getElementById("home"),"btn-about":document.getElementById("about"),"btn-projects":document.getElementById("projects"),"btn-contact":document.getElementById("contact")},s=document.getElementById("paths"),i=(new Vivus("greeting",{type:"oneByOne",duration:225,pathTimingFunction:Vivus.LINEAR,animTimingFunction:Vivus.LINEAR},function(){s.classList.add("drawn")}),L.map("map",{center:[37.9410106,-1.1398814],doubleClickZoom:"center",dragging:!1,scrollWheelZoom:!1,zoom:11}));L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoianVhbnJpcWdvbiIsImEiOiJjaWs5MGR2bTAwMDA4d2xsdjNwOXQ3eXQ1In0.Y7PbFkq-Wxa2Kn5O1CWgUg",{attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',maxZoom:18,id:"juanriqgon.p2ln61p7",accessToken:"pk.eyJ1IjoianVhbnJpcWdvbiIsImEiOiJjaWs5MGR2bTAwMDA4d2xsdjNwOXQ3eXQ1In0.Y7PbFkq-Wxa2Kn5O1CWgUg"}).addTo(i),L.Icon.Default.imagePath="../assets/images";var c=L.marker([37.9410106,-1.1398814]).addTo(i);c.bindPopup("I live around here."),c.addEventListener("click",t);var l=document.getElementById("contact-ways"),d='<form class="contact-form" action="http://pooleapp.com/stash/52a1c0eb-dcc6-45b9-8923-73309fbb729b/" method="post">\n	<input type="hidden" name="redirect_to" value="{YOUR-THANKS-PAGE}" />\n	<p>\n		<label for="name">Name\n			<input class="contact-field" type="text" name="name" id="name" placeholder="What\'s your name?" />\n		</label>\n	</p>\n	<p>\n		<label for="e-mail">E-mail\n			<input class="contact-field" type="email" name="email" id="email" placeholder="An email to answer you">\n		</label>\n	</p>\n	<p>\n		<label for="message">Message\n			<textarea class="message" id="message" name="message" rows="5" placeholder="Your message"></textarea>\n		</label>\n	</p>\n	<p>\n		<input class="submit" type="submit" value="Submit" />\n	</p>\n</form>';l.insertAdjacentHTML("beforeend",d);for(var u=document.querySelectorAll(".nav-link"),m=0;m<u.length;m++)u[m].addEventListener("click",e(200));var p=document.getElementById("mobile-menu"),f=document.getElementById("navbar-mobile-menu-container"),g=document.querySelectorAll(".nav-link"),b=_slicedToArray(g,5),v=b[0],y=b[1],h=b[2],w=b[3],E=b[4];p.addEventListener("click",n);var I=new Map;["home","about","skills","projects","contact"].forEach(function(e){return I.set(e,document.getElementById(e).offsetTop)});var A=document.querySelectorAll(".chart-bar"),T=debounce(o,100);window.addEventListener("scroll",T),!function(){var e=function(e){e.preventDefault(),o=e.deltaY<0?o+10:o-10,a.style.transform="rotateY(-"+o+"deg)"},t=!0,n=document.getElementById("carousel-control"),a=document.getElementById("carousel"),o=0;n.addEventListener("click",function(){t=t?!1:!0,t?(n.textContent="Autoplay",addClass(a,"carousel-animation"),a.removeEventListener("wheel",e)):(n.textContent="Swipe",removeClass(a,"carousel-animation"),a.addEventListener("wheel",e))});var r=new Hammer.Manager(a);r.add(new Hammer.Swipe({direction:Hammer.DIRECTION_HORIZONTAL,threshold:10})),r.on("swiperight",function(e){o-=60,a.style.transform="rotateY(-"+o+"deg)"}),r.on("swipeleft",function(e){o+=60,a.style.transform="rotateY(-"+o+"deg)"})}()}();
//# sourceMappingURL=app.js.map
