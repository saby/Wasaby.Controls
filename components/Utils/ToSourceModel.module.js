/**
 * Created by am.gerasimov on 15.02.2017.
 */
define('js!SBIS3.CONTROLS.ToSourceModel', [
   'js!WS.Data/Di',
   'Core/core-instance',
   'Core/core-functions'
], function(Di, cInstance, cFunc) {

   function getModel(model, config) {
      return typeof model === 'string' ? Di.resolve(model, config) : new model(config)
   }
   /**
    * Приводит записи к модели источника данных
    * @param {WS.Data/Collection/IList} items массив записей
    * @param {WS.Data/Source/ISource} dataSource Источник
    * @param {String} idProperty поле элемента коллекции, которое является идентификатором записи.
    * @returns {WS.Data/Collection/IList|undefined}
    */
   return function toSourceModel(items, dataSource, idProperty, saveParentRecordChanges) {
      var dataSourceModel, dataSourceModelInstance, parent, changedFields, newRec;

      if(items) {
         if(dataSource) {
            dataSourceModel = dataSource.getModel();
            /* Создадим инстанс модели, который указан в dataSource,
               чтобы по нему проверять модели которые выбраны в поле связи */
            dataSourceModelInstance = getModel(dataSourceModel, {});

            /* FIXME гразный хак, чтобы изменение рекордсета не влекло за собой изменение родительского рекорда
               Удалить, как Леха Мальцев будет позволять описывать более гибко поля записи, и указывать в качестве типа прикладную модель.
               Задача:
               https://inside.tensor.ru/opendoc.html?guid=045b9c9e-f31f-455d-80ce-af18dccb54cf&description= */
            if(saveParentRecordChanges) {
               parent = items._getMediator().getParent(items);

               if (parent && cInstance.instanceOfModule(parent, 'WS.Data/Entity/Model')) {
                  changedFields = cFunc.clone(parent._changedFields);
               }
            }

            items.each(function(rec, index) {
               /* Создадим модель указанную в сорсе, и перенесём адаптер и формат из добавляемой записи,
                  чтобы не было конфликтов при мерже полей этих записей */
               if(dataSourceModelInstance._moduleName !==  rec._moduleName) {
                  (newRec = getModel(dataSourceModel, { adapter: rec.getAdapter(), format: rec.getFormat() })).merge(rec);
                  rec = newRec;
                  items.replace(rec, index);
               }
            });

            if(changedFields) {
               parent._changedFields = changedFields;
            }
         }

         /* Элементы, установленные из дилогов выбора / автодополнения могут иметь другой первичный ключ,
            отличный от поля с ключём, установленного в поле связи. Это связно с тем, что "связь" устанавливается по опеределённому полю,
            и не обязательному по первичному ключу у записей в списке. */
         items.each(function(rec) {
            if(rec.getIdProperty() !== idProperty && rec.get(idProperty) !== undefined) {
               rec.setIdProperty(idProperty);
            }
         });
      }

      return items;
   };
});