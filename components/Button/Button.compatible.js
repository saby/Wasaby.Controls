/**
 * Created by dv.zuev on 13.03.2017.
 */
define('js!SBIS3.CONTROLS.Button/Button.compatible', [
   "Core/constants"
], function (cConstants) {
   'use strict';

   /**
    * В этом файле собраны методы, работающие с домом и со старой архитектурой WS
    */
   if (typeof window !== 'undefined') {
      $(document).on("touchend  mouseup", function () {
         $('.controls-Click__active').removeClass('controls-Click__active');
      });
   }
   return {

      _isControlActive: false,
      _needRegistWhenParent: false,


      /**
      * Далее в файле идут методы для сохранения старого АПИ
      */
      _drawIcon: function(icon){
         this.setIcon(icon);
      },

      isDefaultButton: function(){
         return !!this._options.primary;
      },

      _unregisterDefaultButton: function() {
         this.sendCommand('unregisterDefaultButtonAction');
      },

      _registerDefaultButton: function() {
         if (!this._options.parent) {
            this._needRegistWhenParent = true;
            return;
         }
         function defaultAction(e) {
            if (self && self.isEnabled()) {
               self._onClickHandler(e);
               return false;
            } else {
               return true;
            }
         }
         var self = this;

         // регистрироваться имеют права только видимые кнопки. если невидимая кнопка зарегистрируется, мы нажмем enter и произойдет неведомое действие
         if (this.isVisible()) {
            // сначала отменяем регистрацию текущего действия по умолчанию, а потом регистрируем новое действие
            this._unregisterDefaultButton();
            this.sendCommand('registerDefaultButtonAction', defaultAction, this);
         }
      },

      /**
       * @noShow
       * @param isDefault
       */
      setDefaultButton: function(isDefault){
         if (isDefault === undefined) {
            isDefault = true;
         }

         if (isDefault) {
            this._registerDefaultButton();
         }
         else {
            this._unregisterDefaultButton();
         }

         this.setPrimary(isDefault);
      },

      _clickHandler:function(){
         this._onClickHandler();
      },

      _baseClickAction: function(e){
         if (!this.iWantVDOM && e && e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
            e.stopPropagation();
         }
         if (!this._options.enabled)
            return;

         if (!this.iWantVDOM) {
            this._container.removeClass('controls-Click__active');
         }

         if (!this._isControlActive) {
            this.setActive(true);
         }

         if (!!this._options.command) {
            var args = [this._options.command].concat(this._options.commandArgs);
            this.sendCommand.apply(this, args);
         }
      },

      _onClickHandlerOld: function(e){
         this._baseClickAction(e);
         this._onClick(e);
      },

      _onClickHandler: function(e)
      {
         this._baseClickAction(e);
         if (!this.iWantVDOM) {
            this._notify("onActivated", e);
         }
      }

   };

});