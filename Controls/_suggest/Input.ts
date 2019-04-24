import Control = require('Core/Control');
import template = require('wml!Controls/_suggest/Input/Input');
import {descriptor} from 'Types/entity';
import tmplNotify = require('Controls/Utils/tmplNotify');
import 'css!theme?Controls/_suggest/Input/Input';

/**
 * The Input/Suggest control is a normal text input enhanced by a panel of suggested options.
 *
 * Here you can see the <a href="/materials/demo-ws4-input">demo examples</a>.
 *
 * @class Controls/_suggest/Input
 * @extends Core/Control
 * @mixes Controls/interface/ISearch
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/ISuggest
 * @mixes Controls/interface/INavigation
 * @mixes Controls/Input/Suggest/SuggestStyles
 * @mixes Controls/Input/resources/InputRender/InputRenderStyles
 * @mixes Controls/interface/IPaste
 * @mixes Controls/interface/IInputText
 * @control
 * @public
 * @category Input
 * @demo Controls-demo/Input/Suggest/SuggestPG
 * @author Герасимов А.М.
 */



var Suggest = Control.extend({

   _template: template,
   _notifyHandler: tmplNotify,
   _suggestState: false,
   _searchState: false,

   // <editor-fold desc="LifeCycle">

   _beforeMount: function() {
      this._searchStart = this._searchStart.bind(this);
      this._searchEnd = this._searchEnd.bind(this);
   },

   // </editor-fold>


   // <editor-fold desc="handlers">

   _changeValueHandler: function(event, value) {
      this._notify('valueChanged', [value]);
   },

   _inputCompletedHandler: function(event, value) {
      this._notify('inputCompleted', [value]);
   },

   _choose: function(event, item) {
      /* move focus to input after select, because focus will be lost after closing popup  */
      this.activate();
      this._notify('choose', [item]);
      this._notify('valueChanged', [item.get(this._options.displayProperty || '')]);
   },

   _clearClick: function() {
      /* move focus to input after clear text, because focus will be lost after hiding cross  */
      this.activate();
      this._suggestState = false;
      this._notify('valueChanged', ['']);
   },

   _deactivated: function() {
      this._suggestState = false;
   },

   _searchStart: function() {
      this._searchState = true;
      this._forceUpdate();
   },

   _searchEnd: function() {
      this._searchState = false;
      this._forceUpdate();
   }

   // </editor-fold>

});


// <editor-fold desc="OptionsDesc">

Suggest.getOptionTypes = function() {
   return {
      displayProperty: descriptor(String).required(),
      suggestTemplate: descriptor(Object).required(),
      searchParam: descriptor(String).required()
   };
};

Suggest.getDefaultOptions = function() {
   return {
      minSearchLength: 3
   };
};

// </editor-fold>

export = Suggest;

