define(['Controls/_lookupPopup/List/Utils/memorySourceFilter', 'Types/entity'], function(memorySourceFilter, entity) {


   describe('Controls/_lookupPopup/List/Utils/memorySourceFilter', function() {

      it('emptyFilter', function() {
         var model = new entity.Model({
            rawData: {
               testField: 'testValue'
            },
            idProperty: 'testField'
         });
         assert.isTrue(memorySourceFilter(model, {}, 'testField'));
      })

      it('filter with selected', function() {
         var model1 = new entity.Model({
            rawData: {
               testField: 'testValue'
            },
            idProperty: 'testField'
         });
         var model2 = new entity.Model({
            rawData: {
               testField: 'testValue2'
            },
            idProperty: 'testField'
         });
         var filter = {
            selection: new entity.Model({
               rawData: {
                  marked: ['testValue2']
               }
            })
         }
         assert.isFalse(memorySourceFilter(model1, filter, 'testField'));
         assert.isTrue(memorySourceFilter(model2, filter, 'testField'));
      })

   });

});
