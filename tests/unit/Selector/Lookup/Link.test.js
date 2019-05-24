define(['Controls/lookup'], function(lookup) {
   describe('Controls/lookup:Link', function() {
      it('_keyUpHandler', function() {
         var
            isNotifyClick = false,
            link = new lookup.Link(),
            event = {
               nativeEvent: {
                  keyCode: 13
               }
            };

         link._notify = function(eventName) {
            if (eventName === 'click') {
               isNotifyClick = true;
            }
         };

         link._keyUpHandler(event);
         assert.isTrue(isNotifyClick);

         isNotifyClick = false;
         link._options.readOnly = true;
         link._keyUpHandler(event);
         assert.isFalse(isNotifyClick);
      });

      it('_clickHandler', function() {
         var
            isStopPropagation = false,
            link = new lookup.Link(),
            event = {
               stopPropagation: function() {
                  isStopPropagation = true;
               }
            };

         link._clickHandler(event);
         assert.isFalse(isStopPropagation);

         link._options.readOnly = true;
         link._clickHandler(event);
         assert.isTrue(isStopPropagation);
      });
   });
});
