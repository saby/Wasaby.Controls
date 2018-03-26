define('Controls-demo/List/EditInPlace', [
   'Core/Control',
   'tmpl!Controls-demo/List/EditInPlace/EditInPlace',
   'WS.Data/Source/Memory',
   'WS.Data/Entity/Record',
   'Core/Deferred',
   'Controls/Validate/Validators/IsRequired'
], function (Control,
             template,
             MemorySource,
             Record,
             Deferred
) {
   'use strict';

   var counter = 5;

   var srcData = [
      {
         id: 1,
         title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
         description: 'Другое название 1'
      },
      {
         id: 2,
         title: 'Notebooks 22222',
         description: 'Описание вот такое'
      },
      {
         id: 3,
         title: 'Smartphones 3',
         description: 'Хватит страдать'

      }
   ];

   var EditInPlace = Control.extend({
      _template: template,
      editingConfig: null,

      _beforeMount: function() {
         this._viewSource = new MemorySource({
            idProperty: 'id',
            data: srcData
         });
         this.editingConfig = {
            // item: Record.fromObject({ id: 4, title: 'добавление стартует по опции', description: 'а может и не стартует', randomField: 'поле, которого нет'}),
            editOnClick: true,
            singleEdit: false,
            autoAdd: true
         };
      },

      _onBeginEdit: function(e, item) {

      },

      _onBeginAdd: function(e, item) {
         var
            options = {
               item: Record.fromObject({
                  id: counter++,
                  title: 'подготовленный item',
                  description: 'описание',
                  extraField: 'поле, которого нет у остальных itemов'
               })
            },
            def = new Deferred();
         //имитирую БЛ
         // setTimeout(function() {
         //    def.callback(options);
         // }, 3000);
         // return def;

         return options;
      },

      _onEndEdit: function(e, item, commit) {

      },

      beginAdd: function() {
         var options = {};
         this._children.list.beginAdd();
      },

      beginEdit: function(item) {
         this._children.list.beginEdit(item);
      }
   });
   return EditInPlace;
});