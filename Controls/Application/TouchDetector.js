define('Controls/Application/TouchDetector', [], function() {
   var
      _private = {
         moveInRow: 1,

         //При инициализации необходимо корректно проставить значение, далее значение определяется в зависимости от событий
         state: document && (navigator.msMaxTouchPoints || navigator.maxTouchPoints || 'ontouchstart' in document.documentElement)
      };
   return {
      touchHandler: function() {
         _private.state = true;
         _private.moveInRow = 0;
      },
      moveHandler: function() {
         if (_private.moveInRow > 0) {
            _private.state = false;
         }
         _private.moveInRow++;
      },
      isTouch: function() {
         return _private.state;
      },
      getClass: function() {
         return _private.state ? 'ws-is-touch' : 'ws-is-no-touch';
      }
   };
});
