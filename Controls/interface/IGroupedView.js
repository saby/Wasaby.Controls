define('js!Controls/interface/IGroupedView', [
], function() {

   /**
    * Интерфейс для работы группировкой.
    * @mixin Controls/interface/IGroupedView
    * @public
    */

   /**
    * @name Controls/interface/IGroupedView#itemsGroup
    * @cfg {Object} {
        method: () => void,
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