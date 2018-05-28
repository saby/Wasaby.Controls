
define('SBIS3.CONTROLS/Menu/MenuItem', [
   'SBIS3.CONTROLS/WSControls/Buttons/ButtonBase',
   'tmpl!SBIS3.CONTROLS/Menu/MenuItem/MenuItem',
   'Core/EventBus',
   'Core/Sanitize',
   'css!SBIS3.CONTROLS/Menu/MenuItem/MenuItem'
], function(WSButtonBase, dotTplFn, EventBus, Sanitize) {

   'use strict';
   /**
    * Контрол, отображающий элемент меню. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS/Menu/MenuItem
    * @public
    * @extends WSControls/Buttons/ButtonBase
    * @author Крайнов Д.О.
    */
   var MenuItem = WSButtonBase.extend( /** @lends SBIS3.CONTROLS/Menu/MenuItem.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Включает перенеос текста внутри пункта меню
             */
            multiline: false,
            escapeCaptionHtml: false,
            _sanitizeOpts: {
               validNodes: { component: true }
            }
         },
         _iconContainer: undefined
      },

      $constructor: function() {
         this._iconContainer = $('.js-controls-MenuItem__icon',this.getContainer());
         // Предотвращаем всплытие focus и mousedown с контейнера меню, т.к. это приводит к потере фокуса
         // при потере фокуса в богатом редакторе теряется текущее выделение текста  в IE8
         this._container.on('mousedown focus', this._blockFocusEvents);
      },
      _blockFocusEvents: function(event) {
         var eventsChannel = EventBus.channel('WindowChangeChannel');
         event.preventDefault();
         event.stopPropagation();
         //Если случился mousedown то нужно нотифицировать о клике, перебив дефолтное событие перехода фокуса
         if(event.type === 'mousedown') {
            eventsChannel.notify('onDocumentClick', event);
         }
      },

      setCaption: function(caption){
         MenuItem.superclass.setCaption.call(this, caption);
         this._options.caption = Sanitize(this._options.caption, {validNodes: {component: true}});
         var $caption = $('.js-controls-MenuItem__text', this._container);
         if (this._options.caption) {
            if ($caption.length){
               $caption.html(this._options.caption);
            }
         }
      },

      setIcon: function(){
         this._iconContainer && this._iconContainer.removeClass(this._options._iconClass);
         MenuItem.superclass.setIcon.apply(this, arguments);
      },
      _drawIcon: function(){
         this._iconContainer && this._iconContainer.addClass(this._options._iconClass);
      }

   });

   return MenuItem;

});
