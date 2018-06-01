define('Controls-demo/Suggest/resources/SuggestTabTemplate', [
   'Core/Control',
   'tmpl!Controls-demo/Suggest/resources/SuggestTabTemplate',
   'WS.Data/Source/Memory',
   'Controls/List'
], function(Control, template, MemorySource) {
   
   'use strict';
   
   var tabSourceData = [
      { id: 1, title: 'Сотрудники', text: 'test' },
      { id: 2, title: 'Контрагенты', text: 'test' }
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