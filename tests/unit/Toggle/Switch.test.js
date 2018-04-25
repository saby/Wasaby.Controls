define(['Controls/Toggle/Switch'], function (Switch) {
   'use strict';
   var SW, changeValue;
   describe('Controls.Toggle.Switch', function () {
      beforeEach(function(){
         SW = new Switch({
            captions: ['capt1']
         });
         //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
         //(дефолтный метод для vdom компонент который стреляет событием).
         //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
         //событие и оно полетит с корректными параметрами.
         SW._notify = function(event, eventChangeValue){
            if(event==='valueChanged'){
               changeValue = eventChangeValue[0];
            }
         };
      });

      afterEach(function () {
         SW.destroy();
         SW = undefined;
      });

      it('click to ON state', function () {
         var opt = {
           value:false
         };
         SW.saveOptions(opt);
         SW._clickHandler();
         assert(changeValue);
      });

      it('click to OFF state', function () {
         var opt = {
            value:true
         };
         SW.saveOptions(opt);
         SW._clickHandler();
         assert(!changeValue);
      });

      describe('calculate markerState in _beforeMount', function() {
         it('enabled checked', function() {
            var options = {
               value: true,
               readOnly: false
            };
            SW._beforeMount(options);
            assert.equal('controls-Switch__marker_enabled_checked', SW._markerState);
         });
         it('disabled checked', function() {
            var options = {
               value: true,
               readOnly: true
            };
            SW._beforeMount(options);
            assert.equal('controls-Switch__marker_disabled_checked', SW._markerState);
         });
         it('enabled unchecked', function() {
            var options = {
               value: false,
               readonly: false
            };
            SW._beforeMount(options);
            assert.equal('controls-Switch__marker_enabled_unchecked', SW._markerState);
         });
         it('disabled unchecked', function() {
            var options = {
               value: false,
               readOnly: true
            };
            SW._beforeMount(options);
            assert.equal('controls-Switch__marker_disabled_unchecked', SW._markerState);
         });
      });

      describe('calculate markerState in _beforeUpdate', function() {
         it('enabled checked', function() {
            var options = {
               value: true,
               readOnly: false
            };
            SW._beforeUpdate(options);
            assert.equal('controls-Switch__marker_enabled_checked', SW._markerState);
         });
         it('disabled checked', function() {
            var options = {
               value: true,
               readOnly: true
            };
            SW._beforeUpdate(options);
            assert.equal('controls-Switch__marker_disabled_checked', SW._markerState);
         });
         it('enabled unchecked', function() {
            var options = {
               value: false,
               readOnly: false
            };
            SW._beforeUpdate(options);
            assert.equal('controls-Switch__marker_enabled_unchecked', SW._markerState);
         });
         it('disabled unchecked', function() {
            var options = {
               value: false,
               readOnly: true
            };
            SW._beforeUpdate(options);
            assert.equal('controls-Switch__marker_disabled_unchecked', SW._markerState);
         });
      });
   });
});