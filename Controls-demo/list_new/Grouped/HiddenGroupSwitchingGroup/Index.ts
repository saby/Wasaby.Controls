import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {Memory} from 'Types/source';
import {groupConstants} from 'Controls/list';
import * as Template from 'wml!Controls-demo/list_new/Grouped/HiddenGroupSwitchingGroup/HiddenGroupSwitchingGroup';

function getData(): Array<{
    id: number
    title: string
    group?: string
}> {
    return [
        {
            id: 1,
            title: '1 Первая запись в рекордсете',
            group: groupConstants.hiddenGroup
        },
        {
            id: 2,
            title: '2 Вторая запись в рекордсете',
            group: groupConstants.hiddenGroup
        },
        {
            id: 3,
            title: '3 Третья запись в рекордсете',
            group: 'Архив'
        },
        {
            id: 4,
            title: '4 Четвертая запись в рекордсете',
            group: 'Архив'
        },
        {
            id: 5,
            title: '5 Пятая запись в рекордсете',
            group: groupConstants.hiddenGroup
        },
        {
            id: 6,
            title: '6 Шестая запись в рекордсете',
            group: 'Архив'
        },
        {
            id: 7,
            title: '7 Седьмая запись в рекордсете',
            group: 'Архив'
        },
    ];
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions = [
        {
            id: 'archive',
            icon: 'icon-Archive',
            showType: 2,
            handler: this._switchGroup
        }];

    protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getData()
        });
    }

    protected _switchGroup(item): void {
        item.set('group', item.get('group') === 'Архив' ? groupConstants.hiddenGroup : 'Архив');
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
