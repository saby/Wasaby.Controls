/**
 * Created by as.suhoruchkin on 15.10.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceClickController',
   [
      'js!SBIS3.CONTROLS.EditInPlaceBaseController',
      'js!SBIS3.CONTROLS.EditInPlace'
   ],
   function (EditInPlaceBaseController, EditInPlace) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlaceClickController
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       */

      var
         EditInPlaceClickController = EditInPlaceBaseController.extend(/** @lends SBIS3.CONTROLS.EditInPlaceClickController.prototype */ {
            $protected: {
               _options: {
                  template: undefined
               },
               _area: undefined,
               _editing: false
            },
            $constructor: function() {
               this._area = this._initArea();
            },
            _initArea: function() {
               var self = this;
               return {
                  editInPlace: new EditInPlace({
                     template: this._options.template,
                     columns: this._options.columns,
                     element: $('<div>'),
                     ignoreFirstColumn: this._options.ignoreFirstColumn,
                     context: this._getContextForArea(),
                     focusCatch: this._focusCatch.bind(this),
                     parent: this,
                     handlers: {
                        onChildFocusOut: this._onChildFocusOut.bind(this),
                        onFieldChange: function(event, fieldName, record) {
                           event.setResult(self._notify('onFieldChange', fieldName, record));
                        }
                     }
                  }),
                  record: null,
                  target: null
               };
            },
            isEditing: function () {
               return this._area && this._area.isVisible();
            },
            _onChildFocusOut: function () {
               this.finishEditing(true);
            },
            showEditing: function (target, data) {
               if (this._editing) {
                  this.finishEditing(true);
               }

               this._area.target = target;
               this._area.record = data;
               this._area.editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
               this._updateArea(this._area);
            },
            finishEditing: function (saveFields, notHide) {
               var
                  self = this,
                  result,
                  syncDataSource = function () {
                     self._options.dataSource.sync(self._options.dataSet);
                  };
               this._area.target.show();
               this._editing = false;
               if (!notHide) {
                  this._area.editInPlace.hide();
                  this._area.editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
               }
               if (saveFields) {
                  result = this._area.editInPlace.applyChanges();
                  if (result instanceof $ws.proto.Deferred) {
                     result.addCallback(function () {
                        syncDataSource();
                     });
                     return result;
                  }
                  syncDataSource();
               }
            },
            _updateArea: function (area) {
               EditInPlaceClickController.superclass._updateArea.apply(this, arguments);
               area.editInPlace.activateFirstControl();
            },
            _editAnotherRow: function (newTarget) {
               this._area.target = newTarget;
               newTarget.hide();
               this._area.record = this._options.dataSet.getRecordByKey(newTarget.data('id'));
               this._updateArea(this._area);
            }
         });

      return EditInPlaceClickController;
   });