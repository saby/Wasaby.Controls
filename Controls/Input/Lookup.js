define('Controls/Input/Lookup', ['Controls/Selector/Lookup', 'Env/Env'], function(Lookup, Env) {
   Env.IoC.resolve('ILogger').warn('Control "Controls/Input/Lookup" moved and will be deleted in 3.19.100, use "Controls/Selector/Lookup"');
   return Lookup;
});
