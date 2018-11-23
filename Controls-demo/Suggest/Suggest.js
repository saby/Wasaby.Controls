/**
 * Created by am.gerasimov on 13.04.2018.
 */
/**
 * Created by am.gerasimov on 13.12.2017.
 */
define('Controls-demo/Suggest/Suggest', [
   'Core/Control',
   'wml!Controls-demo/Suggest/Suggest',
   'WS.Data/Source/Memory',
   'Core/Deferred',
   'WS.Data/Entity/Model',
   'Controls-demo/Search/SearchMemory',
   'Controls-demo/Utils/MemorySourceFilter',
   'css!Controls-demo/Suggest/Suggest'
], function(Control, template, MemorySource, Deferred, Model, SearchMemory, memorySourceFilter) {
   
   'use strict';
   
   var sourceData = [
      { id: 1, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 2, title: 'Dmitry', text: 'test', currentTab: 1 },
      { id: 3, title: 'Andrey', text: 'test', currentTab: 1 },
      { id: 4, title: 'Aleksey', text: 'test', currentTab: 1 },
      { id: 5, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 6, title: 'Ivan', text: 'test', currentTab: 1 },
      { id: 7, title: 'Petr', text: 'test', currentTab: 1 },
      { id: 8, title: 'Roman', text: 'test', currentTab: 2 },
      { id: 9, title: 'Maxim', text: 'test', currentTab: 2 },
      { id: 10, title: 'Andrey', text: 'test', currentTab: 2 },
      { id: 12, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 13, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 14, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 15, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 16, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 17, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 18, title: 'Dmitry', text: 'test', currentTab: 1 },
      { id: 19, title: 'Andrey', text: 'test', currentTab: 1 },
      { id: 20, title: 'Aleksey', text: 'test',currentTab: 1 },
      { id: 21, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 22, title: 'Ivan', text: 'test', currentTab: 1 },
      { id: 23, title: 'Petr', text: 'test', currentTab: 1 },
      { id: 24, title: 'Roman', text: 'test', currentTab: 1 },
      { id: 25, title: 'Maxim', text: 'test', currentTab: 1 },
      { id: 26, title: 'Andrey', text: 'test', currentTab: 1 },
      { id: 27, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 28, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 29, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 30, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 31, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 32, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 33, title: 'Dmitry', text: 'test', currentTab: 1 },
      { id: 34, title: 'Andrey', text: 'test', currentTab: 1 },
      { id: 35, title: 'Aleksey', text: 'test', currentTab: 1 },
      { id: 36, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 37, title: 'Ivan', text: 'test', currentTab: 1 },
      { id: 38, title: 'Petr', text: 'test', currentTab: 1 },
      { id: 39, title: 'Roman', text: 'test', currentTab: 1 },
      { id: 40, title: 'Maxim', text: 'test', currentTab: 1 },
      { id: 41, title: 'Andrey', text: 'test', currentTab: 1 },
      { id: 42, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 43, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 44, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 45, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 46, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 47, title: 'Andrey', text: 'test', currentTab: 1 },
      { id: 48, title: 'Aleksey', text: 'test', currentTab: 1 },
      { id: 49, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 50, title: 'Ivan', text: 'test', currentTab: 1 },
      { id: 51, title: 'Petr', text: 'test', currentTab: 1 },
      { id: 52, title: 'Roman', text: 'test', currentTab: 1 },
      { id: 53, title: 'Maxim', text: 'test', currentTab: 1 },
      { id: 54, title: 'Andrey', text: 'test', currentTab: 1 },
      { id: 55, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 56, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 57, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 58, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 59, title: 'Sasha', text: 'test', currentTab: 2 },
      { id: 60, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 61, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 62, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 63, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 64, title: 'Sasha', text: 'test', currentTab: 2 },
      { id: 65, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 66, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 67, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 68, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 69, title: 'Sasha', text: 'test', currentTab: 2 },
      { id: 70, title: 'Sasha', text: 'test', currentTab: 2 },
      { id: 71, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 72, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 73, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 74, title: 'Sasha', text: 'test', currentTab: 2 },
      { id: 75, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 76, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 77, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 78, title: 'Sasha', text: 'test', currentTab: 1 },
      { id: 79, title: 'Sasha', text: 'test', currentTab: 2 }
   ];
   for (var i = 80; i < 200; i++) {
    sourceData.push( { id: i, title: 'Sasha', text: 'test', currentTab: 1} );
   };
   
   var VDomSuggest = Control.extend({
      _template: template,
      _suggestValue: '',
      _suggest2Value: '',
      _suggest3Value: '',
      _suggest4Value: '',
      _suggest5Value: '',
      _tabsSelectedKey: 0,
      _suggestState: false,
      _suggestState1:false,
      
      constructor: function() {
         VDomSuggest.superclass.constructor.apply(this, arguments);
         this._suggestTabSource = new SearchMemory({
            idProperty: 'id',
            data: sourceData,
            searchParam: 'title',
            filter: memorySourceFilter()
         });
         this._suggestSource = new SearchMemory({
            idProperty: 'id',
            data: sourceData,
            searchParam: 'title',
            filter: memorySourceFilter()
         });
      }
   });
   
   return VDomSuggest;
});