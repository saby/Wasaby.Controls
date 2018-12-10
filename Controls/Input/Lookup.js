define('Controls/Input/Lookup', ['Controls/Selector/Lookup', 'Core/IoC'], function(Lookup, IoC) {
   IoC.resolve('ILogger').warn('Control "Controls/Input/Lookup" moved and will be deleted in 3.19.100, use "Controls/Selector/Lookup"');
   return Lookup;
});
