define('Controls/interface/IFilter', [
], function() {

   /**
    * Filter interface.
    *
    * @interface Controls/interface/IFilter
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/interface/IFilter#filter
    * @cfg {Object} Filter configuration - object with field names and their values.
    * @example
    * In this example, the list will be displayed 2 items.
    * TMPL:
    * <pre>
    *    <Controls.List
    *       keyProperty="id"
    *       filter={{_filter}}
    *       source="{{_source}}" />
    * </pre>
    * JS:
    * <pre>
    *    this._filter = {id: ['1', '2']};
    *    this._source = new Memory({
    *      idProperty: 'id',
    *      data: [
    *         {
    *            id: '1',
    *            title: 'Yaroslavl'
    *         },
    *         {
    *            id: '2',
    *            title: 'Moscow'
    *         },
    *         {
    *            id: '3',
    *            title: 'St-Petersburg'
    *         }
    *      ]
    *    });
    * </pre>
    */

});
