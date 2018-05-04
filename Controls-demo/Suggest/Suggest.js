/**
 * Created by am.gerasimov on 13.04.2018.
 */
/**
 * Created by am.gerasimov on 13.12.2017.
 */
define('Controls-demo/Suggest/Suggest', [
   'Core/Control',
   'tmpl!Controls-demo/Suggest/Suggest',
   'WS.Data/Source/Memory',
   'Core/Deferred',
   'css!Controls-demo/Suggest/Suggest',
   'Controls/Input/Suggest',
   'Controls/List',
   'Controls/Container/List',
   'Controls/Tabs/Buttons'
], function(Control, template, MemorySource, Deferred) {
   
   'use strict';
   
   var sourceData = [
      { id: 1, title: 'Sasha', text: 'test' },
      { id: 2, title: 'Dmitry', text: 'test' },
      { id: 3, title: 'Andrey', text: 'test' },
      { id: 4, title: 'Aleksey', text: 'test' },
      { id: 5, title: 'Sasha', text: 'test' },
      { id: 6, title: 'Ivan', text: 'test' },
      { id: 7, title: 'Petr', text: 'test' },
      { id: 8, title: 'Roman', text: 'test' },
      { id: 9, title: 'Maxim', text: 'test' },
      { id: 10, title: 'Andrey', text: 'test' },
      { id: 12, title: 'Sasha', text: 'test' },
      { id: 13, title: 'Sasha', text: 'test' },
      { id: 14, title: 'Sasha', text: 'test' },
      { id: 15, title: 'Sasha', text: 'test' },
      { id: 16, title: 'Sasha', text: 'test' },
      { id: 17, title: 'Sasha', text: 'test' },
      { id: 18, title: 'Dmitry', text: 'test' },
      { id: 19, title: 'Andrey', text: 'test' },
      { id: 20, title: 'Aleksey', text: 'test' },
      { id: 21, title: 'Sasha', text: 'test' },
      { id: 22, title: 'Ivan', text: 'test' },
      { id: 23, title: 'Petr', text: 'test' },
      { id: 24, title: 'Roman', text: 'test' },
      { id: 25, title: 'Maxim', text: 'test' },
      { id: 26, title: 'Andrey', text: 'test' },
      { id: 27, title: 'Sasha', text: 'test' },
      { id: 28, title: 'Sasha', text: 'test' },
      { id: 29, title: 'Sasha', text: 'test' },
      { id: 30, title: 'Sasha', text: 'test' },
      { id: 31, title: 'Sasha', text: 'test' },
      { id: 32, title: 'Sasha', text: 'test' },
      { id: 33, title: 'Dmitry', text: 'test' },
      { id: 34, title: 'Andrey', text: 'test' },
      { id: 35, title: 'Aleksey', text: 'test' },
      { id: 36, title: 'Sasha', text: 'test' },
      { id: 37, title: 'Ivan', text: 'test' },
      { id: 38, title: 'Petr', text: 'test' },
      { id: 39, title: 'Roman', text: 'test' },
      { id: 40, title: 'Maxim', text: 'test' },
      { id: 41, title: 'Andrey', text: 'test' },
      { id: 42, title: 'Sasha', text: 'test' },
      { id: 43, title: 'Sasha', text: 'test' },
      { id: 44, title: 'Sasha', text: 'test' },
      { id: 45, title: 'Sasha', text: 'test' },
      { id: 46, title: 'Sasha', text: 'test' },
      { id: 47, title: 'Andrey', text: 'test' },
      { id: 48, title: 'Aleksey', text: 'test' },
      { id: 49, title: 'Sasha', text: 'test' },
      { id: 50, title: 'Ivan', text: 'test' },
      { id: 51, title: 'Petr', text: 'test' },
      { id: 52, title: 'Roman', text: 'test' },
      { id: 53, title: 'Maxim', text: 'test' },
      { id: 54, title: 'Andrey', text: 'test' },
      { id: 55, title: 'Sasha', text: 'test' },
      { id: 56, title: 'Sasha', text: 'test' },
      { id: 57, title: 'Sasha', text: 'test' },
      { id: 58, title: 'Sasha', text: 'test' },
      { id: 59, title: 'Sasha', text: 'test' }
   ];
   
   var tabSourceData = [
      { id: 0, title: 'Сотрудники', text: 'test' },
      { id: 1, title: 'Контрагенты', text: 'test' }
   ];
   
   var VDomSuggest = Control.extend({
      _template: template,
      _suggestValue: '',
      _suggest2Value: '',
      _tabSelectedKey: 0,
      
      constructor: function() {
         VDomSuggest.superclass.constructor.apply(this, arguments);
         this._suggestSource = new MemorySource({
            idProperty: 'id',
            data: sourceData
         });
         this._tabSource = new MemorySource({
            idProperty: 'id',
            data: tabSourceData
         });
         
         //Чтобы запрос был асинхронным.
         var origQuery = this._suggestSource.query;
         this._suggestSource.query = function() {
            var self = this,
               arg = arguments;
            var def = Deferred.fromTimer(100);
            def.addCallback(function() {
               return origQuery.apply(self, arg);
            });
            return def;
         };
      }
   });
   
   return VDomSuggest;
});