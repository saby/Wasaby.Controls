/**
 * Created by as.krasilnikov on 29.10.2018.
 */
define('Controls/Popup/Compatible/ManagerWrapper',
   [
      'Core/Control',
      'Controls/Popup/Compatible/ManagerWrapper/Controller',
      'wml!Controls/Popup/Compatible/ManagerWrapper/ManagerWrapper',
      'Controls/popup',
      'Vdom/Vdom'
   ],
   function(Control, Controller, template, popup, Vdom) {
      'use strict';

      var ManagerWrapper = Control.extend({
         _template: template,

         _afterMount: function() {
            Controller.registerManager(this);

            // Add handlers to events when children are created
            this._scrollPage = this._eventRegistratorHandler.bind(this, 'scrollDetect');
            this._resizePage = this._eventRegistratorHandler.bind(this, 'resizeDetect');
            this._mousemovePage = this._eventRegistratorHandler.bind(this, 'mousemoveDetect');
            this._touchmovePage = this._eventRegistratorHandler.bind(this, 'touchmoveDetect');
            this._touchendPage = this._eventRegistratorHandler.bind(this, 'touchendDetect');
            this._mousedownPage = this._mouseDownHandler.bind(this);
            this._mouseupPage = this._eventRegistratorHandler.bind(this, 'mouseupDetect');

            this._toggleWindowHandlers(true);
         },

         _beforePopupDestroyedHandler: function() {
            // Контрол ловим событие и вызывает обработчик в GlobalPopup.
            // На текущий момент у PopupGlobal нет возможности самому ловить событие.
            var PopupGlobal = this._children.PopupGlobal;
            PopupGlobal._popupBeforeDestroyedHandler.apply(PopupGlobal, arguments);
         },

         _toggleWindowHandlers: function(subscribe) {
            var actionName = subscribe ? 'addEventListener' : 'removeEventListener';
            window[actionName]('scroll', this._scrollPage);
            window[actionName]('resize', this._resizePage);
            window[actionName]('mousemove', this._mousemovePage);
            window[actionName]('touchmove', this._touchmovePage);
            window[actionName]('touchend', this._touchendPage);
            window[actionName]('mousedown', this._mousedownPage);
            window[actionName]('mouseup', this._mouseupPage);
         },

         _eventRegistratorHandler: function(registratorName, event) {
            // vdom control used synthetic event
            this._children[registratorName].start(new Vdom.SyntheticEvent(event));
         },

         _mouseDownHandler: function(event) {
            this._eventRegistratorHandler('mousedownDetect', event);
            var Manager = popup.Controller.getManager();
            if (Manager) {
               Manager._mouseDownHandler(event);
            }
         },

         registerListener: function(event, registerType, component, callback) {
            this._listenersSubscribe('_registerIt', event, registerType, component, callback);
         },

         unregisterListener: function(event, registerType, component, callback) {
            this._listenersSubscribe('_unRegisterIt', event, registerType, component, callback);
         },

         _listenersSubscribe: function(method, event, registerType, component, callback) {
            // Вызываю обработчики всех регистраторов, регистратор сам поймет, нужно ли обрабатывать событие
            var registrators = [
               'scrollDetect',
               'resizeDetect',
               'mousemoveDetect',
               'touchmoveDetect',
               'touchendDetect',
               'mousedownDetect',
               'mouseupDetect'
            ];
            for (var i = 0; i < registrators.length; i++) {
               this._children[registrators[i]][method](event, registerType, component, callback);
            }
         },

         _scrollHandler: function() {
            this.closePopups();
         },

         closePopups: function() {
            var items = this.getItems().clone();
            var self = this;

            // todo: Задача: научить Listener'ы, лежащие в старом окружени, регистрироваться в ManagerWrapper'e
            // https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
            items.forEach(function(item) {
               // Если попап не следует за таргетом при скролле - закроем его.
               // Избавимся только когда сделают задачу, описанную комментом выше
               if (!item.popupOptions.targetTracking) {
                  self._children.Manager.remove(item.id);
               }
            });
         },

         getItems: function() {
            return this._children.PopupContainer._popupItems;
         },

         _beforeUnmount: function() {
            if (window) {
               this._toggleWindowHandlers(false);
            }
         }

      });

      return ManagerWrapper;
   });
