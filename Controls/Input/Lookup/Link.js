define('Controls/Input/Lookup/Link', ['Controls/Selector/Lookup/Link', 'Core/IoC'], function(LookupLink, IoC) {
   IoC.resolve('ILogger').warn('Контрол "Controls/Input/Lookup/Link" перенесён, используйте "Controls/Selector/Lookup/Link"');
   return LookupLink;
});
