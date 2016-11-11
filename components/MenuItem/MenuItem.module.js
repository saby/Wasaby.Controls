
define('js!SBIS3.CONTROLS.MenuItem', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.MenuItem', 'Core/Sanitize'], function(ButtonBase, dotTplFn, Sanitize) {

   'use strict';
   /**
    * Контрол, отображающий элемент меню. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.MenuItem
    * @public
    * @extends SBIS3.CONTROLS.ButtonBase
    * @author Крайнов Дмитрий Олегович
    */
   var MenuItem = ButtonBase.extend( /** @lends SBIS3.CONTROLS.MenuItem.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            sanitize: Sanitize
         },
         _iconContainer: undefined
      },

      $constructor: function() {
         this._iconContainer = $('.js-controls-MenuItem__icon',this.getContainer());
      },

      setCaption: function(caption){
         MenuItem.superclass.setCaption.call(this, caption);
         caption = this._options.caption;
         var $caption = $('.js-controls-MenuItem__text', this._container);
         if (this._options.caption) {
            if ($caption.length){
               $caption.html(caption);
            }
         }
      },

      setIcon: function(){
         this._iconContainer && this._iconContainer.removeClass(this._oldIcon);
         MenuItem.superclass.setIcon.apply(this, arguments);
      },
      _drawIcon: function(){
         this._iconContainer && this._iconContainer.addClass(this._options._iconClass);
      }

   });

   return MenuItem;

});