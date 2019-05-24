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
    *    <Controls.list:View
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

   /**
    * @event Controls/interface/IFilter#filterChanged Событие filterChanged срабатывает, когда фильтр был изменён.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
    * @param {Object} Изменённый фильтр
    * @remark
    * Важно помнить, что опции имутабельны (https://ru.m.wikipedia.org/wiki/Неизменяемый_объект), поэтому фильтр в аргументах события отличается от фильтра в опциях контрола.
    * @example
    * WML:
    * <pre>
    *    <Controls.filter:Controller on:filterChanged="filterChanged()" filter="{{ _filter }}"/>
    *    <pre>{{ _filterString }}</pre>
    * </pre>
    * JS:
    * <pre>
    *    _filter: null,
    *    _beforeMount: function() {
    *       this._filter = {
    *          city: 'Yaroslavl'
    *       }
    *    },
    *    filterChanged: function(e, filter) {
    *       this._filter = filter; //Т.к. в приведённом примере опция filter не связана с помощью bind c состоянием, необходимо обновить фильтр на состоянии самостоятельно.
    *       this._filterString = JSON.stringify(this._filter, null, 4);
    *    }
    * </pre>
    * @see filter
    */

   /**
    * @event Controls/interface/IFilter#filterChangedENG Occurs when filter were changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Object} new filter
    * @noshow
    * @remark
    * It's important to remember that we don't mutate filter from options (or any other option). So filter in the event arguments and filter in the component's options are not the same.
    * @example
    * WML:
    * <pre>
    *    <Controls.filter:Controller on:filterChanged="filterChanged()" filter="{{ _filter }}"/>
    *    <pre>{{ _filterString }}</pre>
    * </pre>
    * JS:
    * <pre>
    *    _filter: null,
    *    _beforeMount: function() {
    *       this._filter = {
    *          city: 'Yaroslavl'
    *       }
    *    },
    *    filterChanged: function(e, filter) {
    *       this._filter = filter; //We don't use binding in this example so we have to update state manually.
    *       this._filterString = JSON.stringify(this._filter, null, 4);
    *    }
    * </pre>
    * @see filter
    */

});
