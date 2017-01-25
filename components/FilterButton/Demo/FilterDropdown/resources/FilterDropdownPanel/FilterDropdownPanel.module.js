/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.Demo.FilterButton.FilterDropdownPanel', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый компонент, от которого далее будем наследовать свой демо-компонент
      'html!SBIS3.Demo.FilterButton.FilterDropdownPanel', // Подключаем вёрстку демо-компонента
      'js!SBIS3.CONTROLS.TextBox', // Подключаем контрол представления данных
      'js!SBIS3.CONTROLS.FilterText', // Подключаем контрол представления данных
      'js!SBIS3.CONTROLS.FilterDropdown', // Подключаем контрол представления данных
      'css!SBIS3.Demo.FilterButton.FilterDropdownPanel' // Подключаем CSS-файл со стилями, которые будут использованы в вёрстке демо-компонента
   ], 
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn // В эту переменную импортируется вёрстка демо-компонента из файла FilterButton.FilterDropdownPanel.html
   ) {
   var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
      _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент

      init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
         moduleClass.superclass.init.call(this); // Обязательная конструкция - вызов функции init у родительского класса
         

      }
   });

   return moduleClass;
});