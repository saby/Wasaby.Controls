import formatDate = require('Core/helpers/Date/format');
import isEmpty = require('Core/helpers/Object/isEmpty');
import scrollToElement = require('Controls/Utils/scrollToElement');

export default {
    /**
     * Returns whether the mode of the year can be displayed
     * @returns {Boolean}
     */
    isYearStateEnabled: function (options) {
        var quantum = options.quantum;
        return options.selectionType !== 'single' && (!quantum ||
            (isEmpty(quantum) || 'months' in quantum || 'quarters' in quantum || 'halfyears' in quantum || 'years' in quantum));
    },

    /**
     * Returns whether the month view can be displayed
     * @returns {Boolean}
     */
    isMonthStateEnabled: function (options) {
        var quantum = options.quantum;
        return !quantum || ((isEmpty(quantum) && options.minQuantum === 'day') || 'days' in quantum || 'weeks' in quantum);
    },

    /**
     * Returns whether the month and year mode switch button can be displayed
     * @returns {Boolean}
     */
    isStateButtonDisplayed: function (options) {
        return this.isYearStateEnabled(options) && this.isMonthStateEnabled(options);
    },

    scrollToDate: function(container, selector, date): boolean {
        var containerToScroll = this.getElementByDate(container, selector, date);

        if (containerToScroll) {
            scrollToElement(containerToScroll);
            return true;
        }
        return false;
    },

    getElementByDate: function(container, selector, date) {
        return container.querySelector(selector + '[data-date="' + this.dateToDataString(date) + '"]');
    },

    getAllElementsByDate: function(container, selector, date) {
        return container.querySelectorAll(selector + '[data-date="' + this.dateToDataString(date) + '"]');
    },

    dateToDataString: function(date) {
        return formatDate(date, 'YYYY.M');
    },
    dataStringToDate: function (str) {
        var d = str.split('.');
        return new Date(d[0], d[1]);
    }
};
