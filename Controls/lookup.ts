/**
 * Библиотека контролов, которые служат для отображения одного или нескольких элементов коллекции или выбора элементов из справочника.
 * @library Controls/lookup
 * @includes Selector Controls/_lookup/Button
 * @includes Input Controls/_lookup/Lookup
 * @includes MultipleInput Controls/_lookup/MultipleInput
 * @includes ItemTemplate Controls/lookup:ItemTemplate
 * @includes Link Controls/_lookup/Lookup/Link
 * @includes PlaceholderChooser Controls/_lookup/PlaceholderChooser
 * @includes Collection Controls/_lookup/SelectedCollection
 * @public
 * @author Крайнов Д.О.
 */

/*
 * Lookup library
 * @library Controls/lookup
 * @includes Selector Controls/_lookup/Button
 * @includes Input Controls/_lookup/Lookup
 * @includes MultipleInput Controls/_lookup/MultipleInput
 * @includes ItemTemplate Controls/lookup:ItemTemplate
 * @includes PlaceholderChooser Controls/_lookup/PlaceholderChooser
 * @includes Link Controls/_lookup/Lookup/Link
 * @includes Collection Controls/_lookup/SelectedCollection
 * @public
 * @author Крайнов Д.О.
 */

import Selector = require("Controls/_lookup/Button");
import Input = require("Controls/_lookup/Lookup");
import MultipleInput = require("Controls/_lookup/MultipleInput");
import {default as Collection} from "Controls/_lookup/SelectedCollection";
import _CollectionController = require("Controls/_lookup/BaseController");
import ItemTemplate = require("wml!Controls/_lookup/SelectedCollection/ItemTemplate");
import ButtonItemTemplate = require("wml!Controls/_lookup/Button/itemTemplate");
import Opener = require("Controls/_lookup/Opener");
import PlaceholderChooser = require("Controls/_lookup/PlaceholderChooser");
import Link = require('Controls/_lookup/Lookup/Link');

export {
   Selector,
   Input,
   MultipleInput,
   Collection,
   _CollectionController,
   ItemTemplate,
   Opener,
   ButtonItemTemplate,
   PlaceholderChooser,
   Link
};

