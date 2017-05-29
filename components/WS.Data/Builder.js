/* global define */
define('js!WS.Data/Builder', [
   'js!WS.Data/Di',
   'Core/core-instance',
   'Core/core-functions'
], function (
   Di,
   CoreInstance,
   CoreFunctions
) {
   'use strict';

   var Builder = /** @lends WS.Data/Builder.prototype */{
      _moduleName: 'WS.Data/Builder',

      /**
       * Создает модель по формату, данные берет из переданной модели.
       * @remark не рекомендуется использовать этот метод
       * @param {WS.Data/Entity/Model | WS.Data/Entity/Record} item Модель с данными
       * @param {WS.Data/Format/Format} format Формат по которому строится модель
       * @param {Function|String} module  Конструктор, который будет использоваться для создания модели, по умолчанию тот же, что и у item
       * @return {WS.Data/Entity/Model}
       */
      reduceTo: function (item, format, module) {
         module = module || Builder.getModule(item);

         var newItem = Di.create( module, {
            adapter: item.getAdapter(),
            format: []
         });

         format.each(function(field) {
            var  value = item.get(field.getName());
            if (value && typeof(value) == 'object') {
               if (typeof(value.clone) == 'function') {
                  value = value.clone();
               } else {
                  value = CoreFunctions.clone(value);
               }
            }
            newItem.addField(field, undefined, value);
         });

         if (!item.isChanged()) {
            newItem.acceptChanges();
         }

         if (CoreInstance.instanceOfModule(item, 'WS.Data/Entity/Model') && CoreInstance.instanceOfModule(newItem, 'WS.Data/Entity/Model')) {
            newItem.setIdProperty(item.getIdProperty());
            newItem.setState(item.getState());
         }

         return newItem;
      }
   };

   Builder.getModule = function(item) {
      return Object.getPrototypeOf(item).constructor;
   };

   return Builder;
});
