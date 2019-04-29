import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/Lookup/Lookup');


/**
 * The Lookup control allows you to select a value from a dialog or suggest containing a list of possible values.
 * Сan be displayed in single-line and multi-line mode.
 * Supports single and multiple selection.
 * Here you can see <a href="/materials/demo-ws4-engine-selector-lookup">demo-example</a>.
 *
 * @class Controls/_lookup/Lookup
 * @mixes Controls/interface/ISelectedCollection
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/interface/ISearch
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/ISuggest
 * @mixes Controls/interface/ILookup
 * @mixes Controls/interface/INavigation
 * @mixes Controls/interface/IMultiSelectable
 * @mixes Controls/interface/IInputPlaceholder
 * @mixes Controls/Input/interface/IInputField
 * @mixes Controls/_lookup/Lookup/LookupStyles
 * @control
 * @public
 * @author Капустин И.А.
 * @category Input
 * @demo Controls-demo/Input/Lookup/LookupPropertyGrid
 */

var Lookup = Control.extend({
   _template: template,

   showSelector: function (templateOptions) {
      this._children.controller.showSelector(templateOptions);
   }
});

export = Lookup;

