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
    * @cfg {Function} Items selection panel template.
    * @example
    * In the following example, we will create a lookup by specifying selectorTemplate, before this we define the templateOptions value in advance.
    * WML:
    * <pre>
    *    <Controls.Selector.Lookup
    *       source="{{_source}}"
    *       searchParam="title"
    *       keyProperty="id"
    *       <ws:selectorTemplate templateName="Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector" templateOptions="{{_templateOptions}}"/>
    *    </Controls.Selector.Lookup>
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
    *    }
    * </pre>
    */
});
