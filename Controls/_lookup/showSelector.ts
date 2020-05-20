import merge = require('Core/core-merge');
import {Stack as StackOpener} from 'Controls/popup';

interface PopupOptions {
    opener: any;
    isCompoundTemplate: boolean;
    templateOptions: any;
}

/**
 * Open selector
 * @param {Controls/_lookup/BaseController} self
 * @param {Object} popupOptions
 * @param {Boolean} multiSelect
 * @returns {Promise}
 */
export default function(self, popupOptions, multiSelect) {
    let
        selectorTemplate = self._options.selectorTemplate,
        defaultPopupOptions: PopupOptions = merge({
            opener: self,
            template: self._options.selectorTemplate.templateName,
            closeOnOutsideClick: true,
            isCompoundTemplate: self._options.isCompoundTemplate,
            eventHandlers: {
                onResult: (result) => {
                    self._selectCallback(null, result);
                },
                onClose: self._closeHandler.bind(self)
            }
        }, selectorTemplate && selectorTemplate.popupOptions || {}),
        popupId;

    if (popupOptions && popupOptions.template || selectorTemplate) {
        defaultPopupOptions.templateOptions = merge({
            selectedItems: self._getItems().clone(),
            multiSelect: multiSelect,
            handlers: {
                onSelectComplete: function (event, result) {
                    StackOpener.closePopup(popupId);
                    if (self._options.isCompoundTemplate) {
                        self._selectCallback(null, result);
                    }
                }
            }
        }, selectorTemplate.templateOptions || {});

        return StackOpener.openPopup(merge(defaultPopupOptions, popupOptions || {})).then((id) => {
            popupId = id;
        });
    }
}
