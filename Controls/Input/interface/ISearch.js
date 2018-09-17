define('Controls/Input/interface/ISearch', [
], function() {

   /**
    * Interface for Search inputs.
    *
    * @interface Controls/Input/interface/ISearch
    * @public
    */

   /**
    * @name Controls/Input/interface/ISearch#searchParam
    * @cfg {String} Name of the field that search should operate on. Search value will insert in filter by this parameter.
    */

   /**
    * @name Controls/Input/interface/ISearch#minSearchLength
    * @cfg {Number} Minimum query length to start searching.
    */

   /**
    * @name Controls/Input/interface/ISearch#searchDelay
    * @cfg {Number} Delay before search starts.
    */
});
