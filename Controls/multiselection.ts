/**
 * Библиотека, которая предоставляет функционал для множественного выбора
 * @library Controls/multiselection
 * @includes Controller Controls/_multiselection/Controller
 * @includes FlatSelectionStrategy Controls/_multiselection/SelectionStrategy/Flat
 * @includes TreeSelectionStrategy Controls/_multiselection/SelectionStrategy/Tree
 * @includes ISelectionItem Controls/_multiselection/interface#ISelectionItem
 * @includes ISelectionModel Controls/_multiselection/interface#ISelectionModel
 * @includes ISelectionControllerOptions Controls/_multiselection/interface#ISelectionControllerOptions
 * @includes IFlatSelectionStrategyOptions Controls/_multiselection/interface#IFlatSelectionStrategyOptions
 * @includes ITreeSelectionStrategyOptions Controls/_multiselection/interface#ITreeSelectionStrategyOptions
 * @includes IKeysDifference Controls/_multiselection/interface#IKeysDifference
 * @includes ISelectionDifference Controls/_multiselection/interface#ISelectionDifference
 * @public
 * @author Панихин К.А.
 */

import { Controller as SelectionController } from 'Controls/_multiselection/Controller';
import { FlatSelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/Flat';
import { TreeSelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/Tree';
import { default as ISelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/ISelectionStrategy';
import {
   ISelectionItem,
   ISelectionModel,
   ISelectionControllerOptions,
   IFlatSelectionStrategyOptions,
   ITreeSelectionStrategyOptions,
   ISelectionDifference
} from 'Controls/_multiselection/interface';

export {
   ISelectionItem,
   SelectionController,
   ISelectionControllerOptions,
   ISelectionDifference,
   ISelectionModel,
   ISelectionStrategy,
   FlatSelectionStrategy,
   IFlatSelectionStrategyOptions,
   TreeSelectionStrategy,
   ITreeSelectionStrategyOptions
};
