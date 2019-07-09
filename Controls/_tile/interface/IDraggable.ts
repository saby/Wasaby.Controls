/**
 * Интерфейс для перемещения элементов списка с помощью drag'n'drop.
 * Больше информации можно прочитать <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">здесь</a>.
 *
 * @interface Controls/_tile/interface/IDraggable
 * @public
 * @author Авраменко А.С.
 */

/*
 * Interface to move elements of the list by using drag'n'drop.
 * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
 *
 * @interface Controls/_tile/interface/IDraggable
 * @public
 * @author Авраменко А.С.
 */

/**
 * @name Controls/_tile/interface/IDraggable#itemsDragNDrop
 * @cfg {String} Определяет, может ли пользователь перемещать элементы в списке с помощью drag'n'drop.
 * @variant none Перемещение запрещено.
 * @variant allow Перемещение разрешено.
 * @default none
 * @example
 * В следующем примере показано, как включить возможность перемещения элементов с помощью drag'n'drop.
 * <pre>
 *    <Controls.list:View source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   itemsDragNDrop="allow">
 *     </Controls.list:View>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 */

/*
 * @name Controls/_tile/interface/IDraggable#itemsDragNDrop
 * @cfg {String} Determines whether the user can move entries in the list using drag'n'drop.
 * @variant none Dragging items is not allowed.
 * @variant allow Dragging items is allowed.
 * @default none
 * @example
 * The following example shows how to enable the ability to move items using drag'n'drop.
 * <pre>
 *    <Controls.list:View source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   itemsDragNDrop="allow">
 *     </Controls.list:View>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 */

/**
 * @name Controls/_tile/interface/IDraggable#draggingTemplate
 * @cfg {Function} Шаблон перемещаемого элемета.
 * @default Controls/dragnDrop:DraggingTemplate
 * @remark В процессе перемещения рядом с курсором отображается эскиз перемещаемого объекта.
 * @example
 * В следующем примере показано, как использовать стандартный шаблон перемещения элементов.
 * <pre>
 *    <Controls.list:View source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   on:dragStart="_onDragStart()"
 *                   itemsDragNDrop="allow">
 *       <ws:draggingTemplate>
 *          <ws:partial template="Controls/dragnDrop:DraggingTemplate"
 *                      mainText="{{draggingTemplate.entity._options.mainText}}"
 *                      image="{{draggingTemplate.entity._options.image}}"
 *                      additionalText="{{draggingTemplate.entity._options.additionalText}}">
 *          </ws:partial>
 *       </ws:draggingTemplate>
 *    </Controls.list:View>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _onDragStart: function(event, items) {
 *          var mainItem = this._items.getRecordById(items[0]);
 *          return new Entity({
 *             items: items,
 *             mainText: mainItem.get('FIO'),
 *             additionalText: mainItem.get('title'),
 *             image: mainItem.get('userPhoto')
 *          });
 *       },
 *       _beforeMount: function() {
 *          this._viewSource= new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 */

/*
 * @name Controls/_tile/interface/IDraggable#draggingTemplate
 * @cfg {Function} Template of the entity to be moved.
 * @default Controls/dragnDrop:DraggingTemplate
 * @remark In the process of moving, a thumbnail of the entity being moved is shown near the cursor.
 * @example
 * The following example shows how to use a standard dragging template.
 * <pre>
 *    <Controls.list:View source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   on:dragStart="_onDragStart()"
 *                   itemsDragNDrop="allow">
 *       <ws:draggingTemplate>
 *          <ws:partial template="Controls/dragnDrop:DraggingTemplate"
 *                      mainText="{{draggingTemplate.entity._options.mainText}}"
 *                      image="{{draggingTemplate.entity._options.image}}"
 *                      additionalText="{{draggingTemplate.entity._options.additionalText}}">
 *          </ws:partial>
 *       </ws:draggingTemplate>
 *    </Controls.list:View>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _onDragStart: function(event, items) {
 *          var mainItem = this._items.getRecordById(items[0]);
 *          return new Entity({
 *             items: items,
 *             mainText: mainItem.get('FIO'),
 *             additionalText: mainItem.get('title'),
 *             image: mainItem.get('userPhoto')
 *          });
 *       },
 *       _beforeMount: function() {
 *          this._viewSource= new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 */

/**
 * @event Controls/_tile/interface/IDraggable#dragStart Происходит при начале перемещения элемента.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 * @param {Array.<String>} items Массив идентификаторов перемещаемых элементов.
 * @remark Чтобы начать перемещение drag'n'drop из события, необходимо вернуть объект перемещения. Событие срабатывает у контейнера, в котором началось перемещение. 
 * Отличается от события {@link https://wi.sbis.ru/docs/js/Controls/tile/IDraggable/events/dragEnter/?v=19.500 dragEnter}, которое срабатывает у контейнера, в который была перемещена запись. 
 * @example
 * В следующем примере показано, как начать перемещение элементов с помощью drag'n'drop, если все элементы имеют одинаковый тип.
 * <pre>
 *     <Controls.list:View source="{{_viewSource}}"
 *                    keyProperty="id"
 *                    on:dragStart="_dragStart()"
 *                    itemsDragNDrop="allow">
 *     </Controls.list:View>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _dragStart: function(event, items) {
 *          var eventResult;
 *          if (this._isSameTypes(items)) {
 *             eventResult = new ItemsEntity({
 *                items: items
 *             });
 *          }
 *          return eventResult;
 *       },
 *       _isSameTypes: function() {...},
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 * @see dragEnd
 */

