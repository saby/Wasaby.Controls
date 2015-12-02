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
                  onFieldChange: undefined,
                  template: undefined,
                  applyOnFieldChange: true,
                  visible: false
               },
               _record: undefined,
               _target: null,
               _editing: false,
               _editingRecord: undefined,
               _previousRecordState: undefined,
               _editingDeferred: undefined
            },
            init: function() {
               EditInPlace.superclass.init.apply(this, arguments);
               this._container.bind('keypress keydown', this._onKeyDown);
               if (this._options.onFieldChange) {
                  this.subscribe('onChildControlFocusOut', this._onChildControlFocusOut);
               }
            },
            _onChildControlFocusOut: function() {
               var
                  result,
                  difference = this._getRecordsDifference(),
                  loadingIndicator;
               if (difference.length) {
                  result = this._options.onFieldChange(difference, this._editingRecord);
                  if (result instanceof $ws.proto.Deferred) {
                     loadingIndicator = setTimeout(function () {
                        $ws.helpers.toggleIndicator(true);
                     }, 100);
                     this._editingDeferred = result.addBoth(function () {
                        clearTimeout(loadingIndicator);
                        this._previousRecordState = this._editingRecord.clone();
                        $ws.helpers.toggleIndicator(false);
                     }.bind(this));
                  } else {
                     this._previousRecordState = this._editingRecord.clone()
                  }
               }
            },
            /**
             * TODO Сухоручкин, Авраменко, Мальцев. Функция используется для определения изменившихся полей, скорее всего она тут не нужна (это метод рекорда)
             * @private
             */
            _getRecordsDifference: function() {
               var
                  raw1 = this._editingRecord.getRaw(),
                  raw2 = this._previousRecordState.getRaw(),
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
            _getElementToFocus: function() {
              return this._container; //Переопределяю метод getElementToFocus для того, чтобы не создавался fake focus div
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
               this._previousRecordState = record.clone();
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
               return (this._editingDeferred || $ws.proto.Deferred.success()).addCallback(function() {
                  this._record.merge(this._editingRecord);
               }.bind(this))
            },
            show: function(target, record) {
               //set record
               this._record = record;
               this.getContainer().attr('data-id', record.getKey());
               this.updateFields(record);
               //set target
               this._target = target;
               this.getContainer().insertAfter(target);
               this._target.hide();
               EditInPlace.superclass.show.apply(this, arguments);
            },
            hide: function() {
               this._deactivateActiveChildControl();
               this.setActive(false);
               EditInPlace.superclass.hide.apply(this, arguments);
               if (this._target) {
                  this._target.show();
               }
            },
            edit: function(target, record) {
               this.show(target, record);
               this._editing = true;
               this.activateFirstControl();
            },
            isEdit: function() {
               return this._editing;
            },
            endEdit: function() {
               this._editing = false;
            },
            getRecord: function() {
               return this._record;
            },
            getTarget: function() {
               return this._target;
            },
            _deactivateActiveChildControl: function() {
               var activeChild = this.getActiveChildControl();
               activeChild && activeChild.setActive(false);
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
