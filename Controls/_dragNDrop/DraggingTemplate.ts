import Control = require('Core/Control');
import template = require('wml!Controls/_dragNDrop/DraggingTemplate/DraggingTemplate');
import 'css!theme?Controls/_dragNDrop/DraggingTemplate/DraggingTemplate';

   var MAX_ITEMS_COUNT = 999;

   var _private = {
      getCounterText: function(itemsCount) {
         var result;
         if (itemsCount > MAX_ITEMS_COUNT) {
            result = MAX_ITEMS_COUNT + '+';
         } else if (itemsCount > 1) {
            result = itemsCount;
         }
         return result;
      }
   };

   /**
    * Standard dragging template for the list.
    * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
    * @class Controls/_dragNDrop/DraggingTemplate
    * @extends Core/Control
    * @mixes Controls/_dragNDrop/DraggingTemplate/Styles
    * @control
    * @public
    * @author Авраменко А.С.
    * @category DragNDrop
    */

   /**
    * @name Controls/_dragNDrop/DraggingTemplate#mainText
    * @cfg {String} Main information about the entity being moved.
    * @default Запись реестра
    * @example
    * The following example shows how to use a standard dragging template.
    * <pre>
    *    <Controls.list:View source="{{_viewSource}}"
    *                   keyProperty="id"
    *                   on:dragStart="_onDragStart()"
    *                   itemsDragNDrop="{{true}}">
    *       <ws:draggingTemplate>
    *          <ws:partial template="Controls/_dragNDrop/DraggingTemplate"
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
    * @name Controls/_dragNDrop/DraggingTemplate#additionalText
    * @cfg {String} Additional information about the entity being moved.
    * @example
    * The following example shows how to use a standard dragging template.
    * <pre>
    *    <Controls.list:View source="{{_viewSource}}"
    *                   keyProperty="id"
    *                   on:dragStart="_onDragStart()"
    *                   itemsDragNDrop="{{true}}">
    *       <ws:draggingTemplate>
    *          <ws:partial template="Controls/_dragNDrop/DraggingTemplate"
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
    * @name Controls/_dragNDrop/DraggingTemplate#image
    * @cfg {String} A image of the entity being moved.
    * @remark The option must contain a link to the image. If this option is specified, the logo option is not applied.
    * @example
    * The following example shows how to use a standard dragging template.
    * <pre>
    *    <Controls.list:View source="{{_viewSource}}"
    *                   keyProperty="id"
    *                   on:dragStart="_onDragStart()"
    *                   itemsDragNDrop="{{true}}">
    *       <ws:draggingTemplate>
    *          <ws:partial template="Controls/_dragNDrop/DraggingTemplate"
    *                      mainText="{{draggingTemplate.entity._options.mainText}}"
    *                      image="/resources/imageForDragTemplate.jpg"
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
    *             additionalText: mainItem.get('title')
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
    * @name Controls/_dragNDrop/DraggingTemplate#logo
    * @cfg {String} A logo of the entity being moved.
    * @default icon-DocumentUnknownType
    * @remark The full list of possible values can be found <a href="/docs/js/icons/">here</a>. This option is used if the image option is not specified.
    * @example
    * The following example shows how to use a standard dragging template.
    * <pre>
    *    <Controls.list:View source="{{_viewSource}}"
    *                   keyProperty="id"
    *                   on:dragStart="_onDragStart()"
    *                   itemsDragNDrop="{{true}}">
    *       <ws:draggingTemplate>
    *          <ws:partial template="Controls/_dragNDrop/DraggingTemplate"
    *                      mainText="{{draggingTemplate.entity._options.mainText}}"
    *                      logo="icon-Album"
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
    *             additionalText: mainItem.get('title')
    *          });
    *       },
    *       _beforeMount: function() {
    *          this._viewSource= new Source({...});
    *       }
    *       ...
    *    });
    * </pre>
    */

   export = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._itemsCount = _private.getCounterText(options.entity.getItems().length);
      }
   });

