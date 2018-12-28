define('Controls/Input/interface/ISuggest', [
], function() {

   /**
    * Interface for Input.Suggest.
    *
    * @interface Controls/Input/interface/ISuggest
    * @public
    * @author Герасимов А.М.
    */
   
   /**
    * @typedef {Object} suggestTemplateProp
    * @property {String} templateName Control name, that will be displayed list of items in suggest.
    * @property {Object} templateOptions Options for control , which is specified in the templateName field.
    */
   
   /**
    * @typedef {Object} emptyTemplateProp
    * @property {String} templateName Template name for suggest, which will showing when no result were found.
    * @property {Object} templateOptions Options for template, which is specified in the templateName field.
    */
   
   /**
    * @typedef {Object} suggestFooterTemplate
    * @property {String} templateName Name of template, which will showing in bottom of suggest.
    * @property {Object} templateOptions Options for template, which is specified in the templateName field.
    */
   
   
   /**
    * @name Controls/Input/interface/ISuggest#suggestTemplate
    * @cfg {suggestTemplateProp|null} Template for suggest, that showing search results.
    * @remark Root control of suggest must be Controls/Container/Suggest/List, for this control you can pass in content option a control (such Controls/List or Controls/Grid), that will displaying a list.
    * @example
    * suggestTemplate.wml
    * <pre>
    *    <Controls.Container.Suggest.List>
    *       <Controls.List keyProperty="id">
    *          <ws:itemTemplate>
    *             <ws:partial template="wml!Controls/List/ItemTemplate" displayProperty="city"/>
    *          </ws:itemTemplate>
    *       </Controls.List>
    *    </Controls.Container.Suggest.List>
    * </pre>
    *
    * component with Input/Suggest:
    * <pre>
    *    <Controls.Input.Suggest>
    *       <ws:suggestTemplate templateName="wml!SuggestTemplate">
    *          <ws:templateOptions />
    *       </ws:suggestTemplate>
    *    </Controls.Input.Suggest>
    * </pre>
    */
   
   /**
    * @name Controls/Input/interface/ISuggest#emptyTemplate
    * @cfg {emptyTemplateProp|null} Template for suggest when no results were found.
    * @remark If option set to null, empty suggest won't appear.
    * @example
    * emptyTemplate.wml:
    * <pre>
    *    <div class="emptyTemplate-class">Sorry, no data today</div>
    * </pre>
    *
    * MySuggest.wml:
    * <Controls.Input.Suggest>
    *    <ws:emptyTemplate templateName="wml!emptyTemplate">
    *       <ws:templateOptions showImage={{_showImage}}/>
    *    </ws:emptyTemplate>
    * </Controls.Input.Suggest>
    */
   
   /**
    * @name Controls/Input/interface/ISuggest#footerTemplate
    * @cfg {suggestFooterTemplate} Footer template of suggest.
    * @example
    * myFooter.wml
    * <pre>
    *    <span on:click="_showTasksClick()">show tasks</span>
    * <pre>
    *
    * myFooter.js
    * <pre>
    *    define('myFooter', ['Core/Control'], function(Control) {
    *       return Control.extend({
    *          _showTasksClick: function() {
    *             stackOpener.open();
    *          }
    *       });
    *    });
    * </pre>
    *
    * mySuggest.wml
    * <pre>
    *    <Controls.Input.Suggest>
    *       <ws:suggestFooterTemplate templateName="myFooter">
    *    </Controls.Input.Suggest>
    * </pre>
    */

   /**
    * @name Controls/Input/interface/ISuggest#historyId
    * @cfg {String} Unique id to save input history.
    * @remark If items were previously selected, suggest with this items will be displayed after input get focused.
    * @example
    * <pre>
    *    <Controls.Input.Suggest historyId="myHistoryId"/>
    * </pre>
    */

   /**
    * @name Controls/Input/interface/ISuggest#autoDropDown
    * @cfg {Boolean} Show suggest when the input get focused.
    * @example
    * In this example suggest will shown after input get focused.
    * <pre>
    *    <Controls.Input.Suggest autoSuggest={{true}}/>
    * </pre>
    */
   
   /**
    * @name Controls/Input/interface/ISuggest#displayProperty
    * @cfg {String} Defines which field from suggest list will be used as text after selecting an option.
    * @remark
    * @example
    * myModule.js
    * <pre>
    *    define('myModule', ['Core/Control', 'wml!myModule', 'WS.Data/Source/Memory'], function(Control, template, Memory) {
    *       return Control.extend({
    *          _template: template,
    *          _suggestValue: null,
    *          _source: null,
    *
    *          _beforeMount: function() {
    *             this._source = new Memory({
    *                rawData: [
    *                   {id: 0, city: 'Yaroslavl'},
    *                   {id: 1, city: 'Moscow'}
    *                ]
    *                idProperty: 'id'
    *             });
    *          },
    *
    *          _choose: function(event, value) {
    *             this._suggestValue = value;
    *          }
    *       });
    *    });
    * </pre>
    * myModule.wml
    * <pre>
    *    <div>
    *       <Controls.Input.Suggest displayProperty="city" on:choose="_choose()"/>
    *    </div>
    *    ChosenValue: {{_suggestValue || 'Nothing were chosen'}}
    * </pre>
    */

   /**
    * @event Controls/Input/interface/ISuggest#choose Occurs when user selects item from suggest.
    * @param {String} value Selected value.
    * @example
    * myModule.js
    * <pre>
    *    define('myModule', ['Core/Control', 'wml!myModule', 'WS.Data/Source/Memory'], function(Control, template, Memory) {
    *       return Control.extend({
    *          _template: template,
    *          _suggestValue: null,
    *          _source: null,
    *
    *          _beforeMount: function() {
    *             this._source = new Memory({
    *                rawData: [
    *                   {id: 0, city: 'Yaroslavl'},
    *                   {id: 1, city: 'Moscow'}
    *                ]
    *                idProperty: 'id'
    *             });
    *          },
    *
    *          _choose: function(event, value) {
    *             this._suggestValue = value;
    *          }
    *       });
    *    });
    * </pre>
    * myModule.wml
    * <pre>
    *    <div>
    *       <Controls.Input.Suggest displayProperty='city' on:choose="_choose()"/>
    *    </div>
    *    ChosenValue: {{_suggestValue || 'Nothing were chosen'}}
    * </pre>
    */
});
