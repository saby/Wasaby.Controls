define(['Controls/_grids/utils/RowIndexUtil'], function (Util) {


   describe('Controls/_grids/RowIndexUtil', function () {

      it('ResultsPosition enumItem should be string and equal top/bottom', function () {
         assert.equal(Util.ResultsPosition.Bottom, 'bottom');
         assert.equal(Util.ResultsPosition.Top, 'top');
      });

      it('calcResultsRowIndex for top position', function () {
         assert.equal(Util.calcResultsRowIndex({}, Util.ResultsPosition.Top), 0);
         assert.equal(Util.calcResultsRowIndex({}, Util.ResultsPosition.Top, true), 1);
      });


      /*
      *
      * getLastItem: function(display) {
        var
            itemIdx = display.getCount() - 1,
            item;
        while (itemIdx >= 0) {
            item = display.at(itemIdx).getContents();
            if (cInstance.instanceOfModule(item, 'Types/entity:Model')) {
                return display.at(itemIdx).getContents();
            }
            itemIdx--;
        }
    }
    */
      it('calcResultsRowIndex for bottom position', function () {

         var display = {
            getCount: function () {
               return 100;
            },
            at: function () {
               return {
                  getContents: function () {
                     return {
                        '[Types/entity:Model]': true,
                        getId: function() {
                           return 100
                        }
                     }
                  }
               }
            }
         };

         assert.equal(Util.calcResultsRowIndex(display, Util.ResultsPosition.Bottom), 0);

      });


   });


});



