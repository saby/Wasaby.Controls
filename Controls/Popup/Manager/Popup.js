define('js!Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/CommandDispatcher',
      'Core/constants',
      'css!Controls/Popup/Manager/Popup'
   ],
      function (Control, template, CommandDispatcher, CoreConstants) {
         'use strict';
         /**

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

            constructor: function(cfg){
               Popup.superclass.constructor.apply(this, arguments);
               CommandDispatcher.declareCommand(this, 'close', this.close);
            },

            _afterMount: function(){
               this.subscribe('onFocusIn', this._focusIn);
               this.subscribe('onFocusOut', this._focusOut);

               var opener = this.getOpener();
               if( opener ){
                  this.subscribeTo(opener, 'onFocusOut', this._focusOut.bind(this));
               }

               if( this._options.catchFocus === undefined || this._options.catchFocus ){
                  this.focus();
               }
               this._recalcPosition();
            },

            /**
             * автоматически скрывать popup при потере фокуса
             * @function Controls/Popup/Manager/Popup#close
             */
            isAutoHide: function(){
               return !!this._options.autoHide;
            },

            /**
             * Закрыть popup
             * @function Controls/Popup/Manager/Popup#close
             */
            close: function(){
               CommandDispatcher.sendCommand(this, 'closePopup', this);
            },

            getOpener: function(){
               return this._options.opener;
            },

            /**
             * Обработчик фокусировки элемента.
             * @function Controls/Popup/Manager/Popup#_focusIn
             * @param event
             */
            _focusIn: function(event){

            },

            /**
             * Обработчик потери фокуса.
             * @function Controls/Popup/Manager/Popup#_focusOut
             * @param event
             * @param focusedControl
             */
            _focusOut: function(event, focusedControl){
               if( this.isAutoHide() ){
                  var
                     opener = this.getOpener(),
                     parent = focusedControl.to;
                  while( !!parent ){
                     if( parent === opener || parent === this ){
                        return;
                     }
                     parent = parent.getParent();
                  }
                  this.close();
               }
            },

            /**
             * Обработчик нажатия на клавиши.
             * @function Controls/Popup/Manager/Popup#_keyPressed
             * @param event
             */
            _keyPressed: function(event){
               if( event.nativeEvent.keyCode === CoreConstants.key.esc ){
                  this.close();
               }
            },

            /**
             * Пересчитать позицию попапа
             * @function Controls/Popup/Manager/Popup#_recalcPosition
             */
            _recalcPosition: function(){
               CommandDispatcher.sendCommand(this, 'recalcPosition', this);
            }
         });

         return Popup;
      }
);