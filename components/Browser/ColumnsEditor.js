define('SBIS3.CONTROLS/Browser/ColumnsEditor', [
      'SBIS3.CONTROLS/Browser/ColumnsEditor/EditorButton',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Editor',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/AreaSelectableModel',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Cache/*'/*,
      'SBIS3.CONTROLS/Browser/Columns/Config',
      'SBIS3.CONTROLS/Browser/Columns/Defenition'*/
   ],
   function (EditorButton, Editor, Editing_Area, Editing_AreaSelectableModel, Preset_Dropdown, Preset_Unit, Preset_Cache) {

      return {
         /*
          * Компонент кнопки, открывающей редактор колонок. Предназначена для использования в браузере. Результат редактирования применяется к самому браузеру
          * (так как при нажатии посылается команда showColumnsEditor cо свойством applyToSelf = true). Опционально использует дропдаун с выбором пресета
          */
         EditorButton: EditorButton,
         /*
          * Компонент редактора колонок. Открывает (в плавающей области) компонент области редактирования методом open, который возвращает обещание,
          * разрешаемое результатом редактирования (объектом columnsConfig)
          */
         Editor: Editor,
         /*
          * Подпакет
          */
         Editing: {
            /*
             * Компонент области редактирования редактора колонок, в котором пользователь непосредственно осуществляет редактирование колонок. Список колонок
             * разделяется на фиксированные и не фиксированные. Не фиксированные колонки (опционально) собираются в группы для удобства работы с длинными
             * списками. Также (опционально) используются предустановленные наборы выделения колонок и сосатояния групп (пресеты), как задаваемые статически
             * (через опции), так и редактируемые и сохраняемые пользователем.
             */
            Area: Editing_Area,
            /*
             * Модель данных для списка колонок. Используется в компоненте области редактирования редактора колонок
             */
            AreaSelectableModel: Editing_AreaSelectableModel
         },
         /*
          * Подпакет
          */
         Preset: {
            /*
             * Компонент дропдауна для выбора пресета. Комбинирует пресеты, задаваемые (в опциях) статически и пресеты, редактируемые и сохраняемые пользователем
             */
            Dropdown: Preset_Dropdown,
            /*
             * Класс, формализующий данные пресета
             */
            Unit: Preset_Unit,
            /*
             * Класс для запроса/сохранения данных пользовательских пресетов. Обеспечивает минимизацию обращений к сервису и синхронизацию данных для разных
             потребителей
             */
            Cache: Preset_Cache
         }
      };
   }
);
