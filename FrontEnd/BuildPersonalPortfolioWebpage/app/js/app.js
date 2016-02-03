!function t(e,r,n){function i(o,s){if(!r[o]){if(!e[o]){var h="function"==typeof require&&require;if(!s&&h)return h(o,!0);if(a)return a(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var c=r[o]={exports:{}};e[o][0].call(c.exports,function(t){var r=e[o][1][t];return i(r?r:t)},c,c.exports,t,e,r,n)}return r[o].exports}for(var a="function"==typeof require&&require,o=0;o<n.length;o++)i(n[o]);return i}({1:[function(t,e,r){"use strict";!function(t,n){function i(e){if("undefined"==typeof e)throw new Error('Pathformer [constructor]: "element" parameter is required');if(e.constructor===String&&(e=n.getElementById(e),!e))throw new Error('Pathformer [constructor]: "element" parameter is not related to an existing ID');if(!(e.constructor instanceof t.SVGElement||/^svg$/i.test(e.nodeName)))throw new Error('Pathformer [constructor]: "element" parameter must be a string or a SVGelement');this.el=e,this.scan(e)}function a(t,e,r){this.isReady=!1,this.setElement(t,e),this.setOptions(e),this.setCallback(r),this.isReady&&this.init()}i.prototype.TYPES=["line","ellipse","circle","polygon","polyline","rect"],i.prototype.ATTR_WATCH=["cx","cy","points","r","rx","ry","x","x1","x2","y","y1","y2"],i.prototype.scan=function(t){for(var e,r,n,i,a=t.querySelectorAll(this.TYPES.join(",")),o=0;o<a.length;o++)r=a[o],e=this[r.tagName.toLowerCase()+"ToPath"],n=e(this.parseAttr(r.attributes)),i=this.pathMaker(r,n),r.parentNode.replaceChild(i,r)},i.prototype.lineToPath=function(t){var e={};return e.d="M"+t.x1+","+t.y1+"L"+t.x2+","+t.y2,e},i.prototype.rectToPath=function(t){var e={},r=parseFloat(t.x)||0,n=parseFloat(t.y)||0,i=parseFloat(t.width)||0,a=parseFloat(t.height)||0;return e.d="M"+r+" "+n+" ",e.d+="L"+(r+i)+" "+n+" ",e.d+="L"+(r+i)+" "+(n+a)+" ",e.d+="L"+r+" "+(n+a)+" Z",e},i.prototype.polylineToPath=function(t){var e,r,n={},i=t.points.trim().split(" ");if(-1===t.points.indexOf(",")){var a=[];for(e=0;e<i.length;e+=2)a.push(i[e]+","+i[e+1]);i=a}for(r="M"+i[0],e=1;e<i.length;e++)-1!==i[e].indexOf(",")&&(r+="L"+i[e]);return n.d=r,n},i.prototype.polygonToPath=function(t){var e=i.prototype.polylineToPath(t);return e.d+="Z",e},i.prototype.ellipseToPath=function(t){var e=t.cx-t.rx,r=t.cy,n=parseFloat(t.cx)+parseFloat(t.rx),i=t.cy,a={};return a.d="M"+e+","+r+"A"+t.rx+","+t.ry+" 0,1,1 "+n+","+i+"A"+t.rx+","+t.ry+" 0,1,1 "+e+","+i,a},i.prototype.circleToPath=function(t){var e={},r=t.cx-t.r,n=t.cy,i=parseFloat(t.cx)+parseFloat(t.r),a=t.cy;return e.d="M"+r+","+n+"A"+t.r+","+t.r+" 0,1,1 "+i+","+a+"A"+t.r+","+t.r+" 0,1,1 "+r+","+a,e},i.prototype.pathMaker=function(t,e){var r,i,a=n.createElementNS("http://www.w3.org/2000/svg","path");for(r=0;r<t.attributes.length;r++)i=t.attributes[r],-1===this.ATTR_WATCH.indexOf(i.name)&&a.setAttribute(i.name,i.value);for(r in e)a.setAttribute(r,e[r]);return a},i.prototype.parseAttr=function(t){for(var e,r={},n=0;n<t.length;n++){if(e=t[n],-1!==this.ATTR_WATCH.indexOf(e.name)&&-1!==e.value.indexOf("%"))throw new Error("Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into 'path' tags. Please use 'viewBox'.");r[e.name]=e.value}return r};var o,s,h;a.LINEAR=function(t){return t},a.EASE=function(t){return-Math.cos(t*Math.PI)/2+.5},a.EASE_OUT=function(t){return 1-Math.pow(1-t,3)},a.EASE_IN=function(t){return Math.pow(t,3)},a.EASE_OUT_BOUNCE=function(t){var e=-Math.cos(t*(.5*Math.PI))+1,r=Math.pow(e,1.5),n=Math.pow(1-t,2),i=-Math.abs(Math.cos(r*(2.5*Math.PI)))+1;return 1-n+i*n},a.prototype.setElement=function(e,r){if("undefined"==typeof e)throw new Error('Vivus [constructor]: "element" parameter is required');if(e.constructor===String&&(e=n.getElementById(e),!e))throw new Error('Vivus [constructor]: "element" parameter is not related to an existing ID');if(this.parentEl=e,r&&r.file){var i=n.createElement("object");i.setAttribute("type","image/svg+xml"),i.setAttribute("data",r.file),i.setAttribute("built-by-vivus","true"),e.appendChild(i),e=i}switch(e.constructor){case t.SVGSVGElement:case t.SVGElement:this.el=e,this.isReady=!0;break;case t.HTMLObjectElement:var a,o;o=this,a=function(t){if(!o.isReady){if(o.el=e.contentDocument&&e.contentDocument.querySelector("svg"),!o.el&&t)throw new Error("Vivus [constructor]: object loaded does not contain any SVG");return o.el?(e.getAttribute("built-by-vivus")&&(o.parentEl.insertBefore(o.el,e),o.parentEl.removeChild(e),o.el.setAttribute("width","100%"),o.el.setAttribute("height","100%")),o.isReady=!0,o.init(),!0):void 0}},a()||e.addEventListener("load",a);break;default:throw new Error('Vivus [constructor]: "element" parameter is not valid (or miss the "file" attribute)')}},a.prototype.setOptions=function(e){var r=["delayed","async","oneByOne","scenario","scenario-sync"],n=["inViewport","manual","autostart"];if(void 0!==e&&e.constructor!==Object)throw new Error('Vivus [constructor]: "options" parameter must be an object');if(e=e||{},e.type&&-1===r.indexOf(e.type))throw new Error("Vivus [constructor]: "+e.type+" is not an existing animation `type`");if(this.type=e.type||r[0],e.start&&-1===n.indexOf(e.start))throw new Error("Vivus [constructor]: "+e.start+" is not an existing `start` option");if(this.start=e.start||n[0],this.isIE=-1!==t.navigator.userAgent.indexOf("MSIE")||-1!==t.navigator.userAgent.indexOf("Trident/")||-1!==t.navigator.userAgent.indexOf("Edge/"),this.duration=h(e.duration,120),this.delay=h(e.delay,null),this.dashGap=h(e.dashGap,1),this.forceRender=e.hasOwnProperty("forceRender")?!!e.forceRender:this.isIE,this.selfDestroy=!!e.selfDestroy,this.onReady=e.onReady,this.frameLength=this.currentFrame=this.map=this.delayUnit=this.speed=this.handle=null,this.ignoreInvisible=e.hasOwnProperty("ignoreInvisible")?!!e.ignoreInvisible:!1,this.animTimingFunction=e.animTimingFunction||a.LINEAR,this.pathTimingFunction=e.pathTimingFunction||a.LINEAR,this.delay>=this.duration)throw new Error("Vivus [constructor]: delay must be shorter than duration")},a.prototype.setCallback=function(t){if(t&&t.constructor!==Function)throw new Error('Vivus [constructor]: "callback" parameter must be a function');this.callback=t||function(){}},a.prototype.mapping=function(){var e,r,n,i,a,o,s,u;for(u=o=s=0,r=this.el.querySelectorAll("path"),e=0;e<r.length;e++)n=r[e],this.isInvisible(n)||(a={el:n,length:Math.ceil(n.getTotalLength())},isNaN(a.length)?t.console&&console.warn&&console.warn("Vivus [mapping]: cannot retrieve a path element length",n):(this.map.push(a),n.style.strokeDasharray=a.length+" "+(a.length+2*this.dashGap),n.style.strokeDashoffset=a.length+this.dashGap,a.length+=this.dashGap,o+=a.length,this.renderPath(e)));for(o=0===o?1:o,this.delay=null===this.delay?this.duration/3:this.delay,this.delayUnit=this.delay/(r.length>1?r.length-1:1),e=0;e<this.map.length;e++){switch(a=this.map[e],this.type){case"delayed":a.startAt=this.delayUnit*e,a.duration=this.duration-this.delay;break;case"oneByOne":a.startAt=s/o*this.duration,a.duration=a.length/o*this.duration;break;case"async":a.startAt=0,a.duration=this.duration;break;case"scenario-sync":n=r[e],i=this.parseAttr(n),a.startAt=u+(h(i["data-delay"],this.delayUnit)||0),a.duration=h(i["data-duration"],this.duration),u=void 0!==i["data-async"]?a.startAt:a.startAt+a.duration,this.frameLength=Math.max(this.frameLength,a.startAt+a.duration);break;case"scenario":n=r[e],i=this.parseAttr(n),a.startAt=h(i["data-start"],this.delayUnit)||0,a.duration=h(i["data-duration"],this.duration),this.frameLength=Math.max(this.frameLength,a.startAt+a.duration)}s+=a.length,this.frameLength=this.frameLength||this.duration}},a.prototype.drawer=function(){var t=this;this.currentFrame+=this.speed,this.currentFrame<=0?(this.stop(),this.reset(),this.callback(this)):this.currentFrame>=this.frameLength?(this.stop(),this.currentFrame=this.frameLength,this.trace(),this.selfDestroy&&this.destroy(),this.callback(this)):(this.trace(),this.handle=o(function(){t.drawer()}))},a.prototype.trace=function(){var t,e,r,n;for(n=this.animTimingFunction(this.currentFrame/this.frameLength)*this.frameLength,t=0;t<this.map.length;t++)r=this.map[t],e=(n-r.startAt)/r.duration,e=this.pathTimingFunction(Math.max(0,Math.min(1,e))),r.progress!==e&&(r.progress=e,r.el.style.strokeDashoffset=Math.floor(r.length*(1-e)),this.renderPath(t))},a.prototype.renderPath=function(t){if(this.forceRender&&this.map&&this.map[t]){var e=this.map[t],r=e.el.cloneNode(!0);e.el.parentNode.replaceChild(r,e.el),e.el=r}},a.prototype.init=function(){this.frameLength=0,this.currentFrame=0,this.map=[],new i(this.el),this.mapping(),this.starter(),this.onReady&&this.onReady(this)},a.prototype.starter=function(){switch(this.start){case"manual":return;case"autostart":this.play();break;case"inViewport":var e=this,r=function(){e.isInViewport(e.parentEl,1)&&(e.play(),t.removeEventListener("scroll",r))};t.addEventListener("scroll",r),r()}},a.prototype.getStatus=function(){return 0===this.currentFrame?"start":this.currentFrame===this.frameLength?"end":"progress"},a.prototype.reset=function(){return this.setFrameProgress(0)},a.prototype.finish=function(){return this.setFrameProgress(1)},a.prototype.setFrameProgress=function(t){return t=Math.min(1,Math.max(0,t)),this.currentFrame=Math.round(this.frameLength*t),this.trace(),this},a.prototype.play=function(t){if(t&&"number"!=typeof t)throw new Error("Vivus [play]: invalid speed");return this.speed=t||1,this.handle||this.drawer(),this},a.prototype.stop=function(){return this.handle&&(s(this.handle),this.handle=null),this},a.prototype.destroy=function(){var t,e;for(t=0;t<this.map.length;t++)e=this.map[t],e.el.style.strokeDashoffset=null,e.el.style.strokeDasharray=null,this.renderPath(t)},a.prototype.isInvisible=function(t){var e,r=t.getAttribute("data-ignore");return null!==r?"false"!==r:this.ignoreInvisible?(e=t.getBoundingClientRect(),!e.width&&!e.height):!1},a.prototype.parseAttr=function(t){var e,r={};if(t&&t.attributes)for(var n=0;n<t.attributes.length;n++)e=t.attributes[n],r[e.name]=e.value;return r},a.prototype.isInViewport=function(t,e){var r=this.scrollY(),n=r+this.getViewportH(),i=t.getBoundingClientRect(),a=i.height,o=r+i.top,s=o+a;return e=e||0,n>=o+a*e&&s>=r},a.prototype.docElem=t.document.documentElement,a.prototype.getViewportH=function(){var e=this.docElem.clientHeight,r=t.innerHeight;return r>e?r:e},a.prototype.scrollY=function(){return t.pageYOffset||this.docElem.scrollTop},o=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),s=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||t.msCancelAnimationFrame||function(e){return t.clearTimeout(e)}}(),h=function(t,e){var r=parseInt(t,10);return r>=0?r:e},"function"==typeof define&&define.amd?define([],function(){return a}):"object"==typeof r?e.exports=a:t.Vivus=a}(window,document)},{}],2:[function(t,e,r){"use strict";!function(){var e=t("vivus"),r=document.getElementById("paths"),n=new e("greeting",{type:"oneByOne",pathTimingFunction:e.LINEAR,animTimingFunction:e.LINEAR},function(){r.classList.add("drawn")});n.play(1)}()},{vivus:1}]},{},[2]);
//# sourceMappingURL=app.js.map
