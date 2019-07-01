define('Controls/interface/IEditableList', [
], function() {

   /**
    * Interface for lists that have editing. The difference between this interface and {@link Controls/View Controls/editableArea:View} is that the former is used in lists and the latter is used outside of them (e.g., in tabs).
    *
    * @interface Controls/interface/IEditableList
    * @public
    * @author Авраменко А.С.
    * @see Controls/View
    */

   /**
    * @typedef {Object} ItemEditOptions
    * @property {Types/entity:Record} [options.item] Record with initial data.
    */

   /**
    * @typedef {Object} EditingConfig
    * @property {Boolean} [editOnClick=false] Если передано значение "true", клик по элементу списка начинает редактирование по месту.
    * @property {Boolean} [autoAdd=false] Если передано значение "true", после окончания редактирования последнего элемента списка автоматически добавляется новый элемент и начинается его редактирование.
    * @property {Boolean} [sequentialEditing=true] Если передано значение "true", после окончания редактирования любого элемента списка, кроме последнего, автоматически запускается редактирование следующего элемента списка.
    * @property {Boolean} [toolbarVisibility=false] Определяет, должны ли отображаться кнопки "Сохранить" и "Отмена".
    * @property {Types/entity:Record} [item=undefined] Позволяет начать редактирование элемента списка при первом рендеринге.
    */

   /*
    * @typedef {Object} EditingConfig
    * @property {Boolean} [editOnClick=false] If true, click on list item starts editing in place.
    * @property {Boolean} [autoAdd=false] If true, after the end of editing of the last list item, new item adds automatically and its editing begins.
    * @property {Boolean} [sequentialEditing=true] If true, after the end of editing of any list item other than the last, editing of the next list item starts automatically.
    * @property {Boolean} [toolbarVisibility=false] Determines whether buttons 'Save' and 'Cancel' should be displayed.
    * @property {Types/entity:Record} [item=undefined] If present, editing of this item will begin on first render.
    */

   /**
    * @typedef {String|Types/entity:Record|Core/Deferred} ItemEditResult
    * @variant {String} Cancel Cancel start of editing.
    * @variant {ItemEditOptions} options Options of editing.
    * @variant {Core/Deferred} Deferred is used for asynchronous preparation of edited record. It is necessary to fullfill deferred with {@link ItemEditOptions ItemEditOptions} or 'Cancel'. If deferred takes too long to resolve then loading indicator will be shown.
    */

   /**
    * @typedef {String|Core/Deferred} EndEditResult
    * @variant {String} Cancel Cancel ending of editing\adding.
    * @variant {Core/Deferred} Deferred is used for saving with custom logic.
    */

   /**
    * @event Controls/interface/IEditableList#beforeBeginEdit Происходит перед началом редактирования.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {ItemEditOptions} options Параметры редактирования.
    * @param {Boolean} isAdd Значение true является признаком, что запись добавляется по месту.
    * @returns {ItemEditResult}
    * @example
    * В следующем примере показано, как запретить редактирование элемента, если он соответствует условию:
    * WML:
    * <pre>
    *    <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    define('ModuleName', ['Controls/Constants'], function(constants) {
    *       ...
    *       beforeBeginEditHandler: function(e, options) {
    *          if (options.item.getId() === 1) {
    *             return constants.editing.CANCEL;
    *          }
    *       }
    *    });
    * </pre>
    * В следующем примере показано, как прочитать элемент из БЛ и открыть его для редактирования:
    * WML:
    * <pre>
    *    <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    beforeBeginEditHandler: function(e, options) {
    *       return this.source.read(options.item.getId()).addCallback(function(result) {
    *          return {
    *             item: result
    *          };
    *       });
    *    }
    * </pre>
    * В следующем примере показано, как начать редактирование элемента, созданного на клиенте:
    * WML:
    * <pre>
    *    <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    define('ModuleName', ['Types/entity'], function(entity) {
    *       ...
    *       beforeBeginEditHandler: function(e, options) {
    *          return {
    *             item: new entity.Model({
    *                rawData: {
    *                   //Obviously, you would use something else instead of Date.now() to generate id, but we'll use it here to keep the example simple
    *                   id: Date.now(),
    *                   title: ''
    *                }
    *             })
    *          }
    *       }
    *    });
    * </pre>
    * @see afterBeginEdit
    * @see beforeEndEdit
    * @see afterEndEdit
    * @see editingConfig
    */

   /*
    * @event Controls/interface/IEditableList#beforeBeginEdit Occurs before the start of editing.
    * @param {Env/Event:Object} eventObject Descriptor of the event.
    * @param {ItemEditOptions} options Options of editing.
    * @param {Boolean} isAdd
    * @returns {ItemEditResult}
    * @example
    * The following example shows how to prevent editing of an element if it matches condition:
    * WML:
    * <pre>
    *    <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    define('ModuleName', ['Controls/Constants'], function(constants) {
    *       ...
    *       beforeBeginEditHandler: function(e, options) {
    *          if (options.item.getId() === 1) {
    *             return constants.editing.CANCEL;
    *          }
    *       }
    *    });
    * </pre>
    * The following example shows how to read item from BL and open it for editing.
    * WML:
    * <pre>
    *    <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    beforeBeginEditHandler: function(e, options) {
    *       return this.source.read(options.item.getId()).addCallback(function(result) {
    *          return {
    *             item: result
    *          };
    *       });
    *    }
    * </pre>
    * The following example shows how to start editing with an item created on the client.
    * WML:
    * <pre>
    *    <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    define('ModuleName', ['Types/entity'], function(entity) {
    *       ...
    *       beforeBeginEditHandler: function(e, options) {
    *          return {
    *             item: new entity.Model({
    *                rawData: {
    *                   //Obviously, you would use something else instead of Date.now() to generate id, but we'll use it here to keep the example simple
    *                   id: Date.now(),
    *                   title: ''
    *                }
    *             })
    *          }
    *       }
    *    });
    * </pre>
    * @see afterBeginEdit
    * @see beforeEndEdit
    * @see afterEndEdit
    * @see editingConfig
    */

   /**
    * @event Controls/interface/IEditableList#afterBeginEdit Происходит после начала редактирования\добавления.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {Types/entity:Record} item Редактируемая запись.
    * @param {Boolean} isAdd Флаг, который позволяет различать редактирование и добавление.
    * @remark
    * Подпишитесь на событие, если необходимо что-либо сделать после начала редактирования (например, скрыть кнопку "Добавить").
    * Событие запускается, когда подготовка данных успешно завершена и возможно безопасно обновить пользовательский интерфейс.
    * @example
    * В следующем примере показано, как скрыть кнопку "Добавить" после начала редактирования\добавления.
    * WML:
    * <pre>
    *    <Controls.list:View on:afterBeginEdit="afterBeginEditHandler()" />
    *    <ws:if data="{{ showAddButton }}">
    *       <Controls.list:AddButton />
    *    </ws:if>
    * </pre>
    * JS:
    * <pre>
    *    afterBeginEditHandler: function(e, item, isAdd) {
    *       this.showAddButton = false;
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see beforeEndEdit
    * @see afterEndEdit
    */

   /*
    * @event Controls/interface/IEditableList#afterBeginEdit Occurs after the start of editing\adding.
    * @param {Env/Event:Object} eventObject Descriptor of the event.
    * @param {Types/entity:Record} item Editing record.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    * @remark
    * This event is useful if you want to do something after the editing has started, for example hide an add button.
    * The main difference between this event and {@link beforeBeginEdit beforeBeginEdit} is that this event fires when the preparation of the data has successfully finished and it is safe to update your UI.
    * @example
    * The following example shows how to hide the add button after the start of editing\adding.
    * WML:
    * <pre>
    *    <Controls.list:View on:afterBeginEdit="afterBeginEditHandler()" />
    *    <ws:if data="{{ showAddButton }}">
    *       <Controls.list:AddButton />
    *    </ws:if>
    * </pre>
    * JS:
    * <pre>
    *    afterBeginEditHandler: function(e, item, isAdd) {
    *       this.showAddButton = false;
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see beforeEndEdit
    * @see afterEndEdit
    */

   /**
    * @event Controls/interface/IEditableList#beforeEndEdit Происходит перед завершением редактирования\добавления.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {Types/entity:Record} item Редактируемая запись.
    * @param {Boolean} willSave Определяет, будут ли сохранены изменения в редактируемом элементе.
    * @param {Boolean} isAdd Флаг, который позволяет различать редактирование и добавление.
    * @returns {EndEditResult}
    * @remark
    * Используйте событие, если необходимо проверить данные и отменить изменения. По умолчанию для сохранения изменений вызывается метод обновления списка.
    * Не обновляйте пользовательский интерфейс в обработчике этого события, потому что если во время подготовки данных произойдет ошибка, вам придется откатить изменения.
    * @example
    * В следующем примере показано, как запретить завершение редактирования элемента, если оно соответствует условию:
    * WML:
    * <pre>
    *    <Controls.list:View on:beforeEndEdit="beforeEndEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    define('ModuleName', ['Controls/Constants'], function(constants) {
    *       ...
    *       beforeEndEditHandler: function(e, item, commit, isAdd) {
    *          if (!item.get('text').length) {
    *             return constants.editing.CANCEL;
    *          }
    *       }
    *    });
    * </pre>
    * @see beforeBeginEdit
    * @see afterBeginEdit
    * @see afterEndEdit
    */

   /*
    * @event Controls/interface/IEditableList#beforeEndEdit Occurs before the end of editing\adding.
    * @param {Env/Event:Object} eventObject Descriptor of the event.
    * @param {Types/entity:Record} item Editing record.
    * @param {Boolean} willSave Determines whether changes to editing item will be saved.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    * @returns {EndEditResult}
    * @remark
    * This event is useful if you want to validate data and cancel if needed or if you want to handle saving yourself. By default, list's update method will be called to save changes.
    * Don't update your UI in the handler of this event because if an error happens during preparation of data you'll have to rollback your changes.
    * @example
    * The following example shows how to prevent the end of editing of an element if it matches condition:
    * WML:
    * <pre>
    *    <Controls.list:View on:beforeEndEdit="beforeEndEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    define('ModuleName', ['Controls/Constants'], function(constants) {
    *       ...
    *       beforeEndEditHandler: function(e, item, commit, isAdd) {
    *          if (!item.get('text').length) {
    *             return constants.editing.CANCEL;
    *          }
    *       }
    *    });
    * </pre>
    * @see beforeBeginEdit
    * @see afterBeginEdit
    * @see afterEndEdit
    */

   /**
    * @event Controls/interface/IEditableList#afterEndEdit Происходит после завершения редактирования\добавления.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {Types/entity:Record} item Редактируемая запись.
    * @param {Boolean} isAdd Флаг, который позволяет различать редактирование и добавление.
    * @remark
    * Подпишитесь на событие, если необходимо что-либо сделать после завершения редактирования (например, показать кнопку "Добавить"). 
    * Событие запускается, когда редактирование успешно завершено и возможно безопасно обновить пользовательский интерфейс.
    * @example
    * В следующем примере показано, как отобразить кнопку "Добавить" после окончания редактирования\добавления.
    * WML:
    * <pre>
    *    <Controls.list:View on:afterEndEdit="afterEndEditHandler()" />
    *    <ws:if data="{{ showAddButton }}">
    *       <Controls.list:AddButton />
    *    </ws:if>
    * </pre>
    * JS:
    * <pre>
    *    afterEndEditHandler: function() {
    *       this.showAddButton = true;
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see afterBeginEditа
    * @see beforeEndEdit
    */

   /*
    * @event Controls/interface/IEditableList#afterEndEdit Occurs after the end of editing\adding.
    * @param {Env/Event:Object} eventObject Descriptor of the event.
    * @param {Types/entity:Record} item Editing record.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    * @remark
    * This event is useful if you want to do something after the end of editing, for example show an add button.
    * The main difference between this event and {@link beforeEndEdit beforeEndEdit} is that this event fires when the editing has successfully finished and it is safe to update your UI.
    * @example
    * The following example shows how to show the add button after the end of editing\adding.
    * WML:
    * <pre>
    *    <Controls.list:View on:afterEndEdit="afterEndEditHandler()" />
    *    <ws:if data="{{ showAddButton }}">
    *       <Controls.list:AddButton />
    *    </ws:if>
    * </pre>
    * JS:
    * <pre>
    *    afterEndEditHandler: function() {
    *       this.showAddButton = true;
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see afterBeginEdit
    * @see beforeEndEdit
    */

   /**
    * @cfg {EditingConfig} Конфигурация редактирования по месту.
    * <a href="/materials/demo-ws4-editable-list">Example</a>.
    * @name Controls/interface/IEditableList#editingConfig
    * @example
    * WML:
    * <pre>
    *    <Controls.list:View>
    *       <ws:editingConfig>
    *          <ws:Object editOnClick="{{true}}" showToolbar="{{true}}" />
    *       </ws:editingConfig>
    *    </Controls.list:View>
    * </pre>
    */

   /*
    * @cfg {EditingConfig} Configuration for editing in place.
    * <a href="/materials/demo-ws4-editable-list">Example</a>.
    * @name Controls/interface/IEditableList#editingConfig
    * @example
    * WML:
    * <pre>
    *    <Controls.list:View>
    *       <ws:editingConfig>
    *          <ws:Object editOnClick="{{true}}" showToolbar="{{true}}" />
    *       </ws:editingConfig>
    *    </Controls.list:View>
    * </pre>
    */    

   /**
    * Starts editing.
    * @function Controls/interface/IEditableList#beginEdit
    * @param {ItemEditOptions} options Options of editing.
    * @returns {Core/Deferred}
    * @remark
    * Use this method in situations when you want to start editing from an unusual location, e.g., from item actions.
    * @example
    * The following example shows how to start editing of an item.
    * WML:
    * <pre>
    *    <Controls.list:View name="list" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.list.beginEdit({
    *          item: this._items.at(0)
    *       });
    *    }
    * </pre>
    * @see beginAdd
    * @see commitEdit
    * @see cancelEdit
    */

   /**
    * Starts adding.
    * @function Controls/interface/IEditableList#beginAdd
    * @param {ItemEditOptions} options Options of adding.
    * @returns {Core/Deferred}
    * @remark
    * If you don't pass the options then {@link Types/source:ICrud#create create} method of the list's source will be called and the result will be added to the list.
    * @example
    * The following example shows how to start editing of an item.
    * WML:
    * <pre>
    *    <Controls.list:View name="list" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.list.beginAdd();
    *    }
    * </pre>
    * @see beginEdit
    * @see commitEdit
    * @see cancelEdit
    */

   /**
    * Ends editing and commits changes.
    * @function Controls/interface/IEditableList#commitEdit
    * @returns {Core/Deferred}
    * @remark
    * Use this method when you want to end editing in response to user action, e.g., when a user tries to close a dialog you'd use this method to save changes.
    * @example
    * The following example shows how to end editing and commit changes.
    * WML:
    * <pre>
    *    <Controls.list:View name="list" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.list.commitEdit();
    *    }
    * </pre>
    * @see beginEdit
    * @see beginAdd
    * @see cancelEdit
    */

   /**
    * Ends editing and discards changes.
    * @function Controls/interface/IEditableList#cancelEdit
    * @returns {Core/Deferred}
    * @remark
    * Use this method when you want to end editing in response to user action, e.g., when a user clicks on a 'Cancel' button.
    * @example
    * The following example shows how to end editing and discard changes.
    * WML:
    * <pre>
    *    <Controls.list:View name="list" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.list.cancelEdit();
    *    }
    * </pre>
    * @see beginEdit
    * @see beginAdd
    * @see commitEdit
    */

});
