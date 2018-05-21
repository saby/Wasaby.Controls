define('Controls/List/EditInPlace', [
   'Core/Control',
   'tmpl!Controls/List/EditInPlace/EditInPlace',
   'Core/Deferred',
   'WS.Data/Entity/Record',
   'WS.Data/Display/CollectionItem',
   'Controls/List/resources/utils/ItemsUtil'
], function(Control, template, Deferred, Record, CollectionItem, ItemsUtil) {

   var
      ItemEditResult = { // Возможные результаты события "onItemEdit"
         CANCEL: 'Cancel' // Отменить начало редактирования/добавления
      },
      ItemEndEditResult = { // Возможные результаты события "onItemEndEdit"
         CANCEL: 'Cancel' // Отменить завершение редактирования/добавления
      },
      _private = {
         editItem: function(self, options, isAdd) {
            var result = self._notify(isAdd ? 'beforeItemAdd' : 'beforeItemEdit', [options]);
            if (!isAdd) {
               self._originalItem = options.item;
            }
            return _private.processBeforeItemEditResult(self, options, result, isAdd);
         },

         afterItemEdit: function(self, options, isAdd) {
            self._editingItem = options.item.clone();
            self._notify('afterItemEdit', [options.item, isAdd]);
            self._setEditingItemData(self._editingItem, self._options.listModel);

            return options;
         },

         processBeforeItemEditResult: function(self, options, eventResult, isAdd) {
            var result;

            if (eventResult === ItemEditResult.CANCEL) {
               result = Deferred.fail(options);
            } else if (eventResult instanceof Deferred) {
               self._notify('showIndicator', [], { bubbling: true });
               eventResult.addBoth(function(result) {
                  self._notify('hideIndicator', [], { bubbling: true });
                  return result;
               });
               result = eventResult;
            } else if ((eventResult && eventResult.item instanceof Record) || (options && options.item instanceof Record)) {
               result = Deferred.success(eventResult || options);
            } else if (isAdd) {
               result = _private.createModel(self, eventResult || options);
            }

            return result;
         },

         endItemEdit: function(self, commit) {
         //Чтобы при первом старте редактирования не летели лишние события
            if (!self._editingItem) {
               return Deferred.success();
            }

            var result = self._notify('beforeItemEndEdit', [self._editingItem, commit, self._isAdd]);

            if (result === ItemEndEditResult.CANCEL) {
               return Deferred.fail();
            }
            if (result instanceof Deferred) {
            //Если мы попали сюда, то прикладники сами сохраняют запись
               return result.addCallback(function() {
                  _private.afterItemEndEdit(self);
               });
            }

            return _private.updateModel(self, commit).addCallback(function() {
               _private.afterItemEndEdit(self);
            });
         },

         afterItemEndEdit: function(self) {
         //Это событие всплывает, т.к. прикладники после завершения сохранения могут захотеть показать кнопку "+Запись" (по стандарту при старте добавления она скрывается)
            self._notify('afterItemEndEdit', [self._originalItem, self._isAdd]);
            _private.resetVariables(self);
            self._setEditingItemData(null, self._options.listModel);
         },

         createModel: function(self, options) {
            return self._options.source.create().addCallback(function(item) {
               options.item = item;
               return options;
            });
         },

         updateModel: function(self, commit) {
            if (commit) {
               if (self._options.source) {
                  return self._options.source.update(self._editingItem).addCallback(function() {
                     _private.acceptChanges(self);
                  });
               } else {
                  _private.acceptChanges(self);
               }
            }

            return Deferred.success();
         },

         acceptChanges: function(self) {
            if (self._isAdd) {
               self._options.listModel.appendItems([self._editingItem]);
            } else {
               self._originalItem.merge(self._editingItem);
            }
         },

         resetVariables: function(self) {
            self._originalItem = null;
            self._editingItem = null;
            self._isAdd = null;
         },

         validate: function(self) {
            return self._children.formController.submit();
         },

         editNextRow: function(self, editNextRow) {
            var index = _private.getEditingItemIndex(self, self._editingItem, self._options.listModel);

            if (editNextRow) {
               if (index < self._options.listModel.getCount() - 1) {
                  self.editItem({
                     item: self._options.listModel.at(index + 1).getContents()
                  });
               } else if (self._options.editingConfig && self._options.editingConfig.autoAdd) {
                  self.addItem();
               } else {
                  self.commitEdit();
               }
            } else {
               if (index > 0) {
                  self.editItem({
                     item: self._options.listModel.at(index - 1).getContents()
                  });
               } else {
                  self.commitEdit();
               }
            }
         },

         getEditingItemIndex: function(self, editingItem, listModel) {
            var
               index = listModel.getCount(),
               originalItem = listModel.getItemById(ItemsUtil.getPropertyValue(editingItem, listModel._options.keyProperty), listModel._options.keyProperty);

            if (originalItem) {
               index = listModel.getIndexBySourceItem(originalItem.getContents());
            }

            return index;
         }
      };

   var EditInPlace = Control.extend({
      _template: template,

      /**
       * @class Controls/List/EditInPlace
       * @author Зайцев А.С.
       * @public
       */

      /**
       * @typedef {Object} ItemEditOptions
       * @param {WS.Data/Entity/Record} [options.item] Record with initial data.
       */

      /**
       * @typedef {String|WS.Data/Entity/Record|Core/Deferred} ItemEditResult
       * @variant {String} Cancel Cancel start of editing.
       * @variant {ItemEditOptions} options Options of editing.
       * @variant {Core/Deferred} Deferred Deferred is used for asynchronous preparation of edited record. It is necessary to fullfill deferred with a record which will be opened for editing.
       */

      /**
       * @typedef {String|Core/Deferred} ItemEndEditResult
       * @variant {String} Cancel Cancel ending of editing\adding.
       * @variant {Core/Deferred} Deferred Deferred is used for saving with custom logic.
       */

      /**
       * @typedef {Object} AddItemOptions
       * @param {WS.Data/Entity/Record} [options.item] Record with initial data.
       */

      /**
       * @typedef {String|Core/Deferred|AddItemOptions} AddItemResult
       * @variant {String} Cancel Cancel start of adding.
       * @variant {AddItemOptions} Options of adding.
       * @variant {Core/Deferred} Deferred Deferred is used for asynchronous preparation of adding record. It is necessary to fullfill deferred with options of adding.
       */

      /**
       * @event Controls/List/EditInPlace#beforeItemEdit Happens before start of editing.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {ItemEditOptions} item Options of editing.
       * @returns {BeforeItemEditResult}
       */

      /**
       * @event Controls/List/EditInPlace#beforeItemAdd Happens before start of adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {AddItemOptions} Options of adding.
       * @returns {AddItemResult}
       */

      /**
       * @event Controls/List/EditInPlace#afterItemEdit Happens after start of editing\adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {WS.Data/Entity/Record} item Editing record.
       * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
       */

      /**
       * @event Controls/List/EditInPlace#beforeItemEndEdit Happens before the end of editing\adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {Boolean} commit If it is true editing ends with saving.
       * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
       * @returns {ItemEndEditResult}
       */

      /**
       * @event Controls/List/EditInPlace#afterItemEndEdit Happens after the end of editing\adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {WS.Data/Entity/Record} item Editing record.
       * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
       */

      _beforeMount: function(newOptions) {
         if (newOptions.editingConfig) {
            if (newOptions.editingConfig.item) {
               this._editingItem = newOptions.editingConfig.item;
               this._setEditingItemData(this._editingItem, newOptions.listModel);
               if (!this._isAdd) {
                  this._originalItem = newOptions.listModel.getItemById(this._editingItem.get(newOptions.listModel._options.keyProperty), newOptions.listModel._options.keyProperty).getContents();
               }
            }
         }
      },

      /**
       * Starts editing in place.
       * @variant {ItemEditOptions} options Options of editing.
       * @returns {Core/Deferred}
       */
      //TODO: управлять индикатором загрузки
      editItem: function(options) {
         var self = this,
            editingItemIndex = _private.getEditingItemIndex(this, this._editingItem, this._options.listModel),
            currentItemIndex = this._options.listModel.getIndexBySourceItem(options.item);

         if (editingItemIndex !== currentItemIndex) {
            return this.commitEdit().addCallback(function() {
               return _private.editItem(self, options).addCallback(function(newOptions) {
                  return _private.afterItemEdit(self, newOptions);
               });
            });
         }
      },

      /**
       * Starts adding.
       * @param {AddItemOptions} options Options of adding.
       * @returns {Core/Deferred}
       */
      //TODO: управлять индикатором загрузки
      addItem: function(options) {
         var self = this;
         return this.commitEdit().addCallback(function() {
            return _private.editItem(self, options || {}, true).addCallback(function(newOptions) {
               return _private.afterItemEdit(self, newOptions, true);
            });
         });
      },

      /**
       * Ends editing in place with saving.
       * @returns {Core/Deferred}
       */
      commitEdit: function() {
         var self = this;

         return _private.validate(this).addCallback(function(result) {
            for (var key in result) {
               if (result.hasOwnProperty(key) && result[key]) {
                  return Deferred.fail();
               }
            }
            return _private.endItemEdit(self, true);
         });
      },

      /**
       * Ends editing in place without saving.
       * @returns {Core/Deferred}
       */
      cancelEdit: function() {
         return _private.endItemEdit(this, false);
      },

      _onKeyDown: function(e) {
         if (this._editingItem) {
            switch (e.nativeEvent.keyCode) {
               case 13: //Enter
                  if (this._options.editingConfig && this._options.editingConfig.singleEdit) {
                     this.commitEdit();
                  } else {
                     _private.editNextRow(this, true);
                  }
                  break;
               case 27: //Esc
                  this.cancelEdit();
                  break;
            }
         }
      },

      _onItemClick: function(e, record) {
         if (this._options.editingConfig && this._options.editingConfig.editOnClick) {
            this.editItem({
               item: record
            });
         }
      },

      _setEditingItemData: function(item, listModel) {
         if (!item) {
            listModel._setEditingItemData(null);
            this._editingItemData = null;
            return;
         }
         var index = _private.getEditingItemIndex(this, item, listModel);
         this._isAdd = index === listModel.getCount();
         this._editingItemProjection = this._isAdd
            ? new CollectionItem({ contents: this._editingItem })
            : listModel.getItemById(ItemsUtil.getPropertyValue(this._editingItem, listModel._options.keyProperty), listModel._options.keyProperty);
         this._editingItemData = {
            getPropValue: ItemsUtil.getPropertyValue,
            keyProperty: listModel._options.keyProperty,
            displayProperty: listModel._options.displayProperty,
            index: this._isAdd ? listModel.getCount() : index,
            item: this._editingItem,
            dispItem: this._editingItemProjection,
            isEditing: true,
            isSelected: !listModel._markedItem,
            key: ItemsUtil.getPropertyValue(this._editingItemProjection.getContents(), listModel._options.keyProperty)
         };
         listModel._setEditingItemData(this._editingItemData);
      },

      _onRowDeactivated: function(e, eventOptions) {
         if (eventOptions.isTabPressed) {
            _private.editNextRow(this, !eventOptions.isShiftKey);
         }
         e.stopPropagation();
      },

      _beforeUnmount: function() {
         _private.resetVariables(this);
      }
   });

   return EditInPlace;
});
