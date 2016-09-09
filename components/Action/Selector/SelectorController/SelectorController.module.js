/**
 * Created by am.gerasimov on 11.08.2016.
 */
define('js!SBIS3.CONTROLS.SelectorController', [
       'js!SBIS3.CORE.CompoundControl',
       'js!WS.Data/Di',
       'Core/helpers/collection-helpers',
       'js!SBIS3.CONTROLS.SelectorWrapper',
       'js!WS.Data/Collection/List'
    ],
    function (CompoundControl, Di, collectionHelpers) {

       'use strict';

       /**
        * Описание логики выбора из диалога/панели.
        * @public
        * @author Крайнов Дмитрий Олегович
        */
       var SelectorController = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.SelectorController.prototype  */{
          $protected: {
             _options: {
                /**
                 * Набор выбранных элементов
                 */
                selectedItems: null
             }
          },
          $constructor: function () {
             var commandDispatcher = $ws.single.CommandDispatcher;
             this._publish('onSelectComplete');

             commandDispatcher.declareCommand(this, 'selectorWrapperSelectionChanged', this._chooserWrapperSelectionChanged);
             commandDispatcher.declareCommand(this, 'selectorWrapperInitialized', this._chooserWrapperInitialized);
             commandDispatcher.declareCommand(this, 'selectComplete', this._chooseComplete);

             if(this._options.selectedItems) {
                if(Array.isArray(this._options.selectedItems)) {
                   this._options.selectedItems = Di.resolve('collection.list', {items: this._options.selectedItems});
                }
             } else {
                this._options.selectedItems = Di.resolve('collection.list');
             }
          },

          /**
           * Проставляет выбранные элементы, когда компонент выбора проинициализирован
           * @param chooserWrapper
           * @private
           */
          _chooserWrapperInitialized: function(chooserWrapper) {
             chooserWrapper.setSelectedItems(this._options.selectedItems);
          },

          /**
           * Обрабатываем изменение выделения
           * @param difference
           * @param keyField
           * @private
           */
          _chooserWrapperSelectionChanged: function(difference, keyField) {
             var currentItems = this._options.selectedItems;

             if(difference.removed.length) {
                collectionHelpers.forEach(difference.removed, function (removedKey) {
                   currentItems.removeAt(currentItems.getIndexByValue(keyField, removedKey));
                }, this);
             }

             if(difference.added.length) {
                collectionHelpers.forEach(difference.added, function(item) {
                   var index = currentItems.getIndexByValue(keyField, item.get(keyField));

                   if(index === -1) {
                      currentItems.add(item);
                   } else {
                      currentItems.replace(item, index);
                   }
                }, this);
             }
          },

          _chooseComplete: function() {
             this._notify('onSelectComplete', this._options.selectedItems.clone());
          }
       });

       return SelectorController;

    });
