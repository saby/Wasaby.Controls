define('Controls/Input/Lookup', ['Controls/Selector/Lookup', 'Core/IoC'], function(Lookup, IoC) {
   IoC.resolve('ILogger').warn('Контрол "Controls/Input/Lookup" перенесён, используйте "Controls/Selector/Lookup"');
   return Lookup;
});
