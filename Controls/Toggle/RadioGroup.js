define('Controls/Toggle/RadioGroup', [
   'Core/Control',
   'Controls/Controllers/SourceController',
   'wml!Controls/Toggle/RadioGroup/RadioGroup',
   'wml!Controls/Toggle/RadioGroup/resources/ItemTemplate',
   'css!Controls/Toggle/RadioGroup/RadioGroup',
   'css!Controls/Toggle/resources/SwitchCircle/SwitchCircle'
], function(Control, SourceController, template, defaultItemTemplate) {

   /**
    * Controls are designed to give users a choice among two or more settings.
    *
    * <a href="/materials/demo-ws4-switchers">Demo-example</a>.
    *
    * @class Controls/Toggle/RadioGroup
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/ISingleSelectable
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Toggle
    * @demo Controls-demo/RadioGroup/RadioGroupDemo
    *
    * @mixes Controls/Toggle/resources/SwitchCircle/SwitchCircleStyles
    * @mixes Controls/Toggle/RadioGroup/RadioGroupStyles
    */

   /**
    * @name Controls/interface/IItemTemplate#itemTemplate
    * @cfg {Function} Template for item render.
    * @default Base template "tmpl!Controls\Toggle\RadioGroup\resources\ItemTemplate"
    * @remark
    * To determine the template, you should call the base template "wml!Controls\Toggle\RadioGroup\resources\ItemTemplate".
    * The template is placed in the component using the <ws:partial> tag with the template attribute.
    *
    * By default, the base template wml!Controls/Dropdown/resources/template/itemTemplate will display only the 'title' field.
    * You can change the display of records by setting their values ​​for the following options:
    * <ul>
    *    <li>displayProperty - defines the display field of the record.</li>
    * </ul>
    * You can redefine content using the contentTemplate option.
    * You can change the display of records by setting their values ​​for the following options:
    * <ul>
    *    <li>selected - defines the display field in selected or unselected states.</li>
    *    <li>readOnly - defines the display field in readOnly or non readOnly states.</li>
    * </ul>
    * @example
    * RadioGroup with iteemTemplate and contentTemplate.
    * <pre>
    *    <Controls.Toggle.RadioGroup ... >
    *       <ws:itemTemplate>
    *          <ws:partial
    *             template="wml!Controls/Toggle/RadioGroup/resources/ItemTemplate" >
    *             <ws:contentTemplate>
    *                <span attr:class="controls-RadioItem__caption_{{selected ? 'selected' : 'unselected'}}_{{readOnly ? 'disabled' : 'enabled'}}_custom controls-RadioItem__caption_custom">
    *                </span>
    *             </ws:contentTemplate>
    *          </ws:partial>
    *       </ws:itemTemplate>
    *    </Controls.Toggle.RadioGroup>
    * </pre>
    * @see itemTemplateProperty
    */

   /**
    * @name Controls/interface/IItemTemplate#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render.
    * @default If not set, itemTemplate is used instead.
    * @remark
    * To determine the template, you should call the base template "wml!Controls\Toggle\RadioGroup\resources\ItemTemplate".
    * The template is placed in the component using the <ws:partial> tag with the template attribute.
    *
    * By default, the base template wml!Controls/Dropdown/resources/template/itemTemplate will display only the 'title' field.
    * You can change the display of records by setting their values ​​for the following options:
    * <ul>
    *    <li>displayProperty - defines the display field of the record.</li>
    * </ul>
    * You can redefine content using the contentTemplate option.
    * You can change the display of records by setting their values ​​for the following options:
    * <ul>
    *    <li>selected - defines the display field in selected or unselected states.</li>
    *    <li>readOnly - defines the display field in readOnly or non readOnly states.</li>
    * </ul>
    * @example
    * Example description.
    * <pre>
    *    <Controls.Toggle.RadioGroup itemTemplateProperty="myTemplate" source="{{_source}}...>
    *    </Controls.Toggle.RadioGroup>
    * </pre>
    * myTemplate
    * <pre>
    *    <ws:partial
    *       template="wml!Controls/Toggle/RadioGroup/resources/ItemTemplate" >
    *       <ws:contentTemplate>
    *          <span attr:class="controls-RadioItem__caption_{{selected ? 'selected' : 'unselected'}}_{{readOnly ? 'disabled' : 'enabled'}} controls-RadioItem__caption">
    *             {{item['caption']}}
    *          </span>
    *       </ws:contentTemplate>
    *    </ws:partial>
    * </pre>
    * <pre>
    *    _source: new Memory({
    *       idProperty: 'id',
    *       data: [
    *          {id: 1, title: 'I agree'},
    *          {id: 2, title: 'I not decide'},
    *          {id: 4, title: 'Will not seem', caption: 'I not agree',  myTemplate: 'wml!.../myTemplate'}
    *       ]
    *    })
    * </pre>
    * @see itemTemplate
    */

    /**
    * @name Controls/Toggle/RadioGroup#direction
    * @cfg {string} Arrangement of elements in the container.
    * @variant horizontal Elements are located one after another.
    * @variant vertical Elements are located one after another.
    * @default Horizontal
    * @remark It's only displaying option, it's only regulates the location of the control.
    * @example
    * Vertical orientation.
    * <pre>
    *    <Controls.Toggle.RadioGroup direction="horizontal"/>
    * </pre>
    */

   var _private = {
      initItems: function(source, self) {
         self._sourceController = new SourceController({
            source: source
         });
         return self._sourceController.load().addCallback(function(items) {
            return items;
         });
      }
   };

   var Radio = Control.extend({
      _template: template,
      _defaultItemTemplate: defaultItemTemplate,

      _beforeMount: function(options, context, receivedState) {
         if (receivedState) {
            this._items = receivedState;
         } else {
            return _private.initItems(options.source, this).addCallback(function(items) {
               this._items = items;
               return items;
            }.bind(this));
         }
      },

      _beforeUpdate: function(newOptions) {
         var self = this;
         if (newOptions.source && newOptions.source !== this._options.source) {
            return _private.initItems(newOptions.source, this).addCallback(function(items) {
               this._items = items;
               self._forceUpdate();
            }.bind(this));
         }
      },

      _selectKeyChanged: function(e, item, keyProperty) {
         if (!this._options.readOnly) {
            this._notify('selectedKeyChanged', [item.get(keyProperty)]);
         }
      }
   });

   Radio.getDefaultOptions = function getDefaultOptions() {
      return {
         direction: 'vertical'
      };
   };

   Radio._private = _private;

   return Radio;
});
