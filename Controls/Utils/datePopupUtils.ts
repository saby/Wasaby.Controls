export default {
    getCommonOptions: function (self) {
        return {
            opener: self,
            direction: {horizontal: 'right'},
            targetPoint: { horizontal: 'left' },
            fittingMode: 'overflow',
            eventHandlers: {
                onResult: self._onResult.bind(self)
            }
        };
    },

    getTemplateOptions: function(self) {
        return {
            startValue: self._options.startValue || self._options.value,
            endValue: self._options.endValue || self._options.value,
            mask: self._options.mask,
            readOnly: self._options.readOnly,
            dateConstructor: self._options.dateConstructor
        };
    }
};
