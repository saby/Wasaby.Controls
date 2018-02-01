define(
   [
      'Core/Control',
      'js!Controls/Input/Search',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function (Control, Search, SyntheticEvent) {
      'use strict'

      var
         isSearched = false,
         isReseted = false,
         search;

      describe('Controls/Input/Search', function () {

         before(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
            var container = $('<div></div>');
            $('#mocha').append(container);

            if (typeof $ !== 'undefined') {
               container = $('<div></div>');
               $('#mocha').append(container);
            }
            search = Control.createControl(Search, {element: container}, container);
            search.subscribe('search', function () {
               isSearched = true;
            });
            search.subscribe('reset', function () {
               isReseted = true;
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
            it('1 or 2 character', function () {
               isSearched = false;
               search._valueChangedHandler(new SyntheticEvent('onchange', {
                  target: {}
               }), 'n');
               assert.isFalse(isSearched);

               search._valueChangedHandler(new SyntheticEvent('onchange', {
                  target: {}
               }), 'no');
               assert.isFalse(isSearched);
            });

            it('3 character', function () {
               isSearched = false;
               search._valueChangedHandler(new SyntheticEvent('onchange', {
                  target: {}
               }), 'noo');
               setTimeout(function(){assert.isTrue(isSearched);}, search._options.searchDelay);

            });

            it('2 character', function () {
               isSearched = false;
               search._valueChangedHandler(new SyntheticEvent('onchange', {
                  target: {}
               }), 'no');
               assert.isFalse(isSearched);
            });

            it('Click on reset', function () {
               isSearched = false;
               isReseted = false;
               search._onResetClick();
               assert.isTrue(isReseted);
               assert.isFalse(isSearched);

               //Проверяем, что поиск с задержкой не запустился
               isSearched = false;
               setTimeout(function(){assert.isFalse(isSearched);}, search._options.searchDelay);
            });

            it('Click on search', function () {
               isSearched = false;
               isReseted = false;
               search._onSearchClick();
               assert.isTrue(isSearched);
               assert.isFalse(isReseted);

               //Проверяем, что поиск с задержкой не запустился
               isSearched = false;
               setTimeout(function(){assert.isFalse(isSearched);}, search._options.searchDelay);
            });

         });
      });
   });