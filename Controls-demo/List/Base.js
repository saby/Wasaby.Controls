/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls-demo/List/Base', [
   'Core/Control',
   'tmpl!Controls-demo/List/Base/Base',
   'WS.Data/Source/Memory',
   'css!Controls-demo/List/Base/Base',
   'css!Controls-demo/List/ScrollPaging/ScrollPaging',
   'tmpl!Controls-demo/List/Base/myContent'
], function (
   BaseControl,
   template,
   MemorySource
) {
   'use strict';

   var myData = [
      {
         id: 1,
         author: 'Дэвид Макфарланд',
         title: 'Большая книга CSS3',
         description: 'Прочитав в этой книге множество практических примеров, а также советов, вы перейдете на новый уровень создания сайтов с помощью HTML и CSS.'
      },
      {
         id: 2,
         author: 'Дэвид Флэнаган',
         title: 'JavaScript. Подробное руководство',
         description: 'Эта книга – одновременно и руководство программиста с большим числом практических примеров, и полноценный справочник по базовому языку JavaScript и клиентским прикладным интерфейсам, предоставляемым веб-браузерами.'
      },
      {
         id: 3,
         author: 'Джеффри Фридл',
         title: 'Регулярные выражения',
         description: 'Книга откроет перед вами секрет высокой производительности. Тщательно продуманные регулярные выражения помогут избежать долгих часов утомительной работы и решить проблемы за 15 секунд.'
      },
      {
         id: 4,
         author: 'Билл Любанович',
         title: 'Простой Python. Современный стиль программирования',
         description: 'Эта книга идеально подходит как для начинающих программистов, так и для тех, кто только собирается осваивать Python, но уже имеет опыт программирования на других языках.'
      },
      {
         id: 5,
         author: 'Стивен Прата',
         title: 'Язык программирования C++. Лекции и упражнения',
         description: 'Книга представляет собой тщательно проверенный, качественно составленный полноценный учебник по одной из ключевых тем для программистов и разработчиков. Эта классическая работа по вычислительной технике обучает принципам программирования, среди которых структурированный код и нисходящее проектирование, а также использованию классов, наследования, шаблонов, исключений, лямбда-выражений, интеллектуальных указателей и семантики переноса.'
      }
   ];

   var ModuleClass = BaseControl.extend(
      {
         _template: template,

         constructor: function() {
            ModuleClass.superclass.constructor.apply(this, arguments);
            this._viewSource = new MemorySource({
               keyProperty: 'id',
               data: myData
            })
         }
      });
   return ModuleClass;
});