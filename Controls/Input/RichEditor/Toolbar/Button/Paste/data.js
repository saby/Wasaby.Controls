define('Controls/Input/RichEditor/Toolbar/Button/Paste/data', [], function() {
   return [{
      id: 'pasteWithStyles',
      icon: 'icon-PasteStyle icon-medium',
      withStyles: true,
      title: rk('С сохранением стилей')
   }, {
      id: 'pasteWithoutStyles',
      icon: 'icon-PasteAsText icon-medium',
      withStyles: false,
      title: rk('Без форматирования')
   }];
});
