define(['Controls/Header/Counter'], function (Counter) {
   'use strict';
   var counter, successCountClick;
   describe('Controls/Header/Counter', function () {
      beforeEach(function(){
         counter = new Counter();
         successCountClick = false;
         //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
         //(дефолтный метод для vdom компонент который стреляет событием).
         //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
         //событие и оно полетит с корректными параметрами.
         counter._notify = function(event){
            if(event==='countClick'){
               successCountClick = true;
            }
         };
      });

      afterEach(function () {
         counter.destroy();
         counter = undefined;
      });

      it('click counter with singleClick', function () {
         var opt = {
            singleClick: true
         };
         var customEvent = {
            stopPropagation: function (){}
         };
         counter.saveOptions(opt);
         counter.countClickHandler(customEvent);
         assert(successCountClick);
      });

      it('click counter without singleClick', function () {
         var opt = {
            singleClick: false
         };
         counter.saveOptions(opt);
         counter.countClickHandler();
         assert(!successCountClick);
      });
   });
});