/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.Button', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.Button'], function(ButtonBase, dotTplFn) {

   'use strict';

   if (typeof window !== 'undefined') {
      $(document).mouseup(function () {
         $('.controls-Button__active').removeClass('controls-Button__active');
      });
   }

   /**
    * Контрол, отображающий обычную кнопку
    * @class SBIS3.CONTROLS.Button
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.Button' style='width: 100px'>
    *    <option name='caption' value='Кнопка'></option>
    * </component>
    * @public
    * @category Buttons
    */

   var Button = ButtonBase.extend( /** @lends SBIS3.CONTROLS.Button.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._container.mouseup(function (e) {
            if (e.which == 1 && self.isEnabled()) {
               self._container.removeClass('controls-Button__active');
            }
         }).mousedown(function (e) {
               if (e.which == 1 && self.isEnabled()) {
                  self._container.addClass('controls-Button__active');
               }
            });

         if (this._options.primary == true) {
            this._registerDefaultButton();
         }
      },

      setCaption: function(captionTxt){
         Button.superclass.setCaption.call(this, captionTxt);
         var btnText;
         if (this._options.icon) {
            btnText = $('.js-controls-Button__text', this._container.get(0));
         }
         else {
            btnText = this._container;
         }
         btnText.text(captionTxt || '');
      },

      setPrimary: function(flag){
         Button.superclass.setPrimary.call(this,flag);
         if (this.isPrimary()){
            this._container.addClass('controls-Button__primary');
         } else {
            this._container.removeClass('controls-Button__primary');
         }
      },

      setIcon: function(icon) {
         Button.superclass.setIcon.call(this);
         if (!icon) {
            $('.js-controls-Button__icon', this._container.get(0)).remove();
         }
         if (icon.indexOf('sprite:') >= 0) {
            var iconCont = $('.js-controls-Button__icon', this._container.get(0));
            if (!(iconCont.length)) {
               iconCont = $('<i></i>').addClass('js-controls-Button__icon');
               $('.js-controls-Button__text', this._container.get(0)).before(iconCont);
            }
            $('.js-controls-Button__icon', this._container.get(0)).get(0).className = 'controls-Button__icon js-controls-Button__icon ' + icon.substr(7);
         }
      },

      /*TODO методы для поддержки defaultButton*/
      isDefaultButton: function(){
         return !!this._options.primary;
      },
      _unregisterDefaultButton: function() {
         var parent = this.getParent();
         if(parent && parent.unregisterDefaultButton)
            parent.unregisterDefaultButton(this);
      },
      _registerDefaultButton: function() {
         var parent = this.getParent();
         if(parent && parent.registerDefaultButton)
            parent.registerDefaultButton(this);
      },
      setDefaultButton: function(isDefault){
         if(isDefault === undefined)
            isDefault = true;
         this.setPrimary(isDefault);


         if(isDefault) this._registerDefaultButton();
         else this._unregisterDefaultButton();
      }
      /*TODO конец*/
   });

   return Button;

});