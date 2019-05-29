import merge = require('Core/core-merge');

var showSelector = function (self, popupOptions, multiSelect) {
    var
        selectorOpener = self._children.selectorOpener,
        selectorTemplate = self._options.selectorTemplate,
        defaultPopupOptions = merge({
            opener: self,
            isCompoundTemplate: self._options.isCompoundTemplate
        }, selectorTemplate.popupOptions || {});

    if (popupOptions && popupOptions.template || selectorTemplate) {
        defaultPopupOptions.templateOptions = merge({
            selectedItems: self._getItems(),
            multiSelect: multiSelect,
            handlers: {
                onSelectComplete: function (event, result) {
                    self._selectCallback(null, result);
                    selectorOpener.close();
                }
            }
        }, selectorTemplate.templateOptions || {});

        selectorOpener.open(merge(defaultPopupOptions, popupOptions || {}));
    }
};

export = showSelector;
