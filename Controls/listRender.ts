import editingTemplate = require('wml!Controls/_listRender/Render/resources/EditingTemplate');
import itemTemplateWrapper = require('wml!Controls/_listRender/Render/resources/ItemTemplateWrapper');
import itemActionsTemplate = require('wml!Controls/_listRender/Render/resources/ItemActionsTemplate');
import swipeTemplate = require('wml!Controls/_listRender/Render/resources/SwipeTemplate');
import TileItemTemplateWrapper = require('wml!Controls/_listRender/Tile/resources/ItemTemplateWrapper');

export { default as Render, IRenderOptions, IRenderChildren } from 'Controls/_listRender/Render';

export { default as Tile } from 'Controls/_listRender/Tile';
export { TileItemTemplateWrapper };

export { default as View } from 'Controls/_listRender/View';
export {
    editingTemplate,
    itemTemplateWrapper,
    itemActionsTemplate,
    swipeTemplate
};

import TileView = require('wml!Controls/_listRender/TileView');
export { TileView };

import ListView = require('wml!Controls/_listRender/ListView');
export { ListView };

// Если используется новый рендер, то используется новая модель. Грузим ее
// здесь, чтобы не заморачиваться с асинхронной подгрузкой в BaseControl
import 'Controls/display';
