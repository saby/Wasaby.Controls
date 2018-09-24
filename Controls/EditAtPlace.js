define('Controls/EditAtPlace', [
   'Core/Control',
   'Core/Deferred',
   'wml!Controls/EditAtPlace/EditAtPlace',
   'css!Controls/EditAtPlace/EditAtPlace',
   'css!Controls/List/EditInPlace/Text'
], function(
   Control,
   Deferred,
   template
) {
   'use strict';
   var
      EditResult = {
         CANCEL: 'Cancel' // Undo start editing
      },
      EndEditResult = {
         CANCEL: 'Cancel' // Undo completion of editing
      },
      _private = {
         validate: function(self) {
            return self._children.formController.submit();
         },
         afterEndEdit: function(self, commit) {
            if (commit) {
               self._editObject.acceptChanges();
            } else {
               self._editObject.rejectChanges();
            }
            self._isEditing = false;
            self._notify('afterEndEdit', [self._editObject], { bubbling: true });
            return Deferred.success();
         },
         endEdit: function(self, commit) {
            var result = self._notify('beforeEndEdit', [self._editObject, commit], { bubbling: true });

            if (result === EndEditResult.CANCEL) {
               return Deferred.success();
            }

            if (result instanceof Deferred) {
               return result.addCallback(function() {
                  return _private.afterEndEdit(self, commit);
               });
            }

            return _private.afterEndEdit(self, commit);
         }
      };

   /**
    * Controller for editing of input fields.
    *
    * @class Controls/List/EditAtPlace
    * @extends Core/Control
    * @mixes Controls/interface/IEditAtPlace
    * @author Зайцев А.С.
    * @public
    */

   var EditAtPlace = Control.extend(/** @lends Controls/List/EditAtPlace.prototype */{
      _template: template,
      _isEditing: false,

      _beforeMount: function(newOptions) {
         this._isEditing = newOptions.editWhenFirstRendered;
         this._editObject = newOptions.editObject.clone();
      },

      _beforeUpdate: function(newOptions) {
         if (this._options.editObject !== newOptions.editObject) {
            this._editObject = newOptions.editObject.clone();
         }
      },

      _afterUpdate: function() {
         if (this._startEditTarget) {
            // search closest input and focus
            this._startEditTarget.getElementsByTagName('input')[0].focus();
            this._startEditTarget = null;
         }
      },

      _onClickHandler: function(event) {
         if (!this._options.readOnly && !this._isEditing) {
            this.startEdit(event);
         }
      },

      _onDeactivatedHandler: function() {
         if (!this._options.readOnly && this._isEditing) {
            this.commitEdit();
         }
      },

      _onKeyDown: function(event) {
         if (this._isEditing) {
            switch (event.nativeEvent.keyCode) {
               case 13: // Enter
                  this.commitEdit();
                  break;
               case 27: // Esc
                  this.cancelEdit();
                  break;
            }
         }
      },

      startEdit: function(event) {
         var result = this._notify('beforeEdit', [this._editObject], {
            bubbling: true
         });
         if (result !== EditResult.CANCEL) {
            this._isEditing = true;
            this._startEditTarget = event.target.closest('.controls-EditAtPlaceV__editorWrapper');
         }
      },

      cancelEdit: function() {
         return _private.endEdit(this, false);
      },

      commitEdit: function() {
         var self = this;
         return _private.validate(this).addCallback(function(result) {
            for (var key in result) {
               if (result.hasOwnProperty(key) && result[key]) {
                  return Deferred.success();
               }
            }
            return _private.endEdit(self, true);
         });
      }
   });

   return EditAtPlace;
});
