define(
   [
      'Controls/input'
   ],
   function(input) {
      'use strict';

      describe('Controls/input:CarriagePositionWhenFocus', function() {
         let inst;
         let positionChanged;
         beforeEach(function() {
            inst = new input.__CarriagePositionWhenFocus(() => {
               return positionChanged;
            });
         });
         it('Фокусировка поля по tab. После фокуса позиция каретки обновляется.', function() {
            positionChanged = true;
            assert.isTrue(inst.focusHandler());
            assert.isFalse(inst.focusHandler());
         });
         it('Фокусировка поля по tab. После фокуса позиция каретки не обновляется.', function() {
            positionChanged = false;
            assert.isFalse(inst.focusHandler());
            assert.isFalse(inst.focusHandler());
         });
         it('Фокусировка поля по tab. Смена режима с чтения на редактирование', function() {
            positionChanged = true;
            assert.isTrue(inst.focusHandler());
            inst.editingModeWasChanged(true, false);
            assert.isTrue(inst.focusHandler());
         });
         it('Фокусировка поля по tab. Смена режима с редактирования на чтение.', function() {
            positionChanged = true;
            assert.isTrue(inst.focusHandler());
            inst.editingModeWasChanged(false, true);
            assert.isFalse(inst.focusHandler());
         });
         it('Фокусировка поля по кнопке мыши. После фокуса позиция каретки обновляется.', function() {
            positionChanged = true;
            inst.mouseDownHandler();
            assert.isFalse(inst.focusHandler());
         });
         it('Фокусировка поля по кнопке мыши. После фокуса позиция каретки не обновляется.', function() {
            positionChanged = false;
            inst.mouseDownHandler();
            assert.isFalse(inst.focusHandler());
         });
      });
   }
);
