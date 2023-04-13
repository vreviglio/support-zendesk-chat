'use strict';

var onMessage = function onMessage(channelName, callback) {
  var channel = new BroadcastChannel(channelName);
  channel.addEventListener('message', function (event) {
    callback(event.data);
  });
};

var parsedPayloadToVisitorInfo = function parsedPayloadToVisitorInfo(payload) {
  var visitorInfo = {};
  if (!(payload !== null && payload !== void 0 && payload.visitorInfo)) return null;
  var _payload$visitorInfo = payload.visitorInfo,
    name = _payload$visitorInfo.name,
    email = _payload$visitorInfo.email,
    phone = _payload$visitorInfo.phone;
  if (!name && !email && !phone) return null;
  if (name) {
    visitorInfo.name = name;
  }
  if (email) {
    visitorInfo.email = email;
  }
  if (phone) {
    visitorInfo.phone = phone;
  }
  return visitorInfo;
};

var openChat = function openChat(payload) {
  var _payload$tags, _window3, _window4, _window5;
  if (payload !== null && payload !== void 0 && (_payload$tags = payload.tags) !== null && _payload$tags !== void 0 && _payload$tags.length) {
    var _window;
    (_window = window) === null || _window === void 0 ? void 0 : _window.zE('webWidget', 'chat:addTags', payload === null || payload === void 0 ? void 0 : payload.tags);
  }
  var visitorInfo = parsedPayloadToVisitorInfo(payload);
  if (visitorInfo) {
    var _window2;
    (_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.zE('webWidget', 'identify', visitorInfo);
  }
  (_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.zE('webWidget', 'show');
  (_window4 = window) === null || _window4 === void 0 ? void 0 : _window4.zE('webWidget', 'open');
  (_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.zE('webWidget', 'updateSettings', {
    chat: {
      suppress: false
    }
  });
};

var chatActions = /*#__PURE__*/Object.freeze({
  __proto__: null,
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
    var action = chatActions[data === null || data === void 0 ? void 0 : data.type];
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

// Creates the script element for the zendesk widget
var createZendeskScriptElement = function createZendeskScriptElement(key) {
  var script = document.createElement('script');
  script.setAttribute('id', 'ze-snippet');
  script.setAttribute('src', "https://static.zdassets.com/ekr/snippet.js?key=".concat(key));
  return script;
};

// Sets the initial configuration for the zendesk chat
var setZendeskChatConfiguration = function setZendeskChatConfiguration() {
  window.zESettings = {
    webWidget: {
      launcher: {
        chatLabel: {
          '*': 'Help chat',
          es: 'Chat de ayuda',
          'es-es': 'Chat de ayuda',
          'es-419': 'Chat de ayuda'
        }
      },
      color: {
        theme: '#7145D6'
      },
      chat: {
        concierge: {
          name: 'Live Support',
          avatarPath: 'https://assets.cabifil.es/images/logos_cabify/lo_cabify_avatar.svg',
          title: {
            '*': 'Customer Support'
          }
        },
        title: {
          '*': 'Chat with us',
          es: 'Chatea con nosotros',
          'es-es': 'Chatea con nosotros',
          'es-419': 'Chatea con nosotros'
        },
        hideWhenOffline: true,
        suppress: true
      }
    }
  };
};

// Injects the Zendesk script tag into the target project
var initializeZendeskIntegration = function initializeZendeskIntegration() {
  var _document, _document$currentScri, _document2, _document2$body;
  var scriptSrc = (_document = document) === null || _document === void 0 ? void 0 : (_document$currentScri = _document.currentScript) === null || _document$currentScri === void 0 ? void 0 : _document$currentScri.src;
  if (!scriptSrc) {
    console.error('Script src not found', {
      severity: 'warning'
    });
    return;
  }
  var key = getQueryParamFromString(scriptSrc, 'key');
  if (!key) {
    console.error('Key was not provided', {
      severity: 'warning'
    });
    return;
  }
  setZendeskChatConfiguration();
  var script = createZendeskScriptElement(key);
  (_document2 = document) === null || _document2 === void 0 ? void 0 : (_document2$body = _document2.body) === null || _document2$body === void 0 ? void 0 : _document2$body.appendChild(script);
};

// Set up zendeskConfiguration and inject the Zendesk script tag into the target project
initializeZendeskIntegration();

// Initialize the iframe listener
initializeIframeListener();
//# sourceMappingURL=index.js.map
