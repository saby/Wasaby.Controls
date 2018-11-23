define(['Controls/Toggle/Button'], function (Button) {
   'use strict';
   var Btn, changeValue;
   describe('Controls.Toggle.Button', function () {
      beforeEach(function(){
         Btn = new Button({
            style: 'linkMain'
         });
         //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
         //(дефолтный метод для vdom компонент который стреляет событием).
         //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
         //событие и оно полетит с корректными параметрами.
         Btn._notify = function(event, eventChangeValue){
            if(event==='valueChanged'){
               changeValue = eventChangeValue[0];
            }
         };
      });

      afterEach(function () {
         Btn.destroy();
         Btn = undefined;
      });

      it('click to ON state', function () {
         var opt = {
            value: false
         };
         Btn.saveOptions(opt);
         Btn._clickHandler();
         assert.isTrue(changeValue, 'switch to on state failed');
      });

      it('click to OFF state', function () {
         var opt = {
            value: true
         };
         Btn.saveOptions(opt);
         Btn._clickHandler();
         assert.isFalse(changeValue, 'switch to off state failed');
      });

      it('change style', function () {
         var opt = {
            style: 'iconButtonBordered',
            readOnly: true,
            value: true,
            size: 'l'
         };
         Btn._beforeUpdate(opt);
         assert.isTrue(Btn._style === 'secondary', 'changing style failed in style');
         assert.isTrue(Btn._viewMode === 'toolButton', 'changing style failed in type');
         assert.isTrue(Btn._state === '_toggle_on_readOnly', 'changing style failed in state');
      });

      it('_beforeMount', function () {
         var opt = {
            style: 'iconButtonBordered',
            readOnly: true,
            value: true,
            size: 'l'
         };
         Btn._beforeMount(opt);
         assert.isTrue(Btn._style === 'secondary', 'changing style failed in style');
         assert.isTrue(Btn._viewMode === 'toolButton', 'changing style failed in type');
         assert.isTrue(Btn._state === '_toggle_on_readOnly', 'changing style failed in state');
      });
   });
});
