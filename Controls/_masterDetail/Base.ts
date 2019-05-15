import Control = require('Core/Control');
import template = require('wml!Controls/_masterDetail/Base/Base');
import 'css!theme?Controls/masterDetail';

   /**
    * Control that allows to implement the Master-Detail interface
    * The detailed description and instructions on how to configure the control you can read <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/master-detail/'>here</a>.
    * @class Controls/_masterDetail/Base
    * @extends Core/Control
    * @mixes Controls/_masterDetail/List/Styles
    * @control
    * @author Волоцкой В.Д.
    * @public
    * @demo Controls-demo/MasterDetail/Demo
    */

   /**
    * @name Controls/_masterDetail/Base#master
    * @cfg {Function} Master content template
    */

   /**
    * @name Controls/_masterDetail/Base#detail
    * @cfg {Function} Detail content template
    */

   var Base = Control.extend({
      _template: template,
      _selected: null,
      _selectedMasterValueChangedHandler: function(event, value) {
         this._selected = value;
         event.stopPropagation();
      }
   });

   export = Base;
