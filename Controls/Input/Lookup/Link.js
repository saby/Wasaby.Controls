define('Controls/Input/Lookup/Link', ['Controls/lookup', 'Env/Env'], function(lookup, Env) {
   Env.IoC.resolve('ILogger').warn('Контрол "Controls/Input/Lookup/Link" перенесён, используйте "Controls/lookup:Link"');
   return lookup.Link;
});
