define(
   ['SBIS3.CONTROLS/ListView/resources/MassSelectionController/MassSelectionController',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Display/Display',
      'WS.Data/Display/Collection'
   ],
   function(SelectionController, RecordSet, Projection) {
      'use strict';

      var data = new RecordSet({
         rawData: [{id: 1}, {id: 2}, {id: 3}],
         idProperty: 'id'
      });

      var
         addState, removeState,
         projection = Projection.getDefaultDisplay(data, {
            keyProperty: 'id'
         }),
         linkedObject = {
            _getItemsProjection: function() {
               return projection;
            },
            addItemsSelection: function(keys) {
               addState = keys;
            },
            removeItemsSelection: function(keys) {
               removeState = keys;
            },
            subscribe: function() {},
            subscribeTo: function() {}
         },
         selectionController = new SelectionController({
            linkedObject: linkedObject,
            idProperty: 'id'
         }),
         projArray = [];

      projection.each(function(item) {
         projArray.push(item);
      });

      describe('SBIS3.CONTROLS/ListView/resources/MassSelectionController/MassSelectionController', function() {
         it('not add excluded keys', function() {
            selectionController.setSelectedItemsAll();
            selectionController.removeItemsSelection([1]);
            selectionController._onProjectionChangeAdd(projArray);
            assert.deepEqual(addState, [2, 3]);
         });
      });
   });