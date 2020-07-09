import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/Grouped/groupHistoryId/DemoSwitchableArea';
import {Memory} from 'Types/source';
import {getTasks} from '../../DemoHelpers/DataCatalog';
import {IColumn} from 'Controls/_grid/interface/IColumn';
import Config = require('Env/Config');

interface IItem {
   get: (item: string) => string;
}

export default class extends Control {
   protected _template: TemplateFunction = Template;
   protected _items: any = {};
   protected _demoSelectedKey: string = '0';
   protected _viewSource: Memory;
   protected _columns: IColumn[] = [
      {
         displayProperty: 'id',
         width: '30px'
      },
      {
         displayProperty: 'state',
         width: '200px'
      },
      {
         displayProperty: 'date',
         width: '100px'
      }
   ];
   protected _groupHistoryId: string = '';
   protected readonly GROUP_HISTORY_ID_NAME: string = 'MY_NEWS';
   _groupingKeyCallback = (item: IItem): string => {
      return item.get('fullName');
   };

   protected _beforeMount(): void {
      Config.UserConfig.setParam('LIST_COLLAPSED_GROUP_' + this.GROUP_HISTORY_ID_NAME, JSON.stringify(['Крайнов Дмитрий']));
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: getTasks().getData()
      });
   }

   clickHandler(event: object, idButton: string): void {
      if (idButton === '1') {
         this._groupHistoryId = this.GROUP_HISTORY_ID_NAME;
         this._viewSource = new Memory({
            keyProperty: 'id',
            data: [
               {
                  id: 1,
                  message: 'Регламент: Ошибка в разработку. Автор: Дубенец Д.А. Описание: (reg-chrome-presto) 3.18.150 controls - Поехала верстка кнопок когда они задизейблены prestocarry',
                  fullName: 'fullName',
                  date: '6 мар',
                  state: 'state'
               },
               {
                  id: 2,
                  message: 'Регламент: Ошибка в разработку. Автор: Волчихина Л.С. Описание: Отображение колонок. При снятии галки с колонки неверная всплывающая подсказка',
                  fullName: 'fullName',
                  date: '6 мар',
                  state: 'state'
               },
               {
                  id: 3,
                  message: 'Смотри надошибку. Нужно сделать тесты, чтобы так в будущем не разваливалось',
                  fullName: 'fullName',
                  date: '6 мар',
                  state: 'Выполнение'
               },
               {
                  id: 4,
                  message: 'Регламент: Ошибка в разработку. Автор: Оборевич К.А. Описание: Розница. Замечания к шрифтам в окнах Что сохранить в PDF/Excel и Что напечатать',
                  fullName: 'fullName',
                  date: '12 ноя',
                  state: 'state'
               },
               {
                  id: 5,
                  message: 'Пустая строка при сканировании в упаковку Тест-онлайн adonis1/adonis123 1) Создать документ списания 2) отсканировать в него наименование/открыть РР/+Упаковка 3) Заполнить данные по упаковке/отсканировать еще 2 марки',
                  fullName: 'Корбут Антон',
                  date: '5 мар',
                  state: 'Выполнение'
               },
               {
                  id: 6,
                  message: 'Разобраться с getViewModel - либо наследование, либо создавать модель прямо в TreeControl и передавать в BaseControl, либо ещё какой то вариант придумать.',
                  fullName: 'Кесарева Дарья',
                  date: '12 сен',
                  state: 'Выполнение'
               },
               {
                  id: 7,
                  message: 'Научить reload обновлять табличное представление VDOM с сохранением набранных данных (например загруженных по кнопке "еще"). В данный момент есть deepReload, но он не сохраняет набранные данные.',
                  fullName: 'Кесарева Дарья',
                  date: '12 сен',
                  state: 'Выполнение'
               },
               {
                  id: 8,
                  message: 'Лесенка на VDOM. Перевести алгоритм на предварительный расчет в модели. Сделать демку.',
                  fullName: 'Кесарева Дарья',
                  date: '12 сен',
                  state: 'Выполнение'
               },
               {
                  id: 9,
                  message: 'Прошу сделать возможность отключения: 1) ховера на айтемах  у Controls/List, 2) курсор: поинтер',
                  fullName: 'Кесарева Дарья',
                  date: '12 сен',
                  state: 'Выполнение'
               },
               {
                  id: 10,
                  message: 'через шаблон ячейки должна быть возможность управлять colspan (или rowspan) отдельной ячейки. <ws:partial template="standartCellTemplate" colspan="2"> типа такого если я напишу, то у меня будет ячейка на две колонки',
                  fullName: 'Кесарева Дарья',
                  date: '12 сен',
                  state: 'Выполнение'
               },
               {
                  id: 11,
                  message: 'Не работают хлебные крошки и навигация по' +
                  'ним если идентификатор записи равен 0 Как повторить',
                  fullName: 'Догадкин Владимир',
                  date: '28 фев',
                  state: 'Выполнение'
               },
               {
                  id: 12,
                  message: 'Не работает collapse в группировке в дереве test-online.sbis.ru сталин/Сталин123',
                  fullName: 'Догадкин Владимир',
                  date: '26 фев',
                  state: 'Выполнение'
               }
            ]
         });
      } else {
         this._groupHistoryId = '';
      }
   }

)

   static _styles: string[] = ['Controls-demo/Controls-demo'];
}
