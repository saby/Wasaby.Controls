define(['SBIS3.CONTROLS/Utils/ControlsValidators'], function (ControlsValidators) {
   
   'use strict';
   describe('SBIS3.CONTROLS/Utils/ControlsValidators', function () {
      
      describe('required', function (){
   
         describe('bool option test', function() {
   
            it('validate true', function (){
               assert.equal(ControlsValidators.required(true), true);
            });
   
            it('validate false', function (){
               assert.equal(ControlsValidators.required(false), true);
            });
            
         });
   
         describe('string option test', function() {
      
            it('validate true', function (){
               assert.equal(ControlsValidators.required('test'), true);
            });
      
            it('validate false', function (){
               assert.equal(ControlsValidators.required(''), 'Поле обязательно для заполнения.');
            });
      
         });
   
         describe('number option test', function() {
      
            it('validate 0', function (){
               assert.equal(ControlsValidators.required(0), true);
            });
            
            it('validate 1', function (){
               assert.equal(ControlsValidators.required(1), true);
            });
            
            it('validate -1', function (){
               assert.equal(ControlsValidators.required(-1), true);
            });
      
            it('validate NaN', function (){
               assert.equal(ControlsValidators.required(NaN), 'Поле обязательно для заполнения.');
            });
      
         });
   
         describe('undefined option test', function() {
            it('validate true', function (){
               assert.equal(ControlsValidators.required(undefined), 'Поле обязательно для заполнения.');
            });
         });
      });
   });
});