/* global define, require */
define('js!WS.Data/Chain/Generator', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Di'
], function (
   Abstract,
   Di
) {
   'use strict';

   /**
    * Цепочка по генератору.
    * @class WS.Data/Chain/Generator
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var GeneratorChain = Abstract.extend(/** @lends WS.Data/Chain/Generator.prototype */{
      _moduleName: 'WS.Data/Chain/Generator',

      constructor: function $Generator(source) {
         GeneratorChain.superclass.constructor.call(this, source);
         throw new Error('Under construction');
      }
   });

   return GeneratorChain;
});
