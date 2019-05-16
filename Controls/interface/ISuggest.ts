/**
 * @typedef {Object} ISuggestTemplateProp
 * @property {String} templateName Control name, that will be displayed list of items in suggest.
 * @property {Object} templateOptions Options for control , which is specified in the templateName field.
 */
export interface ISuggestTemplateProp {
   templateName: string;
   templateOptions: object;
}

/**
 * @typedef {Object} IEmptyTemplateProp
 * @property {String} templateName Template name for suggest, which will showing when no result were found.
 * @property {Object} templateOptions Options for template, which is specified in the templateName field.
 */
export interface IEmptyTemplateProp {
   templateName: string;
   templateOptions: object;
}

/**
 * @typedef {Object} ISuggestFooterTemplate
 * @property {String} templateName Name of template, which will showing in bottom of suggest.
 * @property {Object} templateOptions Options for template, which is specified in the templateName field.
 */
export interface ISuggestFooterTemplate {
   templateName: string;
   templateOptions: object;
}

/**
 * Interface for Input.Suggest.
 *
 * @interface Controls/interface/ISuggest
 * @public
 * @author Герасимов А.М.
 */
interface ISuggest {
   readonly _options: {
      /**
       * @name Controls/interface/ISuggest#suggestTemplate
       * @cfg {ISuggestTemplateProp|null} Template for suggest, that showing search results.
       * @remark Root control of suggest must be Controls/Container/Suggest/List, for this control you can pass in content option a control (such Controls.list:View or Controls/grid:View), that will displaying a list.
       * @remark You can set width of suggestions popup by adding own class on suggestTemplate and set min-width by this class. By default width of the suggest is equal input field width.
       * @editor function
       * @example
       * suggestTemplate.wml
       * <pre>
       *    <Controls.Container.Suggest.List attr:class="myClass">
       *       <Controls.list:View keyProperty="id">
       *          <ws:itemTemplate>
       *             <ws:partial template="Controls/list:ItemTemplate" displayProperty="city"/>
       *          </ws:itemTemplate>
       *       </Controls.list:View>
       *    </Controls.Container.Suggest.List>
       * </pre>
       *
       * suggestTemplate.css
       * <pre>
       *    .myClass {
       *       min-width: 300px;
       *    }
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
      suggestTemplate: ISuggestTemplateProp | null;

      /**
       * @name Controls/interface/ISuggest#emptyTemplate
       * @cfg {IEmptyTemplateProp|null} Template for suggest when no results were found.
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
      emptyTemplate: IEmptyTemplateProp | null;

      /**
       * @name Controls/interface/ISuggest#footerTemplate
       * @cfg {ISuggestFooterTemplate} Footer template of suggest.
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
      footerTemplate: ISuggestFooterTemplate;

      /**
       * @name Controls/interface/ISuggest#historyId
       * @cfg {String} Unique id to save input history.
       * @remark If items were previously selected, suggest with this items will be displayed after input get focused.
       * @example
       * <pre>
       *    <Controls.Input.Suggest historyId="myHistoryId"/>
       * </pre>
       */
      historyId: string;

      /**
       * @name Controls/interface/ISuggest#autoDropDown
       * @cfg {Boolean} Show suggest when the input get focused.
       * @example
       * In this example suggest will shown after input get focused.
       * <pre>
       *    <Controls.Input.Suggest autoSuggest={{true}}/>
       * </pre>
       */
      autoDropDown: boolean;

      /**
       * @name Controls/interface/ISuggest#displayProperty
       * @cfg {String} Defines which field from suggest list will be used as text after selecting an option.
       * @remark
       * @example
       * myModule.js
       * <pre>
       *    define('myModule', ['Core/Control', 'wml!myModule', 'Types/source:Memory'], function(Control, template, Memory) {
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
      displayProperty: string;

      /**
       * @event Occurs when user selects item from suggest.
       * @name Controls/interface/ISuggest#choose
       * @param {String} value Selected value.
       * @example
       * myModule.js
       * <pre>
       *    define('myModule', ['Core/Control', 'wml!myModule', 'Types/source:Memory'], function(Control, template, Memory) {
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
      choose: string;
   };
}

export default ISuggest;
