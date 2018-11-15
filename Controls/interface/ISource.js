define('Controls/interface/ISource', [
], function() {

   /**
    * Interface for components that use data source.
    *
    * @interface Controls/interface/ISource
    * @public
    * @author Крайнов Д.О.
    */

   /**
    * @name Controls/interface/ISource#source
    * @cfg {WS.Data/Source/Base} Object that implements ISource interface for data access.
    * @example
    * The list will be rendered data from _source
    * <pre>
    *    <Controls.List
    *       source = "{{_source}}"
    *       keyProperty="key">
    *    </Controls.List>
    * </pre>
    * <pre>
    *    _source: new Memory({
    *       idProperty: 'key',
    *       data: [
    *       {
    *          key: '1',
    *          title: 'Yaroslavl'
    *       },
    *       {
    *          key: '2',
    *          title: 'Moscow'
    *       },
    *       {
    *          key: '3',
    *          title: 'St-Petersburg'
    *       }
    *       ]
    *    })
    * </pre>
    * @see link to source paper
    */

   /**
    * @name Controls/interface/ISource#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item.
    * @example
    * The option selectedKey contains a value from the "key" field of the selected record.
    * <pre>
    *    <Controls.List
    *       source = "{{_source}}"
    *       keyProperty="id">
    *    </Controls.List>
    * </pre>
    * <pre>
    *    _source: new Memory({
    *       idProperty: 'key',
    *       data: [
    *       {
    *          key: '1',
    *          title: 'Yaroslavl'
    *       },
    *       {
    *          key: '2',
    *          title: 'Moscow'
    *       },
    *       {
    *          key: '3',
    *          title: 'St-Petersburg'
    *       }
    *       ]
    *    })
    * </pre>
    *
    */
});
