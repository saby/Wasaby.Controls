/**
 * Библиотека, которая предоставляет функционал для множественного выбора
 * @library Controls/multiselection
 * @includes Controller Controls/_multiselection/Controller
 * @includes FlatSelectionStrategy Controls/_multiselection/SelectionStrategy/Flat
 * @includes TreeSelectionStrategy Controls/_multiselection/SelectionStrategy/Tree
 * @includes ISelectionItem Controls/multiselection/ISelectionItem
 * @includes ISelectionModel Controls/multiselection/ISelectionModel
 * @includes ISelectionControllerOptions Controls/multiselection/ISelectionControllerOptions
 * @includes IFlatSelectionStrategyOptions Controls/multiselection/IFlatSelectionStrategyOptions
 * @includes ITreeSelectionStrategyOptions Controls/multiselection/ITreeSelectionStrategyOptions
 * @includes IKeysDifference Controls/multiselection/IKeysDifference
 * @includes ISelectionDifference Controls/multiselection/ISelectionDifference
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
