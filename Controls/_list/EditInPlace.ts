import Control = require('Core/Control');
import template = require('wml!Controls/_list/EditInPlace/EditInPlace');
import Deferred = require('Core/Deferred');
import entity = require('Types/entity');
import getWidthUtil = require('Controls/Utils/getWidth');
import hasHorizontalScrollUtil = require('Controls/Utils/hasHorizontalScroll');
import Constants = require('Controls/Constants');
import cInstance = require('Core/core-instance');
import 'css!theme?Controls/list';

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
        beginEdit: function (self, options, isAdd) {
            var result = self._notify('beforeBeginEdit', [options, isAdd]);
            if (!isAdd) {
                self._originalItem = options.item;
            }
            return _private.processBeforeBeginEditResult(self, options, result, isAdd);
        },

        afterBeginEdit: function (self, options, isAdd) {
            self._editingItem = options.item.clone();
            self._notify('afterBeginEdit', [self._editingItem, isAdd]);
            self._setEditingItemData(self._editingItem, self._options.listModel);

            /**
             * This code exists because there's no way to declaratively change editing item, so the users are forced to write something like this:
             * editingItem.set('field', 'value').
             */
            self._editingItem.subscribe('onPropertyChange', self._resetValidation);

            return options;
        },

        processBeforeBeginEditResult: function (self, options, eventResult, isAdd) {
            var result;

            if (eventResult === Constants.editing.CANCEL) {
                result = Deferred.success({cancelled: true});
            } else if (eventResult && eventResult.addBoth) {
                var id = self._notify('showIndicator', [{}], {bubbling: true});
                eventResult.addBoth(function (defResult) {
                    self._notify('hideIndicator', [id], {bubbling: true});
                    return defResult;
                });
                result = eventResult;
            } else if ((eventResult && eventResult.item instanceof entity.Record) || (options && options.item instanceof entity.Record)) {
                result = Deferred.success(eventResult || options);
            } else if (isAdd) {
                result = _private.createModel(self, eventResult || options);
            }

            return result;
        },

        endItemEdit: function (self, commit) {
            // Чтобы при первом старте редактирования не летели лишние события
            if (!self._editingItem) {
                return Deferred.success();
            }
            let result = self._notify('beforeEndEdit', [self._editingItem, commit, self._isAdd]);
            return _private.processBeforeEndEditResult(self, result, commit);
        },

        processBeforeEndEditResult: function (self, eventResult, commit) {
            var result;

            if (eventResult === Constants.editing.CANCEL) {
                result = Deferred.success({cancelled: true});
            } else if (eventResult && eventResult.addBoth) {
                let id = self._notify('showIndicator', [{}], {bubbling: true});
                eventResult.addBoth(function (defResult) {
                    self._notify('hideIndicator', [id], {bubbling: true});
                    return defResult;
                });
                result = eventResult;
            } else {
                result = _private.updateModel(self, commit).addCallback(function () {
                    _private.afterEndEdit(self);
                })
            }

            return result;
        },

        afterEndEdit: function (self) {
            self._notify('afterEndEdit', [self._isAdd ? self._editingItem : self._originalItem, self._isAdd]);
            _private.resetVariables(self);
            self._setEditingItemData(null, self._options.listModel);
        },

        createModel: function (self, options) {
            return self._options.source.create().addCallback(function (item) {
                options.item = item;
                return options;
            });
        },

        updateModel: function (self, commit) {
            if (commit) {
                if (self._options.source) {
                    return self._options.source.update(self._editingItem).addCallback(function () {
                        _private.acceptChanges(self);
                    });
                }
                _private.acceptChanges(self);
            }

            return Deferred.success();
        },

        acceptChanges: function (self) {
            if (self._isAdd) {
                self._options.listModel.appendItems([self._editingItem]);
            } else {
                self._originalItem.merge(self._editingItem);
            }
        },

        resetVariables: function (self) {
            if (self._editingItem) {
                self._editingItem.unsubscribe('onPropertyChange', self._resetValidation);
                self._options.listModel.unsubscribe('onCollectionChange', self._updateIndex);
            }
            self._originalItem = null;
            self._editingItem = null;
            self._isAdd = null;
        },

        validate: function (self) {
            return self._children.formController.submit();
        },

        hasParentInItems: function (item, listModel) {
            return !!listModel.getItemById(item.get(listModel._options.parentProperty));
        },

        editNextRow: function (self, editNextRow) {
            var index = _private.getEditingItemIndex(self, self._editingItem, self._options.listModel);

            if (editNextRow) {
                if (_private.getNext(self._editingItem, index, self._options.listModel)) {
                    self.beginEdit({
                        item: _private.getNext(self._editingItem, index, self._options.listModel)
                    });
                } else if (self._options.editingConfig && self._options.editingConfig.autoAdd) {
                    self.beginAdd();
                } else {
                    self.commitEdit();
                }
            } else if (_private.getPrevious(self._editingItem, index, self._options.listModel)) {
                self.beginEdit({
                    item: _private.getPrevious(self._editingItem, index, self._options.listModel)
                });
            } else {
                self.commitEdit();
            }
        },

        getNext: function (editingItem, index, listModel) {
            var
                offset = 1,
                result,
                parentId,
                parentIndex,
                count;

            if (_private.hasParentInItems(editingItem, listModel)) {
                parentId = editingItem.get(listModel._options.parentProperty);
                parentIndex = listModel.getIndexBySourceItem(listModel.getItemById(parentId, listModel._options.keyProperty).getContents());
                count = parentIndex + listModel.getChildren(parentId).length + 1;
            } else {
                count = listModel.getCount();
            }

            while (index + offset < count) {
                result = listModel.at(index + offset).getContents();
                if (result instanceof entity.Record) {
                    return result;
                }
                offset++;
            }
        },

        getPrevious: function (editingItem, index, listModel) {
            var
                offset = -1,
                result,
                parentId,
                parentIndex,
                count;

            if (_private.hasParentInItems(editingItem, listModel)) {
                parentId = editingItem.get(listModel._options.parentProperty);
                parentIndex = listModel.getIndexBySourceItem(listModel.getItemById(parentId, listModel._options.keyProperty).getContents());
                count = parentIndex + 1;
            } else {
                count = 0;
            }

            while (index + offset >= count) {
                result = listModel.at(index + offset).getContents();
                if (result instanceof entity.Record) {
                    return result;
                }
                offset--;
            }
        },

        getEditingItemIndex: function (self, editingItem, listModel) {
            var
                index = listModel.getCount(),
                originalItem = listModel.getItemById(editingItem.get(listModel._options.keyProperty), listModel._options.keyProperty),
                parentId,
                parentIndex;

            if (originalItem) {
                index = listModel.getIndexBySourceItem(originalItem.getContents());
            } else if (_private.hasParentInItems(editingItem, listModel)) {
                parentId = editingItem.get(listModel._options.parentProperty);
                parentIndex = listModel.getIndexBySourceItem(listModel.getItemById(parentId, listModel._options.keyProperty).getContents());
                index = parentIndex + listModel.getChildren(parentId).length + 1;
            }

            return index;
        },

        getSequentialEditing: function (newOptions) {
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
 * @class Controls/_list/EditInPlace
 * @extends Core/Control
 * @mixes Controls/interface/IEditableList
 * @author Авраменко А.С.
 * @private
 */

var EditInPlace = Control.extend(/** @lends Controls/_list/EditInPlace.prototype */{
    _template: template,

    constructor: function () {
        EditInPlace.superclass.constructor.apply(this, arguments);
        this._resetValidation = function () {
            /**
             * We should manually trigger update of the list, otherwise only inputs with validators are gonna get updated.
             */
            this._forceUpdate();

            /**
             * Validation doesn't reset if the value was changed without user input, so we have to reset it here.
             * Ideally, validation should take value through options and reset automagically.
             * TODO: https://online.sbis.ru/opendoc.html?guid=951f6762-8e37-4182-a7fc-3104a35ce27a
             */
            this._children.formController.setValidationResult();
        }.bind(this);
        this._updateIndex = this._updateIndex.bind(this);
    },

    _beforeMount: function (newOptions) {
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

    beginEdit: function (options) {
        var self = this;

        if (!this._editingItem || !this._editingItem.isEqual(options.item)) {
            return this.commitEdit().addCallback(function (res) {
                if (res && res.validationFailed) {
                    return Deferred.success();
                }
                return _private.beginEdit(self, options).addCallback(function (newOptions) {
                    if (newOptions && newOptions.cancelled) {
                        return Deferred.success({cancelled: true});
                    }
                    return _private.afterBeginEdit(self, newOptions);
                });
            });
        }
    },

    beginAdd: function (options) {
        var self = this;
        return this.commitEdit().addCallback(function (res) {
            if (res && res.validationFailed) {
                return Deferred.success();
            }
            return _private.beginEdit(self, options || {}, true).addCallback(function (newOptions) {
                if (newOptions && newOptions.cancelled) {
                    return Deferred.success({cancelled: true});
                }
                return _private.afterBeginEdit(self, newOptions, true);
            });
        });
    },

    commitEdit: function () {
        var self = this;

        return _private.validate(this).addCallback(function (result) {
            for (var key in result) {
                if (result.hasOwnProperty(key) && result[key]) {
                    return Deferred.success({validationFailed: true});
                }
            }
            return _private.endItemEdit(self, true);
        });
    },

    cancelEdit: function () {
        return _private.endItemEdit(this, false);
    },

    _onKeyDown: function (e, nativeEvent) {
        switch (nativeEvent.keyCode) {
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
        nativeEvent.stopPropagation();
    },

    _onItemClick: function (e, record, originalEvent) {
        if (this._options.editingConfig && this._options.editingConfig.editOnClick && !this._options.readOnly && originalEvent.type === 'click') {
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
                // The click should not bubble over the editing controller to ensure correct control works.
                // e.c., a click can be processed by the selection controller, which should not occur when starting editing in place.
                // https://online.sbis.ru/opendoc.html?guid=b3254c65-596b-4f89-af0f-c160217ce7a3
                e.stopPropagation();
            }
        }
    },

    _beforeUpdate: function (newOptions) {
        this._sequentialEditing = _private.getSequentialEditing(newOptions);
    },

    _afterUpdate: function () {
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
                typographyStyles.forEach(function (prop) {
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

                /**
                 * When editing starts, EditingRow calls this.activate() to focus first focusable element.
                 * But if a user has clicked on an editable field, we can do better - we can set caret exactly
                 * where the user has clicked. But before moving the caret we should manually focus the right field.
                 */
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

    _setEditingItemData: function (item, listModel) {
        if (!item) {
            listModel._setEditingItemData(null);
            this._editingItemData = null;
            return;
        }
        var editingItemProjection = listModel.getItemById(this._editingItem.get(listModel._options.keyProperty), listModel._options.keyProperty);

        if (!editingItemProjection) {
            this._isAdd = true;
            editingItemProjection = listModel._prepareDisplayItemForAdd(item);
        }

        var actions = listModel.getItemActions(item);
        this._editingItemData = listModel.getItemDataByItem(editingItemProjection);
        if (this._isAdd && _private.hasParentInItems(this._editingItem, listModel)) {
            this._editingItemData.level = listModel.getItemById(item.get(this._editingItemData.parentProperty)).getLevel() + 1;
        }
        this._editingItemData.isEditing = true;
        this._editingItemData.item = this._editingItem;
        if (this._isAdd) {
            this._editingItemData.index = _private.getEditingItemIndex(this, item, listModel);
            this._editingItemData.drawActions = this._options.editingConfig && this._options.editingConfig.toolbarVisibility;
        }
        listModel._setEditingItemData(this._editingItemData);
        listModel.subscribe('onCollectionChange', this._updateIndex);
    },

    _updateIndex() {
       if (this._isAdd) {
          /**
           * If an item gets added to the list during editing we should update index of editing item to preserve its position.
           */
          this._editingItemData.index = _private.getEditingItemIndex(this, this._editingItem, this._options.listModel);
       }
    },

    _onRowDeactivated: function (e, eventOptions) {
        if (eventOptions.isTabPressed) {
            _private.editNextRow(this, !eventOptions.isShiftKey);
        }
        e.stopPropagation();
    },

    _beforeUnmount: function () {
        _private.resetVariables(this);
    }
});

export = EditInPlace;
