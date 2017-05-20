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

      _isCompatibleInited: false,

      initCompatibleFunc: function() {
         if (!this._isCompatibleInited) {
            this._isCompatibleInited = true;
            this._addClassCompatible = function(className){
               if (this._options.class.indexOf(className)==-1) {
                  this._options.class += " "+className;
                  this._setDirty();
               }
               return this._container;
            }.bind(this);

            this._removeClassCompatible = function(className){
               this._options.class.replace(" "+className, "");
               this._setDirty();
               return this._container;
            }.bind(this);

            this._mouseEnterCompatible = function(callback){
               this.subscribe('onMouseEnter', function(ev, synEvent){
                  callback({currentTarget: this._container});
               });
               return this._container;
            }.bind(this);

            this._mouseLeaveCompatible = function(callback){
               this.subscribe('onMouseLeave', function(ev, synEvent){
                  callback({currentTarget: this._container});
               });
               return this._container;
            }.bind(this);

         }
      },
      _addClassCompatible: null,
      _removeClassCompatible: null,
      _mouseEnterCompatible: null,
      _mouseLeaveCompatible: null,

      getContainer: function(){
         if (this.iWantVDOM) {
            this.initCompatibleFunc();
            this._container.mouseenter = this._mouseEnterCompatible;
            this._container.mouseleave = this._mouseLeaveCompatible;
            this._container.addClass = this._addClassCompatible;
            this._container.removeClass = this._removeClassCompatible;
         }
         return this._container;
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
         this._onClick(e);
      },

      _onClick: function (e) {
         if (!this._options.enabled || this.iWantVDOM)
            return;
         return this._notify("onActivated", e);
      }

   };

});