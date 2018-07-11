define(
   [
      'Core/Control',
      'Controls/Input/Search'
   ],
   function(Control, Search) {
      'use strict';

      describe('Controls/Input/Search', function() {

         var search = new Search();
         var valueSearch;


         describe('search', function() {
            it('value changed', function() {
               search._notify = (e, args) => {
                  if (e === 'valueChanged') {
                     valueSearch = args[0];
                  }
               };
               search._valueChangedHandler('valueChanged', 'text');
               assert.equal(valueSearch, 'text');
            });

            it('Click on search', function() {
               let searched = false;
               let activated = false;
               
               search._notify = (e, args) => {
                  searched = true;

               };
               search.activate = () => {
                  activated = true;
               };
               
               assert.isTrue(searched);
               assert.isTrue(activated);
            });
   
            it('Enter click', function() {
               search._notify = (e, args) => {
                  assert.equal(e, 'searchClick');
         
               };
               search._keyUpHandler({
                  nativeEvent: {
                     which: 13 //enter key
                  }
               });
            });
         });
      });
   });
