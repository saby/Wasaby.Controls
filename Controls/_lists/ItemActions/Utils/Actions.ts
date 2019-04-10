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
            self._notify('itemActionsClick', [
                action,
                itemData.item,
                Array.prototype.filter.call(container.querySelector('.controls-ListView__itemV').parentNode.children, function (item) {
                    return item.className.indexOf('controls-ListView__itemV') !== -1;
                })[itemData.index - listModel.getStartIndex()],
                event //TODO: кидаю нативное событие, чтобы прикладники могли бы сами сделать операции над записью с меню. В январе по этой задаче предоставлю им платформенный механизм https://online.sbis.ru/opendoc.html?guid=94840c27-ff4f-4cc9-9b9e-b900f326dd18
            ]);
            action.handler && action.handler(itemData.item);
        }
    }
};
