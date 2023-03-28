'use strict';

var onMessage = function onMessage(channelName, callback) {
  var channel = new BroadcastChannel(channelName);
  channel.addEventListener('message', function (event) {
    callback(event.data);
  });
};

var openChat = function openChat(payload) {
  var _window, _payload$tags, _window3, _window4;
  var isChatting = (_window = window) === null || _window === void 0 ? void 0 : _window.zE('webWidget:get', 'chat:isChatting');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (isChatting) {
    return;
  }
  if (payload !== null && payload !== void 0 && (_payload$tags = payload.tags) !== null && _payload$tags !== void 0 && _payload$tags.length) {
    var _window2;
    (_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.zE('webWidget', 'chat:addTags', payload === null || payload === void 0 ? void 0 : payload.tags);
  }
  (_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.zE('webWidget', 'show');
  (_window4 = window) === null || _window4 === void 0 ? void 0 : _window4.zE('webWidget', 'open');
};
var hideChat = function hideChat() {
  var _window5;
  (_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.zE('webWidget', 'hide');
};

var zendeskActions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hideChat: hideChat,
  openChat: openChat
});

/* eslint-disable no-console */
var CHANNEL_NAME = 'zendesk-channel';

// Adds a message listener to the specified iframe
var initializeIframeListener = function initializeIframeListener() {
  onMessage(CHANNEL_NAME, function (data) {
    if (!data) {
      console.warn("Invalid event or event data");
      return;
    }
    var action = zendeskActions[data === null || data === void 0 ? void 0 : data.type];
    if (!action) {
      console.warn("No action defined for ".concat(data === null || data === void 0 ? void 0 : data.type));
      return;
    }
    var payload = data === null || data === void 0 ? void 0 : data.payload;
    action(payload);
  });
};

var getQueryParamFromString = function getQueryParamFromString(scriptSrc, paramName) {
  var url = new URL(scriptSrc);
  return url.searchParams.get(paramName);
};

/* eslint-disable no-console */

// Injects the Zendesk script tag into the target project
var injectZendeskScript = function injectZendeskScript() {
  var _document;
  var scriptSrc = ((_document = document) === null || _document === void 0 ? void 0 : _document.currentScript).src;
  var key = getQueryParamFromString(scriptSrc, 'key');
  if (!key) {
    console.warn('Key was not provided');
    return;
  }
  var script = document.createElement('script');
  script.setAttribute('id', 'ze-snippet');
  script.setAttribute('src', "https://static.zdassets.com/ekr/snippet.js?key=".concat(key));
  script.addEventListener('load', function () {
    return hideChat();
  });
  document.body.appendChild(script);
};

console.log('A vel');
try {
  // Inject the Zendesk script tag into the target project
  injectZendeskScript();

  // Initialize the iframe listener
  initializeIframeListener();
} catch (error) {
  console.log(error);
}
//# sourceMappingURL=index.js.map
