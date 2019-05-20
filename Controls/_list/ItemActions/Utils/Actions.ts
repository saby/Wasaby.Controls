import { IoC } from 'Env/Env';

export = {
    itemActionsClick: function (self, event, action, itemData, listModel, showAll) {
        event.stopPropagation();
        if (action._isMenu) {
            self._notify('menuActionsClick', [itemData, event, showAll]);
        } else if (action['parent@']) {
           self._notify('menuActionClick', [itemData, event, action]);
        } else {
            //TODO: self._container может быть не HTMLElement, а jQuery-элементом, убрать после https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            var container = self._container.get ? self._container.get(0) : self._container;
            const args = [
                action,
                itemData.breadCrumbs ? itemData.item[itemData.item.length - 1] : itemData.item,
                Array.prototype.filter.call(container.querySelector('.controls-ListView__itemV').parentNode.children, function (item) {
                    return item.className.indexOf('controls-ListView__itemV') !== -1;
                })[itemData.index - listModel.getStartIndex()]
            ];
            self._notify('itemActionsClick', args.concat(event));
            IoC.resolve('ILogger').warn('Событие itemActionsClick было переименовано и будет удалено в версию 19.400. Используйте событие actionClick.');
            self._notify('actionClick', args);
            action.handler && action.handler(args[1]);
        }
    }
};
