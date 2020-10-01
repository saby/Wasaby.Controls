import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { IItemAction } from 'Controls/itemActions';

interface IData {
   id: number;
   parent: null | number;
   title: string;
   type: string;
   hiddenGroup?: boolean;
   isDocument: Boolean;
   image: string;
   width: string | number;
   isShadow: boolean;
}

export const Gadgets = {
   getData: (): IData[] => [{
      id: 1,
      parent: null,
      type: null,
      title: 'Сравнение условий конкурентов по ЭДО.xlsx',
      image: explorerImages[4],
      isDocument: true,
      hiddenGroup: true,
      width: 150,
      isShadow: true
   }, {
      id: 2,
      parent: null,
      type: null,
      title: 'Сравнение систем по учету рабочего времени.xlsx',
      image: explorerImages[5],
      isDocument: true,
      hiddenGroup: true,
      width: 200,
      isShadow: false
   }, {
      id: 3,
      parent: null,
      type: null,
      title: 'Конфеты копия',
      image: explorerImages[3],
      isDocument: true,
      width: 300,
      isShadow: true
   }],
    getPreviewItems: (): IData[] => [
        {
            id: 0,
            parent: null,
            type: null,
            title: 'Конфеты копия',
            image: explorerImages[8],
            titleStyle: 'light',
            'parent@': true,
            additionalText: 'папка с песцом',
            gradientType: 'dark',
            isDocument: true,
            width: 300,
            isShadow: true
        },
        {
        id: 1,
        parent: null,
        type: null,
        title: 'Сравнение условий конкурентов по ЭДО.xlsx',
        titleStyle: 'light',
        titleLines: 2,
        'parent@': false,
        additionalText: 'песец лист',
        gradientType: 'dark',
        image: explorerImages[8],
        isDocument: true,
        hiddenGroup: true,
        width: 150,
        isShadow: true
    }, {
        id: 2,
        parent: null,
        type: null,
        title: 'Сравнение систем по учету рабочего времени.xlsx',
        image: explorerImages[9],
        isDocument: true,
        hiddenGroup: true,
        titleStyle: 'dark',
        'parent@': false,
        additionalText: 'солнышко',
        gradientType: 'light',
        image: explorerImages[9],
        width: 200,
        isShadow: false
    }, {
        id: 3,
        parent: null,
        type: null,
        title: 'Конфеты копия',
        image: explorerImages[8],
        isDocument: true,
        width: 300,
        isShadow: true
    }, {
        id: 4,
        parent: null,
        type: null,
        title: 'Картинка с умным градиентом',
        image: explorerImages[8],
        titleStyle: 'lite',
        gradientType: 'custom',
        gradientColor: '#E0E0E8',
        isDocument: true,
        width: 300,
        isShadow: true
    }],

   getActions: (): IItemAction[] => [
      {
         id: 1,
         icon: 'icon-PhoneNull',
         title: 'phone',
         showType: 0
      },
      {
         id: 2,
         icon: 'icon-EmptyMessage',
         title: 'message',
         showType: 0
      }
   ],

}
