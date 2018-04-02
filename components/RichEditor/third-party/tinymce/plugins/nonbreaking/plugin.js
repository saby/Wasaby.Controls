(function () {
var nonbreaking = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var stringRepeat = function (string, repeats) {
    var str = '';
    for (var index = 0; index < repeats; index++) {
      str += string;
    }
    return str;
  };
  var isVisualCharsEnabled = function (editor) {
    return editor.plugins.visualchars ? editor.plugins.visualchars.isEnabled() : false;
  };
  var insertNbsp = function (editor, times) {
    var nbsp = isVisualCharsEnabled(editor) ? '<span class="mce-nbsp">&nbsp;</span>' : '&nbsp;';
    editor.insertContent(stringRepeat(nbsp, times));
    editor.dom.setAttrib(editor.dom.select('span.mce-nbsp'), 'data-mce-bogus', '1');
  };
  var $_c3580zgljedwgl9h = { insertNbsp: insertNbsp };

  var register = function (editor) {
    editor.addCommand('mceNonBreaking', function () {
      $_c3580zgljedwgl9h.insertNbsp(editor, 1);
    });
  };
  var $_77vrecgkjedwgl9g = { register: register };

  var VK = tinymce.util.Tools.resolve('tinymce.util.VK');

  var getKeyboardSpaces = function (editor) {
    var spaces = editor.getParam('nonbreaking_force_tab', 0);
    if (typeof spaces === 'boolean') {
      return spaces === true ? 3 : 0;
    } else {
      return spaces;
    }
  };
  var $_57u1d5gojedwgl9l = { getKeyboardSpaces: getKeyboardSpaces };

  var setup = function (editor) {
    var spaces = $_57u1d5gojedwgl9l.getKeyboardSpaces(editor);
    if (spaces > 0) {
      editor.on('keydown', function (e) {
        if (e.keyCode === VK.TAB && !e.isDefaultPrevented()) {
          if (e.shiftKey) {
            return;
          }
          e.preventDefault();
          e.stopImmediatePropagation();
          $_c3580zgljedwgl9h.insertNbsp(editor, spaces);
        }
      });
    }
  };
  var $_gdambogmjedwgl9j = { setup: setup };

  var register$1 = function (editor) {
    editor.addButton('nonbreaking', {
      title: 'Nonbreaking space',
      cmd: 'mceNonBreaking'
    });
    editor.addMenuItem('nonbreaking', {
      text: 'Nonbreaking space',
      cmd: 'mceNonBreaking',
      context: 'insert'
    });
  };
  var $_8qgh7qgpjedwgl9m = { register: register$1 };

  PluginManager.add('nonbreaking', function (editor) {
    $_77vrecgkjedwgl9g.register(editor);
    $_8qgh7qgpjedwgl9m.register(editor);
    $_gdambogmjedwgl9j.setup(editor);
  });
  function Plugin () {
  }

  return Plugin;

}());
})();
