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

      /**
       * Компонент - контейнер с узкой стилизованной полосой скролла.
       * @class Controls/Container/Scroll
       * @extends Controls/Control
       * @control
       * @public
       * @category Container
       */

      /**
       * @name Controls/Container/Scroll#content
       * @cfg {Content} Содержимое контейнера
       */
      /**
       * @name Controls/Container/Scroll#shadowVisibility
       * @cfg {Boolean} Наличие тени при прокрутке контента
       */
      /**
       * @name Controls/Container/Scroll#scrollbarVisibility
       * @cfg {Boolean} Наличие полосы прокрутки
       */
      /**
       * @name Controls/Container/Scroll#style
       * @cfg {String} Цветовая схема контейнера. Влияет на цвет тени и полоски скролла. Используется для того чтобы контейнер корректно отображался как на светлом так и на темном фоне.
       * @variant normal стандартная схема
       * @variant opposite противоположная схема
       */

      var ScrollContainer = Control.extend({
         _controlName: 'Controls/Container/Scroll/Scroll',
         _template: template,
         contentHeight: 1,
         scrollBarPosition: 0,
         showScrollbar: false,
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
            this.showScrollbar = !(detection.isMobileIOS || detection.isMobileAndroid);
            this.contentHeight = this._getScrollHeight();
            this.scrollBarPosition = this._getScrollTop();
         },
         _hideScrollbar: function hideScrollbar() {
            this.showScrollbar = false;
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
