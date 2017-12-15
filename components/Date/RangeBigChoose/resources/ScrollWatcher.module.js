define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/ScrollWatcher', ['SBIS3.CONTROLS/Utils/ScrollWatcher'], function(_ScrollWatcher) {
   'use strict';
   /**
    * На данный момент не используется, делалось для анимирования бесконечной прокрутки вверх и вниз.
    */
   var ScrollWatcher = _ScrollWatcher.extend(/** @lends SBIS3.CONTROLS.DateRangeBig.ScrollWatcher.prototype */{
      $protected: {
         _options: {
         },
         _animateTo: null
      },

      _onWheel: function(event){
         setTimeout(function () {
            var container = $(this._options.element),
               height = $(this._options.element).height();
            this._animateTo -= event.wheelDelta > 0? height: -height;
            $(this._options.element).stop();
            $(this._options.element).animate({scrollTop: this._animateTo}, '5000');
         }.bind(this), 10);
      }

   });
   return  ScrollWatcher;
});
