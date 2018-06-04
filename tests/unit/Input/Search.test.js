define(
   [
      'Core/Control',
      'Controls/Input/Search'
   ],
   function (Control, Search) {
      'use strict';

      var
         isSearched = false,
         isValueChanged = false,
         search;

      describe('Controls/Input/Search', function () {

         before(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
            var container = $('<div></div>');
            $('#mocha').append(container);

            search = Control.createControl(Search, {element: container}, container);
            search.subscribe('search', function () {
               isSearched = true;
            });
            search.subscribe('valueChanged', function () {
               isValueChanged = true;
            });
         });

         beforeEach(function () {
            if(typeof $==='undefined') {
               this.skip();
            }
         });

         after(function () {
            if (typeof $ !== 'undefined') {
               search.destroy();
            }
         });

         describe('search', function () {

            it('Click on reset', function () {
               isSearched = false;
               isValueChanged = false;
               search._resetClick();
               assert.isTrue(isValueChanged);
               assert.isTrue(isSearched);
            });

            it('Click on search', function () {
               isSearched = false;
               isValueChanged = false;
               search._searchClick();
               assert.isTrue(isSearched);
               assert.isFalse(isValueChanged);
            });
         });
      });
   });