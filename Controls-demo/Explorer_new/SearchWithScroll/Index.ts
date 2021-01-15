import {Control, TemplateFunction} from 'UI/Base';
import * as MemorySource from 'Controls-demo/Explorer/ExplorerMemory';
import * as Template from 'wml!Controls-demo/Explorer_new/SearchWithScroll/SearchWithScroll';
import {TRoot} from 'Controls-demo/types';

interface IViewColumns {
    displayProperty: string;
    width: string;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: MemorySource;
    protected _viewColumns: IViewColumns[];
    protected _root: TRoot = null;

    protected _beforeMount(): void {
        this._viewColumns = [
            {
                displayProperty: 'title',
                width: '1fr'
            }
        ];
        this._viewSource = new MemorySource({
            keyProperty: 'id',
            data: [
                {
                    id: 1,
                    'parent': null,
                    'parent@': true,
                    title: 'Документы отделов'
                }, {
                    id: 11,
                    'parent': 1,
                    'parent@': true,
                    title: '1. Электронный документооборот'
                }, {
                    id: 12,
                    'parent': 1,
                    'parent@': true,
                    title: '2. Отчетность через интернет'
                }, {
                    id: 121,
                    'parent': 12,
                    'parent@': true,
                    title: 'Papo4ka'
                },
                {
                    id: 1211,
                    'parent': 121,
                    'parent@': true,
                    title: 'Doc1',
                    isDocument: true
                },
                {
                    id: 1212,
                    'parent': 121,
                    'parent@': true,
                    title: 'Doc12',
                    isDocument: true
                },
                {
                    id: 122,
                    'parent': 12,
                    'parent@': true,
                    title: 'Papo4ka2'
                },
                {
                    id: 13,
                    'parent': 1,
                    'parent@': null,
                    title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                    isDocument: true
                }, {
                    id: 14,
                    'parent': 1,
                    'parent@': null,
                    title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                    isDocument: true
                }, {
                    id: 15,
                    'parent': 1,
                    'parent@': null,
                    title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                    isDocument: true
                }, {
                    id: 16,
                    'parent': 1,
                    'parent@': null,
                    title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                    isDocument: true
                }, {
                    id: 17,
                    'parent': 1,
                    'parent@': null,
                    title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                    isDocument: true
                }, {
                    id: 18,
                    'parent': 1,
                    'parent@': null,
                    title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                    isDocument: true
                }, {
                    id: 19,
                    'parent': 1,
                    'parent@': null,
                    title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                    isDocument: true
                }, {
                    id: 111,
                    'parent': 11,
                    'parent@': true,
                    title: 'Задачи'
                }, {
                    id: 91,
                    'parent': 111,
                    'parent@': true,
                    title: 'Очень длинный текст внтури папки "Задачи"'
                }, {
                    id: 92,
                    'parent': 91,
                    'parent@': true,
                    title: 'Очень длинный текст внтури папки "Очень длинный текст внтури папки Задачи"'
                }, {
                    id: 94,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 95,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 96,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 97,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 98,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 99,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 911,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 912,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 913,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 914,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 915,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 916,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 917,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 918,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 919,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 920,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 921,
                    'parent': 92,
                    'parent@': null,
                    title: 'Задача'
                }, {
                    id: 112,
                    'parent': 11,
                    'parent@': null,
                    title: 'Сравнение систем по учету рабочего времени.xlsx',
                    isDocument: true
                }, {
                    id: 2,
                    'parent': null,
                    'parent@': true,
                    title: 'Техническое задание'
                }, {
                    id: 21,
                    'parent': 2,
                    'parent@': null,
                    title: 'PandaDoc.docx',
                    isDocument: true
                }, {
                    id: 22,
                    'parent': 2,
                    'parent@': null,
                    title: 'SignEasy.docx',
                    isDocument: true
                }, {
                    id: 3,
                    'parent': null,
                    'parent@': true,
                    title: 'Анализ конкурентов'
                }, {
                    id: 4,
                    'parent': null,
                    'parent@': null,
                    title: 'Договор на поставку печатной продукции',
                    isDocument: true
                }, {
                    id: 5,
                    'parent': null,
                    'parent@': null,
                    title: 'Договор аренды помещения',
                    isDocument: true
                }, {
                    id: 6,
                    'parent': null,
                    'parent@': null,
                    title: 'Конфеты'

                }, {
                    id: 7,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 71,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 72,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 73,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 74,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 75,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 76,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 77,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 78,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 79,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 80,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 81,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 82,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 83,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 84,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 85,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }, {
                    id: 86,
                    'parent': null,
                    'parent@': null,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    isDocument: true
                }]
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
