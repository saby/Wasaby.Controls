define([
   'Controls/_list/utils/RowIndexUtil',
   'Controls/List/TreeGridView/TreeGridViewModel',
   'Core/core-instance',
   'Types/collection',
   'Types/entity'
], function (Util, TreeGridViewModel, cInstance, collection, _entity) {

   describe('Controls/_grids/RowIndexUtil', function () {

      var
          initialColumns = [{
             width: '1fr',
             displayProperty: 'title'
          }],

          /*
          *  0
          *  +-1
          *  +---3
          *  +-2
          *  +---4
          *  5
          *  6
          */
          treeGridViewModel = new TreeGridViewModel({
             items: new collection.RecordSet({
                idProperty: 'id',
                rawData: [
                   {id: 0, title: 'i0', parent: null, type: true},
                   {id: 1, title: 'i1', parent: 0, type: false},
                   {id: 2, title: 'i2', parent: 0, type: false},
                   {id: 3, title: 'i3', parent: 1, type: null},
                   {id: 4, title: 'i4', parent: 2, type: null},
                   {id: 5, title: 'i5', parent: null, type: null},
                   {id: 6, title: 'i6', parent: null, type: null}
                ]
             }),
             keyProperty: 'id',
             nodeProperty: 'type',
             parentProperty: 'parent',
             columns: initialColumns
          }),
          hierarchyRelation = new _entity.relation.Hierarchy({
             idProperty: 'id',
             parentProperty: 'parent',
             nodeProperty: 'type'
          });

      it('ResultsPosition enumItem should be equal to top or bottom', function () {
         assert.equal(Util.ResultsPosition.Bottom, 'bottom');
         assert.equal(Util.ResultsPosition.Top, 'top');
      });

      it('calcResultsRowIndex for top position', function () {
         assert.equal(Util.calcResultsRowIndex(treeGridViewModel._model._display, Util.ResultsPosition.Top, false), 0);
         assert.equal(Util.calcResultsRowIndex(treeGridViewModel._model._display, Util.ResultsPosition.Top, true), 1);
      });

      it('calcResultsRowIndex for bottom position and no nodeFooters', function () {

         var templateCalc = function (hasHeader, hasFooter) {
            return Util.calcResultsRowIndex(treeGridViewModel._model._display, Util.ResultsPosition.Bottom, hasHeader, hierarchyRelation, {});
         };

         // Bottom results index, list hasn't header and hasn't footer
         assert.equal(templateCalc(false, false), 3);

         // Bottom results index, list hasn't header and has footer
         assert.equal(templateCalc(false, true), 3);

         // Bottom results index, list has header and hasn't footer
         assert.equal(templateCalc(true, false), 4);

         // Bottom results index, list has header and has footer
         assert.equal(templateCalc(true, true), 4);
      });

      it('calcResultsRowIndex for bottom position and nodeFooters', function () {

         var
             hasMoreStorage = {
                5: true
             },
             templateCalc = function (hasHeader, hasFooter) {
                return Util.calcResultsRowIndex(
                    treeGridViewModel._model._display,
                    Util.ResultsPosition.Bottom,
                    hasHeader,
                    hierarchyRelation,
                    hasMoreStorage);
             };

         // Bottom results index, list hasn't header and hasn't footer
         assert.equal(templateCalc(false, false), 4);

         // Bottom results index, list hasn't header and has footer
         assert.equal(templateCalc(false, true), 4);

         // Bottom results index, list has header and hasn't footer
         assert.equal(templateCalc(true, false), 5);

         // Bottom results index, list has header and has footer
         assert.equal(templateCalc(true, true), 5);


         hasMoreStorage = {
            2: true,
            3: true,
            5: true
         };


         // Bottom results index, list hasn't header and hasn't footer
         assert.equal(templateCalc(false, false), 6);

         // Bottom results index, list hasn't header and has footer
         assert.equal(templateCalc(false, true), 6);

         // Bottom results index, list has header and hasn't footer
         assert.equal(templateCalc(true, false), 7);

         // Bottom results index, list has header and has footer
         assert.equal(templateCalc(true, true), 7);

      });

      it('calcFooterRowIndex in tree grid with nodeFooters', function () {
         var
             hasMoreStorage = {
                5: true
             },
             templateCalc = function (hasHeader, hasResults) {
                return Util.calcFooterRowIndex(
                    treeGridViewModel._model._display,
                    hasResults,
                    hasHeader,
                    hierarchyRelation,
                    hasMoreStorage);
             };

         // Bottom results index, list hasn't header and hasn't footer
         assert.equal(templateCalc(false, false), 4);

         // Bottom results index, list hasn't header and has footer
         assert.equal(templateCalc(false, true), 5);

         // Bottom results index, list has header and hasn't footer
         assert.equal(templateCalc(true, false), 5);

         // Bottom results index, list has header and has footer
         assert.equal(templateCalc(true, true), 6);


         hasMoreStorage = {
            2: true,
            3: true,
            5: true
         };


         // Bottom results index, list hasn't header and hasn't footer
         assert.equal(templateCalc(false, false), 6);

         // Bottom results index, list hasn't header and has footer
         assert.equal(templateCalc(false, true), 7);

         // Bottom results index, list has header and hasn't footer
         assert.equal(templateCalc(true, false), 7);

         // Bottom results index, list has header and has footer
         assert.equal(templateCalc(true, true), 8);

      });

      it('calcFooterRowIndex in empty tree ', function () {
         var
             tgvm = new TreeGridViewModel({
                items: new collection.RecordSet({
                   idProperty: 'id',
                   rawData: []
                }),
                keyProperty: 'id',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: initialColumns
             }),
             templateCalc = function (hasHeader, hasResults) {
                return Util.calcFooterRowIndex(
                    tgvm._model._display,
                    hasResults,
                    hasHeader
                );
             };

         // Bottom results index, list hasn't header and hasn't footer
         assert.equal(templateCalc(false, false), 0);

         // Bottom results index, list hasn't header and has footer
         assert.equal(templateCalc(false, true), 1);

         // Bottom results index, list has header and hasn't footer
         assert.equal(templateCalc(true, false), 1);

         // Bottom results index, list has header and has footer
         assert.equal(templateCalc(true, true), 2);

      });

      it('calcFooterRowIndex in tree of only collapsed group(s)', function () {
         var
             tgvm = new TreeGridViewModel({
                items: new collection.RecordSet({
                   idProperty: 'id',
                   rawData: [
                      {
                         id: 1,
                         title: 'qwe-title',
                         group: 'qwe'
                      }
                   ]
                }),
                groupingKeyCallback: function (item) {
                   return item.get('group');
                },
                collapsedGroups: ['qwe'],
                keyProperty: 'id',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: initialColumns
             }),
             templateCalc = function (hasHeader, hasResults) {
                return Util.calcFooterRowIndex(
                    tgvm._model._display,
                    hasResults,
                    hasHeader
                );
             };

         assert.equal(templateCalc(false, false), 1);
         assert.equal(templateCalc(false, true), 2);
         assert.equal(templateCalc(true, false), 2);
         assert.equal(templateCalc(true, true), 3);

      });

      it('calcRowIndexByKey', function () {

         var hasMoreStorage = {
            1: true,
            5: true
         };

         // Item with index in projection = 12, list hasn't header and results
         assert.equal(Util.calcRowIndexByKey(6, treeGridViewModel._model._display, false, 'bottom'), 2);

         // Item with index in projection = 12, list hasn't header and has top results
         assert.equal(Util.calcRowIndexByKey(6, treeGridViewModel._model._display, false, 'top'), 3);

         // Item with index in projection = 12, list has header and has bottom results
         assert.equal(Util.calcRowIndexByKey(6, treeGridViewModel._model._display, true, 'bottom'), 3);

         // Item with index in projection = 12, list has header and has top results
         assert.equal(Util.calcRowIndexByKey(6, treeGridViewModel._model._display, true, 'top'), 4);


         // Item with index in projection = 12, list hasn't header and results and 2 footers
         assert.equal(Util.calcRowIndexByKey(6, treeGridViewModel._model._display, false, 'bottom', hierarchyRelation, hasMoreStorage), 4);

         // Item with index in projection = 12, list hasn't header and has top results and 2 footers
         assert.equal(Util.calcRowIndexByKey(6, treeGridViewModel._model._display, false, 'top', hierarchyRelation, hasMoreStorage), 5);

         // Item with index in projection = 12, list has header and has bottom results and 2 footers
         assert.equal(Util.calcRowIndexByKey(6, treeGridViewModel._model._display, true, 'bottom', hierarchyRelation, hasMoreStorage), 5);

         // Item with index in projection = 12, list has header and has top results and 2 footers
         assert.equal(Util.calcRowIndexByKey(6, treeGridViewModel._model._display, true, 'top', hierarchyRelation, hasMoreStorage), 6);
      });

      it('calcTopOffset', function () {
         assert.equal(Util.calcTopOffset(true, Util.ResultsPosition.Top), 2);
         assert.equal(Util.calcTopOffset(false, Util.ResultsPosition.Top), 1);
         assert.equal(Util.calcTopOffset(false, Util.ResultsPosition.Bottom), 0);
         assert.equal(Util.calcTopOffset(true, Util.ResultsPosition.Bottom), 1);
      });

      it('calcGroupRowIndex', function () {
         var
             hasMoreStorage = {
                1: true,
                5: true
             },
             templateCalc = function (index, hasHeader, resultsPosition) {
                return Util.calcGroupRowIndex(
                    treeGridViewModel._model._display.at(index),
                    treeGridViewModel._model._display,
                    hasHeader,
                    resultsPosition,
                    hasMoreStorage,
                    hierarchyRelation
                );
             };

         assert.equal(templateCalc(2, false, 'top'), 5);
         assert.equal(templateCalc(2, true, 'top'), 6);

         assert.equal(templateCalc(2, false, 'bottom'), 4);
         assert.equal(templateCalc(2, true, 'bottom'), 5);
      });
   });
});



