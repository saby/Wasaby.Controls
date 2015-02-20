define('js!SBIS3.CORE.ServerEventBus/resources/reconnect', [
   'is!browser?//cdn.sbis.ru/sockjs/0.3.4/sockjs-min.js'
], function(SockJS){

   /**
    * Производим переподключение только в том случае, если код указан в этом хэше и содержит значение true
    * @see http://tools.ietf.org/html/rfc6455#section-7.4.1
    */
   var RECONNECT_BY_CODE = {
      // connection cleanly closed
      1000: false,
      // endpoint going down
      1001: false,
      // some protocol error (STOMP 502)
      1002: true,
      // "to indicate that the connection was closed abnormally, e.g., without sending or receiving a Close control frame."
      1006: true,
      // message too big
      1009: true
   };


   function ReconnectingSockJS(url, protocols) {
      protocols = protocols || [];

      // These can be altered by calling code.
      this.debug = false;
      this.reconnectInterval = 5000;
      this.timeoutInterval = 5000;
      this.maxReconnectRetryCount = 10;
      this.reconnectFailures = 0;

      var self = this;
      var ws;
      var forcedClose = false;
      var timedOut = false;

      this.url = url;
      this.protocols = protocols;
      this.readyState = 0;
      this.URL = url; // Public API

      this.getReconnectInterval = function() {
         return Math.exp(this.reconnectFailures / 2) * 300 + 1000;
      };

      /**
       * Reconnect only on unclean connection shutdown
       * @param event
       * @returns {*|boolean}
       */
      this.isNeedReconnect = function(event) {
         return (event && RECONNECT_BY_CODE[event.code] || false) && this.reconnectFailures <= this.maxReconnectRetryCount;
      };

      this.onopen = function(event) {
      };

      this.onclose = function(event) {
      };

      this.onconnecting = function(event) {
      };

      this.onmessage = function(event) {
      };

      this.onerror = function(event) {
      };

      function connect(reconnectAttempt) {

         var config = protocols.length ? {
            protocols_whitelist: protocols
         } : undefined;

         ws = new SockJS(url, null, config);

         self.onconnecting && self.onconnecting();
         if (self.debug || ReconnectingSockJS.debugAll) {
            console.log('ReconnectingSockJS', 'attempt-connect', url);
         }

         var localWs = ws;
         var timeout = setTimeout(function() {
            if (self.debug || ReconnectingSockJS.debugAll) {
               console.log('ReconnectingSockJS', 'connection-timeout', url);
            }
            timedOut = true;
            localWs.close();
            timedOut = false;
         }, self.timeoutInterval);

         ws.onopen = function(event) {
            clearTimeout(timeout);
            if (self.debug || ReconnectingSockJS.debugAll) {
               console.log('ReconnectingSockJS', 'onopen', url);
            }
            self.readyState = 1;
            reconnectAttempt = false;
            self.reconnectFailures = 0;
            self.onopen && self.onopen(event);
         };

         ws.onclose = function(event) {
            clearTimeout(timeout);
            if (forcedClose) {
               self.readyState = 3;
               self.onclose && self.onclose(event);
            } else {
               self.readyState = 0;
               self.onconnecting && self.onconnecting();
               if (!reconnectAttempt && !timedOut) {
                  if (self.debug || ReconnectingSockJS.debugAll) {
                     console.log('ReconnectingSockJS', 'onclose', url);
                  }
                  self.onclose && self.onclose(event);
               }
               self.reconnectFailures++;
               if (self.isNeedReconnect(event)) {
                  setTimeout(function() {
                     connect(true);
                  }, self.getReconnectInterval());
               }
            }
            ws = null;
         };
         ws.onmessage = function(event) {
            if (self.debug || ReconnectingSockJS.debugAll) {
               console.log('ReconnectingSockJS', 'onmessage', url, event.data);
            }
            self.onmessage && self.onmessage(event);
         };
         ws.onerror = function(event) {
            if (self.debug || ReconnectingSockJS.debugAll) {
               console.log('ReconnectingSockJS', 'onerror', url, event);
            }
            self.onerror && self.onerror(event);
         };
      }
      connect();

      this.send = function(data) {
         if (ws) {
            if (self.debug || ReconnectingSockJS.debugAll) {
               console.log('ReconnectingSockJS', 'send', url, data);
            }
            return ws.send(data);
         } else {
            throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
         }
      };

      this.close = function() {
         if (ws) {
            forcedClose = true;
            ws.close();
         }
      };

      /**
       * Additional public API method to refresh the connection if still open (close, re-open).
       * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
       */
      this.refresh = function() {
         if (ws) {
            ws.close();
         }
      };
   }

   /**
    * Setting this to true is the equivalent of setting all instances of ReconnectingSockJS.debug to true.
    */
   ReconnectingSockJS.debugAll = false;

   return ReconnectingSockJS;
});