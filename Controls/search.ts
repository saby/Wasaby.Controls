/**
 * Библиотека контролов, которые служат для организации поиска в списках.
 * @remark
 * Подробнее читайте <a href="/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/">здесь</a>.
 * @library Controls/search
 * @includes InputContainer Controls/_search/Input/Container
 * @includes Misspell Controls/_search/Misspell
 * @includes MisspellContainer Controls/_search/Misspell/Container
 * @includes Controller Controls/_search/Controller
 * @includes Input Controls/_search/Input/Search
 * @public
 * @author Крайнов Д.О.
 */

/*
 * Search library
 * @library Controls/search
 * @includes InputContainer Controls/_search/Input/Container
 * @includes Misspell Controls/_search/Misspell
 * @includes MisspellContainer Controls/_search/Misspell/Container
 * @includes Controller Controls/_search/Controller
 * @includes Input Controls/_search/Input/Search
 * @public
 * @author Крайнов Д.О.
 */

import 'i18n!Controls/search';
import {default as Misspell} from 'Controls/_search/Misspell';
import {default as FilterController} from 'Controls/_search/FilterController';
import InputContainer = require('Controls/_search/Input/Container');
import MisspellContainer = require('Controls/_search/Misspell/Container');
import Controller = require('Controls/_search/Controller');
import Input = require('Controls/_search/Input/Search');

import getSwitcherStrFromData = require('Controls/_search/Misspell/getSwitcherStrFromData');

export {default as _Search} from './_search/_Search';
export {default as _SearchController} from './_search/_SearchController';

export {
   InputContainer,
   Misspell,
   MisspellContainer,
   Controller,
   Input,
   FilterController,

   getSwitcherStrFromData
};
