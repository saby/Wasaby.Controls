/**
 * Библиотека контролов, которые реализуют панель фильтрации и её содержимое.
 * @library Controls/filterPopup
 * @includes Panel Controls/_filterPopup/Panel
 * @includes DetailPanel Controls/_filterPopup/DetailPanel
 * @includes SimplePanel Controls/_filterPopup/SimplePanel
 * @includes SimplePanelEmptyItemTemplate Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate
 * @includes SimplePanelHierarchyItemTemplate Controls/_filterPopup/SimplePanel/_HierarchyList/hierarchyItemTemplate
 * @includes Link Controls/_filterPopup/Panel/Link
 * @includes Select Controls/_filterPopup/Panel/Select
 * @includes Dropdown Controls/_filterPopup/Panel/Dropdown
 * @includes Text Controls/_filterPopup/Panel/Text
 * @includes Lookup Controls/_filterPopup/Panel/Lookup
 * @includes HierarchyLookup Controls/_filterPopup/Panel/HierarchyLookup
 * @public
 * @author Крайнов Д.О.
 */

/*
 * filterPopup library
 * @library Controls/filterPopup
 * @includes Panel Controls/_filterPopup/Panel
 * @includes DetailPanel Controls/_filterPopup/DetailPanel
 * @includes SimplePanel Controls/_filterPopup/SimplePanel
 * @includes SimplePanelEmptyItemTemplate Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate
 * @includes Link Controls/_filterPopup/Panel/Link
 * @includes Select Controls/_filterPopup/Panel/Select
 * @includes Dropdown Controls/_filterPopup/Panel/Dropdown
 * @includes Text Controls/_filterPopup/Panel/Text
 * @includes Lookup Controls/_filterPopup/Panel/Lookup
 * @includes HierarchyLookup Controls/_filterPopup/Panel/HierarchyLookup
 * @public
 * @author Крайнов Д.О.
 */

import Panel = require('Controls/_filterPopup/Panel');
import DetailPanel = require('Controls/_filterPopup/DetailPanel');
import SimplePanel = require('Controls/_filterPopup/SimplePanel');
import SimplePanelItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/itemTemplate');
import SimplePanelEmptyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate');
import SimplePanelHierarchyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/hierarchyItemTemplate');
import Link = require('Controls/_filterPopup/Panel/Link');
import Select = require('Controls/_filterPopup/Panel/Select');
import Dropdown = require('Controls/_filterPopup/Panel/Dropdown');
import Text = require('Controls/_filterPopup/Panel/Text');
import Lookup = require('Controls/_filterPopup/Panel/Lookup');
import _List = require('Controls/_filterPopup/SimplePanel/_List');
import _HierarchyList = require('Controls/_filterPopup/SimplePanel/_HierarchyList');

import _FilterPanelWrapper = require('Controls/_filterPopup/Panel/Wrapper/_FilterPanelWrapper');

export {default as HierarchyLookup} from 'Controls/_filterPopup/Panel/HierarchyLookup';
export {default as _EditDialog} from 'Controls/_filterPopup/History/_EditDialog';

export {
   Panel,
   DetailPanel,
   SimplePanel,
   SimplePanelItemTemplate,
   SimplePanelEmptyItemTemplate,
   SimplePanelHierarchyItemTemplate,
   Link,
   Select,
   Dropdown,
   Text,
   Lookup,
   _List,
   _HierarchyList,

   _FilterPanelWrapper
}
