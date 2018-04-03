define(['Controls/Button/ButtonSeparator'], function (Separator) {
   'use strict';
   var separator, successIconClick;
   describe('Controls/Button/ButtonSeparator', function () {
      beforeEach(function(){
         separator = new Separator();
         successIconClick = false;
         //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
         //(дефолтный метод для vdom компонент который стреляет событием).
         //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
         //событие и оно полетит с корректными параметрами.
         separator._notify = function(event){
            if(event==='iconClick'){
               successIconClick = true;
            }
         };
      });

      afterEach(function () {
         separator.destroy();
         separator = undefined;
      });

      it('click counter with singleClick', function () {
         var opt = {
            singleClick: true
         };
         var customEvent = {
            stopPropagation: function (){}
         };
         separator.saveOptions(opt);
         separator.iconClickHandler(customEvent);
         assert(successIconClick);
      });

      it('click counter without singleClick', function () {
         var opt = {
            singleClick: false
         };
         separator.saveOptions(opt);
         separator.iconClickHandler();
         assert(!successIconClick);
      });

      it('counter open state', function () {
         var opt = {
            value: true
         };
         separator._beforeMount(opt);
         assert(separator._icon === 'icon-CollapseLight icon-16');
      });

      it('counter close state', function () {
         var opt = {
            value: false
         };
         separator._beforeMount(opt);
         assert(separator._icon === 'icon-ExpandLight icon-16');
      });

      it('update counter open state to close state', function () {
         var opt = {
            value: true
         };
         var newOpt = {
            value: false
         };
         separator.saveOptions(opt);
         separator._beforeUpdate(newOpt);
         assert(separator._icon === 'icon-ExpandLight icon-16');
      });

      it('update counter close state to open state', function () {
         var opt = {
            value: false
         };
         var newOpt = {
            value: true
         };
         separator.saveOptions(opt);
         separator._beforeUpdate(newOpt);
         assert(separator._icon === 'icon-CollapseLight icon-16');
      });
   });
});