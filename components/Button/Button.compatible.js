/**
 * Created by dv.zuev on 13.03.2017.
 */
define('SBIS3.CONTROLS/Button/Button.compatible', [
], function () {
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
               if (self.iWantVDOM) {
                  self._onMouseClick(e);
               } else {
                  self._onClickHandler(e);
               }
               return false;
            } else {
               return true;
            }
         }
         var self = this;

         // регистрироваться имеют права только видимые кнопки. если невидимая кнопка зарегистрируется, мы нажмем enter и произойдет неведомое действие
         if (this.isVisibleWithParents()) {
            // сначала отменяем регистрацию текущего действия по умолчанию, а потом регистрируем новое действие
            this._unregisterDefaultButton();
            this.sendCommand('registerDefaultButtonAction', defaultAction, this);
         }
      },

      /**
       * Делает кнопку дефолтной или отменяет таковое состояние
       *
       * @noShow
       * @param {Boolean} [isDefault] Если не указан, считается true
       * @param {Boolean} [dontSendCommand] Не стрелять событием о регистрации/разрегистрации кнопки
       */
      setDefaultButton: function(isDefault, dontSendCommand){
         if (isDefault === undefined) {
            isDefault = true;
         }

         if (!dontSendCommand) {
            if (isDefault) {
               this._registerDefaultButton();
            }
            else {
               this._unregisterDefaultButton();
            }
         }

         this.setPrimary(isDefault);
      },

      _clickHandler:function(){
         this._onClickHandler();
      },

      _baseClickAction: function(e){
         //Прикладники из своего кода зовут _onClickHandler без аргументов или с произвольными аргументами
         if (e && e.stopImmediatePropagation) {
            // если не остановить, будет долетать до области, а у нее обработчик на клик - onBringToFront. фокус будет улетать не туда
            e.stopImmediatePropagation();
         }

         if (!this.isEnabled())
            return;

         if (!this.iWantVDOM) {
            this._container && this._container.removeClass('controls-Click__active');
         }

         if (!this._isControlActive && this._options.activableByClick!==false) {
            //Прикрытие юнит-тестов. Внутри того setActive лезут в дом
            if (typeof window !== "undefined") {
               this.setActive(true);
            } else {
               this._isControlActive = true;
            }
         }

         if (!!this._options.command) {
            var args = [this._options.command].concat(this._options.commandArgs);
            this.sendCommand.apply(this, args);
         }
      },

      /**
       * Базовая логика старых компонентов: при клике на
       * контейнер вызывается _onClickHandler, который вызывает _onClick
       * Есть те, кто переопределяет каждый из этих методов и они ждут
       * сохранения правильной последовательности, поэтому мы не можем использовать метод _onClick в VirtualDom кнопке
       * там метод _onMouseClick
       * */
      _onClickHandler: function(e)
      {
         this._baseClickAction(e);
         if (this.isEnabled()) {
            this._onClick(e);
         }
      },

      _onClick: function (e) {
         if (!this.isEnabled() || this.iWantVDOM)
            return;
         return this._notify("onActivated", e);
      }

   };

});