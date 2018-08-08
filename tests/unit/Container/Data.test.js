define(
   [
      'Controls/Container/Data',
      'WS.Data/Source/Memory',
      'WS.Data/Collection/RecordSet'
   ],
   function(Data, Memory, RecordSet) {
      describe('Container/Data', function() {

         var sourceData = [
            {id: 1, title: 'Sasha'},
            {id: 2, title: 'Dmitry'},
            {id: 3, title: 'Andrey'},
            {id: 4, title: 'Aleksey'},
            {id: 5, title: 'Sasha'},
            {id: 6, title: 'Ivan'}
         ];

         var sourceDataEdited = [
            {id: 1, title: 'Sasha'},
            {id: 2, title: 'Dmitry'},
            {id: 3, title: 'Andrey'},
            {id: 4, title: 'Petr'},
            {id: 5, title: 'Petr'},
            {id: 6, title: 'Petr'}
         ];

         var source = new Memory({
            idProperty: 'id',
            data: sourceData
         });

         var getDataWithConfig = function(config) {
            var data = new Data(config);
            data.saveOptions(config);
            return data;
         };

         it('update source', function(done) {
            var data = getDataWithConfig({source: source, keyProperty: 'id'});
            var newSource = new Memory({
               idProperty: 'id',
               data: sourceDataEdited
            });
            data._beforeUpdate({source: newSource, idProperty: 'id'}).addCallback(function(items) {
               assert.deepEqual(data._items.getRawData(), sourceDataEdited);
               done();
            });
         });


      });
   });
