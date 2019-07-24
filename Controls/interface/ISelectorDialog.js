define('Controls/interface/ISelectorDialog', [
], function() {
   /**
    * Интерфейс для контролов, открывающих диалоговое окно выбора.
    * @interface Controls/interface/ISelectorDialog
    * @public
    * @author Капустин И.А.
    */
   /*
    * Interface for controls that open selector dialog.
    * @interface Controls/interface/ISelectorDialog
    * @public
    * @author Kapustin I.A.
    */

   /**
    * @name Controls/interface/ISelectorDialog#selectorTemplate
    * @cfg {SelectorTemplate[]} Конфиг справочника.
    * @example
    * В следующем примере создадем Controls.lookup:Input, ему указываем selectorTemplate, templateOptions и popupOptions.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       searchParam="title"
    *       keyProperty="id"
    *       <ws:selectorTemplate templateName="Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector"
    *                            templateOptions="{{_templateOptions}}"
    *                            popupOptions="{{_popupOptions}}"/>
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
   /*
    * @name Controls/interface/ISelectorDialog#selectorTemplate
    * @cfg {SelectorTemplate[]} Directory config.
    * @example
    * In the following example, we will create a lookup by specifying selectorTemplate, before this we define the templateOptions and popupOptions value in advance.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       searchParam="title"
    *       keyProperty="id"
    *       <ws:selectorTemplate templateName="Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector"
    *                            templateOptions="{{_templateOptions}}"
    *                            popupOptions="{{_popupOptions}}"/>
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
    * @typedef {Object} SelectorTemplate
    * @property {Function} templateName Шаблон панели выбора элементов.
    * @property {Object} templateOptions Параметры шаблона всплывающего окна.
    * @property {Object} popupOptions Параметры всплывающего окна.
    */
   /*
    * @typedef {Object} SelectorTemplate
    * @property {Function} templateName Items selection panel template.
    * @property {Object} templateOptions Popup template options.
    * @property {Object} popupOptions Stack popup options.
    */
});
