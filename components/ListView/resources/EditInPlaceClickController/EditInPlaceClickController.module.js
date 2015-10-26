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
            showEditing: function (target, record, isAdd) {
               var area,
                   validate;
               if (this._editing) {
                  validate = this.finishEditing(true);
               }
               if (this._options.addInPlaceButton && isAdd) {
                  this._options.addInPlaceButton.hide();
               }
               if (validate !== false) {
                  this._editing = true;
                  area = this._getEditingArea();
                  area.addInPlace = isAdd;
                  this._showArea(area, target, record, true);
                  area.target.addClass('controls-editInPlace__editing');
               }
            },
            destroy: function() {
               EditInPlaceClickController.superclass.destroy.apply(this, arguments);
               if (this._editing) {
                  this._area.editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
                  this._editing = null;
               }
               this._area.editInPlace.destroy();
               this._area = null;
            }
         });

      return EditInPlaceClickController;
   });