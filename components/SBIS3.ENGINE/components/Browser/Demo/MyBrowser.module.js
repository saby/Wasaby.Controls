define('js!SBIS3.Engine.Demo.MyBrowser', [
   'html!SBIS3.Engine.Demo.MyBrowser',
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.Engine.Demo.MyBrowser/resources/ExampleSource',
   'css!SBIS3.Engine.Demo.MyBrowser',
   'js!SBIS3.Engine.Browser',
   'js!SBIS3.CONTROLS.TreeDataGridView',
   'js!SBIS3.Engine.SBISOpenDialogAction',
   'html!SBIS3.CONTROLS.Demo.FilterButtonMain',
   'js!SBIS3.CONTROLS.Demo.FilterButtonMain',
   "js!SBIS3.CONTROLS.FastDataFilter"

], function(dot, CompoundControl, ExampleSource){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.Engine.Demo.MyBrowser
    * @extends $ws.proto.CompoundControl
    * @public
    */

   var MyBrowser = CompoundControl.extend( /** @lends SBIS3.Engine.Demo.MyBrowser.prototype */{
      _dotTplFn : dot,
      $protected: {
         _options: {

         },
         _data: [{
            keyField : 'key',
            displayField: 'title',
            name: 'first',
            multiselect : false,
            values:[
               {
                  key : 0,
                  title : 'Заголовок'
               },
               {
                  key : 1,
                  title : 'Первый'
               },
               {
                  key : 6,
                  title : 'Шестой'
               },
               {
                  key : 9,
                  title : 'Девятый'
               },
               {
                  key : 10,
                  title : 'Десятый'
               },
               {
                  key : 11,
                  title : 'Одиннадцатый'
               }
            ]
         }]
      },

      $constructor: function () {
         //Нужно определить имена фильтра в нужном контексте. в данном случае в контексте основного компонента
         this.getLinkedContext().setValue('filter', {});
         this.getLinkedContext().setValue('filterDescr', {});
      },

      init: function(){
         MyBrowser.superclass.init.call(this);

         var
         browser = this.getChildControlByName('brows'),
         action = this.getChildControlByName('action'),
         view = this.getChildControlByName('browserView'),
         add = this.getChildControlByName('addBtn'),
         addFolder = this.getChildControlByName('addFolderBtn');

      
         browser._getView().setDataSource(ExampleSource);
         this.getChildControlByName('browserFastDataFilter').setItems(this._data);
         add.subscribe('onActivated', function(){
            browser.addItem({itemType:null});
         });
         browser.subscribe('onEdit', function(e, meta){
            action.execute(meta);
         });
         action.subscribe('onExecuted', function(){
            view.reload();
         });
         addFolder.subscribe('onActivated', function(){
            browser.addItem({itemType:true});
         });
      },
      activateItem : function(item, id) {
         this._activateItem(id);
      }
   });

   return MyBrowser;
});