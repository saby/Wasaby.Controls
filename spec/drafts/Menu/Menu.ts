import IMenuOptions = require("./Options");
import ItemsRender = require("./resources/ItemsRender");

class Menu {
    constructor(options: IMenuOptions){
        //Здесь нужно добавить работу с popup.
        //нужно постараться сделать так, чтобы
        //popup был обычным независимым окном
        //безразличным к своему содержимому
        //никакие popupMixin делать не нужно
        //нет смысла в публичном API.
        //меню показывает подменю только по своей инициативе
        //когда пользователь кликнул по строке.
        
        let items = options.items || options.dataSource.query();
        let menuView = new ItemsRender({
            items: items,
            displayProperty: options.displayProperty,
            itemsGroup: options.itemsGroup,
            itemTemplate: options.itemTemplate
        });

        menuView.onItemClick.subscribe((item) => {

        });
        menuView.onNeedSubmenu.subscribe((item) => {
            //тут нужно показать новое MenuView
        })
    }
}