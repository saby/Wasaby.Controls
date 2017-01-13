/**
 * Created by am.gerasimov on 08.06.2016.
 */
define('js!SBIS3.CONTROLS.SuggestTextBoxMixin', [
   "Core/constants",
   "js!SBIS3.CONTROLS.Utils.KbLayoutRevertUtil",
   "Core/core-instance"
], function ( constants,KbLayoutRevertUtil, cInstace) {
   'use strict';

   function stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
   }

   var SuggestTextBoxMixin = {
      $protected: {
         _changedByKeyboard: false,  /* {Boolean} Флаг, обозначающий, что изменения были вызваны действиями с клавиатуры */
         /* Т.к. при выборе из списка, фокус может находиться на нём, а не на поле ввода,
            то обрабатывать клавиатурные события надо на списке. Но надо учитывать,
            что список находится в body, а блокировать всплытие события надо на уровне поля ввода,
            поэтому запоминаем, что выбор был произвёден, когда фокус был на списке, чтобы потом заблокировать всплытие события. */
         _selectedFromList: false
      },
      $constructor: function () {
         var self = this;

         this._options.observableControls.unshift(this);

         this.once('onListReady', function(e, list) {
            self.subscribeTo(list, 'onKeyPressed', function (event, jqEvent) {
               if(jqEvent.which === constants.key.enter) {
                  self._selectedFromList = true;
               }
            });
         });
      },
      _getLoadingContainer : function() {
         return this.getContainer().find('.controls-TextBox__fieldWrapper');
      },

      _chooseCallback: function(result) {
         if(result && cInstace.instanceOfModule(result[0], 'WS.Data/Entity/Model')) {
            var item = result[0];
            this._onListItemSelect(item.getId(), item);
         }
      },

      before: {
         _setTextByKeyboard: function () {
            /* Этот флаг надо выставлять только когда текст изменён с клавиатуры,
               чтобы при изменнии текста из контекста не вызывался поиск в автодополнении */
            this._changedByKeyboard = true;
         }
      },


      after: {
         _keyDownBind: function(e) {
            /* Запрещаем всплытие enter и esc по событию keyDown,
               т.к. Area тоже его слушает и закрывает floatArea */
            if((e.which === constants.key.enter || e.which === constants.key.esc) && this.isPickerVisible()) {
               stopEvent(e);
            }
         },

         // FIXME костыль до перехода на пикера по фокусную систему
         _inputFocusInHandler: function() {
            this._observableControlFocusHandler();
         },
         /**
          * Блочим события поднятия служебных клавиш,
          * нужно в основном при использовании в редактировании по месту
          * @param e
          * @private
          */
         _keyUpBind: function(e) {
            var isPickerVisible = this.isPickerVisible();

            switch (e.which) {
               /* Чтобы нормально работала навигация стрелками и не случалось ничего лишнего,
                то запретим всплытие события */
               case constants.key.down:
               case constants.key.up:
               case constants.key.enter:
                  if(isPickerVisible || this._selectedFromList) {
                     stopEvent(e);
                  }

                  this._selectedFromList = false;

                  if(isPickerVisible) {
                     var list = this.getList();
                     list._keyboardHover(e);
                  }
                  break;
               case constants.key.esc:
                  if(isPickerVisible) {
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
            var isChildControl = false,
                list = this._list;

            /* Рекурсивный поиск списка, чтобы автодополнение не закрывалось,
               когда фокус уходит на компонент, который был открыт из автодополнения. */
            function isSuggestParent(target) {
               do {
                  target = target.getParent() || target.getOpener();
               }
               while (target && target !== list);

               return target === list;
            }

            /* focusedControl может не приходить при разрушении контрола */
            if(list && focusedControl) {
               isChildControl = isSuggestParent(focusedControl);

               if(!isChildControl) {
                  isChildControl = list.getChildControls(false, true, function(ctrl) {
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
         setListFilter: function(parentFunc, filter, silent) {
            parentFunc.call(this, filter, silent || !this._changedByKeyboard);
         }
      }
   };

   return SuggestTextBoxMixin;
});
