/**
 * Библиотека контролов, которые служат для организации преобразования данных для нескольких элементов списка.
 * @library Controls/operations
 * @includes Panel Controls/_operations/Panel
 * @includes Button Controls/_operations/Button
 * @includes Controller Controls/_operations/Controller
 * @includes Container Controls/_operations/Container
 * @public
 * @author Крайнов Д.О.
 */

/*
 * operations library
 * @library Controls/operations
 * @includes Panel Controls/_operations/Panel
 * @includes Button Controls/_operations/Button
 * @includes Controller Controls/_operations/Controller
 * @includes Container Controls/_operations/Container
 * @public
 * @author Крайнов Д.О.
 */

import Panel = require('Controls/_operations/Panel');
import Controller = require('Controls/_operations/Controller');
import Container = require('Controls/_operations/Container');
import selectionToRecord = require('Controls/_operations/MultiSelector/selectionToRecord');
import {default as Button} from './_operations/Button';
import MultiSelector from 'Controls/_operations/__MultiSelector';

export {default as HierarchySelection} from 'Controls/_operations/MultiSelector/HierarchySelection';
export {default as Selection} from 'Controls/_operations/MultiSelector/Selection';

export {
   Panel,
   Button,
   Controller,
   Container,
   selectionToRecord,
   MultiSelector as SimpleMultiSelector
};
