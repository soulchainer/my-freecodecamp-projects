var users = ["freecodecamp","geoffstorbeck","robotcaleb",
             "noobs2ninjas","beohoff", "brunofin","comster404"];
var baseURL = "https://api.twitch.tv/kraken/";
var placeholderAvatar = "assets/placeholder.png";
var firstProcessStreamsCall = true;
var usersStreaming = [];
var usersNotStreaming = [];
var group = "all";

function jsonp(baseURL, params, callback) {
  $.ajax({
    url: baseURL,
    jsonp: "callback",
    dataType: "jsonp",
    data: params,
    success: callback,
  });
}
function fillUser(user, group, disabled){
  var disabledAnchor = ['<a href="', user.url,
                        '" class="disabled user-item all ', group,
                        '" target="_self" data-name="', user.name,
                        '" id="__',user.name,'">'].join("");
  var anchor = ['<a href="', user.url, '" class="user-item all ',
                group, '" target="_blank" data-name="',
                user.name,'">'].join("");
  var status = (group === "offline" && user.url[0] !== "#")?
                "Last streaming: " + user.status: user.status;
  var userContent = [(disabled)?disabledAnchor:anchor, '<img src="',
                     user.avatar||placeholderAvatar, '" alt="',
                     user.displayName,' profile image"\
                     class="user-avatar"><div class="user-info">\
                     <span class="user-name">', user.displayName,
                     '</span><span class="extra-info">', status,
                     '</span></div></a>'].join("");
  $("#users").append(userContent);
}
function fillWithPlaceholder(username) {
  var user = {
    "avatar": placeholderAvatar,
    "displayName": username,
    "name": username,
    "status": "User not available on Twitch",
    "url": "#__" + username,
  };
  fillUser(user, "offline", true);
}
function processStreamsData(json) {
  function processData(json){
    var streams = json.streams;
    for (var i = 0; i < streams.length; i++) {
      var channel = streams[i].channel;
      var user = {
        "avatar": channel.logo,
        "displayName": channel.display_name,
        "name": channel.name,
        "status": channel.status,
        "url": channel.url,
      };
      if (usersStreaming.indexOf(user.name) === -1) {
        fillUser(user, "online");
        usersStreaming.push(user.name);
      }
    }
  }
  function processFirstData(json) {
    processData(json);
    usersNotStreaming= users.filter(notStreaming);
    firstProcessStreamsCall = false;
    // call to the API to get info of not streaming users
    $.each(usersNotStreaming, getChannel);
  }

  if (firstProcessStreamsCall) {
    processFirstData(json);
  } else {
    processData(json);
  }
}
function processChannelData(json) {
  var user = {
    "status": json.status,
  };
  if (user.status !== 422) { // user isn't available
    user.name = json.name;
    user.displayName = json.display_name;
    user.avatar = json.logo;
    user.url = json.url;
    fillUser(user,"offline");
  } else {
    var notAvailableUser = json.message.match(/'(.+?)'/)[1];
    fillWithPlaceholder(notAvailableUser);
  }
}
function getUsersData() {
  var userStr = users.join(",");
  var paramsFCC = {"game": "Programming", "channel": userStr};
  var params = {"game": "Programming"};
  jsonp(baseURL + "/streams/", paramsFCC, processStreamsData);
  jsonp(baseURL + "/streams/", params, processStreamsData);
}
function getChannel(index, channel) {
  jsonp(baseURL + "channels/" + channel, {}, processChannelData);
}
function notStreaming(value) {
  return usersStreaming.indexOf(value) === -1;
}
function hideUserDontMatch(value) {
  var hide = function () {
    var $this = $(this);
    $this.removeClass("notAMatch");
    if ($this.attr("data-name").indexOf(value.toLowerCase()) === -1) {
      $this.addClass("notAMatch");
    }
  };
  return hide;
}
function handleSearch(e) {
  var value = $(this).val();
  $("#users>.all").each(hideUserDontMatch(value));
}
function filterUsers(e){
  var toGroup = e.currentTarget.id;
  if (toGroup !== group) {
    $("#"+group+",#"+toGroup).toggleClass("inactive");
    $("#users").toggleClass(group+ " " + toGroup);
    group = toGroup;
  }
}

$(document).ready(function(){
  getUsersData();
  $("#search").keyup(handleSearch);
  $("#all,#online,#offline").click(filterUsers);
});