/*
 * @event Controls/_tile/interface/IDraggable#dragStart Occurs before the user starts dragging an element in the list.
 * @param {Env/Event:Object} eventObject The event descriptor.
 * @param {Array.<String>} items An array of identifiers for items to be moved.
 * @returns {Controls/_dragnDrop/Entity/Items)
 * @remark To start a drag'n'drop move from an event, you must return the move entity.
 * @example
 * The following example shows how to start moving items using drag'n'drop if all items are of the same type.
 * <pre>
 *     <Controls.list:View source="{{_viewSource}}"
 *                    keyProperty="id"
 *                    on:dragStart="_dragStart()"
 *                    itemsDragNDrop="allow">
 *     </Controls.list:View>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _dragStart: function(event, items) {
 *          var eventResult;
 *          if (this._isSameTypes(items)) {
 *             eventResult = new ItemsEntity({
 *                items: items
 *             });
 *          }
 *          return eventResult;
 *       },
 *       _isSameTypes: function() {...},
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 * @see dragEnd
 */

/**
 * @typedef {String} MovePosition
 * @variant after Вставить перемещенные элементы после указанного элемента.
 * @variant before Вставить перемещенные элементы перед указанным элементом.
 * @variant on Вставить перемещенные элементы в указанный элемент.
 */

/*
 * @typedef {String} MovePosition
 * @variant after Insert moved items after the specified item.
 * @variant before Insert moved items before the specified item.
 * @variant on Insert moved items into the specified item.
 */

/** 
 * @event Controls/_tile/interface/IDraggable#dragEnd Происходит при завершении перемещения элемента в списке.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 * @param {Controls/_dragnDrop/Entity/Items} entity Сущность перемещения.
 * @param {Types/entity:Record} target Объект перемещения.
 * @param {MovePosition} position Положение перемещения.
 * @example
 * В следующем примере показано, как перемещать элементы с помощью Controls/_list/Mover.
 * <pre>
 *     <Controls.Container.Data source="{{_viewSource}}" keyProperty="id">
 *        <Controls.list:View on:dragEnd="_dragEnd()"
 *                       itemsDragNDrop="allow">
 *        </Controls.list:View>
 *        <Controls._list.Mover name="listMover">
 *     <Controls.Container.Data>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _dragEnd: function(event, entity, target, position) {
 *          this._children.listMover.moveItems(entity.getItems(), target, position);
 *       },
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 * @see dragStart
 */

/*
 * @event Controls/_tile/interface/IDraggable#dragEnd Occurs after the user has finished dragging an item in the list.
 * @param {Env/Event:Object} eventObject The event descriptor.
 * @param {Controls/_dragnDrop/Entity/Items} entity Drag'n'drop entity.
 * @param {Types/entity:Record} target Target item to move.
 * @param {MovePosition} position Position to move.
 * @example
 * The following example shows how to move items using Controls/_list/Mover after the drag is complete.
 * <pre>
 *     <Controls.Container.Data source="{{_viewSource}}" keyProperty="id">
 *        <Controls.list:View on:dragEnd="_dragEnd()"
 *                       itemsDragNDrop="allow">
 *        </Controls.list:View>
 *        <Controls._list.Mover name="listMover">
 *     <Controls.Container.Data>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _dragEnd: function(event, entity, target, position) {
 *          this._children.listMover.moveItems(entity.getItems(), target, position);
 *       },
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 * @see dragStart
 */ 

/**
 * @typedef {Boolean|Types/entity:Record} DragEnterResult
 * @property {Boolean} Разрешить перемещение элементов в текущий список из другого списка.
 * @property {Types/entity:Record} Разрешить перемещение элементов в текущий список из другого списка, возвращенная запись будет отображаться в списке как указатель на местоположение перемещения.
 */

/*
 * @typedef {Boolean|Types/entity:Record} DragEnterResult
 * @property {Boolean} Allow dragging items to the current list from another list.
 * @property {Types/entity:Record} Allow dragging items to the current list from another list, the returned entry will be displayed in the list as a pointer to the move location.
 */ 

