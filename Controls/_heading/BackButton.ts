import Menu = require('Controls/_heading/Back');
import Env = require('Env/Env');
      var logger = Env.IoC.resolve('ILogger');
      logger.warn('Контрол "Controls/_heading/BackButton" перенесён, используйте "Controls/_heading/Back"');
      export = Menu;
   
