/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.Demo.FilterButton.FilterDropdown', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый компонент, от которого далее будем наследовать свой демо-компонент
      'html!SBIS3.Demo.FilterButton.FilterDropdown', // Подключаем вёрстку демо-компонента
      'js!SBIS3.Demo.FilterButton.FilterDropdownSource', // Подключаем статический источник данных
      'js!SBIS3.Demo.FilterButton.FilterDropdownPanel', // Подключаем компонент, который будет использован как шаблон всплывающей панели фильтров
      'js!SBIS3.Demo.FilterButton.FilterDropdownPanelAdd', // Подключаем компонент, который будет использован на всплывающей панели для блока "Можно отобрать"
      'js!SBIS3.CONTROLS.FilterButton', // Подключаем контрол представления данных
      'js!SBIS3.CONTROLS.DataGridView', // Подключаем контрол представления данных
      'css!SBIS3.Demo.FilterButton.FilterDropdown' // Подключаем CSS-файл со стилями, которые будут использованы в вёрстке демо-компонента
   ], 
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js 
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента из файла FilterButton.FilterDropdown.html
      MemorySource // В эту переменную импортируется класс для работы с источником данных
   ) {
   var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
      _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент

      init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
         moduleClass.superclass.init.call(this); // Обязательная конструкция - вызов функции init у родительского класса
         
         var myTable = this.getChildControlByName('myTable'), // Получаем представление данных
            myFilter = this.getChildControlByName('FilterTable'); // Получаем экземпляр панели фильтров
         
	 myTable.setDataSource(MemorySource); // Устанавливаем источник данных для представления данных
         
      }
   });


   return moduleClass;
});