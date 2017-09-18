import IItemsRenderOptions = require("./resources/ItemsRenderOptions");
import IItemTemplate = require("../interfaces/IItemTemplate");
import ICollection = require("../interfaces/ICollection");
import ISource = require("../interfaces/ISource");

interface Options extends IItemsRenderOptions {
    dataSource: ISource,
    navigation: {
        type: string,
        config: {
            pageSize?: number
        }
    },
    emptyHTML?: string,
    filter? : {},
    sorting?: Array<any>,
    /**
     * @cfg {String} Устанавливает стратегию действий с подгружаемыми в список записями
     * @variant merge - мержить, при этом записи с одинаковыми id схлопнутся в одну
     * @variant append - добавлять, при этом записи с одинаковыми id будут выводиться в списке
     *
     */
    loadItemsStrategy?: string,//непонятная штука
    footerTemplate?: () => void //непонятно, почему нет headertemplate

}
export = Options;