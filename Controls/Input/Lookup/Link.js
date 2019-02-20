define('Controls/Input/Lookup/Link', ['Controls/Selector/Lookup/Link', 'Env/Env'], function(LookupLink, Env) {
   Env.IoC.resolve('ILogger').warn('Контрол "Controls/Input/Lookup/Link" перенесён, используйте "Controls/Selector/Lookup/Link"');
   return LookupLink;
});
