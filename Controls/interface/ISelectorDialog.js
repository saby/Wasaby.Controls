define('Controls/interface/ISelectorDialog', [
], function() {

   /**
    * Interface for controls that open selector dialog.
    * @interface Controls/interface/ISelectorDialog
    * @public
    * @author Капустин И.А.
    */

   /**
    * @name Controls/interface/ISelectorDialog#selectorTemplate
    * @cfg {ConfigSelector[]}
    * @example
    * In the following example, we will create a lookup by specifying selectorTemplate, before this we define the templateOptions value in advance.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       searchParam="title"
    *       keyProperty="id"
    *       <ws:selectorTemplate templateName="Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector" templateOptions="{{_templateOptions}}" popupOptions="{{_popupOptions}}"/>
    *    </Controls.lookup:Input>
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._source = new Memory();
    *       this._templateOptions = {
    *          handlers: {
    *             onSelectComplete: function() {}
    *          }
    *       };
    *       this._popupOptions = {
    *          width: 400
    *       };
    *    }
    * </pre>
    */

   /**
    * @typedef {Object} ConfigSelector
    * @property {Function} templateName Items selection panel template.
    * @property {Object} templateOptions Popup template options.
    * @property {Object} popupOptions Stack popup options.
    */

});
