define('Controls/interface/IPrinter', [], function() {

   /**
    * Interface for printers. Printer is an action that exports a file to a certain format (e.g., PDF, Excel).
    *
    * @interface Controls/interface/IPrinter
    * @public
    * @author Зайцев А.С.
    *
    * @see Unload/Action/PDF
    * @see Unload/Action/Excel
    */

   /**
    * @typedef {Object} Column
    * @property {String} field Name of the field that contains data to be rendered in the column.
    * @property {String} title Header of the column.
    */

   /**
    * Prints items.
    * @function Controls/interface/IPrinter#execute
    * @param {Object} params Additional information.
    * @param {String} params.name File name to use for exported file.
    * @param {Boolean} params.pageLandscape Determines whether the page will be in portrait or landscape orientation.
    * @param {Array.<Column>} params.columns List of columns to export.
    * @param {String} params.parentProperty Name of the field that contains item's parent identifier.
    * @example
    * The following example shows how to print something.
    * <pre>
    *    var params = {
    *       name: 'myFile',
    *       pageLandscape: true,
    *       columns: [{ field: 'Name', name: 'Name' }, { field: 'Date', name: 'Date' }],
    *       parentProperty: 'parent'
    *    };
    *    this._children.printer.execute(params);
    * </pre>
    */

   /**
    * @name Controls/interface/IPrinter#sorting
    * @cfg {Object.<string, 'ASC' | 'DESC'>} Sorting config (object keys - field names; values - sorting type).
    * @example
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._sorting = {
    *          Name: 'DESC'
    *       }
    *    }
    * </pre>
    * WML:
    * <pre>
    *    <Unload.Action.PDF sorting="{{ _sorting }}" />
    * </pre>
    */
});
