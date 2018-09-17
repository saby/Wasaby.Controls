/**
 * Created by as.krasilnikov on 17.09.2018.
 */
define(
   [
      'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
   ],

   function(CompoundArea) {
      'use strict';

      var Area = new CompoundArea({});

      describe('Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea', function() {
         it('check options for reload', () => {
            let opt = {
               template: 'newTemplate',
               record: 'record',
               templateOptions: {
                  testOptions: 'test'
               }
            };
            Area._setCompoundAreaOptions(opt);
            assert.equal(Area._record, opt.record);
            assert.equal(Area._childControlName, opt.template);
            assert.equal(Area._childConfig, opt.templateOptions);
         });
      });
   }
);
