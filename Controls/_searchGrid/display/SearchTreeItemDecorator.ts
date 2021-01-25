import { TreeItemDecorator } from 'Controls/display';
import { Model } from 'Types/entity';

export default class SearchTreeItemDecorator<S extends Model> extends TreeItemDecorator<S> {
   shouldDisplayExpanderBlock(): boolean {
      return false;
   }

   getDefaultTemplate(): any {
      return this._$source && this._$source.getDefaultTemplate.apply(this, arguments);
   }

   getItemClasses(): any {
      return this._$source && this._$source.getItemClasses.apply(this, arguments);
   }

   isLastItem(): any {
      return this._$source && this._$source.isLastItem.apply(this, arguments);
   }

   isFullGridSupport(): any {
      return this._$source && this._$source.isFullGridSupport.apply(this, arguments);
   }

   getColumns(): any {
      return this._$source && this._$source.getColumns.apply(this, arguments);
   }

   getColumnsConfig(): any {
      return this._$source && this._$source.getColumnsConfig.apply(this, arguments);
   }

   getHeaderConfig(): any {
      return this._$source && this._$source.getHeaderConfig.apply(this, arguments);
   }

   getColumnsCount(): any {
      return this._$source && this._$source.getColumnsCount.apply(this, arguments);
   }

   getColumnIndex(): any {
      return this._$source && this._$source.getColumnIndex.apply(this, arguments);
   }

   getTopPadding(): any {
      return this._$source && this._$source.getTopPadding.apply(this, arguments);
   }

   getBottomPadding(): any {
      return this._$source && this._$source.getBottomPadding.apply(this, arguments);
   }

   getLeftPadding(): any {
      return this._$source && this._$source.getLeftPadding.apply(this, arguments);
   }

   getRightPadding(): any {
      return this._$source && this._$source.getRightPadding.apply(this, arguments);
   }

   getItemSpacing(): any {
      return this._$source && this._$source.getItemSpacing.apply(this, arguments);
   }

   getHoverBackgroundStyle(): any {
      return this._$source && this._$source.getHoverBackgroundStyle.apply(this, arguments);
   }

   getEditingBackgroundStyle(): any {
      return this._$source && this._$source.getEditingBackgroundStyle.apply(this, arguments);
   }

   hasHeader(): any {
      return this._$source && this._$source.hasHeader.apply(this, arguments);
   }

   getResultsPosition(): any {
      return this._$source && this._$source.getResultsPosition.apply(this, arguments);
   }

   getStickyLadderProperties(): any {
      return this._$source && this._$source.getStickyLadderProperties.apply(this, arguments);
   }

   getMultiSelectClasses(): any {
      return this._$source && this._$source.getMultiSelectClasses.apply(this, arguments);
   }

   shouldDrawLadderContent(): any {
      return this._$source && this._$source.shouldDrawLadderContent.apply(this, arguments);
   }

   getLadderWrapperClasses(): any {
      return this._$source && this._$source.getLadderWrapperClasses.apply(this, arguments);
   }

   setColumns(): any {
      return this._$source && this._$source.setColumns.apply(this, arguments);
   }

   setColspanCallback(): any {
      return this._$source && this._$source.setColspanCallback.apply(this, arguments);
   }

   updateLadder(): any {
      return this._$source && this._$source.updateLadder.apply(this, arguments);
   }

   getLadder(): any {
      return this._$source && this._$source.getLadder.apply(this, arguments);
   }

   getStickyLadder(): any {
      return this._$source && this._$source.getStickyLadder.apply(this, arguments);
   }

   editArrowIsVisible(): any {
      return this._$source && this._$source.editArrowIsVisible.apply(this, arguments);
   }

   getStickyHeaderMode(): any {
      return this._$source && this._$source.getStickyHeaderMode.apply(this, arguments);
   }

   getStickyHeaderPosition(): any {
      return this._$source && this._$source.getStickyHeaderPosition.apply(this, arguments);
   }

   hasMultiSelectColumn(): any {
      return this._$source && this._$source.hasMultiSelectColumn.apply(this, arguments);
   }

   getIndex(): any {
      return this._$source && this._$source.getIndex.apply(this, arguments);
   }

   hasColumnScroll(): any {
      return this._$source && this._$source.hasColumnScroll.apply(this, arguments);
   }

   getStickyColumnsCount(): any {
      return this._$source && this._$source.getStickyColumnsCount.apply(this, arguments);
   }

   hasItemActionsSeparatedCell(): any {
      return this._$source && this._$source.hasItemActionsSeparatedCell.apply(this, arguments);
   }

   getColumnSeparatorSize(): any {
      return this._$source && this._$source.getColumnSeparatorSize.apply(this, arguments);
   }

   setColumnSeparatorSize(): any {
      return this._$source && this._$source.setColumnSeparatorSize.apply(this, arguments);
   }
}
