/**
 * @author Коновалова А.И.
 */
define('Controls-demo/Layouts/SearchLayout/resources/FBPanelLayout', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'Lib/Control/CompoundControl/CompoundControl', // Подключаем базовый компонент, от которого далее будем наследовать свой демо-компонент
      'tmpl!Controls-demo/Layouts/SearchLayout/resources/FBPanelLayout', // Подключаем вёрстку диалога с фильтрами
      'WS.Data/Source/Memory',
      'SBIS3.CONTROLS/ComboBox', // Подключаем контрол "Выпадающий список"
      'SBIS3.CONTROLS/TextBox',
      'Controls/Filter/FastData',
      'SBIS3.CONTROLS/Filter/Button/Text',
      'css!SBIS3.DOCS.FBPanel', // Подключаем CSS-файл со стилями, которые будут использованы в вёрстке диалога
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента из файла tcv_stageM.html
      MemorySource
   ){
      var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         filter: {
            id: 'id',
            idProperty: 'id',
            displayProperty: 'title',
            resetValue: '0',
            source: {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {id: 0, title: 'По id'},
                     {id: 1, title: '1'},
                     {id: 2, title: '2'},
                     {id: 3, title: '3'},
                     {id: 4, title: '4'}
                  ]
               }
            }
         },

         constructor: function () {
            this._filterSource = new MemorySource({
               idProperty: 'id',
               data: this.filter
            });
         },

         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция - вызов функции init у родительского класса


         }
      });
      return moduleClass;
   }
);