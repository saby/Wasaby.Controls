define(['Controls/Popup/Templates/Stack/StackTemplate'], (StackTemplate) => {
   'use strict';
   describe('Controls/Popup/Templates/Stack/StackTemplate', () => {
      it('maximize button title', () => {
         let Stack = new StackTemplate();
         Stack._beforeMount({
            maximized: true
         });
         assert.equal(Stack._maximizeButtonTitle, 'Свернуть');
         Stack._beforeUpdate({
            maximized: false
         });
         assert.equal(Stack._maximizeButtonTitle, 'Развернуть');
         Stack.destroy();
      });

      it('controlResize after update maximized options', () => {
         let Stack = new StackTemplate();
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