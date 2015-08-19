define('js!SBIS3.CONTROLS.BackButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.BackButton','js!SBIS3.CONTROLS.Link'], function(CompoundControl, dotTpl) {
   'use strict';

   var BackButton = CompoundControl.extend({
      $protected: {
         _dotTplFn: dotTpl,
         _link: null,
         _options:{
            /**
             * Надпись
             * @type {String}
             */ 
            caption: '',
            /**
             * Иконка
             * @type {String}
             */
            icon: '',
         }
      },

      init: function(){
         this._publish('onActivated');
         BackButton.superclass.init.call(this);
         var self = this;
         this._link = this.getChildControlByName('BackButton-caption');
         this._arrow = $('.controls-BackButton__arrow', this._container);
         this._container.bind('mouseup', function(e){
            if (e.which == 1) self._notify('onActivated');
         });
      },

      setCaption: function(caption){
         this._link.setCaption(caption);
         this._options.caption = caption;
         this._arrow.toggleClass('ws-hidden', caption === '');
      },

      setIcon: function(icon){
         this._link.setIcon(icon);
         this._options.icon = icon;
      }
   });

   return BackButton;
});