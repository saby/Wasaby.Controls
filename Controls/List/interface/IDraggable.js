define('Controls/List/interface/IDraggable', ['Controls/_lists/interface/IDraggable'], function(Control) {
   /**
    * Interface to move elements of the list by using drag'n'drop.
    * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
    *
    * @interface Controls/List/interface/IDraggable
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls.list:View/interface/IDraggable#itemsDragNDrop
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
    * @name Controls.list:View/interface/IDraggable#draggingTemplate
    * @cfg {Function} Template of the entity to be moved.
    * @default Controls/DragNDrop/DraggingTemplate
    * @remark In the process of moving, a thumbnail of the entity being moved is shown near the cursor.
    * @example
    * The following example shows how to use a standard dragging template.
    * <pre>
    *    <Controls.list:View source="{{_viewSource}}"
    *                   keyProperty="id"
    *                   on:dragStart="_onDragStart()"
    *                   itemsDragNDrop="allow">
    *       <ws:draggingTemplate>
    *          <ws:partial template="Controls/DragNDrop/DraggingTemplate"
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
    * @event Controls.list:View/interface/IDraggable#dragStart Occurs before the user starts dragging an element in the list.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {Array.<String>} items An array of identifiers for items to be moved.
    * @returns {Controls/DragNDrop/Entity/Items)
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
    * @variant {String} after Inserts the moved items after the specified item.
    * @variant {String} before Inserts the moved items before the specified item.
    * @variant {String} on Inserts the moved items into the specified item.
    */

   /**
    * @event Controls.list:View/interface/IDraggable#dragEnd Occurs after the user has finished dragging an item in the list.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {Controls/DragNDrop/Entity/Items} entity Drag'n'drop entity.
    * @param {Types/entity:Record} target Target item to move.
    * @param {MovePosition} position Position to move.
    * @example
    * The following example shows how to move items using Controls.list:View/Mover after the drag is complete.
    * <pre>
    *     <Controls.Container.Data source="{{_viewSource}}" keyProperty="id">
    *        <Controls.list:View on:dragEnd="_dragEnd()"
    *                       itemsDragNDrop="allow">
    *        </Controls.list:View>
    *        <Controls.list:View.Mover name="listMover">
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
    * @variant {Boolean} Allow dragging items to the current list from another list.
    * @variant {Types/entity:Record} Allow dragging items to the current list from another list, the returned entry will be displayed in the list as a pointer to the move location.
    */

   /**
    * @event Controls.list:View/interface/IDraggable#dragEnter Occurs before moving items from another list to the current list.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {Controls/DragNDrop/Entity/Items} entity Drag'n'drop entity.
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
    * @event Controls.list:View/interface/IDraggable#changeDragTarget Occurs before the change of the position of the drag.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {Controls/DragNDrop/Entity/Items} entity Drag'n'drop entity.
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


   return Control;
});
