define(['js!SBIS3.CONTROLS.ControlsValidators'], function (ControlsValidators) {
   
   'use strict';
   describe('SBIS3.CONTROLS.ControlsValidators', function () {
      
      describe('required', function (){
   
         describe('bool option test', function() {
   
            it('validate true', function (){
               assert.equal(ControlsValidators.required(true), true);
            });
   
            it('validate false', function (){
               assert.equal(ControlsValidators.required(false), 'Поле обязательно для заполнения');
            });
            
         });
      });
   });
});