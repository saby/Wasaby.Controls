/**
 * Created by am.gerasimov on 11.08.2016.
 */
define('js!SBIS3.CONTROLS.SelectorController', [
   "Core/CommandDispatcher",
   "js!SBIS3.CORE.CompoundControl",
   "js!WS.Data/Di",
   "Core/helpers/collection-helpers",
   "js!SBIS3.CONTROLS.SelectorWrapper",
   "js!WS.Data/Collection/List"
],
    function ( CommandDispatcher,CompoundControl, Di, collectionHelpers) {

       'use strict';

       /**
        * Описание логики выбора из диалога/панели.
        * @class SBIS3.CONTROLS.SelectorController
        * @extends SBIS3.CORE.CompoundControl
        * @public
        * @author Крайнов Дмитрий Олегович
        * @control
        */
       var SelectorController = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.SelectorController.prototype  */{
          $protected: {
             _options: {
                /**
                 * Набор выбранных элементов
                 */
                selectedItems: null,
                /**
                 * Разрешён ли множественный выбор
                 */
                multiselect: false,
                /**
                 * Тип выбираемых записей
                 */
                selectionType: 'all',
                /**
                 * Имя кнопки, клик по которой завершает выбор
                 */
                selectButton: 'SelectorControllerButton'
             },
             _selectButton: null
          },
          $constructor: function () {
             var commandDispatcher = CommandDispatcher;
             this._publish('onSelectComplete');

             commandDispatcher.declareCommand(this, 'selectorWrapperSelectionChanged', this._chooserWrapperSelectionChanged);
             commandDispatcher.declareCommand(this, 'selectorWrapperInitialized', this._chooserWrapperInitialized);
             commandDispatcher.declareCommand(this, 'selectComplete', this._chooseComplete);

             if(this._options.selectedItems) {
                if(Array.isArray(this._options.selectedItems)) {
                   this._options.selectedItems = Di.resolve('collection.list', {items: this._options.selectedItems});
                } else {
                   this._options.selectedItems = this._options.selectedItems.clone(true);
                }
             } else {
                this._options.selectedItems = Di.resolve('collection.list');
             }
          },

          init: function() {
             SelectorController.superclass.init.apply(this, arguments);
             if(this.hasChildControlByName(this._options.selectButton)) {
                this._selectButton = this.getChildControlByName(this._options.selectButton);
                this.subscribeTo(this._selectButton, 'onActivated', this.sendCommand.bind(this, 'selectComplete'));
             }
          },

          /**
           * Проставляет выбранные элементы, когда компонент выбора проинициализирован
           * @param chooserWrapper
           * @private
           */
          _chooserWrapperInitialized: function(chooserWrapper) {
             chooserWrapper.setProperties({
                multiselect: this._options.multiselect,
                selectedItems: this._options.selectedItems,
                selectionType: this._options.selectionType
             });
          },

          /**
           * Обрабатываем изменение выделения
           * @param difference
           * @param keyField
           * @private
           */
          _chooserWrapperSelectionChanged: function(difference, keyField) {
             var currentItems = this._options.selectedItems,
                 self = this;

             function onChangeSelection() {
                if(self._selectButton) {
                   self._selectButton.show();
                }
             }

             if(difference.removed.length) {
                collectionHelpers.forEach(difference.removed, function (removedKey) {
                   currentItems.removeAt(currentItems.getIndexByValue(keyField, removedKey));
                });
                onChangeSelection();
             }

             if(difference.added.length) {
                collectionHelpers.forEach(difference.added, function(item) {
                   var index = currentItems.getIndexByValue(keyField, item.get(keyField));

                   if(index === -1) {
                      currentItems.add(item);
                   } else {
                      currentItems.replace(item, index);
                   }
                });
                onChangeSelection();
             }
          },

          _chooseComplete: function() {
             this._notify('onSelectComplete', this._options.selectedItems.clone());
          }
       });

       return SelectorController;

    });
