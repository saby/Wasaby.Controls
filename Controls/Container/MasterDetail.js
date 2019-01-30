define('Controls/Container/MasterDetail', [
   'Core/Control',
   'wml!Controls/Container/MasterDetail/MasterDetail',
   'css!theme?Controls/Container/MasterDetail/MasterDetail'
], function(Control, template) {

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

   return Control.extend({
      _template: template,
      _selected: null,
      _selectedMasterValueChangedHandler: function(event, value) {
         this._selected = value;
         event.stopPropagation();
      }
   });
});
