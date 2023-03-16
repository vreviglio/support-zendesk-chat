'use strict';

var onMessage = function onMessage(channelName, callback) {
  var channel = new BroadcastChannel(channelName);
  channel.addEventListener('message', function (event) {
    callback(event.data);
  });
};

var openChat = function openChat() {
  var _window, _window2;
  (_window = window) === null || _window === void 0 ? void 0 : _window.zE('webWidget', 'show');
  (_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.zE('webWidget', 'open');
};
var hideChat = function hideChat() {
  var _window3;
  (_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.zE('webWidget', 'hide');
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
    var action = zendeskActions[data.action];
    if (!action) {
      console.warn("No action defined for ".concat(data.action));
      return;
    }
    action();
  });
};

var getQueryParamFromString = function getQueryParamFromString(scriptSrc, paramName) {
  var urlSearchParams = new URLSearchParams(scriptSrc.split('?')[1]);
  return urlSearchParams.get(paramName);
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

console.log('SCRIPT LOADED');
// Inject the Zendesk script tag into the target project
injectZendeskScript();

// Initialize the iframe listener
initializeIframeListener();
//# sourceMappingURL=index.js.map
