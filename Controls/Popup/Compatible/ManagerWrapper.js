/**
 * Created by as.krasilnikov on 29.10.2018.
 */
define('Controls/Popup/Compatible/ManagerWrapper',
   [
      'Core/Control',
      'wml!Controls/Popup/Compatible/ManagerWrapper/ManagerWrapper'
   ],
   function(Control, template) {
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

         _beforeUnmount: function() {
            if (window) {
               this._toggleWindowHandlers(false);
            }
         }

      });

      return ManagerWrapper;
   });
