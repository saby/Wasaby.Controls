define('js!Controls/Input/resources/SuggestView/SuggestView',
[
   'Core/Control',
   'tmpl!Controls/Input/resources/SuggestView/SuggestView',
   'Core/moduleStubs',
   'css!Controls/Input/resources/SuggestView/SuggestView'
], function(Control, template, moduleStubs) {
   
   'use strict';
   
   var SuggestView = Control.extend({
      _template: template,
   
      _onItemClickHandler: function(event, item) {
         this._notify('sendResult', item);
         this._notify('close');
      },
   
      _showAllClick: function() {
         var self = this;
         
         moduleStubs.require(['js!Controls/Input/resources/SuggestShowAll/SuggestShowAll', 'js!Controls/Popup/DialogTemplate']).addCallback(function(res) {
            self._options.showAllOpener.open();
            return res;
         });
         this._notify('close');
      },
      
      _beforeUpdate: function(newOptions) {
         SuggestView.superclass._beforeUpdate.call(this, newOptions);
         if (newOptions.items.getCount() && newOptions.selectedIndex  !== -1) {
            this._selectedKey = newOptions.items.at(newOptions.selectedIndex).get(newOptions.idProperty);
         } else {
            this._selectedKey = null;
         }
      }
   });
   
   return SuggestView;
});