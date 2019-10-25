import editingTemplate = require('wml!Controls/_listRender/Render/resources/EditingTemplate');
import itemTemplateWrapper = require('wml!Controls/_listRender/Render/resources/ItemTemplateWrapper');
import itemActionsTemplate = require('wml!Controls/_listRender/Render/resources/ItemActionsTemplate');
import swipeTemplate = require('wml!Controls/_listRender/Render/resources/SwipeTemplate');

export { default as Render, IRenderOptions, IRenderChildren } from 'Controls/_listRender/Render';
export { default as Tile } from 'Controls/_listRender/Tile';
export { default as Container } from 'Controls/_listRender/Container';
export {
    editingTemplate,
    itemTemplateWrapper,
    itemActionsTemplate,
    swipeTemplate
};

import TileContainer = require('wml!Controls/_listRender/TileContainer');
export { TileContainer };

// Если используется новый рендер, то используется новая модель. Грузим ее
// здесь, чтобы не заморачиваться с асинхронной подгрузкой в BaseControl
import 'Controls/display';
