/**
 * Библиотека контролов, которые служат для отображения элемента коллекции или выбора элемента из выпадающего окна с возможностью сохранения истории выбора.
 * @library Controls/history
 * @includes Constants Controls/_history/Constants
 * @includes Menu Controls/_history/Menu
 * @includes Service Controls/_history/Service
 * @includes Source Controls/_history/Source
 * @public
 * @author Крайнов Д.О.
 */

/*
 * history library
 * @library Controls/history
 * @includes Constants Controls/_history/Constants
 * @includes FilterSource Controls/_history/FilterSource
 * @includes Menu Controls/_history/Menu
 * @includes Service Controls/_history/Service
 * @includes Source Controls/_history/Source
 * @public
 * @author Крайнов Д.О.
 */

import Constants = require('Controls/_history/Constants');
import FilterSource = require('Controls/_history/FilterSource');
import Menu = require('Controls/_history/Menu');
import Service = require('Controls/_history/Service');
import Source = require('Controls/_history/Source');

import itemTemplate = require('wml!Controls/_history/resources/itemTemplate');

export {
    Constants,
    FilterSource,
    Menu,
    Service,
    Source,

    itemTemplate
};
