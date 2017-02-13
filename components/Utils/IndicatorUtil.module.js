/**
 * Created by am.gerasimov on 09.02.2017.
 */
define('js!SBIS3.CONTROLS.Utils.IndicatorUtil', ['Core/Indicator'], function (Indicator) {

   'use strict';

   var _private = {
      indicatorShowed: false,
      overlay: null
   };
   var DEFAULT_DELAY = 2000;
   var DEFAULT_MESSAGE = 'Загрузка...';

   return  {
      showLoadingIndicator: function(callback, message) {
         _private.indicatorShowed = true;
         this._toggleOverLay(true);
         window.setTimeout(function(){
            if (_private.indicatorShowed) {
               if (callback) {
                  callback();
               } else {
                  Indicator.setMessage(message === undefined ? DEFAULT_MESSAGE : message); //setMessage зовет show у loadingIndicator
               }
            }
         }.bind(this), DEFAULT_DELAY);
      },

      hideLoadingIndicator: function() {
         this._toggleOverLay(false);
         _private.indicatorShowed = false;
         Indicator.hide();
      },

      _toggleOverLay: function(show) {
         if (!_private.overlay) {
            _private.overlay = $('<div class="controls-overlay ws-hidden"></div>');
            _private.overlay.css({
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               'z-index': 9999,
               opacity: 0
            });
            _private.overlay.appendTo('body');
         }
         _private.overlay.toggleClass('ws-hidden', !show);
      }
   };
});