/**
 * Created by as.avramenko on 01.04.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlace',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.TextBox',
      'js!SBIS3.CONTROLS.CheckBox',
      'js!SBIS3.CONTROLS.ComboBox',
      'html!SBIS3.CONTROLS.EditInPlace',
      'css!SBIS3.CONTROLS.EditInPlace'
   ],
   function(Control, TextBox, CheckBox, ComboBox, dotTplFn) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlace
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       */

      var
         isMobileBrowser = $ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid,

         EditInPlace = Control.extend( /** @lends SBIS3.CONTROLS.EditInPlace.prototype */ {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  columns: []
               },
               _firstField: undefined,
               _fields: {}
            },
            $constructor: function() {
               var childControls;
               this._publish('onMouseDown');
               this._container
                  .bind(isMobileBrowser ? 'touchend' : 'mouseup', this._onMouseDownArea.bind(this));
               this.once('onReady', function() {
                  childControls = this.getChildControls();
                  if (childControls.length) {
                     this._firstField = childControls[0].getName();
                     $ws.helpers.forEach(childControls, function (ctrl) {
                        this._fields[ctrl.getName()] = ctrl;
                     }, this);
                  }
               });
            },
            /**
             * Активирует первый контрол редактирования по месту
             */
            activateFirstField: function() {
               this._fields[this._firstField].setActive(true);
            },
            /**
             * Заполняем значениями отображаемую editInPlace область
             * @param record Record, из которого будут браться значения полей
             */
            updateFields: function(record) {
               var items = [];
               this._record = record;
               $ws.helpers.forEach(this._fields, function(field) {
                  if (field instanceof ComboBox) {
                     //todo избавиться от record.getType(field.getName()).s (получение всех возможных значений перечисляемого поля)
                     $ws.helpers.forEach(record.getType(field.getName()).s, function(value, key) {
                        items.push({ title: value, id: key })
                     });
                     field.setItems(items);
                     field.setText(record.get(field.getName()));
                  } else {
                     field[field instanceof CheckBox ? 'setChecked' : field instanceof TextBox ? 'setText' : 'setValue'](record.get(field.getName()));
                  }
               });
            },
            /**
             * Сохранить значения полей области редактирования по месту
             */
            applyChanges: function() {
               $ws.helpers.forEach(this._fields, function(field, name) {
                  this._record.set(name, field instanceof TextBox ? field.getText() : field.getValue());
               }, this);
            },
            /**
             * Обработчик нажатия мыши над областью EditInPlace
             * @param {Object} event jQuery event
             * @private
             */
            _onMouseDownArea: function(event) {
               this._notify('onMouseDown', $(event.target));
               event.stopImmediatePropagation();
            },
            destroy: function() {
               this._container.unbind(isMobileBrowser ? 'touchend' : 'mouseup');
               EditInPlace.superclass.destroy.call(this);
            }

         });

      return EditInPlace;

   });
