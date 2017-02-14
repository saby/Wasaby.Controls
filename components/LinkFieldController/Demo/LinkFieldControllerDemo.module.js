/**
 * Created by am.gerasimov on 26.09.2016.
 */
define('js!SBIS3.CONTROLS.Demo.LinkFieldController', [
   'Core/IoC',
   'Core/Abstract',
   'js!SBIS3.CONTROLS.LinkFieldController',
   'js!WS.Data/Entity/Model',
   'js!WS.Data/Source/Memory',
   'js!WS.Data/Adapter/Json',
   'Core/helpers/collection-helpers'
], function(IoC, Abstract, LinkFieldController, Model, Memory, Json, colHelpers){

   'use strict';

   return Abstract.extend({
      $protected: {
         _options: {
         }
      },

      $constructor: function() {
         var sourceRawData = [
            {
               Сотрудник: 'Саша Герасимов',
               Отдел: 'Платформа',
               Должность: 'Инженер-программист',
               'Должность.Зарплата': 50,
               Возраст: 23,
               Стаж: 3,
               ИД: 1
            },
            {
               Сотрудник: 'Владимир Путин',
               Отдел: 'Правительство',
               Должность: 'Президент',
               'Должность.Зарплата': 200,
               Возраст: 50,
               Стаж: 17,
               ИД: 2
            }
         ];

         var modelRawData = {
            Сотрудник: 'Дмитрий Медведев',
            'Сотрудник.Отдел': 'Правительство',
            Должность: 'Премьер-министр',
            'Должность.Зарплата': 100,
            Возраст: 55,
            Стаж: 17,
            ИД: 3,
            ПолеПросто: 'ПолеПросто',
            ПолеПросто1: 'ПолеПросто1',
            'ПолеПросто.ПолеПросто1': 'ПолеПросто2'
         };

         var memorySource = new Memory({
            data: sourceRawData,
            idProperty: 'ИД',
            adapter: new Json()
         });

         var model = new Model({
            rawData: modelRawData,
            idProperty: 'ИД',
            adapter: new Json()
         });

         var observableFields = [
            {
               field: 'ИД',
               map: {
                  Сотрудник: 'Сотрудник',
                  Отдел: 'Сотрудник.Отдел',
                  Должность: 'Должность',
                  'Должность.*': 'Должность.*',
                  Возраст: 'Возраст',
                  Стаж: 'Стаж'
               }
            }
         ];

         new LinkFieldController({
            dataSource: memorySource,
            record: model,
            observableFields: observableFields
         });

         var getModelData = function(model) {
            data = {};
            model.each(function(name, value) {
               data[name] = value;
            });
            return data;
         };

         IoC.resolve('ILogger').log(getModelData(model));

         IoC.resolve('ILogger').log('Всё ок: ' + colHelpers.isEqualObject(getModelData(model), {
            Возраст:55,
            Должность:'Премьер-министр',
            'Должность.Зарплата':100,
            ИД:3,
            ПолеПросто:'ПолеПросто',
            ПолеПросто1:'ПолеПросто1',
            'ПолеПросто.ПолеПросто1':'ПолеПросто2',
            Сотрудник: 'Дмитрий Медведев',
            'Сотрудник.Отдел': 'Правительство',
            Стаж: 17
         }));

         model.set('ИД', 1);

         IoC.resolve('ILogger').log(getModelData(model));

         model.set('ИД', 2);

         IoC.resolve('ILogger').log(getModelData(model));

         model.set('ИД', null);

         IoC.resolve('ILogger').log(getModelData(model));
      }
   });
});