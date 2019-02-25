define('Controls/Toggle/Radio',
   [
      'Controls/Toggle/RadioGroup',
      'Env/Env'
   ],
   function(RadioGroup, Env) {

      var logger = Env.IoC.resolve('ILogger');
      logger.error('Контрол "Controls/Toggle/Radio" перенесён, используйте "Controls/Toggle/RadioGroup"');
      return RadioGroup;
   }
);
