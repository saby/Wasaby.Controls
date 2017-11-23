define('js!Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/CommandDispatcher',
      'Core/core-instance',
      'css!Controls/Popup/Manager/Popup'
   ],
      function (Control, template, CommandDispatcher, CoreInstance) {
         'use strict';
         /**
          Опции
          * strategy
          *
          */

         /**
          * Компонент вспывающего окна
          * @class Controls/Popup/Manager/Popup
          * @control
          * @extends Core/Control
          * @public
          * @category Popup
          */
         var Popup = Control.extend({
            _controlName: 'Controls/Popup/Manager/Popup',
            _template: template,
            iWantVDOM: true,
            _position: {},

            constructor: function(cfg){
               Popup.superclass.constructor.apply(this, arguments);
               CommandDispatcher.declareCommand(this, 'close', this.close);
               this._autoHide = cfg.autoHide || true;
               this._strategy = cfg.strategy;
            },

            _beforeMount: function(){
               this.recalcPosition();
            },

            _afterMount: function(){
               this.focus();
               this.subscribe('onFocusIn', this._focus.bind(this, true));
               this.subscribe('onFocusOut', this._focus.bind(this, false));
               this.recalcPosition();
            },

            getStrategy: function(){
               return this._strategy;
            },

            /**
             * Панель является стековой
             * @function Controls/Popup/Manager/Popup#isStack
             */
            isStack: function(){
               return CoreInstance.instanceOfModule(this.getStrategy(), 'Controls/Popup/Opener/Stack/Strategy');
            },

            /**
             * Пересчитать позицию попапа
             * @function Controls/Popup/Manager/Popup#recalcPosition
             */
            recalcPosition: function(){
               this._position = this.getStrategy().getPosition(this);
               this._forceUpdate();
            },

            /**
             * Закрыть окно
             * @function Controls/Popup/Manager/Popup#close
             */
            close: function(){
               CommandDispatcher.sendCommand(this, 'closePopup', this);
            },

            _focus: function(focusIn){
               CommandDispatcher.sendCommand(this, 'focusPopup', this, focusIn);
            }
         });

         return Popup;
      }
);