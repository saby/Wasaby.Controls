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

   var counter = 10;

   var srcData = [
      {
         id: 1,
         title: 'Not editable'
      },
      {
         id: 2,
         title: 'Another record will open on editing'
      },
      {
         id: 3,
         title: 'Returns Deferred and after 3 seconds editing will start'
      },
      {
         id: 4,
         title: 'Record1'
      },
      {
         id: 5,
         title: 'Record2'
      },
      {
         id: 6,
         title: 'Record3'
      }
   ],
   srcData2 = [
      {
         id: 1,
         title: 'Notebook ASUS X550LC-XO228H 6'
      },
      {
         id: 2,
         title: 'Notebook Lenovo IdeaPad G5030 (80G0001FRK) 7'
      }
   ],
   srcData3 = [
      {
         id: 1,
         title: 'Notebook Lenovo G505 59426068 8'
      },
      {
         id: 2,
         title: 'Lenovo 9'
      }
   ],
   srcData4 = [
      {
         id: 1,
         title: 'Notebook Lenovo G505 59426068 14'
      },
      {
         id: 2,
         title: 'редактирование стартует по опции'
      }
   ],
   srcData5 = [
      {
         id: 1,
         title: 'Notebook ASUS X550LC-XO228H 16'
      },
      {
         id: 2,
         title: 'Notebook Lenovo IdeaPad G5030 (80G0001FRK) 17'
      }
   ];

   var EditInPlace = Control.extend({
      _template: template,
      editingConfig: null,
      _editOnClick: true,
      _singleEdit: false,
      _autoAdd: false,
      _editingItem: Record.fromObject({ id: 2, title: 'Editing starts before mounting to DOM', randomField: 'text'}),
      _addItem: Record.fromObject({ id: 3, title: 'Adding starts before mounting to DOM', randomField: 'text'}),

      _beforeMount: function() {
         this._viewSource = new MemorySource({
            idProperty: 'id',
            data: srcData
         });
         this._viewSource2 = new MemorySource({
            idProperty: 'id',
            data: srcData2
         });
         this._viewSource3 = new MemorySource({
            idProperty: 'id',
            data: srcData3
         });
         this._viewSource4 = new MemorySource({
            idProperty: 'id',
            data: srcData4
         });
         this._viewSource5 = new MemorySource({
            idProperty: 'id',
            data: srcData5
         });
      },

      _onBeginEdit: function(e, item) {
         switch (item.get('id')) {
            case 1:
               return 'Cancel';
            case 2:
               return Record.fromObject({
                  id: 2,
                  title: 'Another record'
               });
            case 3:
               var def = new Deferred();
               setTimeout(function() {
                  def.callback(Record.fromObject({
                     id: 3,
                     title: 'Record from Deferred'
                  }));
               }, 3000);
               return def;
         }
      },

      _onBeginAdd: function(e, item) {
         return {
               item: Record.fromObject({
                  id: counter++,
                  title: '',
                  extraField: 'text'
               })
            };
      },

      _cancelBeginAdd: function() {
         return 'Cancel';
      },

      _deferredBeginAdd: function() {
         var
            options = {
               item: Record.fromObject({
                  id: 3,
                  title: '',
                  extraField: 'поле, которого нет у остальных itemов'
               })
            },
            def = new Deferred();
         setTimeout(function() {
            def.callback(options);
         }, 2000);
         return def;
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