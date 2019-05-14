define('Controls/interface/ILookup', [
], function() {

   /**
    * Interface for the input field with a selection from the directory.
    * @interface Controls/interface/ILookup
    * @public
    * @author Капустин И.А.
    */

   /**
    * Open stack popup.
    * @function Controls/interface/ILookup#showSelector
    * @returns {Undefined}
    * @param {PopupOptions[]} popupOptions Stack popup options.
    * @example
    * Open stack with specified configuration.
    * wml
    * <pre>
    *     <Controls.lookup:Input
    *           name="directoriesLookup"
    *           bind:selectedKeys="_selectedKeysDirectories"
    *           source="{{_source}}"
    *           searchParam="title"
    *           keyProperty="id">
    *        <ws:placeholder>
    *           Specify the
    *           <Controls.Selector.Lookup.Link caption="department" on:click="showSelector('department')"/>
    *           and
    *           <Controls.Selector.Lookup.Link caption="company" on:click="showSelector('company')"/>
    *        </ws:placeholder>
    *        <ws:selectorTemplate templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
    *        <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
    *     </Controls.lookup:Input>
    * </pre>
    * js
    * <pre>
    *     Control.extend({
    *        ...
    *
    *        showSelector: function(selectedTab) {
    *            this._children.directoriesLookup.showSelector({
    *                templateOptions: {
    *                   selectedTab: selectedTab
    *                }
    *            });
    *        }
    *
    *        ...
    *
    *     });
    * </pre>
    */

   /**
    * @typedef {Object} PopupOptions
    * @description Stack popup options.
    * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
    * @property {Boolean} modal Determines whether the window is modal.
    * @property {String} className Class names of popup.
    * @property {Boolean} closeOnOutsideClick Determines whether possibility of closing the popup when clicking past.
    * @property {function|String} template Template inside popup.
    * @property {function|String} templateOptions Template options inside popup.
    * @property {Number} minWidth The minimum width of popup.
    * @property {Number} maxWidth The maximum width of popup.
    * @property {Number} width Width of popup.
    */
});
