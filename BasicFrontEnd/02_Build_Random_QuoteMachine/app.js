$(document).ready(function() {
  // Add twitter script for web intents, without dependencies
  (function() {
    if (window.__twitterIntentHandler) return;
    var intentRegex = /twitter\.com(\:\d{2,4})?\/intent\/(\w+)/,
        windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
        width = 550,
        height = 420,
        winHeight = screen.height,
        winWidth = screen.width;

    function handleIntent(e) {
      e = e || window.event;
      var target = e.target || e.srcElement,
          m, left, top;

      while (target && target.nodeName.toLowerCase() !== 'a') {
        target = target.parentNode;
      }

      if (target && target.nodeName.toLowerCase() === 'a' && target.href) {
        m = target.href.match(intentRegex);
        if (m) {
          left = Math.round((winWidth / 2) - (width / 2));
          top = 0;

          if (winHeight > height) {
            top = Math.round((winHeight / 2) - (height / 2));
          }

          window.open(target.href, 'intent', windowOptions + ',width=' + width +
                                             ',height=' + height + ',left=' + left + ',top=' + top);
          e.returnValue = false;
          e.preventDefault && e.preventDefault();
        }
      }
    }

    if (document.addEventListener) {
      document.addEventListener('click', handleIntent, false);
    } else if (document.attachEvent) {
      document.attachEvent('onclick', handleIntent);
    }
    window.__twitterIntentHandler = true;
  }());
  function randomQuote() {
    $.ajax({
        url: "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en",
        jsonp: "jsonp",
        dataType: "jsonp",
        success: function( response ) {
          function getQuote() {
            $(".quote").attr("cite", response.quoteLink)
            .text(response.quoteText);
            if (response.quoteAuthor) {
                $(".author").text("– " + response.quoteAuthor);
            }
          }
          function updateTwitterBtn() {
            var text = response.quoteText;
            var url;
            if (response.hasOwnProperty("quoteAuthor")) {
              text += " – " + response.quoteAuthor;
            }
            if (text.length > 138) {
              text = text.slice(0,111) + "…";
              url = encodeURIComponent(response.quoteLink);
            }
            text = [String.fromCharCode(2037), text,
                    String.fromCharCode(2036)].join("");
            text = encodeURIComponent(text);
            var related = encodeURIComponent("forismatic:Quote API provider,juanriqgon:Author of this Random Quote site");
            var params = "text=" + text + ((url)?"&url=" + url:"") + "&related=" + related;
            var intent = "https://twitter.com/intent/tweet?" + params;
            $("#tw").attr("href", intent);
          }

          var $rquote = $(".random-quote");
          if ($rquote.is(":visible")){
            $rquote.fadeToggle(100, getQuote);
          } else {
            getQuote();
          }
          updateTwitterBtn();
          $rquote.fadeToggle(500);
        }
    });
  }
  $("#get-quote").click(randomQuote);
});
