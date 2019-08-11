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
    * @author Капустин И.А.
    */

   /**
    * @name Controls/interface/ISelectorDialog#selectorTemplate
    * @cfg {ConfigSelector[]}
    * @example
    * В следующем примере мы создадим поле выбора из справочника, указав selectorTemplate, перед этим мы заранее определим значение templateOptions.
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

   /*
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
    * @event Controls/_interface/ISelectorDialog#selectorCallback Происходит при выборе элементов с помощью селектора.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {RecordSet} currentItems Текущий список элементов в окне выбора из справочника.
    * @param {RecordSet} newItems Список элементов, выбранных из селектора.
    */
   /*
    * @event Controls/_interface/ISelectorDialog#selectorCallback Occurs when selected items with selector.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {RecordSet} currentItems Current list of items in Lookup.
    * @param {RecordSet} newItems List of items selected from selector.
    */

   /**
    * @typedef {Object} ConfigSelector
    * @property {Function} templateName Шаблон панели выбора элементов.
    * @property {Object} templateOptions Параметры шаблона всплывающего окна.
    * @property {Object} popupOptions Параметры шаблона стекового окна.
    */

   /*
    * @typedef {Object} ConfigSelector
    * @property {Function} templateName Items selection panel template.
    * @property {Object} templateOptions Popup template options.
    * @property {Object} popupOptions Stack popup options.
    */

});
