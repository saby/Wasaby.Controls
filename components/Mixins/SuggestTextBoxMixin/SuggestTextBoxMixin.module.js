/**
 * Created by am.gerasimov on 08.06.2016.
 */
define('js!SBIS3.CONTROLS.SuggestTextBoxMixin', ['js!SBIS3.CONTROLS.Utils.KbLayoutRevertUtil'], function (KbLayoutRevertUtil) {
   'use strict';

   function stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
   }

   var SuggestTextBoxMixin = {
      $protected: {
         _changedByKeyboard: false  /* {Boolean} Флаг, обозначающий, что изменения были вызваны действиями с клавиатуры */
      },
      $constructor: function () {
         var self = this;

         this._options.observableControls.unshift(this);
         this.getContainer().addClass('controls-SuggestTextBox');

         /* Проверяем на изменение раскладки */
         this.once('onListReady', function(e, list) {
            self.subscribeTo(list, 'onDataLoad', function(event, data) {
               if(KbLayoutRevertUtil.needRevert(data)) {
                  self.setText(KbLayoutRevertUtil.process(self.getText()));
               }
            });
         });

      },

      _getLoadingContainer : function() {
         return this.getContainer().find('.controls-TextBox__fieldWrapper');
      },

      _chooseCallback: function(result) {
         if(result && $ws.helpers.instanceOfModule(result[0], 'SBIS3.CONTROLS.Data.Model')) {
            var item = result[0];
            this._onListItemSelect(item.getId(), item);
         }
      },


      // FIXME костыль до перехода на пикера по фокусную систему
      _inputFocusInHandler: function() {
         this._observableControlFocusHandler();
      },

      after: {
         _keyDownBind: function(e) {
            /* Запрещаем всплытие enter по событию keyDown,
             т.к. Area тоже его слушает и закрывает floatArea */
            if(e.which === $ws._const.key.enter && this.isPickerVisible()) {
               stopEvent(e);
            } else {
               this._changedByKeyboard = true;
            }
         },
         /**
          * Блочим события поднятия служебных клавиш,
          * нужно в основном при использовании в редактировании по месту
          * @param e
          * @private
          */
         _keyUpBind: function(e) {
            switch (e.which) {
               /* Чтобы нормально работала навигация стрелками и не случалось ничего лишнего,
                то запретим всплытие события */
               case $ws._const.key.down:
               case $ws._const.key.up:
               case $ws._const.key.enter:
                  if(this.isPickerVisible()) {
                     this._list && this._list._keyboardHover(e);
                     stopEvent(e);
                  }
                  break;
               case $ws._const.key.esc:
                  if(this.isPickerVisible()) {
                     this.hidePicker();
                     stopEvent(e);
                  }
                  break;
            }
            this._changedByKeyboard = false;
         }
      },
      around: {
         /* Метод для проверки, куда ушёл фокус, т.к. попап до сих пор
          отслеживает клики, и, если фокус ушёл например по tab, то саггест не закроется +
          надо, чтобы правильно запускалась валидация */
         // FIXME костыль до перехода на пикера по фокусную систему
         _focusOutHandler: function(parentFunc, event, isDestroyed, focusedControl) {
            var isChildControl = false;

            /* focusedControl может не приходить при разрушении контрола */
            if(this._list && focusedControl) {
               isChildControl = (this._list === focusedControl) || (!isDestroyed && focusedControl.getOpener && this._list === focusedControl.getOpener());

               if(!isChildControl) {
                  isChildControl = this._list.getChildControls(false, true, function(ctrl) {
                     return focusedControl === ctrl;
                  }).length;
               }
            }

            if(!isChildControl) {
               this.hidePicker();
               parentFunc.apply(this, arguments);
            }
         },
         _setPickerConfig: function(parentFunc){
            var parentConfig = parentFunc.apply(this, arguments);
            parentConfig.tabindex = 0;
            return parentConfig;
         },
         setListFilter: function(parentFunc, filter) {
            parentFunc.call(this, filter, !this._changedByKeyboard);
         }
      }
   };

   return SuggestTextBoxMixin;
});
