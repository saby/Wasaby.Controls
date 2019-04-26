define('Controls/Toolbar', [
   'Controls/toolbars'
], function(toolbarLib) {
   'use strict';

   /**
    * Graphical control element on which buttons, menu and other input or output elements are placed.
    * <a href="/materials/demo-ws4-toolbar">Demo-example</a>.
    *
    * @class Controls/toolbars:View
    * @extends Core/Control
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/List/interface/IHierarchy
    * @control
    * @public
    * @category Toolbar
    * @author Михайловский Д.С.
    * @demo Controls-demo/Toolbar/ToolbarPG
    */

   /**
    * @name Controls.toolbars:View#source
    * @cfg {Types/source:Base} Object that implements ISource interface for data access.
    * @default undefined
    * @remark
    * The item can have an property 'title' and 'showType'. 'Title' determine item caption. 'ShowType' determine where display item, 0 - show in menu,
    * 1 - show on menu and toolbar, 2 - show in toolbar.
    * @example
    * Tabs buttons will be rendered data from _source. First item render with left align, other items render with defult, right align.
    * <pre>
    *    <Controls.toolbars:View
    *              keyProperty="key"
    *              source="{{_source}}"
    *    />
    * </pre>
    * <pre>
    *    _source: new Memory({
    *        idProperty: 'key',
    *        data: [
    *        {
    *           id: '1'
    *           showType: 2,
    *           icon: 'icon-Time',
    *           '@parent': false,
    *           parent: null
    *        },
    *        {
    *           id: '2',
    *           title: 'Moscow',
    *           '@parent': false,
    *           parent: null
    *        },
    *        {
    *           id: '3',
    *           title: 'St-Petersburg',
    *           '@parent': false,
    *           parent: null
    *        }
    *        ]
    *    })
    * </pre>
    */

   /**
    * @name Controls.toolbars:View#itemsSpacing
    * @cfg {Types/source:Base} Type of spacing between items
    * @default medium
    * @example
    * Tabs buttons will be rendered data from _source. First item render with left align, other items render with defult, right align.
    * <pre>
    *    <Controls.toolbars:View
    *              keyProperty="key"
    *              source="{{_source}}"
    *              itemsSpacing="big"
    *    />
    * </pre>
    */

   /**
    * @event Controls.toolbars:View#itemClick Occurs when item was clicked.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Record} item Clicked item.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.toolbars:View on:itemClick="onToolbarItemClick()" />
    * </pre>
    * JS:
    * <pre>
    *    onToolbarItemClick: function(e, selectedItem) {
    *       var itemId = selectedItem.get('id');
    *       switch (itemId) {
    *          case 'remove':
    *             this._removeItems();
    *             break;
    *          case 'move':
    *             this._moveItems();
    *             break;
    *    }
    * </pre>
    */

   /**
    * @name Controls.toolbars:View#itemTemplate
    * @cfg {Function} Template for item render.
    * @remark
    * To determine the template, you should call the base template 'wml!Controls.toolbars:View/ToolbarItemTemplate'.
    * The template is placed in the component using the ws:partial tag with the template attribute.
    * You can change the display of records by setting button options values:
    * <ul>
    *    <li>buttonReadOnly</li>
    *    <li>buttonTransparent</li>
    *    <li>buttonStyle</li>
    *    <li>buttonCaption</li>
    *    <li>buttonViewMode</li>
    *    <li>displayProperty - name of displaying text field, default value "tittle"</li>
    * <ul>
    * @example
    * <pre>
    *    <Controls.toolbars:View
    *       source="{{_source}}"
    *       on:itemClick="_itemClick()"
    *    >
    *       <ws:itemTemplate>
    *          <ws:partial
    *             template="wml!Controls.toolbars:View/ToolbarItemTemplate"
    *             buttonStyle="{{myStyle}}"
    *             buttonReadOnly="{{readOnlyButton}}"
    *             buttonTransparent="{{myButtonTransparent}}"
    *             buttonViewMode="{{myButtonViewMode}}"
    *             displayProperty="title"
    *             iconStyleProperty="iconStyle"
    *             iconProperty="icon"
    *          />
    *      </ws:itemTemplate>
    * </pre>
    */

   return toolbarLib.View;
});
