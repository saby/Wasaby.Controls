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
import * as ItemTemplate from 'wml!Controls/_tileNew/render/items/Default';
import * as ContentTemplate from 'wml!Controls/_tileNew/render/Content';
import * as SmallItemTemplate from 'wml!Controls/_tileNew/render/items/Small';
import * as MediumItemTemplate from 'wml!Controls/_tileNew/render/items/Medium';
import * as PreviewItemTemplate from 'wml!Controls/_tileNew/render/items/Preview';
import * as RichItemTemplate from 'wml!Controls/_tileNew/render/items/Rich';
import {default as ActionsMenu} from 'Controls/_tileNew/itemActions/Menu';

import TileCollection from 'Controls/_tileNew/display/TileCollection';
import TileCollectionItem from 'Controls/_tileNew/display/TileCollectionItem';

export {
    View,
    ItemTemplate,
    ContentTemplate,
    SmallItemTemplate,
    MediumItemTemplate,
    PreviewItemTemplate,
    RichItemTemplate,
    ActionsMenu,
    TileCollection,
    TileCollectionItem
};

register('Controls/tileNew:TileCollection', TileCollection, {instantiate: false});
register('Controls/tileNew:TileCollectionItem', TileCollectionItem, {instantiate: false});
