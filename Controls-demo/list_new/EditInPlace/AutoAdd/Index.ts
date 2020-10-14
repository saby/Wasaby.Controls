import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/AutoAdd/AutoAdd';
import {Memory} from 'Types/source';
import {getFewCategories as getData} from '../../DemoHelpers/DataCatalog';
import {IItemAction, TItemActionShowType} from "../../../../Controls/_itemActions/interface/IItemAction";
import {Model} from "Types/entity";
import {IoC} from "Env/Env";

const itemActions: IItemAction[] = [
    {
        id: 5,
        title: 'прочитано',
        showType: TItemActionShowType.TOOLBAR,
        handler(model: Model): void {
            IoC.resolve('ILogger').info('action read Click');
        }
    },
    {
        id: 1,
        icon: 'icon-PhoneNull',
        title: 'phone',
        handler(model: Model): void {
            IoC.resolve('ILogger').info('action phone Click ', model);
        }
    },
    {
        id: 2,
        icon: 'icon-EmptyMessage',
        title: 'message',
        parent: null,
        'parent@': true,
        handler(model: Model): void {
            alert('Message Click');
        }
    },
    {
        id: 3,
        icon: 'icon-Profile',
        title: 'profile',
        showType: TItemActionShowType.MENU_TOOLBAR,
        parent: 2,
        'parent@': null,
        handler(model: Model): void {
            IoC.resolve('ILogger').info('action profile Click');
        }
    },
    {
        id: 6,
        title: 'call',
        parent: 2,
        'parent@': null,
        handler(model: Model): void {
            IoC.resolve('ILogger').info('action profile Click');
        }
    },
    {
        id: 'delete',
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'delete pls',
        showType: TItemActionShowType.TOOLBAR,
        handler(model: Model): void {
            IoC.resolve('ILogger').info('action delete Click');
        }
    }
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction[] = itemActions;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getData()
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
