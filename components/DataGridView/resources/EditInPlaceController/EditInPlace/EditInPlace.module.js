/**
 * Created by as.avramenko on 01.04.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlace',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.EditInPlace',
      'css!SBIS3.CONTROLS.EditInPlace'
   ],
   function(Control, dotTplFn) {

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
                  columns: [],
                  focusCatch: undefined,
                  editFieldFocusHandler: undefined
               },
               _firstField: undefined,
               //Храним тут состояние того, что фокус потерян из-за скрытия компонента
               _lostFocusOnHide: false,
               _fields: {}
            },
            $constructor: function() {
               var
                  childControls,
                  self = this,
                  childFocusOut = function() {
                     var
                        result,
                        currentValue;
                     if (self.isVisible() && !self._lostFocusOnHide) {
                        currentValue = this[self._determineGetMethodName(this)]();
                        if (currentValue !== (self._editingRecord ? self._editingRecord : self._record).get(this.getName())) {
                           if (!self._editingRecord) {
                              self._editingRecord = self._record.clone();
                           }
                           self._editingRecord.set(this.getName(), currentValue);
                           result = self._notify('onValueChange', this.getName(), self._editingRecord);
                           if (result instanceof $ws.proto.Deferred) {
                              result.addCallback(function () {
                                 self._updateFieldsValues(self._editingRecord);
                                 self._applyChanges();
                              });
                           } else {
                              self._updateFieldsValues(self._editingRecord);
                              self._applyChanges();
                           }
                        }
                     }
                  },
                  childFocusIn = function() {
                     if (self.isVisible()) {
                        self._options.editFieldFocusHandler && self._options.editFieldFocusHandler(this);
                     }
                  };
               this._publish('onMouseDown', 'onValueChange');
               this._container
                  .bind(isMobileBrowser ? 'touchend' : 'mouseup', this._onMouseDownArea.bind(this))
                  .bind('keypress keydown', this._onKeyDown);
               this.once('onReady', function() {
                  childControls = this.getChildControls();
                  if (childControls.length) {
                     this._firstField = childControls[0].getName();
                     $ws.helpers.forEach(childControls, function (ctrl) {
                        this._fields[ctrl.getName()] = ctrl;
                        ctrl.subscribe('onFocusOut', childFocusOut);
                        ctrl.subscribe('onFocusIn', childFocusIn);
                     }, this);
                  }
               });
            },
            _onKeyDown: function(e) {
               e.stopPropagation();
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
               this._record = record;
               this._updateFieldsValues(record);
               if (this._editingRecord) {
                  this._editingRecord.destroy();
                  this._editingRecord = undefined;
               }
            },
            _updateFieldsValues: function(record, ignoreFields) {
               var
                  self = this,
                  items;
               $ws.helpers.forEach(this._fields, function(field) {
                  if (Object.prototype.toString.call(ignoreFields) !== '[object Object]' || !ignoreFields[field.getName()]) {
                     if ($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.ComboBox')) {
                        items = [];
                        //todo избавиться от record.getType(field.getName()).s (получение всех возможных значений перечисляемого поля)
                        $ws.helpers.forEach(record.getType(field.getName()).s, function (value, key) {
                           items.push({title: value, id: key})
                        });
                        field.setItems(items);
                        field.setSelectedKey(record.get(field.getName()));
                     } else {
                        if (record.getType(field.getName()) === 'Деньги' && $ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.NumberTextBox')) {
                           field.setDecimals(2);
                        }
                        field[self._determineSetMethodName(field)](record.get(field.getName()));
                     }
                  }
               });
            },
            /**
             * Сохранить значения полей области редактирования по месту
             */
            applyChanges: function() {
               var
                  self = this,
                  result,
                  record,
                  activeChild = this.getActiveChildControl(),
                  activeChildValue;
               if (activeChild) {
                  record  = this._editingRecord || this._record;
                  activeChildValue = activeChild[this._determineGetMethodName(activeChild)]();
                  if (record.get(activeChild.getName()) != activeChildValue) {
                     record.set(activeChild.getName(), activeChildValue);
                     result = self._notify('onValueChange', activeChild.getName(), record);
                     if (result instanceof $ws.proto.Deferred) {
                        result.addCallback(function () {
                           self._updateFieldsValues(record);
                           self._applyChanges();
                        });
                        return result;
                     }
                  }
                  self._updateFieldsValues(record);
                  self._applyChanges();
               }
            },
            _determineGetMethodName: function(field) {
               //todo избавиться от перебора методов для разных типов полей
               var methodName =
                  $ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.ComboBox') ? 'getSelectedKey' :
                     $ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.NumberTextBox') ? 'getNumericValue' :
                        $ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.TextBox') ? 'getText' :
                           'getValue';
               return methodName;
            },
            _determineSetMethodName: function(field) {
               //todo избавиться от перебора методов для разных типов полей
               var methodName =
                  $ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.CheckBox') ? 'setChecked' :
                     $ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.TextBox') ? 'setText' :
                        'setValue';
               return methodName;
            },
            hide: function() {
               var activeChild;
               if (this.isVisible()) {
                  activeChild = this.getActiveChildControl();
                  if (activeChild) {
                     this._lostFocusOnHide = true;
                     activeChild.setActive(false);
                     this._lostFocusOnHide = false;
                  }
               }
               EditInPlace.superclass.hide.apply(this, arguments);
            },
            _applyChanges: function() {
               $ws.helpers.forEach(this._fields, function(field, name) {
                  this._record.set(name, field[this._determineGetMethodName(field)]());
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
            focusCatch: function(event) {
               if (typeof this._options.focusCatch === 'function') {
                  this._options.focusCatch(event);
               }
            },
            destroy: function() {
               this._container
                  .unbind(isMobileBrowser ? 'touchend' : 'mouseup')
                  .unbind('keypress keydown');
               EditInPlace.superclass.destroy.call(this);
            }

         });

      return EditInPlace;

   });
