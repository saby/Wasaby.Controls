define('Controls/interface/IRemovable', [], function() {


   /**
    * Интерфейс для удаления элементов в коллекциях.
    *
    * @interface Controls/interface/IRemovable
    * @public
    * @author Авраменко А.С.
    */

   /*
    * Interface for item removal in collections.
    *
    * @interface Controls/interface/IRemovable
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @typedef {Object} Selection
    * @property {Array.<Number|String>} selected Массив выбранных ключей.
    * @property {Array.<Number|String>} excluded Массив исключенных из выборки ключей.
    */

   /*
    * @typedef {Object} Selection
    * @property {Array.<Number|String>} selected Array of selected keys.
    * @property {Array.<Number|String>} excluded Array of excluded keys.
    */

   /**
    * @event Controls/interface/IRemovable#beforeItemsRemove Происходит перед удалением элемента.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {Array.<String>|Array.<Number>} idArray Массив элементов для удаления.
    * @returns {Core/Deferred} Если deferred был выполнен с false, то логика по умолчанию не будет выполнена.
    * @example
    * В следующем примере показано, как отобразить диалоговое окно с вопросом перед удалением элементов.
    * <pre>
    *    <Controls.list:View.Remover name="listRemover" on:beforeItemsRemove="_beforeItemsRemove()"/>
    *    <Controls.popup:Confirmation name="popupOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _beforeItemsRemove: function(eventObject, idArray) {
    *          return this._children.popupOpener.open({
    *             message: 'Are you sure you want to delete the items?',
    *             type: 'yesno'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see afterItemsRemove
    * @see removeItems
    */

   /*
    * @event Controls/interface/IRemovable#beforeItemsRemove Occurs before items are removed.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} idArray Array of items to be removed.
    * @returns {Core/Deferred} If deferred was fullfilled with false then default logic will not be executed.
    * @example
    * The following example shows how to display a dialog with a question before deleting items.
    * <pre>
    *    <Controls.list:View.Remover name="listRemover" on:beforeItemsRemove="_beforeItemsRemove()"/>
    *    <Controls.popup:Confirmation name="popupOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _beforeItemsRemove: function(eventObject, idArray) {
    *          return this._children.popupOpener.open({
    *             message: 'Are you sure you want to delete the items?',
    *             type: 'yesno'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see afterItemsRemove
    * @see removeItems
    */

   /**
    * @event Controls/interface/IRemovable#afterItemsRemove Происходит после удаления элементов.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {Array.<String>|Array.<Number>} idArray Массив удаленных элементов.
    * @param {*} result Результат удаления элемента из источника данных.
    * @example
    * В следующем примере показано, как удалить элементы из списка после клика по кнопке.
    * <pre>
    *    <Controls.list:View.Remover name="listRemover" on:afterItemsRemove="_afterItemsRemove()"/>
    *    <Controls.popup:Confirmation name="popupOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _afterItemsRemove: function(eventObject, idArray, result) {
    *          if (result instanseof Error) {
    *             return this._children.popupOpener.open({
    *                message: 'Removing records failed.',
    *                style: 'error'
    *             });
    *          }
    *       }
    *       ...
    *    });
    * </pre>
    * @see removeItems
    * @see beforeItemsRemove
    */

   /*
    * @event Controls/interface/IRemovable#afterItemsRemove Occurs after removing items.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} idArray Array of removed items
    * @param {*} result The result of item removal from the data source.
    * @example
    * The following example shows how to remove items from list after click on the button.
    * <pre>
    *    <Controls.list:View.Remover name="listRemover" on:afterItemsRemove="_afterItemsRemove()"/>
    *    <Controls.popup:Confirmation name="popupOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _afterItemsRemove: function(eventObject, idArray, result) {
    *          if (result instanseof Error) {
    *             return this._children.popupOpener.open({
    *                message: 'Removing records failed.',
    *                style: 'error'
    *             });
    *          }
    *       }
    *       ...
    *    });
    * </pre>
    * @see removeItems
    * @see beforeItemsRemove
    */    

   /**
    * Удаляет элементы из источника данных по идентификаторам элементов коллекции.
    * @function Controls/interface/IRemovable#removeItems
    * @param {Array.<String>|Array.<Number>|Selection} items Массив элементов для удаления.
    * @example
    * В следующем примере показано, как удалить элементы из списка после клика по кнопке.
    * <pre>
    *    <Controls.buttons:Path caption="RemoveItem" on:click="_onRemoveButtonClick()"/>
    *    <Controls.list:View.Remover name="listRemover"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _keysForRemove: [...],
    *
    *       _onRemoveButtonClick: function() {
    *          this._children.listRemover.removeItems(this._keysForRemove);
    *       }
    *       ...
    *    });
    * </pre>
    * @see afterItemsRemove
    * @see beforeItemsRemove
    */

   /*
    * Removes items from the data source by identifiers of the items in the collection.
    * @function Controls/interface/IRemovable#removeItems
    * @param {Array.<String>|Array.<Number>|Selection} items Array of items to be removed.
    * @example
    * The following example shows how to remove items from list after click on the button.
    * <pre>
    *    <Controls.buttons:Path caption="RemoveItem" on:click="_onRemoveButtonClick()"/>
    *    <Controls.list:View.Remover name="listRemover"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _keysForRemove: [...],
    *
    *       _onRemoveButtonClick: function() {
    *          this._children.listRemover.removeItems(this._keysForRemove);
    *       }
    *       ...
    *    });
    * </pre>
    * @see afterItemsRemove
    * @see beforeItemsRemove
    */    
});
