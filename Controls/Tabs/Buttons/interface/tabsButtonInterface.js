define('Controls/Tabs/Buttons/interface/tabsButtonsInterface', [
], function() {

   /**
    * Interface for components that use data source.
    *
    * @interface Controls/Tabs/Buttons/interface/tabsButtonsInterface
    * @mixes Controls/interface/ISource
    * @public
    */

   /**
    * @name Controls/interface/ISource#align
    * @cfg {String} Option determine align of item tab.
    * @example
    * Tabs buttons will be rendered data from _source. First item render with left align, other items render with defult, right align.
    * <pre>
    *    <Controls.Tabs.Buttons
    *              bind:selectedKey='_selectedKey'
    *              keyProperty="key"
    *              source="{{_source}}"
    *    />
    * </pre>
    * <pre>
    *    _selectedKey: '1',
    *    _source: new Memory({
    *        idProperty: 'key',
    *        data: [
    *        {
    *           key: '1',
    *           title: 'Yaroslavl',
    *           align: 'left'
    *        },
    *        {
    *           key: '2',
    *           title: 'Moscow'
    *        },
    *        {
    *           key: '3',
    *           title: 'St-Petersburg'
    *        }
    *        ]
    *    })
    * </pre>
    *
    */
});
