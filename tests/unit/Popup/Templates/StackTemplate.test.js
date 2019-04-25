define(['Controls/popupTemplate'], (popupTemplate) => {
   'use strict';
   describe('Controls/Popup/Templates/Stack/StackTemplate', () => {
      it('maximize button title', () => {
         let Stack = new popupTemplate.Stack();
         Stack._beforeMount({
            stackMinWidth: 100,
            stackWidth: 700,
            stackMaxWidth: 1000
         });
         assert.equal(Stack._maximizeButtonTitle, 'Свернуть');
         Stack._beforeUpdate({
            stackMinWidth: 100,
            stackWidth: 300,
            stackMaxWidth: 1000
         });
         assert.equal(Stack._maximizeButtonTitle, 'Развернуть');
         Stack.destroy();
      });

      it('controlResize after update maximized options', () => {
         let Stack = new popupTemplate.Stack();
         let controlResizeNotified = false;
         Stack._notify = (event) => {
            controlResizeNotified = event === 'controlResize';
         };
         Stack._beforeMount({
            maximized: true
         });
         Stack._afterUpdate({
            maximized: false
         });

         assert.equal(controlResizeNotified, true);
         Stack.destroy();
      });
   });
});