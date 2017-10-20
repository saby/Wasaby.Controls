define('js!SBIS3.SPEC.interface.IIGroupedView', [
], function() {

   /**
    * Интерфейс для работы группировкой.
    * @mixin SBIS3.SPEC.interface.IIGroupedView
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IIGroupedView#itemsGroup
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