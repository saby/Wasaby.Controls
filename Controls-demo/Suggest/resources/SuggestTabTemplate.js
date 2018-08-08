define('Controls-demo/Suggest/resources/SuggestTabTemplate', [
   'Core/Control',
   'tmpl!Controls-demo/Suggest/resources/SuggestTabTemplate',
   'WS.Data/Source/Memory',
   'Controls/List'
], function(Control, template, MemorySource) {
   
   'use strict';
   
   var tabSourceData = [
      { id: 1, title: 'Сотрудники', text: 'test', align: 'left' },
      { id: 2, title: 'Контрагенты', text: 'test', align: 'left' }
   ];
   
   return Control.extend({
      _template: template,
      _tabsSelectedKey: null,
      
      _beforeMount: function() {
            this._tabsOptions = {
               source: new MemorySource({
                  idProperty: 'id',
                  data: tabSourceData
               }),
               keyProperty: 'id',
               displayProperty: 'title'
            };
      }
   });
});