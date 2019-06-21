import merge = require('Core/core-merge');

export = function (self, popupOptions, multiSelect) {
    let
        indicatorId,
        selectorOpener = self._children.selectorOpener,
        selectorTemplate = self._options.selectorTemplate,
        defaultPopupOptions = merge({
            opener: self,
            isCompoundTemplate: self._options.isCompoundTemplate
        }, selectorTemplate && selectorTemplate.popupOptions || {});

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

        indicatorId = self._notify('showIndicator', [], {bubbling: true});

        return selectorOpener.open(merge(defaultPopupOptions, popupOptions || {})).then(function() {
            self._notify('hideIndicator', [indicatorId], {bubbling: true});
        });
    }
};
