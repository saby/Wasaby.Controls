import extend = require('Core/core-extend');

const SERVICE_FILTERS = {
    HIERARCHY: {
        'Разворот': 'С разворотом',
        'usePages': 'full'
    }
};

var FilterUtils = extend({
    constructor: function(options) {
        FilterUtils.superclass.constructor.call(this, options);
    },

    assignServiceFilters: function(self, filter:object, forced):void {
        if (forced || self._options.parentProperty && self._viewMode !== 'search' ) {
            Object.assign(filter, SERVICE_FILTERS.HIERARCHY);
        }
    },

    deleteServiceFilters: function(self, filter:object):void {
        if (self._options.parentProperty) {
            for (var i in SERVICE_FILTERS.HIERARCHY) {
                if (SERVICE_FILTERS.HIERARCHY.hasOwnProperty(i)) {
                    delete filter[i];
                }
            }
        }
    }
})

export default FilterUtils;
