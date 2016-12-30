/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.DOCS.FilterButtonA', 
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый компонент, от которого далее будем наследовать свой демо-компонент
      'html!SBIS3.DOCS.FilterButtonA', // Подключаем вёрстку демо-компонента
      'js!SBIS3.DOCS.FilterButtonSourceA', // Подключаем статический источник данных
      'js!SBIS3.CONTROLS.DataGridView', // Подключаем контрол представления данных
      'js!SBIS3.CONTROLS.FilterButton', // Подключаем контрол панели фильтров
      'js!SBIS3.DOCS.ListFBContentA', // Подключаем компонент, который будет использован при построении всплывающей панели фильтрации
      'js!SBIS3.CONTROLS.FilterLink', // Подключаем компонент, который будет использован при построении всплывающей панели фильтрации
      'js!SBIS3.CONTROLS.TextBox', // Подключаем контрол представления данных
      'js!SBIS3.DOCS.FBAdditionalTemplateA',
      'css!SBIS3.DOCS.FilterButtonA' // Подключаем CSS-файл со стилями, которые будут использованы в вёрстке демо-компонента
   ], 
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js 
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента из файла FilterButton.html
      MemorySource // В эту переменную импортируется класс для работы с источником данных
   ) {
   var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
      _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
      

      init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
         moduleClass.superclass.init.call(this); // Обязательная конструкция - вызов функции init у родительского класса
         

         var myTable = this.getChildControlByName('myTable'), // Получаем представление данных
            myFilter = this.getChildControlByName('FilterTable'); // Получаем экземпляр панели фильтров
         
         var contextFilter = myFilter.getContext();
         
			myTable.setDataSource(MemorySource); // Устанавливаем источник данных для представления данных  
			
			
			
      }
   });
   
   moduleClass.webPage = {
      htmlTemplate: "/Тема Скрепка/Шаблоны/empty-template.html", 
      outFileName: "FilterButtonA"
   };
   
   
   return moduleClass;
});