define('js!Controls/interface/IIGroupedView', [
], function() {

   /**
    * Интерфейс для работы группировкой.
    * @mixin Controls/interface/IIGroupedView
    * @public
    */

   /**
    * @name Controls/interface/IIGroupedView#itemsGroup
    * @cfg {Object} {
        method: () => void,
        field: string,
        template: () => void
    }
    */


});


/*
import IItemsViewOptions = require("../../ItemsView/resources/ItemsRenderOptions");
interface IGroupedItemsViewOptions {
    itemsGroup?: {
        method: () => void,
        field: string,
        template: () => void
    }
}
export = IGroupedItemsViewOptions;

*/