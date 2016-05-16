define('js!SBIS3.CONTROLS.SuggestTextBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.SuggestMixin',
   'js!SBIS3.CONTROLS.ChooserMixin',
   'js!SBIS3.CONTROLS.Utils.KbLayoutRevertUtil'
], function (TextBox, PickerMixin, SuggestMixin, ChooserMixin, KbLayoutRevertUtil) {
   'use strict';

   function stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
   }

   /**
    * Поле ввода с автодополнением
    * @class SBIS3.CONTROLS.SuggestTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.SuggestMixin
    * @mixes SBIS3.CONTROLS.ChooserMixin
    * @control
    * @public
    * @category Inputs
    * @demo SBIS3.CONTROLS.Demo.MySuggestTextBox Поле ввода с автодополнением
    * @author Алексей Мальцев
    */
   var SuggestTextBox = TextBox.extend([PickerMixin, SuggestMixin, ChooserMixin], /** @lends SBIS3.CONTROLS.SuggestTextBox.prototype */ {
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
               if(data.getMetaData()['Switched']) {
                  self.setText(KbLayoutRevertUtil.process(self.getText()));
               }
            });
         });

      },

      _getLoadingContainer : function() {
         return this.getContainer().find('.controls-TextBox__fieldWrapper');
      },

      /**
       * Блочим события поднятия служебных клавиш,
       * нужно в основном при использовании в редактировании по месту
       * @param e
       * @private
       */
      _keyUpBind: function(e) {
         SuggestTextBox.superclass._keyUpBind.apply(this, arguments);
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
      },

      _chooseCallback: function(result) {
         if(result && $ws.helpers.instanceOfModule(result[0], 'SBIS3.CONTROLS.Data.Model')) {
            var item = result[0];
            this._onListItemSelect(item.getId(), item);
         }
      },

      setListFilter: function(filter) {
         SuggestTextBox.superclass.setListFilter.call(this, filter, !this._changedByKeyboard);
      },

      // FIXME костыль до перехода на пикера по фокусную систему
      _inputFocusInHandler: function() {
         SuggestTextBox.superclass._inputFocusInHandler.apply(this, arguments);
         this._observableControlFocusHandler();
      },

      _keyDownBind: function(e) {
         SuggestTextBox.superclass._keyDownBind.apply(this, arguments);

         /* Запрещаем всплытие enter по событию keyDown,
            т.к. Area тоже его слушает и закрывает floatArea */
         if(e.which === $ws._const.key.enter && this.isPickerVisible()) {
            stopEvent(e);
         } else {
            this._changedByKeyboard = true;
         }
      }
   });

   return SuggestTextBox;
});
