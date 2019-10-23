import forTemplate = require('wml!Controls/_listRender/Render/resources/For');
import editingTemplate = require('wml!Controls/_listRender/Render/resources/EditingTemplate');
import itemTemplateWrapper = require('wml!Controls/_listRender/Render/resources/ItemTemplateWrapper');
import itemActionsTemplate = require('wml!Controls/_listRender/Render/resources/ItemActionsTemplate');
import swipeTemplate = require('wml!Controls/_listRender/Render/resources/SwipeTemplate');

export { default as Render, IRenderOptions, IRenderChildren } from 'Controls/_listRender/Render';
export {
    forTemplate,
    editingTemplate,
    itemTemplateWrapper,
    itemActionsTemplate,
    swipeTemplate
};

// Если используется новый рендер, то используется новая модель. Грузим ее
// здесь, чтобы не заморачиваться с асинхронной подгрузкой в BaseControl
import 'Controls/display';
