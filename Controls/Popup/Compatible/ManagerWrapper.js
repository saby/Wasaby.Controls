/**
 * Created by as.krasilnikov on 29.10.2018.
 */
define('Controls/Popup/Compatible/ManagerWrapper',
   [
      'Core/Control',
      'Controls/Popup/Compatible/ManagerWrapper/Controller',
      'wml!Controls/Popup/Compatible/ManagerWrapper/ManagerWrapper'
   ],
   function(Control, Controller, template) {
      'use strict';

      var ManagerWrapper = Control.extend({
         _template: template,

         _beforeMount: function() {
            if (window) {
               this._scrollPage = this._eventRegistratorHandler.bind(this, 'scrollDetect');
               this._resizePage = this._eventRegistratorHandler.bind(this, 'resizeDetect');
               this._mousemovePage = this._eventRegistratorHandler.bind(this, 'mousemoveDetect');
               this._touchmovePage = this._eventRegistratorHandler.bind(this, 'touchmoveDetect');
               this._touchendPage = this._eventRegistratorHandler.bind(this, 'touchendDetect');
               this._mousedownPage = this._eventRegistratorHandler.bind(this, 'mousedownDetect');
               this._mouseupPage = this._eventRegistratorHandler.bind(this, 'mouseupDetect');

               this._toggleWindowHandlers(true);
            }
         },

         _afterMount: function() {
            Controller.registerManager(this);
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
            this._children[registratorName].start(event);
         },

         _scrollHandler: function() {
            this.closePopups();
         },

         closePopups: function() {
            var items = this.getItems();
            var self = this;

            // todo: Задача: научить Listener'ы, лежащие в старом окружени, регистрироваться в ManagerWrapper'e
            // https://online.sbis.ru/opendoc.html?guid=cc63938a-8b0c-40f4-82f5-d920f7f2141c
            items.forEach(function(item) {
               self._children.Manager.remove(item.id);
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
