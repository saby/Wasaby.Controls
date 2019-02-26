import Abstract = require('Core/Abstract');

var VirtualScroll = Abstract.extend({
    $protected: {
        _options: {
            itemsLength: 0,
            pageSize: 5,
            maxItems: 15
        }
    },

    // First and last indices of items in projection
    _projectionLength: null,

    // Range of indices of items that are shown in virtual window
    _virtualWindow: {
        start: null,
        end: null
    },

    init: function () {
        this._projectionLength = this._options.itemsLength;
        this._virtualWindow.start = 0;

        if (this._options.maxItems < this._projectionLength) {
            this._virtualWindow.end = this._options.maxItems;
        } else {
            this._virtualWindow.end = this._projectionLength;
        }
    },

    /************************************************
     *
     *    Event handlers
     *
     ***********************************************/
    /**
     * Updates window bounds when reaching top or bottom of the list.
     *
     * @param position (string) 'top' or 'bottom'
     * @returns {{window: (*|{start: number, end: number}), topChange: number, bottomChange: number}}
     */
    updateWindowOnTrigger: function (position) {
        var result;

        if (position === 'top') {
            result = this._addItemsToWindowStart();
        } else { // bottom
            result = this._addItemsToWindowEnd();
        }

        // No more data left in projection
        if (this._virtualWindow.end === this._projectionLength) {
            this._notify('virtualScrollReachedBottom');
        }
        if (this._virtualWindow.start === 0) {
            this._notify('virtualScrollReachedTop');
        }

        return {
            'window': this.getVirtualWindow(),
            'topChange': result.topChange,
            'bottomChange': result.bottomChange
        };
    },

    /**
     * Add more items to the end of virtual window.
     *
     * @returns {{topChange: number, bottomChange: number}}
     * @private
     */
    _addItemsToWindowEnd: function () {
        var
            bottomChange = 0,
            topChange = 0;

        // Load more data
        if (this._projectionLength - this._virtualWindow.end < this._options.pageSize) {
            bottomChange = this._projectionLength - this._virtualWindow.end;
        } else {
            bottomChange = this._options.pageSize;
        }
        this._virtualWindow.end += bottomChange;

        // Remove items from opposite end
        if (this._virtualWindow.end - this._virtualWindow.start - bottomChange >= this._options.maxItems) {
            // remove page from bottom
            this._virtualWindow.start += bottomChange;
            topChange = -bottomChange;
        }

        return {
            topChange: topChange,
            bottomChange: bottomChange
        };
    },

    /**
     * Add more items to the beginning of virtual window.
     *
     * @returns {{topChange: number, bottomChange: number}}
     * @private
     */
    _addItemsToWindowStart: function () {
        var
            bottomChange = 0,
            topChange = 0;

        // Add items to the beginning of the list
        if (this._virtualWindow.start < this._options.pageSize) {
            // Not enough items for a page => remove remaining items
            topChange += this._virtualWindow.start;
            this._virtualWindow.start = 0;
        } else {
            // Remove the first page
            topChange += this._options.pageSize;
            this._virtualWindow.start -= this._options.pageSize;
        }

        // Remove items from the end of the list
        if (this._virtualWindow.end - this._virtualWindow.start - topChange >= this._options.maxItems) {
            this._virtualWindow.end -= topChange;
            bottomChange -= topChange;
        }
        return {
            topChange: topChange,
            bottomChange: bottomChange
        };

    },

    /**
     * Recalculates virtual page after item was removed from the dataset.
     * TODO: resize window if becomes too small
     *
     * @param idx - index of removed item
     */
    onItemRemoved: function (idx) {
        this._projectionLength -= 1;

        if (idx < this._virtualWindow.start) {
            // Item was removed before the beginning of virtual window =>
            // shift window bounds to the left
            this._virtualWindow.start -= 1;
            this._virtualWindow.end -= 1;
        } else if (idx <= this._virtualWindow.end) {
            // Item was added inside virtual window =>
            // decrease window size by 1
            this._virtualWindow.end -= 1;
        }
    },

    /**
     * Recalculates virtual page after item was added to the dataset.
     * TODO: resize window if becomes too large
     *
     * @param idx - index of added item
     */
    onItemAdded: function (idx) {
        this._projectionLength += 1;

        if (idx <= this._virtualWindow.start) {
            // Item was added before the beginning of virtual window =>
            // shift window bounds to the right
            this._virtualWindow.start += 1;
            this._virtualWindow.end += 1;
        } else if (idx <= this._virtualWindow.end) {
            // Item was added inside virtual window =>
            // increase window size by 1
            this._virtualWindow.end += 1;
        }
    },

    /**
     * Return virtual window bounds.
     *
     * @returns {{start: number, end: number}}
     */
    getVirtualWindow: function () {
        return {
            'start': this._virtualWindow.start,
            'end': this._virtualWindow.end
        };
    }
});

export = VirtualScroll;
