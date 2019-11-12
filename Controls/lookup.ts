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
 * @includes ButtonItemTemplate wml!Controls/_lookup/Button/itemTemplate
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

/**
 * Шаблон, который по умолчанию используется для отображения выбранных значений в контроле {@link Controls/lookup:Input}.
 * 
 * @class Controls/lookup:ItemTemplate
 * @remark
 * Шаблон поддерживает следующие параметры:
 * <ul>
 *    <li>contentTemplate {Function|String} — шаблон для отображения выбранной записи.</li>
 *    <li>crossTemplate {Function|String} — шаблон крестика удаления элемента.</li>
 *    <li>displayProperty {String} —  название поля, значение которого отображается при выборе элемента.</li>
 *    <li>clickable {Boolean} — позволяет установить кликабельность выбранного значения (допустим только в случае использования contentTemplate по умолчанию).</li>
 *    <li>size {Enum} — размер записей (допустим только в случае использования contentTemplate по умолчанию):</li>
 *    <ul>
 *       <li>m</li>
 *       <li>l</li>
 *       <li>xl</li>
 *       <li>2xl</li>
 *       <li>3xl</li>
 *    </ul>
 *    <li>style {Enum} — стиль записей (допустим только в случае использования contentTemplate по умолчанию).</li>
 *    <ul>
 *       <li>default</li>
 *       <li>bold</li>
 *       <li>accent</li>
 *       <li>primary</li>
 *    </ul>
 * </ul>
 *
 * Если вы переопределите contentTemplate/crossTemplate, вы не будете уведомлены о событиях itemClick/crossClick.
 * Для правильной работы необходимо пометить свой контент классами:
 * <ul>
 *    <li>js-controls-SelectedCollection__item__caption</li>
 *    <li>js-controls-SelectedCollection__item__cross</li>
 * </ul>
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Selector
 *          source="{{_source}}"
 *          keyProperty="id">
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls.lookup:ButtonItemTemplate"
 *                      style="primary"
 *                      size="xl"
 *                      displayProperty="title"
 *                      clickable="{{true}}"/>
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 * @author Капустин И.А.
 */
