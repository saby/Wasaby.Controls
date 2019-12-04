/**
 * @author Авраменко А.С.
 * @mixin Controls/_list/ItemActions/ItemActionsStyles
 * @private
 *
 * @css @height_ItemActions_inside Height of the item actions when they're positioned inside a row.
 * @css @height_ItemActions_outside Height of the item actions when they're positioned outside a row.
 * @css @min-height_ItemActions-action-title Min-height of a title of an action.
 * @css @spacing_ItemActions_inside Spacing around the item actions when they're positioned inside a row.
 * @css @spacing_ItemActions-between-content-border-top_position_inside Spacing between item actions and top border when they're positioned inside a row.
 * @css @spacing_ItemActions-between-content-border-right_position_inside Spacing between item actions and right border when they're positioned inside a row.
 * @css @spacing_ItemActions-between-content-border-bottom_position_inside Spacing between item actions and bottom border when they're positioned inside a row.
 * @css @spacing_ItemActions-between-content-border-left_position_inside Spacing between item actions and left border when they're positioned inside a row.
 * @css @spacing_ItemActions-between-content-border-top_position_outside Spacing between item actions and top border when they're positioned outside a row.
 * @css @spacing_ItemActions-between-content-border-right_position_outside Spacing between item actions and right border when they're positioned outside a row.
 * @css @spacing_ItemActions-between-content-border-bottom_position_outside Spacing between item actions and bottom border when they're positioned outside a row.
 * @css @spacing_ItemActions-between-content-border-left_position_outside Spacing between item actions and left border when they're positioned outside a row.
 * @css @spacing_ItemActions_outside Spacing around the item actions when they're positioned outside a row.
 * @css @spacing_ItemActions-between-actions Spacing between actions.
 * @css @background-color_ItemActions Background color of the item actions when they're positioned inside a row.
 * @css @background-color_ItemActions_outside Background color of the item actions when they're positioned outside a row.
 * @css @background-color_ItemActions_style_master Background color of the item actions when the "style" option is set to "master".
 * @css @background-color_ItemActions_editing Background color of the item actions during editing.
 * @css @width_ItemActions-decorativeEdge Width of the decorative edge near item actions when they're are positioned outside a row.
 * @css @font-size_ItemActions-icon_size_m Font size of the icons of the item actions.
 * @css @font-size_ItemActions-icon_size_s Font size of the icons of the item actions inside editable lists.
 * @css @font-family_ItemActions-icon_size_s Font family of the icons of the item actions.
 * @css @font-family_ItemActions-icon_size_m Font family of the icons of the item actions inside editable lists.
 * @css @color_ItemActions-icon_style_danger Color of the icon with the "iconStyle" option set to "danger".
 * @css @color_ItemActions-icon_style_danger_hover Color of the icon with the "iconStyle" option set to "danger" on hover.
 * @css @color_ItemActions-icon_style_success Color of the icon with the "iconStyle" option set to "success".
 * @css @color_ItemActions-icon_style_success_hover Color of the icon with the "iconStyle" option set to "success" on hover.
 * @css @color_ItemActions-icon_style_secondary Color of the icon with the "iconStyle" option set to "secondary".
 * @css @color_ItemActions-icon_style_secondary_hover Color of the icon with the "iconStyle" option set to "secondary" on hover.
 * @css @color_ItemActions-icon_style_warning Color of the icon with the "iconStyle" option set to "warning".
 * @css @color_ItemActions-icon_style_warning_hover Color of the icon with the "iconStyle" option set to "warning" on hover.
 * @css @color_ItemActions-title Color of the title.
 * @css @color_ItemActions-title_hover Color of the title on hover.
 * @css @font-size_ItemActions-title Font size of the title.
 * @css @border-color_ItemActions-action_style_danger Border color of action with the "iconStyle" option set to "danger".
 * @css @border-color_ItemActions-action_style_success Border color of action with the "iconStyle" option set to "success".
 *
 * @css @icon-size_ItemActions-editAtPlace-applyButton Icon size of apply button icon in edit at place mode.
 * @css @icon-size_ItemActions-editAtPlace-applyButton_hovered Icon size of hovered apply button icon in edit at place mode.
 * @css @icon-size_ItemActions-editAtPlace-applyButton_active Icon size of active apply button icon in edit at place mode.
 * @css @width_ItemActions-editAtPlace-applyButton Width of apply button in edit at place mode.
 * @css @height_ItemActions-editAtPlace-applyButton  Height of apply button in edit at place mode.
 * @css @width_ItemActions-editAtPlace-applyButton_hovered  Width of hovered apply button in edit at place mode.
 * @css @height_ItemActions-editAtPlace-applyButton_hovered  Height of hovered apply button in edit at place mode.
 * @css @width_ItemActions-editAtPlace-applyButton_active Width of active apply button in edit at place mode.
 * @css @height_ItemActions-editAtPlace-applyButton_active Height of active apply button in edit at place mode.
 * @css @color_ItemActions-editAtPlace-applyButton-icon Color of apply button icon in edit at place mode.
 * @css @color_ItemActions-editAtPlace-applyButton-icon_hovered Color of hovered apply button icon in edit at place mode.
 * @css @color_ItemActions-editAtPlace-applyButton-icon_active Color of hovered apply button icon in edit at place mode.
 * @css @text-shadow_ItemActions-editAtPlace-applyButton-icon Text shadow of apply button icon in edit at place mode.
 * @css @text-shadow_ItemActions-editAtPlace-applyButton-icon_hovered Text shadow of hovered apply button icon in edit at place mode.
 * @css @text-shadow_ItemActions-editAtPlace-applyButton-icon_active Text shadow of active apply button icon in edit at place mode.
 * @css @border-radius_ItemActions-editAtPlace-applyButton Border radius of apply button in edit at place mode.
 * @css @border-width_ItemActions-editAtPlace-applyButton Border width of apply button in edit at place mode.
 * @css @box-shadow_ItemActions-editAtPlace-applyButton Box shadow of apply button in edit at place mode.
 * @css @box-shadow_ItemActions-editAtPlace-applyButton_hovered Box shadow of hovered apply button in edit at place mode.
 * @css @box-shadow_ItemActions-editAtPlace-applyButton_active Box shadow of active apply button in edit at place mode.
 * @css @background-color_ItemActions-editAtPlace-applyButton Background color of apply button icon in edit at place mode.
 * @css @background-color_ItemActions-editAtPlace-applyButton_hovered Background apply of hovered close button icon in edit at place mode.
 * @css @background-color_ItemActions-editAtPlace-applyButton_active Background apply of active close button icon in edit at place mode.
 *
 * @css @width_ItemActions-editAtPlace-closeButton Width of close button in edit at place mode.
 * @css @height_ItemActions-editAtPlace-closeButton Height of close button in edit at place mode.
 * @css @width_ItemActions-editAtPlace-closeButton_hovered Width of hovered close button in edit at place mode.
 * @css @height_ItemActions-editAtPlace-closeButton_hovered Height of hovered close button in edit at place mode.
 * @css @width_ItemActions-editAtPlace-closeButton_active Width of active close button in edit at place mode.
 * @css @height_ItemActions-editAtPlace-closeButton_active Height of active close button in edit at place mode.
 * @css @width_ItemActions-editAtPlace-closeButton-icon Width of close button in edit at place mode.
 * @css @height_ItemActions-editAtPlace-closeButton-icon Height of close button icon in edit at place mode.
 * @css @width_ItemActions-editAtPlace-closeButton-icon_hovered Width of hovered close button icon in edit at place mode.
 * @css @height_ItemActions-editAtPlace-closeButton-icon_hovered Height of hovered close button icon in edit at place mode.
 * @css @width_ItemActions-editAtPlace-closeButton-icon_active Width of active close button icon in edit at place mode.
 * @css @height_ItemActions-editAtPlace-closeButton-icon_active Height of active close button icon in edit at place mode.
 * @css @border-top-left-radius_ItemActions-editAtPlace-closeButton Top-left border radius of close button in edit at place mode.
 * @css @border-top-right-radius_ItemActions-editAtPlace-closeButton Top-right border radius of close button in edit at place mode.
 * @css @border-bottom-right-radius_ItemActions-editAtPlace-closeButton Bottom-right border radius of close button in edit at place mode.
 * @css @border-bottom-left-radius_ItemActions-editAtPlace-closeButton Bottom-left border radius of close button in edit at place mode.
 * @css @border-color_ItemActions-editAtPlace-closeButton Border color of close button in edit at place mode.
 * @css @border-color_ItemActions-editAtPlace-closeButton_hovered Border color of hovered close button in edit at place mode.
 * @css @border-color_ItemActions-editAtPlace-closeButton_active Border color of active close button in edit at place mode.
 * @css @border-top-width_ItemActions-editAtPlace-closeButton Top border width of close button in edit at place mode.
 * @css @border-right-width_ItemActions-editAtPlace-closeButton Right border width of close button in edit at place mode.
 * @css @border-bottom-width_ItemActions-editAtPlace-closeButton Bottom border width of close button in edit at place mode.
 * @css @border-left-width_ItemActions-editAtPlace-closeButton Left border width of close button in edit at place mode.
 * @css @box-shadow_ItemActions-editAtPlace-closeButton Box shadow of close button in edit at place mode.
 * @css @box-shadow_ItemActions-editAtPlace-closeButton_hovered Box shadow of hovered close button in edit at place mode.
 * @css @box-shadow_ItemActions-editAtPlace-closeButton_active Box shadow of active close button in edit at place mode.
 * @css @background-image_ItemActions-editAtPlace-closeButton-icon Background image of close button icon in edit at place mode.
 * @css @background-image_ItemActions-editAtPlace-closeButton-icon_hovered Background image of hovered close button icon in edit at place mode.
 * @css @background-image_ItemActions-editAtPlace-closeButton-icon_active Background image of active close button icon in edit at place mode.
 *
 */
