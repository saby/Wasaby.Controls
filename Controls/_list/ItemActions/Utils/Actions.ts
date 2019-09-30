function getActionContainer(event, action, itemData, container, listModel): Element {
    if (action.showType === 2) {
        return event.target.closest('.controls-Grid__row-cell');
    } else {
        const rowCells = container.querySelectorAll(`.controls-Grid__row-cell[data-r="${itemData.index - listModel.getStartIndex()}"]`);
        return rowCells[itemData.columnIndex - 1];
    }
}

export = {
    itemActionsClick: function (self, event, action, itemData, listModel, showAll) {
        event.stopPropagation();
        if (action._isMenu) {
            self._notify('menuActionsClick', [itemData, event, showAll]);
        } else if (action['parent@']) {
           self._notify('menuActionClick', [itemData, event, action]);
        } else {
            //TODO: self._container может быть не HTMLElement, а jQuery-элементом, убрать после https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            const container = self._container.get ? self._container.get(0) : self._container;
            let targetContainer;

            /*
            * https://online.sbis.ru/opendoc.html?guid=5d2c482e-2b2f-417b-98d2-8364c454e635
            * под опцией, чтобы не отломать никому ничего.
            * опцию спилит Егор при переходе на table-layout и отказе от partialGrid
            * https://online.sbis.ru/doc/5d2c482e-2b2f-417b-98d2-8364c454e635
            * */
            if (self._options.fix1177894367 && listModel.isPartialGridSupport()) {
                targetContainer = getActionContainer(event, action, itemData, container, listModel);
            } else {
                targetContainer = Array.prototype.filter.call(container.querySelector('.controls-ListView__itemV').parentNode.children, function (item) {
                    return item.className.indexOf('controls-ListView__itemV') !== -1;
                })[itemData.index - listModel.getStartIndex()];
            }

            const args = [
                action,
                itemData.breadCrumbs ? itemData.item[itemData.item.length - 1] : itemData.item,
                targetContainer
            ];
            self._notify('actionClick', args);
            action.handler && action.handler(args[1]);
        }
    }
};
