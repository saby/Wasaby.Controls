define('Controls/List/EditInPlace', [
   'Core/Control',
   'wml!Controls/List/EditInPlace/EditInPlace',
   'Core/Deferred',
   'WS.Data/Entity/Record',
   'Controls/List/resources/utils/ItemsUtil',
   'Controls/Utils/getWidth',
   'Controls/Utils/hasHorizontalScroll',
   'css!Controls/List/EditInPlace/Text'
], function(Control, template, Deferred, Record, ItemsUtil, getWidthUtil, hasHorizontalScrollUtil) {

   var
      typographyStyles = [
         'fontFamily',
         'fontSize',
         'fontWeight',
         'fontStyle',
         'letterSpacing',
         'textTransform',
         'wordSpacing',
         'textIndent'
      ],
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
            self._notify('afterItemEdit', [self._editingItem, isAdd]);
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
            self._notify('afterItemEndEdit', [self._isAdd ? self._editingItem : self._originalItem, self._isAdd]);
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

   var EditInPlace = Control.extend(/** @lends Controls/List/EditInPlace */{
      _template: template,

      /**
       * @class Controls/List/EditInPlace
       * @extends Core/Control
       * @mixes Controls/interface/IEditInPlace
       * @author Зайцев А.С.
       * @public
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
      editItem: function(options) {
         var self = this;

         if (!this._editingItem || !this._editingItem.isEqual(options.item)) {
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

      _onItemClick: function(e, record, originalEvent) {
         if (this._options.editingConfig && this._options.editingConfig.editOnClick && !this._options.readOnly) {
            if (originalEvent.target.closest('.js-controls-ListView__notEditable')) {
               this.commitEdit();
            } else {
               this.editItem({
                  item: record
               });
               this._clickItemInfo = {
                  clientX: originalEvent.nativeEvent.clientX,
                  clientY: originalEvent.nativeEvent.clientY,
                  item: record
               };
            }
         }
      },

      _afterUpdate: function() {
         var target, fakeElement, targetStyle, offset, currentWidth, previousWidth, lastLetterWidth, hasHorizontalScroll;
         if (this._clickItemInfo && this._clickItemInfo.item === this._originalItem) {
            target = document.elementFromPoint(this._clickItemInfo.clientX, this._clickItemInfo.clientY);
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
               fakeElement = document.createElement('div');
               fakeElement.innerText = '';

               targetStyle = getComputedStyle(target);
               hasHorizontalScroll = hasHorizontalScrollUtil(target);

               /*
               Если элемент выравнивается по правому краю, но при этом влезает весь текст, то нужно рассчитывать положение
               курсора от правого края input'а, т.к. перед текстом может быть свободное место. Во всех остальных случаях
               нужно рассчитывать от левого края, т.к. текст гарантированно прижат к нему.
               */
               if (targetStyle.textAlign === 'right' && !hasHorizontalScroll) {
                  offset = target.getBoundingClientRect().right - this._clickItemInfo.clientX;
               } else {
                  offset = this._clickItemInfo.clientX - target.getBoundingClientRect().left;
               }
               typographyStyles.forEach(function(prop) {
                  fakeElement.style[prop] = targetStyle[prop];
               });

               for (var i = 0; i < target.value.length; i++) {
                  currentWidth = getWidthUtil.getWidth(fakeElement);
                  if (currentWidth > offset) {
                     break;
                  }
                  if (targetStyle.textAlign === 'right' && !hasHorizontalScroll) {
                     fakeElement.innerText = target.value.slice(target.value.length - 1 - i);
                  } else {
                     fakeElement.innerText += target.value[i];
                  }
                  previousWidth = currentWidth;
               }

               //EditingRow в afterMount делает this.activate(), чтобы при переходах по табу фокус вставал в поля ввода.
               //Т.е. если не звать focus(), то фокус может находиться в другом поле ввода.
               target.focus();

               lastLetterWidth = currentWidth - previousWidth;
               if (targetStyle.textAlign === 'right' && !hasHorizontalScroll) {
                  if (currentWidth - offset < lastLetterWidth / 2) {
                     target.setSelectionRange(target.value.length - i, target.value.length - i);
                  } else {
                     target.setSelectionRange(target.value.length - i + 1, target.value.length - i + 1);
                  }
               } else {
                  if (currentWidth - offset < lastLetterWidth / 2) {
                     target.setSelectionRange(i, i);
                  } else {
                     target.setSelectionRange(i - 1, i - 1);
                  }
               }

               target.scrollLeft = 0;
            }
            this._clickItemInfo = null;
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
         var editingItemProjection = this._isAdd
            ? listModel._prepareDisplayItemForAdd(item)
            : listModel.getItemById(ItemsUtil.getPropertyValue(this._editingItem, listModel._options.keyProperty), listModel._options.keyProperty);

         listModel.reset(); //reset делается для того, чтобы при добавлении не лезть за пределы проекции
         var actions =  listModel.getItemActions(item);
         this._editingItemData = listModel.getCurrent();
         this._editingItemData.item = this._editingItem;
         this._editingItemData.dispItem = editingItemProjection;
         this._editingItemData.isEditing = true;
         this._editingItemData.index = this._isAdd ? listModel.getCount() : index;
         this._editingItemData.drawActions = this._isAdd && actions && actions.showed && actions.showed.length,
         this._editingItemData.itemActions = this._isAdd ? listModel.getItemActions(item) : {};
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
