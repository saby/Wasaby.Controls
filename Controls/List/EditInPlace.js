define('Controls/List/EditInPlace', [
   'Core/Control',
   'wml!Controls/List/EditInPlace/EditInPlace',
   'Core/Deferred',
   'WS.Data/Entity/Record',
   'Controls/List/resources/utils/ItemsUtil',
   'Controls/Utils/getWidth',
   'Controls/Utils/hasHorizontalScroll',
   'Controls/EditableArea/Constants',
   'css!theme?Controls/List/EditInPlace/Text'
], function(
   Control,
   template,
   Deferred,
   Record,
   ItemsUtil,
   getWidthUtil,
   hasHorizontalScrollUtil,
   EditConstants
) {
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
      _private = {
         beginEdit: function(self, options, isAdd) {
            var result = self._notify('beforeBeginEdit', [options, isAdd]);
            if (!isAdd) {
               self._originalItem = options.item;
            }
            return _private.processBeforeBeginEditResult(self, options, result, isAdd);
         },

         afterBeginEdit: function(self, options, isAdd) {
            self._editingItem = options.item.clone();
            self._notify('afterBeginEdit', [self._editingItem, isAdd]);
            self._setEditingItemData(self._editingItem, self._options.listModel);

            return options;
         },

         processBeforeBeginEditResult: function(self, options, eventResult, isAdd) {
            var result;

            if (eventResult === EditConstants.CANCEL) {
               result = Deferred.fail(options);
            } else if (eventResult && eventResult.addBoth) {
               self._notify('showIndicator', [], { bubbling: true });
               eventResult.addBoth(function(defResult) {
                  self._notify('hideIndicator', [], { bubbling: true });
                  return defResult;
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
         // Чтобы при первом старте редактирования не летели лишние события
            if (!self._editingItem) {
               return Deferred.success();
            }

            var result = self._notify('beforeEndEdit', [self._editingItem, commit, self._isAdd]);

            if (result === EditConstants.CANCEL) {
               return Deferred.fail();
            }
            if (result && result.addCallback) {
            // Если мы попали сюда, то прикладники сами сохраняют запись
               return result.addCallback(function() {
                  _private.afterEndEdit(self);
               });
            }

            return _private.updateModel(self, commit).addCallback(function() {
               _private.afterEndEdit(self);
            });
         },

         afterEndEdit: function(self) {
            self._notify('afterEndEdit', [self._isAdd ? self._editingItem : self._originalItem, self._isAdd]);
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
               }
               _private.acceptChanges(self);
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
               if (index < self._options.listModel.getCount() - 1 && _private.getNext(index, self._options.listModel)) {
                  self.beginEdit({
                     item: _private.getNext(index, self._options.listModel)
                  });
               } else if (self._options.editingConfig && self._options.editingConfig.autoAdd) {
                  self.beginAdd();
               } else {
                  self.commitEdit();
               }
            } else if (index > 0 && _private.getPrevious(index, self._options.listModel)) {
               self.beginEdit({
                  item: _private.getPrevious(index, self._options.listModel)
               });
            } else {
               self.commitEdit();
            }
         },

         getNext: function(index, listModel) {
            var
               result,
               offset = 1,
               count = listModel.getCount();

            while (index + offset < count) {
               result = listModel.at(index + offset).getContents();
               if (result instanceof Record) {
                  return result;
               }
               offset++;
            }
         },

         getPrevious: function(index, listModel) {
            var
               result,
               offset = -1;

            while (index + offset >= 0) {
               result = listModel.at(index + offset).getContents();
               if (result instanceof Record) {
                  return result;
               }
               offset--;
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
         },

         getSequentialEditing: function(newOptions) {
            // TODO: опция editingConfig.sequentialEditing по умолчанию должна быть true. Но она находится внутри объекта,
            // а при вызове getDefaultOptions объекты не мержатся. Нужно либо на стороне ws делать мерж объектов, либо
            // делать 5 опций на списке, либо вот такой костыль:
            if (newOptions.editingConfig && typeof newOptions.editingConfig.sequentialEditing !== 'undefined') {
               return newOptions.editingConfig.sequentialEditing;
            }
            return true;
         }
      };

   /**
    * @class Controls/List/EditInPlace
    * @extends Core/Control
    * @mixes Controls/interface/IEditableList
    * @author Зайцев А.С.
    * @private
    */

   var EditInPlace = Control.extend(/** @lends Controls/List/EditInPlace.prototype */{
      _template: template,

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
         this._sequentialEditing = _private.getSequentialEditing(newOptions);
      },

      beginEdit: function(options) {
         var self = this;

         if (!this._editingItem || !this._editingItem.isEqual(options.item)) {
            return this.commitEdit().addCallback(function() {
               return _private.beginEdit(self, options).addCallback(function(newOptions) {
                  return _private.afterBeginEdit(self, newOptions);
               });
            });
         }
      },

      beginAdd: function(options) {
         var self = this;
         return this.commitEdit().addCallback(function() {
            return _private.beginEdit(self, options || {}, true).addCallback(function(newOptions) {
               return _private.afterBeginEdit(self, newOptions, true);
            });
         });
      },

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

      cancelEdit: function() {
         return _private.endItemEdit(this, false);
      },

      _onKeyDown: function(e) {
         if (this._editingItem) {
            switch (e.nativeEvent.keyCode) {
               case 13: // Enter
                  if (this._options.editingConfig && !this._sequentialEditing) {
                     this.commitEdit();
                  } else {
                     _private.editNextRow(this, true);
                  }
                  break;
               case 27: // Esc
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
               this.beginEdit({
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

      _beforeUpdate: function(newOptions) {
         this._sequentialEditing = _private.getSequentialEditing(newOptions);
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

               // EditingRow в afterMount делает this.activate(), чтобы при переходах по табу фокус вставал в поля ввода.
               // Т.е. если не звать focus(), то фокус может находиться в другом поле ввода.
               target.focus();

               lastLetterWidth = currentWidth - previousWidth;
               if (targetStyle.textAlign === 'right' && !hasHorizontalScroll) {
                  if (currentWidth - offset < lastLetterWidth / 2) {
                     target.setSelectionRange(target.value.length - i, target.value.length - i);
                  } else {
                     target.setSelectionRange(target.value.length - i + 1, target.value.length - i + 1);
                  }
               } else if (currentWidth - offset < lastLetterWidth / 2) {
                  target.setSelectionRange(i, i);
               } else {
                  target.setSelectionRange(i - 1, i - 1);
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

         var actions = listModel.getItemActions(item);
         this._editingItemData = listModel.getItemDataByItem(editingItemProjection);
         this._editingItemData.isEditing = true;
         this._editingItemData.item = this._editingItem;
         this._editingItemData.drawActions = this._isAdd && actions && actions.showed && actions.showed.length;
         this._editingItemData.itemActions = this._isAdd ? actions : {};
         if (this._isAdd) {
            this._editingItemData.index = index;
         }
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
