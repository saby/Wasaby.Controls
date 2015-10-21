/**
 * Created by as.avramenko on 01.04.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlace',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.EditInPlace',
      'js!SBIS3.CORE.CompoundActiveFixMixin',
      'js!SBIS3.CONTROLS.CompoundFocusMixin'
   ],
   function(Control, dotTplFn, CompoundActiveFixMixin, CompoundFocusMixin) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlace
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       */

      var
         CONTEXT_RECORD_FIELD = 'sbis3-controls-edit-in-place',
         EditInPlace = Control.extend([CompoundActiveFixMixin, CompoundFocusMixin], /** @lends SBIS3.CONTROLS.EditInPlace.prototype */ {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  columns: [],
                  focusCatch: undefined,
                  template: undefined,
                  applyOnFieldChange: true
               },
               _firstField: undefined
            },
            $constructor: function() {
               this._publish('onFieldChange');
               this._container.bind('keypress keydown', this._onKeyDown);
               this.subscribe('onChildControlFocusOut', this._onChildControlFocusOut);
            },
            _onChildControlFocusOut: function() {
               var
                  result,
                  difference = this._getRecordsDifference();
               if (difference.length) {
                  for (var idx = 0; idx < difference.length; idx++) {
                     result = this._notify('onFieldChange', difference[idx], this._editingRecord);
                     this._onFieldChange(result);
                  }
               }
            },
            /**
             * TODO Временное решение, функция используется для определения изменившихся полей
             * @private
             */
            _getRecordsDifference: function() {
               var
                  raw1 = this._record.getRaw(),
                  raw2 = this._editingRecord.getRaw(),
                  result = [];
               for (var field in raw1) {
                  if (raw1.hasOwnProperty(field)) {
                     if (raw1[field] != raw2[field]) {
                        result.push(field);
                     }
                  }
               }
               return result;
            },
            _onFieldChange: function(result) {
               var self = this;
               if (this._options.applyOnFieldChange) {
                  if (result instanceof $ws.proto.Deferred) {
                     result.addCallback(function () {
                        self._applyChanges();
                     });
                  } else {
                     this._applyChanges();
                  }
               }
            },
            _onKeyDown: function(e) {
               e.stopPropagation();
            },
            /**
             * Заполняем значениями отображаемую editInPlace область
             * @param record Record, из которого будут браться значения полей
             */
            updateFields: function(record) {
               var ctx = this.getContext();
               this._record = record;
               this._editingRecord = record.clone();
               ctx.setValue(CONTEXT_RECORD_FIELD, this._editingRecord)
            },
            canAcceptFocus: function () {
               return false;
            },
            /**
             * Сохранить значения полей области редактирования по месту
             */
            applyChanges: function() {
               this._deactivateActiveChildControl();
               this._applyChanges();
            },
            hide: function() {
               EditInPlace.superclass.hide.apply(this, arguments);
               this._deactivateActiveChildControl();
            },
            _deactivateActiveChildControl: function() {
               var activeChild = this.getActiveChildControl();
               activeChild && activeChild.setActive(false);
            },
            _applyChanges: function() {
               this._record.merge(this._editingRecord);
               //TODO: пока что merge сырой (и вообще наверно лучше не merge), пока что выполним сами, потом пусть record сам это делает
               this._record._fieldsCache = {};
               this._record._notify('onChange');
            },
            focusCatch: function(event) {
               if (typeof this._options.focusCatch === 'function') {
                  this._options.focusCatch(event);
               }
            },
            destroy: function() {
               this._container.unbind('keypress keydown');
               EditInPlace.superclass.destroy.call(this);
            }
         });

      return EditInPlace;
   });
