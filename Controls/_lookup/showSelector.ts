import {Stack as StackOpener, IStackPopupOptions} from 'Controls/popup';

function getPopupOptions(self): IStackPopupOptions {
    const selectorTemplate = self._options.selectorTemplate;

    return {
        opener: self,
        template: selectorTemplate && selectorTemplate.templateName,
        closeOnOutsideClick: true,
        isCompoundTemplate: self._options.isCompoundTemplate,
        eventHandlers: {
            onOpen: () => {
                self._openingSelector = null;
            },
            onResult: (result) => {
                self._selectCallback(null, result);
            },
            onClose: () => {
                self._openingSelector = null;
                self._closeHandler();
            }
        }
    }
}

function getTemplateOptions(self, multiSelect) {
    return {
        selectedItems: self._getItems().clone(),
        multiSelect: multiSelect,
        handlers: {
            onSelectComplete: function (event, result) {
                StackOpener.closePopup(self._popupId);
                if (self._options.isCompoundTemplate) {
                    self._selectCallback(null, result);
                }
            }
        }
    }
}



/**
 * Open selector
 * @param {Controls/_lookup/BaseController} self
 * @param {Object} popupOptions
 * @param {Boolean} multiSelect
 * @returns {Promise}
 */
export default function(self, popupOptions, multiSelect) {
    if (!self._openingSelector) {
        const selectorTemplate = self._options.selectorTemplate;
        const stackPopupOptions = getPopupOptions(self);

        if (selectorTemplate && selectorTemplate.popupOptions) {
            Object.assign(stackPopupOptions, selectorTemplate.popupOptions);
        }

        if (popupOptions && popupOptions.template || selectorTemplate) {
            stackPopupOptions.templateOptions = getTemplateOptions(self, multiSelect);

            if (selectorTemplate && selectorTemplate.templateOptions) {
                Object.assign(stackPopupOptions.templateOptions, selectorTemplate.templateOptions);
            }

            if (popupOptions) {
                Object.assign(stackPopupOptions, popupOptions);
            }

            self._openingSelector = StackOpener.openPopup(stackPopupOptions).then((id) => {
                self._popupId = id;
            });
        }
        return self._openingSelector;
    }
}
