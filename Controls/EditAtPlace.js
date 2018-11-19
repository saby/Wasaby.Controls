define('Controls/EditAtPlace', [
   'Core/Control',
   'Core/Deferred',
   'wml!Controls/EditAtPlace/EditAtPlace',
   'css!theme?Controls/EditAtPlace/EditAtPlace',
   'css!theme?Controls/List/EditInPlace/Text'
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
            if (!commit) {
               _private.rejectChanges(self);
            }
            self._isEditing = false;
            self._notify('afterEndEdit', [self._options.editObject], { bubbling: true });
            return Deferred.success();
         },
         endEdit: function(self, commit) {
            var result = self._notify('beforeEndEdit', [self._options.editObject, commit], { bubbling: true });

            if (result === EndEditResult.CANCEL) {
               return Deferred.success();
            }

            if (result instanceof Deferred) {
               return result.addCallback(function() {
                  return _private.afterEndEdit(self, commit);
               });
            }

            return _private.afterEndEdit(self, commit);
         },
         rejectChanges: function(self) {
            /*
             * TL;DR: we should never change the state of the record and leave it to the owner.
             *
             * EditAtPlace should never call neither acceptChanges() nor rejectChanges() because of the following problems:
             *
             * 1) acceptChanges breaks change detection. If we call acceptChanges then the owner of the record has no easy
             * way to know if the record has changed, because isChanged() will return an empty array.
             *
             * 2) rejectChanges() doesn't work if nobody calls acceptChanges() between commits. For example, this scenario
             * wouldn't work: start editing - make changes - commit - start editing again - make changes - cancel. If
             * acceptChanges() is never called then rejectChanges() will revert everything, not just changes made since last commit.
             */
            var changedFields = self._options.editObject.getChanged();
            if (changedFields) {
               changedFields.forEach(function(field) {
                  self._options.editObject.set(field, self._oldEditObject.get(field));
               });
            }
         }
      };

   /**
    * Controller for editing of input fields.
    * <a href="/materials/demo-ws4-edit-at-place">Demo</a>.
    *
    * @class Controls/EditAtPlace
    * @extends Core/Control
    * @mixes Controls/interface/IEditAtPlace
    * @author Зайцев А.С.
    * @public
    *
    * @demo Controls-demo/EditAtPlace/EditAtPlacePG
    */

   var EditAtPlace = Control.extend(/** @lends Controls/List/EditAtPlace.prototype */{
      _template: template,
      _isEditing: false,

      _beforeMount: function(newOptions) {
         this._isEditing = newOptions.editWhenFirstRendered;
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
         var result = this._notify('beforeEdit', [this._options.editObject], {
            bubbling: true
         });
         if (result !== EditResult.CANCEL) {
            this._isEditing = true;
            this._oldEditObject = this._options.editObject.clone();
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
