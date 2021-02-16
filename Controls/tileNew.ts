/**
 * Библиотека контролов, которые реализуют список, отображающийся в виде плитки.
 * @library Controls/tileNew
 * @includes ItemTemplate Controls/_tileNew/interface/ItemTemplate
 * @includes ITile Controls/_tileNew/interface/ITile
 * @includes SmallItemTemplate Controls/_tileNew/interface/ISmallTemplate
 * @includes PreviewTemplate Controls/_tileNew/interface/IPreviewTemplate
 * @includes RichTemplate Controls/_tileNew/interface/IRichTemplate
 * @public
 * @author Панихин К.А.
 */

import {register} from 'Types/di';

import {default as View} from 'Controls/_tileNew/View';
import ItemTemplate = require('wml!Controls/_tileNew/render/TileTpl');
import TileItemTemplate = require("wml!Controls/_tileNew/render/TileTpl");
import * as SmallItemTemplate from 'wml!Controls/_tileNew/render/SmallTemplate';
import * as MediumTemplate from 'wml!Controls/_tileNew/render/MediumTemplate';
import * as PreviewTemplate from 'wml!Controls/_tileNew/render/PreviewTemplate';
import * as RichTemplate from 'wml!Controls/_tileNew/render/RichTemplate';
import {default as ActionsMenu} from 'Controls/_tileNew/itemActions/Menu';

import TileCollection from 'Controls/_tileNew/display/TileCollection';
import TileCollectionItem from 'Controls/_tileNew/display/TileCollectionItem';

export {
    View,
    ItemTemplate,
    TileItemTemplate,
    SmallItemTemplate,
    MediumTemplate,
    PreviewTemplate,
    RichTemplate,
    ActionsMenu,
    TileCollection,
    TileCollectionItem
};

register('Controls/tileNew:TileCollection', TileCollection, {instantiate: false});
register('Controls/tileNew:TileCollectionItem', TileCollectionItem, {instantiate: false});
