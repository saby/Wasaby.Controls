define('Controls/Button/ButtonStyles',
   [
   ],
   function() {
   }

   /**
    * @author Михайловский Д.С.
    * @mixin Controls/Button/ButtonStyles
    * @public
    *
    * @css @background-color-IconButton_transparent Background color of button with style set to iconButtonBordered.
    * @css @background-color-IconButton Background color of button with style set to iconButtonBorderedAdditional.
    *
    * @css @border-radius-IconButton Border radius of button with style set to iconButtonBordered and iconButtonBorderedAdditional.
    * @css @border-style-IconButton Border style of button with style set to iconButtonBordered and iconButtonBorderedAdditional.
    *
    * @css @border-width-IconButton Border width of button with style set to iconButtonBordered and iconButtonBorderedAdditional.
    * @css @border-color-IconButton Border color of button with style set to iconButtonBordered and iconButtonBorderedAdditional.
    *
    * @css @box-shadow-IconButton Box shadow of button with style set to iconButtonBordered and iconButtonBorderedAdditional.
    * @css @height-IconButton_size-m Height of button with style set to iconButtonBordered and iconButtonBorderedAdditional and size set to m.
    *
    * @css @width-IconButton_size-m Minimum width of button with style set to iconButtonBordered and iconButtonBorderedAdditional and size set to m.
    * @css @height-IconButton_size-l Height of button with style set to iconButtonBordered and iconButtonBorderedAdditional and size set to l.
    *
    * @css @width-IconButton_size-l Minimum width of button with style set to iconButtonBordered and iconButtonBorderedAdditional and size set to l.
    * @css @color-Button_type-IconButton_readOnly Height of button with style set to iconButtonBordered and iconButtonBorderedAdditional and readOnly set to true.
    *
    * @css @border-color-IconButton_readOnly Border color of button with style set to iconButtonBordered and iconButtonBorderedAdditional and readOnly set to true.
    * @css @background-color-IconButton_hovered Background color of button in hover state with style set to iconButtonBordered.
    *
    * @css @background-color-IconButton_transparent_hovered Background color of button in hover state with style set to iconButtonBorderedAdditional.
    * @css @color-Icon_style_done Border color and icon color of button with style set to iconButtonBordered or iconButtonBorderedAdditional and iconStyle set to done.
    *
    * @css @color-Icon_style_error	Border color and icon color of button with style set to iconButtonBordered or iconButtonBorderedAdditional and iconStyle set to error.
    * @css @color-Icon_style_attention	Border color and icon color of button with style set to iconButtonBordered or iconButtonBorderedAdditional and iconStyle set to attention.
    *
    * @css @color-iconButton__border_iconStyle-primary_hovered	Border color of button with style set to iconButtonBordered or iconButtonBorderedAdditional and iconStyle set to default or unset.
    * @css @color-IconButtonBordered_default_hovered Icon color of button in hovered state with style set to iconButtonBordered or iconButtonBorderedAdditional and iconStyle set to default or unset.
    *
    * @css @box-shadow-IconButton_activated Box shadow of button in active with style set to iconButtonBordered and iconButtonBorderedAdditional.
    * @css @font-size_Link-s Font size of button with size set to s.
    *
    * @css @font-size_Link-m Font size of button with size set to m.
    * @css @font-size_Link-l Font size of button with size set to l.
    *
    * @css @font-size_Link-xl Font size of button with size set to xl.
    * @css @color_Link-main-text Color of button with style set to linkMain.
    *
    * @css @color_Link-main2-text Color of button with style set to linkMain2.
    * @css @color_Link-main2-text Color of button with style set to linkMain3.
    *
    * @css @color_Link-main-text_hovered Color of button in hovered state with style set to linkMain.
    * @css @color_Link-main3-text_hovered Color of button in hovered state with style set to linkMain3.
    *
    * @css @color_Link-additional-text	Color of button with style set to linkAdditional.
    * @css @color_Link-additional2-text Color of button with style set to linkAdditional2.
    *
    * @css @color_Link-additional3-text Color of button with style set to linkAdditional3.
    * @css @color_Link-additional4-text Color of button with style set to linkAdditional4.
    *
    * @css @color_Link-additional5-text Color of button with style set to linkAdditional5.
    * @css @color_Link__text_readOnly Color of button with any link (linkMain, linkMain2, linkMain3 linkAdditional, linkAdditional2, linkAdditional3, linkAdditional4, linkAdditional5) style and readOnly set to true.
    *
    * @css @color_Button_readOnly	Color of button with style set to buttonPrimary, buttonDefault, buttonAdd and readOnly set to true.
    * @css @border-color_Button-Vdom-readOnly Border color of button with style set to buttonPrimary, buttonDefault, buttonAdd and readOnly set to true.
    *
    * @css @min-width_Button	Minimal width of button with style set to buttonPrimary, buttonDefault, buttonAdd.
    * @css @box-shadow_Button Box shadow of button with style set to buttonPrimary, buttonDefault, buttonAdd.
    *
    * @css @box-shadow_Button_active Box shadow of button in active state with style set to buttonPrimary, buttonDefault, buttonAdd.
    * @css @color_Button__text_primary	Text color of button with style set to buttonPrimary or buttonAdd.
    *
    * @css @border-color_Button_primary Border color of button with style set to buttonPrimary or buttonAdd.
    * @css @background_Button_primary Background color of button with style set to buttonPrimary or buttonAdd.
    *
    * @css @border-color_Button_primary_hovered Border color of button in hovered state with style set to buttonPrimary or buttonAdd.
    * @css @background_Button_primary_active Background color of button in hovered state with style set to buttonPrimary or buttonAdd.
    *
    * @css @color_Button__text_default	Text color of button with style set to buttonDefault.
    * @css @border-color_Button Border color of button with style set to buttonDefault.
    *
    * @css @background_Button_default Background of button with style set to buttonDefault.
    * @css @border-color_Button_hovered Border color of button in hovered state with style set to buttonDefault.
    *
    * @css @background_Button_default_active Background color of button in hovered state with style set to buttonDefault.
    * @css @height_Button_m Height of button with style set to buttonDefault, buttonPrimary or buttonAdd and size set to m.
    *
    * @css @font-size_Button_size_m Font size of button with style set to buttonDefault, buttonPrimary or buttonAdd and size set to m.
    * @css @border-radius_Button_default Border radius of button with style set to buttonDefault, buttonPrimary or buttonAdd and size set to m.
    *
    * @css @thickness_Button__border Border thickness of button with style set to buttonDefault, buttonPrimary or buttonAdd.
    * @css @font-size_Button_size_l Font size of button with style set to buttonDefault, buttonPrimary or buttonAdd and size set to l.
    *
    * @css @height_Button_l Height of button with style set to buttonDefault, buttonPrimary or buttonAdd and size set to l.
    * @css @border-radius_Button_l	Border radius of button with style set to buttonDefault, buttonPrimary or buttonAdd and size set to l.
    *
    * @css @color_Button-style-addButton-icon Color of icon button with style set to buttonAdd, iconStyle set to default or unset.
    * @css @color_Button-icon Color of icon button with style set to buttonDefault, iconStyle set to default or unset.
    *
    * @css @color_Button-icon_primary Color of icon button with style set to buttonPrimary, iconStyle set to default or unset.
    * @css @color-IconButtonBordered_default_hovered Icon color of button with style set to iconButtonBordered or iconButtonBorderedAdditional and iconStyle set to default or unset.
    *
    * @css @color_Link-main-icon Icon color of button with style set to linkMain.
    * @css @color-Icon_style_info Icon color of button with style set to linkMain and iconStyle set to info.
    *
    * @css @color_Button-style-addButton-icon_hovered Icon color of button in hovered state with style set to buttonAdd.
    * @css @padding_Button-wrapper_default	Padding of button with style set to buttonDefault, buttonPrimary or buttonAdd and size set to m.
    *
    * @css @padding_Button-wrapper_l Padding of button with style set to buttonDefault, buttonPrimary or buttonAdd and size set to l.
    * @css @spacing_Button-between-icon-text Spacing between icon and text in button with seted icon.
    *
    * @css @background_Button_primary_hovered Background color of button in hovered state with style set to buttonPrimary or buttonAdd.
    * @css @background_Button_hovered Background color of button in hovered state with style set to buttonDefault.
    *
    * @css @background_Button_active Background color of button in active state with style set to buttonDefault.
    */
);
