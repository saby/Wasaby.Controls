interface IVirtualScrollOptions {
    itemsLength: number,
    pageSize?: number,
    maxItems?: number
}

class VirtualScroll {
    constructor(options : IVirtualScrollOptions){

    }

    updateWindowOnTrigger(position: String) {}

    onItemsChange(oldItems, newItems) {}

    getVirtualWindow() {}
}

export = VirtualScroll;