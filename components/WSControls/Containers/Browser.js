define('SBIS3.CONTROLS/WSControls/Containers/Browser',
[
   'Core/Control',
   'tmpl!SBIS3.CONTROLS/WSControls/Containers/Browser',
   //TODO: удалить
   'WS.Data/Source/Memory'
], function(Control, template, StaticSource) {
   var Browser = Control.extend({
      _controlName: 'SBIS3.CONTROLS/WSControls/Containers/Browser',
      _template: template,
      iWantVDOM: true,
      operationsPanelConfig: [],
      backButtonConfig: {},
      breadCrumbsConfig: {},
      fastDataFilterConfig: {},
      filterButtonConfig: {},
      stickyHeader: false,
      topTemplate: '',
      searchFormFocus: true,

      _beforeMount: function() {
         var
            items = [
               {
                  id: 0,
                  title: 'Item 1'
               },
               {
                  id: 1,
                  title: 'Item 2'
               }
            ];
         this._dataSource = new StaticSource({
            data: items,
            idProperty: 'id'
         });
         this._filter = {};
      },

      _onSearch: function(e, text) {
         if(text){
            this._filter = {
               title: text
            };
         } else {
            this._filter = {
               title: undefined
            };
         }
      }
   });

   return Browser;
});
