define('js!genie.RegistryFiltersAreaEditor',
   [
      'js!genie.RegistryAreaEditor',
      'css!genie.RegistryFiltersAreaEditor'
   ],
   function (RegistryAreaEditor) {
      'use strict';
      var RegistryFiltersAreaEditor = RegistryAreaEditor.extend({
         $constructor: function () {
            this._container.addClass('registryFiltersAreaEditor');
         },
         _onLineClick: function (e) {
            // open popup
            this.showPopup(this.getPopupConstructor(e.data.item), {
               configRoot: e.data.item,
               parent: this,
               filter: (this.getConfig().filtered || e.data.item.filtered) ? '' : this.getFilter(),
               key: e.data.key
            }, e.target);
            return false;
         }
      });
      return RegistryFiltersAreaEditor;
   }
);