/**
 * @event Controls/_tile/interface/IDraggable#dragEnter Происходит при перемещении элемента из другого контрола.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 * @param {Controls/_dragnDrop/Entity/Items} entity Сущность перемещения.
 * @returns {DragEnterResult}
 * @remark Событие позволяет перемещать элементы в текущий список из другого списка. Событие срабатывает у контейнера, в который была перемещена запись. 
 * Отличается от события {@link https://wi.sbis.ru/docs/js/Controls/tile/IDraggable/events/dragStart/?v=19.500 dragStart}, которое срабатывает у контейнера, из которого началось перемещение записи. 
 * @example
 * В следующем примере показано, как перемещать в список объекты определенного типа.
 * <pre>
 *     <Controls.Container.Data source="{{_firstSource}}" keyProperty="id">
 *        <Controls.list:View on:dragStart="_dragStart()"
 *                       itemsDragNDrop="allow">
 *        </Controls.list:View>
 *     <Controls.Container.Data>
 *     <Controls.Container.Data source="{{_secondSource}}" keyProperty="id">
 *        <Controls.list:View on:dragEnter="_dragEnter()"
 *                       itemsDragNDrop="allow">
 *        </Controls.list:View>
 *     <Controls.Container.Data>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _dragStart: function(event, items) {
 *          return new TasksItemsEntity({
 *             items: items
 *          });
 *       },
 *       _dragEnter: function(event, entity) {
 *          var result = false;
 *          if (entity instanceof TasksItemsEntity) {
 *             result = new Record({...});
 *          }
 *          return result;
 *       },
 *       _beforeMount: function() {
 *          this._firstSource = new Source({...});
 *          this._secondSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 */

/*
 * @event Controls/_tile/interface/IDraggable#dragEnter Occurs before moving items from another list to the current list.
 * @param {Env/Event:Object} eventObject The event descriptor.
 * @param {Controls/_dragnDrop/Entity/Items} entity Drag'n'drop entity.
 * @returns {DragEnterResult}
 * @remark You can use the event to allow dragging items to the current list from another list.
 * @example
 * The following example shows how to allow dragging to a list of entities of a particular type.
 * <pre>
 *     <Controls.Container.Data source="{{_firstSource}}" keyProperty="id">
 *        <Controls.list:View on:dragStart="_dragStart()"
 *                       itemsDragNDrop="allow">
 *        </Controls.list:View>
 *     <Controls.Container.Data>
 *     <Controls.Container.Data source="{{_secondSource}}" keyProperty="id">
 *        <Controls.list:View on:dragEnter="_dragEnter()"
 *                       itemsDragNDrop="allow">
 *        </Controls.list:View>
 *     <Controls.Container.Data>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _dragStart: function(event, items) {
 *          return new TasksItemsEntity({
 *             items: items
 *          });
 *       },
 *       _dragEnter: function(event, entity) {
 *          var result = false;
 *          if (entity instanceof TasksItemsEntity) {
 *             result = new Record({...});
 *          }
 *          return result;
 *       },
 *       _beforeMount: function() {
 *          this._firstSource = new Source({...});
 *          this._secondSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 */

/**
 * @event Controls/_tile/interface/IDraggable#changeDragTarget Происходит перед изменением позиции, в которую будет перемещен элемент.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 * @param {Controls/_dragnDrop/Entity/Items} entity Сущность перемещения.
 * @param {Types/entity:Record} target Элемент перемещения.
 * @param {MovePosition} position Позиция перемещения.
 * @returns {Boolean}
 * @remark Событие можно использовать для предотвращения перемещения элемента в определенное положение.
 * @example
 * В следующем примере показано, как предотвратить изменение порядка закрепленных элементов.
 * <pre>
 *    <Controls.Container.Data source="{{_viewSource}}" keyProperty="id">
 *       <Controls.list:View on:changeDragTarget="_changeDragTarget()"
 *                      itemsDragNDrop="allow">
 *       </Controls.list:View>
 *    <Controls.Container.Data>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _pinnedProperty: 'pinned',
 *       _changeDragTarget: function(event, entity, target, position) {
 *          return target.get(this._pinnedProperty) !== true;
 *       },
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 */

/*
 * @event Controls/_tile/interface/IDraggable#changeDragTarget Occurs before the change of the position of the drag.
 * @param {Env/Event:Object} eventObject The event descriptor.
 * @param {Controls/_dragnDrop/Entity/Items} entity Drag'n'drop entity.
 * @param {Types/entity:Record} target Target item to move.
 * @param {MovePosition} position Position to move.
 * @returns {Boolean}
 * @remark You can use an event to prevent dragging to a specific position.
 * @example
 * The following example shows how to prevent the change of the order of a pinned item.
 * <pre>
 *    <Controls.Container.Data source="{{_viewSource}}" keyProperty="id">
 *       <Controls.list:View on:changeDragTarget="_changeDragTarget()"
 *                      itemsDragNDrop="allow">
 *       </Controls.list:View>
 *    <Controls.Container.Data>
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _pinnedProperty: 'pinned',
 *       _changeDragTarget: function(event, entity, target, position) {
 *          return target.get(this._pinnedProperty) !== true;
 *       },
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    });
 * </pre>
 */


