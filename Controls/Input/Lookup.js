define('Controls/Input/Lookup', ['Controls/lookup', 'Env/Env'], function(scroll, Env) {
   Env.IoC.resolve('ILogger').warn('Control "Controls/Input/Lookup" moved and will be deleted in 3.19.100, use "Controls/lookup:Input"');
   return scroll.Input;
});
