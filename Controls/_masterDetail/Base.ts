import Control = require('Core/Control');
import template = require('wml!Controls/_masterDetail/Base/Base');
import 'css!theme?Controls/_masterDetail/Base/Base';

   /**
    * Control that allows to implement the Master-Detail interface
    * @class Controls/Container/MasterDetail
    * @extends Core/Control
    * @mixes Controls/Container/MasterList/Styles
    * @control
    * @author Волоцкой В.Д.
    * @public
    * @demo Controls-demo/MasterDetail/Demo
    */

   /**
    * @name Controls/Container/MasterDetail#master
    * @cfg {Function} Master content template
    */

   /**
    * @name Controls/Container/MasterDetail#detail
    * @cfg {Function} Detail content template
    */

   export = Control.extend({
      _template: template,
      _selected: null,
      _selectedMasterValueChangedHandler: function(event, value) {
         this._selected = value;
         event.stopPropagation();
      }
   });

