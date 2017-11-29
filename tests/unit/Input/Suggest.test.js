/**
 * Created by am.gerasimov on 28.11.2017.
 */
define(
   [
      'js!Controls/Input/Suggest',
      'Core/core-merge'
   ],
   function(Suggest) {
      'use strict';
      
      function getSuggest(opts) {
         return new Suggest(opts || {});
      }
   
      describe('Controls.Input.Suggest', function () {
         
         describe('value tests', function (){
         
            it('value in new instance', function() {
               var suggest = getSuggest({value: 'test'});
               assert.equal(suggest._value, 'test');
               suggest.destroy();
            });
            
            it('change value by input', function() {
               var suggest = getSuggest();
               suggest._changeValueHandler(null, 'test');
               assert.equal(suggest._value, 'test');
               suggest.destroy();
            });
   
            it('clear value', function() {
               var suggest = getSuggest({value: 'test'});
               suggest._clearValue();
               assert.equal(suggest._value, '');
               suggest.destroy();
            });
   
            it('change value option by parent', function() {
               var suggest = getSuggest();
               suggest._beforeUpdate({value: 'test'});
               assert.equal(suggest._value, 'test');
               suggest.destroy();
            });
         });
      });
      
   }
);