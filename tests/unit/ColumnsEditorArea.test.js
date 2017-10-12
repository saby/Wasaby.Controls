/**
 * Created by as.avramenko on 06.07.2017.
 */

define(['js!SBIS3.CONTROLS.ColumnsEditorUtils', 'WS.Data/Collection/RecordSet', 'WS.Data/Display/Display', 'WS.Data/Display/Collection'], function (ColumnsEditorUtils, RecordSet, Display) {

   'use strict';

   describe('SBIS3.CONTROLS.ColumnsEditorUtils', function() {
      var
         testItems = new RecordSet({
            rawData: [
               { id: 1 },
               { id: 2 },
               { id: 3 },
               { id: 4 },
               { id: 5 },
               { id: 6 },
               { id: 7 },
               { id: 8 },
               { id: 9 },
               { id: 10 },
               { id: 11 },
               { id: 12 },
               { id: 13 },
               { id: 14 },
               { id: 15 },
               { id: 16 },
               { id: 17 },
               { id: 18 },
               { id: 19 },
               { id: 20 },
               { id: 21 }
             ],
            idProperty: 'id',
            model: ColumnsEditorUtils.getSelectableViewModel()
         }),

         testDisplay = Display.getDefaultDisplay(testItems, {
            idProperty: 'id',
            sort: ColumnsEditorUtils.getSortMethod()
         }),

         testSelectedArray = [ 4, 5, 7, 8, 9, 10, 12, 14, 16, 18, 20 ],

         testResultIds = [ 4, 5, 7, 8, 9, 10, 12, 14, 16, 18, 20, // вначале те, у которых "selected" === true
                           1, 2, 3, 6, 11, 13, 15, 17, 19, 21 ];  // затем все остальные

      it('Check items sort method', function () {
         ColumnsEditorUtils.applySelectedToItems(testSelectedArray, testItems);
         for (var i = 0; i < testResultIds.length; i++) {
            assert.deepEqual(testDisplay.at(i).getContents().getId(), testResultIds[i]);
         }
      });
   });
});