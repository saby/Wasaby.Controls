import merge = require('Core/core-merge');

var showSelector = function (self, config, multiSelect) {
    var
        selectorOpener = self._children.selectorOpener,
        selectorTemplate = self._options.selectorTemplate,
        defaultConfig = {
            opener: self,
            isCompoundTemplate: self._options.isCompoundTemplate
        };

    if (config && config.template || selectorTemplate) {
        defaultConfig.templateOptions = merge({
            selectedItems: self._getItems(),
            multiSelect: multiSelect,
            handlers: {
                onSelectComplete: function (event, result) {
                    self._selectCallback(null, result);
                    selectorOpener.close();
                }
            }
        }, selectorTemplate.templateOptions || {});

        selectorOpener.open(merge(defaultConfig, config || {}));
    }
};

export = showSelector;
