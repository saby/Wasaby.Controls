define(
   [
      'Controls/Container/MultiSelector/selectionToRecord',
      'Types/source'
   ],
   function(selectionToRecord, sourceLib) {
      'use strict';

      describe('Controls.Container.MultiSelector.selectionToRecord', function() {

         it ('selectionToRecord', function() {
            var source = new sourceLib.Memory();
            var selectionType;
            var selection;
            var selectionRec;

            selection = {
               selected: ['1', '2'],
               excluded: ['1', '2']
            };
            selectionType = 'leaf';

            selectionRec = selectionToRecord(selection, source.getAdapter(), selectionType);
            assert.deepEqual(selectionRec.get('excluded'), ['1', '2']);
            assert.deepEqual(selectionRec.get('marked'), ['1', '2']);
            assert.equal(selectionRec.get('type'), 'leaf');

            selection = {
               selected: ['2'],
               excluded: ['2']
            };
            selectionType = 'node';

            selectionRec = selectionToRecord(selection, source.getAdapter(), selectionType);
            assert.deepEqual(selectionRec.get('excluded'), ['2']);
            assert.deepEqual(selectionRec.get('marked'), ['2']);
            assert.equal(selectionRec.get('type'), 'node');

            selectionType = undefined;
            selectionRec = selectionToRecord(selection, source.getAdapter(), selectionType);
            assert.equal(selectionRec.get('type'), 'all');
         });

      });
   }
);
