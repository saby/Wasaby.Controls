define('Controls/interface/IPrinter', [], function() {

   /**
    * Interface for printers.
    *
    * @interface Controls/interface/IPrinter
    * @public
    * @author Зайцев А.С.
    */

   /**
    * @typedef {Object} Column
    * @property {String} field Name of the field that contains data to be rendered in the column.
    * @property {String} title Header of the column.
    */

   /**
    * Prints items.
    * @function Controls/interface/IPrinter#print
    * @param {Object} params Additional information.
    * @param {String} params.name File name to use for exported file.
    * @param {Boolean} params.pageLandscape Determines whether the page will be in portrait or landscape orientation.
    * @param {Array.<Column>} params.columns List of columns to export.
    * @param {String} params.parentProperty Name of the field that contains item's parent identifier.
    * @param {Boolean} params.sync Determines whether the file should be downloaded synchronously.
    */

   /**
    * @name Controls/interface/IPrinter#source
    * @cfg {WS.Data/Source/ISource} Object that implements ISource interface for data access.
    */

   /**
    * @name Controls/interface/IPrinter#sorting
    * @cfg {Object} Sorting config (object keys - field names; values - sorting type: 'ASC' - ascending or 'DESC' - descending).
    */
});
