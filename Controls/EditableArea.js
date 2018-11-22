define('Controls/EditableArea', [
   'Core/Control',
   'Core/Deferred',
   'Controls/EditableArea/Constants',
   'wml!Controls/EditableArea/EditableArea',
   'css!theme?Controls/EditableArea/EditableArea',
   'css!theme?Controls/List/EditInPlace/Text'
], function(
   Control,
   Deferred,
   EditConstants,
   template
) {
   'use strict';
   var
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

            if (result === EditConstants.CANCEL) {
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
             * EditableArea should never call neither acceptChanges() nor rejectChanges() because of the following problems:
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
    * <a href="/materials/demo-ws4-editable-area">Demo</a>.
    *
    * @class Controls/EditableArea
    * @extends Core/Control
    * @mixes Controls/interface/IEditableArea
    * @author Зайцев А.С.
    * @public
    *
    * @demo Controls-demo/EditableArea/EditableAreaPG
    */

   var EditableArea = Control.extend(/** @lends Controls/List/EditableArea.prototype */{
      _template: template,
      _isEditing: false,

      _beforeMount: function(newOptions) {
         this._isEditing = newOptions.editWhenFirstRendered;
      },

      _afterUpdate: function() {
         if (this._beginEditTarget) {
            // search closest input and focus
            this._beginEditTarget.getElementsByTagName('input')[0].focus();
            this._beginEditTarget = null;
         }
      },

      _onClickHandler: function(event) {
         if (!this._options.readOnly && !this._isEditing) {
            this.beginEdit(event);
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

      beginEdit: function(event, res) {
         // TODO: res - это результат события со старым названием. Снести вместе со старым контролом 3.19.110, как только появится веха
         var result = res || this._notify('beforeBeginEdit', [this._options.editObject], {
            bubbling: true
         });
         if (result !== EditConstants.CANCEL) {
            this._isEditing = true;
            this._oldEditObject = this._options.editObject.clone();
            this._beginEditTarget = event.target.closest('.controls-EditableArea__editorWrapper');
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

   EditableArea.getDefaultOptions = function() {
      return {
         style: 'withoutBackground'
      };
   };

   return EditableArea;
});
