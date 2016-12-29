/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.DOCS.ListFBContentA', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый компонент, от которого далее будем наследовать свой демо-компонент
      'html!SBIS3.DOCS.ListFBContentA', // Подключаем вёрстку диалога с фильтрами
      'js!WS.Data/Source/SbisService', 
      'css!SBIS3.DOCS.ListFBContentA', // Подключаем CSS-файл со стилями, которые будут использованы в вёрстке диалога
      'js!SBIS3.CONTROLS.ComboBox', // Подключаем контрол "Выпадающий список"
      'js!SBIS3.CONTROLS.TextBox', 
      'js!SBIS3.CONTROLS.FilterText', 
      'js!SBIS3.CONTROLS.MenuLink', 
      'js!SBIS3.CONTROLS.DropdownList', 
      'js!SBIS3.CONTROLS.FilterSelect' 
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента
      SbisService
   ){
      var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция - вызов функции init у родительского класса

         }
      });
      
      
      return moduleClass;
   }
);