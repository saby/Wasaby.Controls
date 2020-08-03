import {Control, TemplateFunction} from 'UI/Base';
import {RecordSet} from 'Types/collection';
import {showType} from 'Controls/Utils/Toolbar';
import * as Template from 'wml!Controls-demo/Toolbar/Items/Items';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet = new RecordSet({
        rawData: [
            {
                id: '1',
                showType: showType.TOOLBAR,
                icon: 'icon-Time',
                '@parent': false,
                parent: null
            },
            {
                id: '3',
                icon: 'icon-Print',
                title: 'Распечатать',
                '@parent': false,
                parent: null
            },
            {
                id: '4',
                icon: 'icon-Linked',
                fontColorStyle: 'secondary',
                viewMode: 'toolButton',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Связанные документы',
                showType: showType.MENU,
                '@parent': true,
                parent: null
            },
            {
                id: '5',
                viewMode: 'icon',
                icon: 'icon-Link',
                title: 'Скопировать в буфер',
                '@parent': false,
                parent: null
            },
            {
                id: '6',
                showType: showType.MENU,
                title: 'Прикрепить к',
                '@parent': false,
                parent: null,
                readOnly: true
            },
            {
                id: '7',
                showType: showType.MENU_TOOLBAR,
                title: 'Проекту',
                '@parent': false,
                parent: '4'
            },
            {
                id: '8',
                showType: showType.MENU,
                title: 'Этапу',
                '@parent': false,
                parent: '4'
            },
            {
                id: '9',
                showType: showType.MENU,
                title: 'Согласование',
                '@parent': false,
                parent: '2'
            },
            {
                id: '10',
                showType: showType.MENU,
                title: 'Задача',
                '@parent': false,
                parent: '2'
            },
            {
                id: '11',
                icon: 'icon-EmptyMessage',
                fontColorStyle: 'secondary',
                showHeader: true,
                viewMode: 'link',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Обсудить',
                '@parent': true,
                parent: null,
                readOnly: true
            },
            {
                id: '12',
                showType: showType.MENU,
                title: 'Видеозвонок',
                '@parent': false,
                parent: '11'
            },
            {
                id: '13',
                showType: showType.MENU,
                title: 'Сообщение',
                '@parent': false,
                parent: '11'
            },
            {
                id: '14',
                showType: showType.MENU,
                icon: 'icon-Groups',
                fontColorStyle: 'secondary',
                title: 'Совещания',
                '@parent': false,
                parent: null,
                additional: true
            },
            {
                id: '2',
                showType: showType.MENU,
                icon: 'icon-Report',
                fontColorStyle: 'secondary',
                title: 'Список задач',
                '@parent': true,
                parent: null,
                additional: true
            }
        ]
    });

    static styles: string[] = ['Controls-demo/Controls-demo'];
}
