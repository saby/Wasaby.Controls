import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Grouped/groupHistoryId/groupHistoryId';
import {Memory} from 'Types/source';
import {getGroupedCatalog as getData} from '../../DemoHelpers/DataCatalog';
import * as Config from 'Env/Config';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _groupHistoryId: string = '';

    protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: boolean) {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getData()
        });
        if (receivedState) {
            if (!Config.UserConfig.getParam('LIST_COLLAPSED_GROUP_MY_BRAND').getResult()) {
                Config.UserConfig.setParam('LIST_COLLAPSED_GROUP_MY_BRAND', JSON.stringify([]));
            }

            this._groupHistoryId = 'MY_BRAND';
        } else {
            return new Promise((resolve) => {
                resolve(true);
            });
        }
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
