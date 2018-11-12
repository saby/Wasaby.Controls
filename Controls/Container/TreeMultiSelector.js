define('Controls/Container/TreeMultiSelector', [
   'Controls/Container/MultiSelector',
   'Core/IoC'
], function(
   MultiSelector,
   IoC
) {
   'use strict';

   IoC.resolve('ILogger').error('Компонент Controls/Container/TreeMultiSelector будет удалён в версию 3.18.710, используйте Controls/Container/MultiSelector.');

   return MultiSelector;
});
