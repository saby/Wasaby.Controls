define("js!SBIS3.CORE.PluginManager/resources/WebSocket", ['js!SBIS3.CORE.PluginManager/resources/SwfObject'], function(swfobject) {

   "use strict";

   var logger = {
      log: $ws.single.ioc.resolve('ILogger').log.bind($ws.single.ioc.resolve('ILogger'), 'TensorWebSocket'),
      error: $ws.single.ioc.resolve('ILogger').error.bind($ws.single.ioc.resolve('ILogger'), 'TensorWebSocket'),
      info: $ws.single.ioc.resolve('ILogger').info.bind($ws.single.ioc.resolve('ILogger'), 'TensorWebSocket')
   };

   /**
   * Our own implementation of WebSocket class using Flash.
   * @param {string} url
   * @param {array|string} protocols
   * @param {string} proxyHost
   * @param {int} proxyPort
   * @param {string} headers
   */
   var TensorWebSocket = function(url, protocols, proxyHost, proxyPort, headers) {
      var self = this;
      self.__id = TensorWebSocket.__nextId++;
      TensorWebSocket.__instances[self.__id] = self;
      self.readyState = TensorWebSocket.CONNECTING;
      self.bufferedAmount = 0;
      self.__events = {};
      if (!protocols) {
         protocols = [];
      } else if (typeof protocols == "string") {
         protocols = [protocols];
      }
      // Uses setTimeout() to make sure __createFlash() runs after the caller sets ws.onopen etc.
      // Otherwise, when onopen fires immediately, onopen is called before it is set.
      self.__createTask = setTimeout(function() {
         TensorWebSocket.__addTask(function() {
            self.__createTask = null;
            TensorWebSocket.__flash.create(self.__id, url, protocols, proxyHost || null, proxyPort || 0, headers || null);
         });
      }, 0);
   };

   TensorWebSocket.prototype.getId = function() {
      return this.__id;
   };

   /**
   * Send data to the web socket.
   * @param {string} data  The data to send to the socket.
   * @return {boolean}  True for success, false for failure.
   */
   TensorWebSocket.prototype.send = function(data) {
      if (this.readyState == TensorWebSocket.CONNECTING) {
         //throw new Error("INVALID_STATE_ERR: Web Socket connection has not been established");
         logger.error("INVALID_STATE_ERR: Web Socket connection has not been established");
         return false;
      }
      /*
       * We use encodeURIComponent() here, because FABridge doesn't work if
       * the argument includes some characters. We don't use escape() here
       * because of this:
       * https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Functions#escape_and_unescape_Functions
       * But it looks decodeURIComponent(encodeURIComponent(s)) doesn't
       * preserve all Unicode characters either e.g. "\uffff" in Firefox.
       * Note by wtritch: Hopefully this will not be necessary using ExternalInterface.  Will require
       * additional testing.
       */
      var result = TensorWebSocket.__flash.send(this.__id, encodeURIComponent(data));
      if (result < 0) { // success
         return true;
      } else {
         this.bufferedAmount += result;
         return false;
      }
   };

   /**
    * Close this web socket gracefully.
    */
   TensorWebSocket.prototype.close = function() {
      if (this.__createTask) {
         clearTimeout(this.__createTask);
         this.__createTask = null;
         this.readyState = TensorWebSocket.CLOSED;
         return;
      }
      if (this.readyState == TensorWebSocket.CLOSED || this.readyState == TensorWebSocket.CLOSING) {
         return;
      }
      this.readyState = TensorWebSocket.CLOSING;
      TensorWebSocket.__flash.close(this.__id);
   };

   /**
   * @param {string} type
   * @param {function} listener
   * @return void
   */
   TensorWebSocket.prototype.addEventListener = function(type, listener) {
      if (!(type in this.__events)) {
         this.__events[type] = [];
      }
      this.__events[type].push(listener);
   };

   /**
   * @param {string} type
   * @param {function} listener
   * @return void
   */
   TensorWebSocket.prototype.removeEventListener = function(type, listener) {
      if (!(type in this.__events)) return;
      var events = this.__events[type];
      for (var i = events.length - 1; i >= 0; --i) {
         if (events[i] === listener) {
            events.splice(i, 1);
            break;
         }
      }
   };

   /**
   * @param {Event} event
   * @return void
   */
   TensorWebSocket.prototype.dispatchEvent = function(event) {
      var events = this.__events[event.type] || [];
      for (var i = 0; i < events.length; ++i) {
         events[i](event);
      }
      var handler = this["on" + event.type];
      if (handler) handler.apply(this, [event]);
   };

   /**
   * Handles an event from Flash.
   * @param {Object} flashEvent
   */
   TensorWebSocket.prototype.__handleEvent = function(flashEvent) {
      if ("readyState" in flashEvent) {
         this.readyState = flashEvent.readyState;
      }
      if ("protocol" in flashEvent) {
         this.protocol = flashEvent.protocol;
      }

      var jsEvent;
      if (flashEvent.type == "open" || flashEvent.type == "error") {
         jsEvent = this.__createSimpleEvent(flashEvent.type);
      } else if (flashEvent.type == "close") {
         jsEvent = this.__createSimpleEvent("close");
         jsEvent.wasClean = flashEvent.wasClean ? true : false;
         jsEvent.code = flashEvent.code;
         jsEvent.reason = flashEvent.reason;
      } else if (flashEvent.type == "message") {
         var data = decodeURIComponent(flashEvent.message);
         jsEvent = this.__createMessageEvent("message", data);
      } else {
         throw new Error("Unknown event type: " + flashEvent.type);
      }

      this.dispatchEvent(jsEvent);
   };

   TensorWebSocket.prototype.__createSimpleEvent = function(type) {
      if (document.createEvent && window.Event) {
         var event = document.createEvent("Event");
         event.initEvent(type, false, false);
         return event;
      } else {
         return {type: type, bubbles: false, cancelable: false};
      }
   };

   TensorWebSocket.prototype.__createMessageEvent = function(type, data) {
      if (document.createEvent && window.MessageEvent && !window.opera) {
         var event = document.createEvent("MessageEvent");
         if (event.initMessageEvent) {
            event.initMessageEvent("message", false, false, data, null, null, window, null);
         } else {
            event = new MessageEvent("message", { bubbles: false, cancelable: false, data: data, source: window });
         }

         return event;
      } else {
         // IE and Opera 12, the latter one truncates the data parameter after any 0x00 bytes.
         return {type: type, data: data, bubbles: false, cancelable: false};
      }
   };

   /**
   * Define the TensorWebSocket readyState enumeration.
   */
   TensorWebSocket.CONNECTING = 0;
   TensorWebSocket.OPEN = 1;
   TensorWebSocket.CLOSING = 2;
   TensorWebSocket.CLOSED = 3;

   // Field to check implementation of TensorWebSocket.
   TensorWebSocket.__isFlashImplementation = true;
   TensorWebSocket.__initialized = false;
   TensorWebSocket.__flash = null;
   TensorWebSocket.__instances = {};
   TensorWebSocket.__tasks = [];
   TensorWebSocket.__nextId = 0;

   /**
   * Load a new flash security policy file.
   * @param {string} url
   */
   TensorWebSocket.loadFlashPolicyFile = function(url){
      TensorWebSocket.__addTask(function() {
         TensorWebSocket.__flash.loadManualPolicyFile(url);
      });
   };

   /**
    * Loads WebSocketMain.swf and creates WebSocketMain object in Flash.
    */
   TensorWebSocket.initialize = function(callbackFn) {
      TensorWebSocket.__initialize(callbackFn);
   };

   TensorWebSocket.__initTimeout = undefined;
   /**
   * Loads WebSocketMain.swf and creates WebSocketMain object in Flash.
   */
   TensorWebSocket.__initialize = function(callbackFn) {
      if (TensorWebSocket.__initialized) {
         // На странице уже запущен плагин, второй раз не надо
         // Кидаемся ошибкой, если не нашли элемент
         callbackFn({success: swfobject.getObjectById('webSocketFlash') ? true : false});
         return;
      }

      TensorWebSocket.__initialized = true;

      var container = document.createElement("div");
      container.id = "webSocketContainer";
      /*
       * Hides Flash box. We cannot use display: none or visibility: hidden because it prevents
       * Flash from loading at least in IE. So we move it out of the screen at (-100, -100).
       * But this even doesn't work with Flash Lite (e.g. in Droid Incredible). So with Flash
       * Lite, we put it at (0, 0). This shows 1x1 box visible at left-top corner but this is
       * the best we can do as far as we know now.
       */
      container.style.position = "absolute";
      if (TensorWebSocket.__isFlashLite()) {
         container.style.left = "0px";
         container.style.top = "0px";
      } else {
         container.style.left = "-100px";
         container.style.top = "-100px";
      }
      var holder = document.createElement("div");
      holder.id = "webSocketFlash";
      container.appendChild(holder);
      document.body.appendChild(container);
      // See this article for hasPriority:
      // http://help.adobe.com/en_US/as3/mobile/WS4bebcd66a74275c36cfb8137124318eebc6-7ffd.html
      swfobject.embedSWF(
         $ws._const.wsRoot + 'lib/PluginManager/resources/WebSocketMain.swf',
         'webSocketFlash',
         '1' /* width */,
         '1' /* height */,
         "11.0.0" /* SWF version */,
         null,
         null,
         {hasPriority: true, swliveconnect : true, allowScriptAccess: "always"},
         null,
         callback
      );

      function ready(e) {
         clearTimeout(TensorWebSocket.__initTimeout);
         if (e.ref.create) {
            callbackFn(e);
         } else {
            e.success = false;
            e.blocked = true;
            callbackFn(e);
         }
      }

      function callback(e) {
         if (e.success) {
            // Проверим, не блокирует ли кто наш плагин
            // Дадим время на запуск. 5с вроде хватает, чтобы понять запустился он или нет
            var fn = ready.bind(undefined, e);
            TensorWebSocket.__initTimeout = setTimeout(fn, 5000);
            TensorWebSocket.__tasks.push(fn);
         } else {
            callbackFn(e);
         }
      }
   };

   /**
   * Called by Flash to notify JS that it's fully loaded and ready
   * for communication.
   */
   TensorWebSocket.__onFlashInitialized = function() {
      // We need to set a timeout here to avoid round-trip calls
      // to flash during the initialization process.
      setTimeout(function() {
         TensorWebSocket.__flash = document.getElementById("webSocketFlash");
         TensorWebSocket.__flash.setCallerUrl(location.href);
         TensorWebSocket.__flash.setDebug(false);
         for (var i = 0; i < TensorWebSocket.__tasks.length; ++i) {
            TensorWebSocket.__tasks[i]();
         }
         TensorWebSocket.__tasks = [];
      }, 0);
   };

   /**
   * Called by Flash to notify WebSockets events are fired.
   */
   TensorWebSocket.__onFlashEvent = function() {
      setTimeout(function() {
         try {
            // Gets events using receiveEvents() instead of getting it from event object
            // of Flash event. This is to make sure to keep message order.
            // It seems sometimes Flash events don't arrive in the same order as they are sent.
            var events = TensorWebSocket.__flash.receiveEvents();
            for (var i = 0; i < events.length; ++i) {
               TensorWebSocket.__instances[events[i].webSocketId].__handleEvent(events[i]);
            }
         } catch (e) {
            logger.error(e);
         }
      }, 0);
      return true;
   };

   // Called by Flash.
   TensorWebSocket.__log = function(message) {
      logger.log(decodeURIComponent(message));
   };

   // Called by Flash.
   TensorWebSocket.__error = function(message) {
      message = decodeURIComponent(message)
      if (/Error #2048/.test(message)){
         logger.info(message);
      }
      else{
         logger.error(message);
      }
   };

   TensorWebSocket.__addTask = function(task) {
      if (TensorWebSocket.__flash) {
         task();
      } else {
         TensorWebSocket.__tasks.push(task);
      }
   };

   /**
   * Test if the browser is running flash lite.
   * @return {boolean} True if flash lite is running, false otherwise.
   */
   TensorWebSocket.__isFlashLite = function() {
      if (!window.navigator || !window.navigator.mimeTypes) {
         return false;
      }
      var mimeType = window.navigator.mimeTypes["application/x-shockwave-flash"];
      if (!mimeType || !mimeType.enabledPlugin || !mimeType.enabledPlugin.filename) {
         return false;
      }
      return mimeType.enabledPlugin.filename.match(/flashlite/i) ? true : false;
   };

   return TensorWebSocket;
});
