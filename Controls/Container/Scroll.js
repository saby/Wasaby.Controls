define('Controls/Container/Scroll',
   [
      'Core/Control',
      'tmpl!Controls/Container/Scroll/Scroll',
      'Core/detection',
      'Controls/Container/Scrollbar/Scrollbar',
      'css!Controls/Container/Scroll/Scroll'
   ],
   function(Control, template, detection) {

      'use strict';

      var _private = {
         doInitScrollbar: function(self){
            self.showScrollbar = !(detection.isMobileIOS || detection.isMobileAndroid) && (self._getContainerHeight() !== self._getScrollHeight());
            self.contentHeight = self._getScrollHeight();
            self.scrollBarPosition = self._getScrollTop();
         }
      };

      var ScrollContainer = Control.extend({
         _template: template,
         contentHeight: 1,
         scrollBarPosition: 0,
         showScrollbar: false,
         goodIntervalForSilentSizeChanged: null,
         _getScrollHeight: function(){
            return this._children.content.scrollHeight;
         },
         _getContainerHeight: function() {
            return this._children.content.offsetHeight;
         },
         _toggleGradient: function() {
            // maxScrollTop > 1 - погрешность округления на различных браузерах.
            var maxScrollTop = this._getScrollHeight() - this._getContainerHeight();
            this.topGradient = this._getScrollTop() > 0;
            this.bottomGradient = maxScrollTop > 1 && this._getScrollTop() < maxScrollTop;
         },
         _getScrollTop: function(){
            return this._children.content.scrollTop;
         },
         _initScrollbar: function initScrollbar() {
            var self = this;
            _private.doInitScrollbar(self);
            if (!self.goodIntervalForSilentSizeChanged) {
               self.goodIntervalForSilentSizeChanged = setInterval(function () {
                  _private.doInitScrollbar(self);
                  self._forceUpdate();
               }, 100);
            }
         },
         _hideScrollbar: function hideScrollbar() {
            this.showScrollbar = false;
            clearInterval(this.goodIntervalForSilentSizeChanged);
            this.goodIntervalForSilentSizeChanged = null;
         },
         _onScroll: function onScroll() {
            var scrollTop = this._getScrollTop();
            if (this.showScrollbar) {
               this.scrollBarPosition = scrollTop;
            }
            this._toggleGradient();
         },
         _afterMount: function afterMountScrollContainer() {
            if (this.showScrollbar) {
               this._toggleGradient();
            }
         }
      });

      return ScrollContainer;
   }
);
