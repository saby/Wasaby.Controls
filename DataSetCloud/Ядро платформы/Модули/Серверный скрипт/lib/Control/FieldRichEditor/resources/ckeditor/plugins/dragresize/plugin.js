/**
 * CKEditor plugin: Dragable image resizing
 * - Shows semi-transparent overlay while resizing
 * - Enforces Aspect Ratio (unless holding shift)
 * - Snap to size of other images in editor
 * - Escape while dragging cancels resize
 *
 */
(function() {

  'use strict';

  var PLUGIN_NAME = 'dragresize',
      IMAGE_SNAP_TO_SIZE = 7,
      HANDLE_SPRITE = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozQjlGMTJFNzZFRjkxMUU0QUQ3QUY2OTRDMzFEMENBNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozQjlGMTJFODZFRjkxMUU0QUQ3QUY2OTRDMzFEMENBNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNCOUYxMkU1NkVGOTExRTRBRDdBRjY5NEMzMUQwQ0E0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjNCOUYxMkU2NkVGOTExRTRBRDdBRjY5NEMzMUQwQ0E0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+3jP0TwAAAK9JREFUeNrsmDsSgCAMRInjkTgTvSex50zeKdpoQRM1zADD257PbgKbRFQ1zIwlTI7pBVi9G+ScmxJIKdUV4CKkxoFi7Gl9Km/XS02hbl7l/XkCjkh/jXCXdoMLIAB/QLfQPy5iuRgZUKrp7QVGL4SEZggXQAAEQAAKIQe22JbBflQWYItqHDjkPODhVdyfJ+CINPMAXAABsMHu5gGmi5EBtdvhwQsh5gG4wOQ4BRgADdc2PTGmvqYAAAAASUVORK5CYII=');";;

  /**
   * Initializes the plugin
   */
  CKEDITOR.plugins.add(PLUGIN_NAME, {
    onLoad: function() {
      // CSS is added in a compressed form
      CKEDITOR.addCss([
            'img::selection{color:rgba(0,0,0,0)}',
            '#ckimgrsz{position:absolute;width:0;height:0;cursor:default;z-index:10001}',
            '#ckimgrsz span{display:none;position:absolute;top:0;left:0;width:0;height:0;background-size:100% 100%;opacity:.65}',
            '#ckimgrsz i{position:absolute;display:block;width:16px;height:16px;background:' + HANDLE_SPRITE + ' no-repeat}',
            '#ckimgrsz i.tl{background-position:0 0}',
            '#ckimgrsz i.tl:hover{background-position: 0 -16px}',
            '#ckimgrsz i.tr{background-position: -16px 0}',
            '#ckimgrsz i.tr:hover{background-position: -16px -16px}',
            '#ckimgrsz i.bl{background-position: -32px 0}',
            '#ckimgrsz i.bl:hover{background-position: -32px -16px}',
            '#ckimgrsz i.br{background-position: -48px 0}',
            '#ckimgrsz i.br:hover{background-position: -48px -16px}',
            '#ckimgrsz i.br,#ckimgrsz i.tl{cursor:nwse-resize}',
            '#ckimgrsz i.bl,#ckimgrsz i.tr{cursor:nesw-resize}',
            'body.dragging-br,body.dragging-br *,body.dragging-tl,body.dragging-tl *{cursor:nwse-resize!important}',
            'body.dragging-bl,body.dragging-bl *,body.dragging-tr,body.dragging-tr *{cursor:nesw-resize!important}'
      ].join(''));
    },
    init: function(editor) {
      //onDomReady handler
      editor.on('contentDom', function(evt) {
        init(editor);
      });
    }
  });

  function init(editor) {
    var window = editor.window.$, document = editor.document.$;
    var snapToSize = (typeof IMAGE_SNAP_TO_SIZE === 'undefined') ? null : IMAGE_SNAP_TO_SIZE;

    var resizer = new Resizer(editor, {snapToSize: snapToSize});

    document.addEventListener('mousedown', function(e) {
       if (resizer.isHandle(e.target)) {
          resizer.initDrag(e);
       }
    }, false);

     editor.document.on('drop', function() {
        resizer.hide();
     });

    function selectionChange() {
      var selection = editor.getSelection();
      if (!selection) return;
      // If an element is selected and that element is an IMG
      if (selection.getType() !== CKEDITOR.SELECTION_NONE && selection.getStartElement().is('img')) {
        // And we're not right or middle clicking on the image
        if (!window.event || !window.event.button || window.event.button === 0) {
          resizer.show(selection.getStartElement().$);
        }
      } else {
        resizer.hide();
      }
    }

    editor.on('selectionChange', selectionChange);

    editor.on('getData', function(e) {
      var html = e.data.dataValue || '';
      html = html.replace(/<div id="ckimgrsz"([\s\S]*?)<\/div>/i, '');
      html = html.replace(/\b(ckimgrsz)\b/g, '');
      e.data.dataValue = html;
    });

    editor.on('beforeUndoImage', function() {
      // Remove the handles before undo images are saved
      resizer.hide();
    });

    editor.on('afterUndoImage', function() {
      // Restore the handles after undo images are saved
      selectionChange();
    });

    editor.on('blur', function() {
      // Remove the handles when editor loses focus
      resizer.hide();
    });

    editor.on('beforeModeUnload', function self() {
      editor.removeListener('beforeModeUnload', self);
      resizer.hide();
    });

    // Update the selection when the browser window is resized
    var resizeTimeout;
    editor.window.on('resize', function() {
      // Cancel any resize waiting to happen
      clearTimeout(resizeTimeout);
      // Delay resize to "debounce"
      resizeTimeout = setTimeout(selectionChange, 50);
    });
  }

  function Resizer(editor, cfg) {
    this.editor = editor;
    this.window = editor.window.$;
    this.document = editor.document.$;
    this.cfg = cfg || {};
    this.init();
  }

  Resizer.prototype = {
    init: function() {
      var container = this.container = this.document.createElement('div');
      container.id = 'ckimgrsz';
      this.preview = this.document.createElement('span');
      container.appendChild(this.preview);
      var handles = this.handles = {
        tl: this.createHandle('tl'),
        tr: this.createHandle('tr'),
        bl: this.createHandle('bl'),
        br: this.createHandle('br')
      };
      for (var n in handles) {
        container.appendChild(handles[n]);
      }
    },
    createHandle: function(name) {
      var el = this.document.createElement('i');
      el.classList.add(name);
      return el;
    },
    isHandle: function(el) {
      var handles = this.handles;
      for (var n in handles) {
        if (handles[n] === el) return true;
      }
      return false;
    },
    show: function(el) {
      this.el = el;
      if (this.cfg.snapToSize) {
        this.otherImages = toArray(this.document.getElementsByTagName('img'));
        this.otherImages.splice(this.otherImages.indexOf(el), 1);
      }
      var box = this.box = getBoundingBox(this.window, el);
      positionElement(this.container, box.left, box.top);
      this.document.body.appendChild(this.container);
      this.el.classList.add('ckimgrsz');
      this.showHandles();
    },
    hide: function() {
      // Remove class from all img.ckimgrsz
      var elements = this.document.getElementsByClassName('ckimgrsz');
      for (var i = 0; i < elements.length; ++i) {
        elements[i].classList.remove('ckimgrsz');
      }
      this.hideHandles();
      if (this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    },
    initDrag: function(e) {
      if (e.button !== 0) {
        //right-click or middle-click
        return;
      }
      var resizer = this;
      var drag = new DragEvent(this.window, this.document);
      drag.onStart = function() {
        resizer.showPreview();
        resizer.isDragging = true;
        resizer.editor.getSelection().lock();
      };
      drag.onDrag = function() {
        resizer.calculateSize(this);
        resizer.updatePreview();
        var box = resizer.previewBox;
        resizer.updateHandles(box, box.left, box.top);
      };
      drag.onRelease = function() {
        resizer.isDragging = false;
        resizer.hidePreview();
        resizer.hide();
        resizer.editor.getSelection().unlock();
        // Save an undo snapshot before the image is permanently changed
        resizer.editor.fire('saveSnapshot');
      };
      drag.onComplete = function() {
        resizer.resizeComplete();
        // Save another snapshot after the image is changed
        resizer.editor.fire('saveSnapshot');
      };
      drag.start(e);
    },
    updateHandles: function(box, left, top) {
      left = left || 0;
      top = top || 0;
      var handles = this.handles;
      positionElement(handles.tl, left - 12, top - 12);
      positionElement(handles.tr, box.width + left - 4, top - 12);
      positionElement(handles.bl, left - 12, box.height + top - 4);
      positionElement(handles.br, box.width + left - 4, box.height + top - 4);
    },
    showHandles: function() {
      var handles = this.handles;
      this.updateHandles(this.box);
      for (var n in handles) {
        handles[n].style.display = 'block';
      }
    },
    hideHandles: function() {
      var handles = this.handles;
      for (var n in handles) {
        handles[n].style.display = 'none';
      }
    },
    showPreview: function() {
      this.preview.style.backgroundImage = 'url("' + this.el.src + '")';
      this.calculateSize();
      this.updatePreview();
      this.preview.style.display = 'block';
    },
    updatePreview: function() {
      var box = this.previewBox;
      positionElement(this.preview, box.left, box.top);
      resizeElement(this.preview, box.width, box.height);
    },
    hidePreview: function() {
      var box = getBoundingBox(this.window, this.preview);
      this.result = {width: box.width, height: box.height};
      this.preview.style.display = 'none';
    },
    calculateSize: function(data) {
      var box = this.previewBox = {top: 0, left: 0, width: this.box.width, height: this.box.height};
      if (!data) return;
      var attr = data.target.className;
      if (~attr.indexOf('r')) {
        box.width = Math.max(32, this.box.width + data.delta.x);
      }
      if (~attr.indexOf('b')) {
        box.height = Math.max(32, this.box.height + data.delta.y);
      }
      if (~attr.indexOf('l')) {
        box.width = Math.max(32, this.box.width - data.delta.x);
      }
      if (~attr.indexOf('t')) {
        box.height = Math.max(32, this.box.height - data.delta.y);
      }
      //if dragging corner, enforce aspect ratio (unless shift key is being held)
      if (attr.indexOf('m') < 0 && !data.keys.shift) {
        var ratio = this.box.width / this.box.height;
        if (box.width / box.height > ratio) {
          box.height = Math.round(box.width / ratio);
        } else {
          box.width = Math.round(box.height * ratio);
        }
      }
      var snapToSize = this.cfg.snapToSize;
      if (snapToSize) {
        var others = this.otherImages;
        for (var i = 0; i < others.length; i++) {
          var other = getBoundingBox(this.window, others[i]);
          if (Math.abs(box.width - other.width) <= snapToSize && Math.abs(box.height - other.height) <= snapToSize) {
            box.width = other.width;
            box.height = other.height;
            break;
          }
        }
      }
      //recalculate left or top position
      if (~attr.indexOf('l')) {
        box.left = this.box.width - box.width;
      }
      if (~attr.indexOf('t')) {
        box.top = this.box.height - box.height;
      }
    },
    resizeComplete: function() {
      resizeElement(this.el, this.result.width, this.result.height);
      this.editor.execCommand('autogrow');
    }
  };

  function DragEvent(window, document) {
    this.window = window;
    this.document = document;
    this.events = {
      mousemove: bind(this.mousemove, this),
      keydown: bind(this.keydown, this),
      mouseup: bind(this.mouseup, this)
    };
  }

  DragEvent.prototype = {
    start: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.target = e.target;
      this.attr = e.target.className;
      this.startPos = {x: e.clientX, y: e.clientY};
      this.update(e);
      var events = this.events;
      this.document.addEventListener('mousemove', events.mousemove, false);
      this.document.addEventListener('keydown', events.keydown, false);
      this.document.addEventListener('mouseup', events.mouseup, false);
      this.document.body.classList.add('dragging-' + this.attr);
      this.onStart && this.onStart();
    },
    update: function(e) {
      this.currentPos = {x: e.clientX, y: e.clientY};
      this.delta = {x: e.clientX - this.startPos.x, y: e.clientY - this.startPos.y};
      this.keys = {shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey};
    },
    mousemove: function(e) {
      this.update(e);
      this.onDrag && this.onDrag();
      if (e.which === 0) {
        //mouse button released outside window; mouseup wasn't fired (Chrome)
        this.mouseup(e);
      }
    },
    keydown: function(e) {
      //escape key cancels dragging
      if (e.keyCode === 27) {
        this.release();
      }
    },
    mouseup: function(e) {
      this.update(e);
      this.release();
      this.onComplete && this.onComplete();
    },
    release: function() {
      this.document.body.classList.remove('dragging-' + this.attr);
      var events = this.events;
      this.document.removeEventListener('mousemove', events.mousemove, false);
      this.document.removeEventListener('keydown', events.keydown, false);
      this.document.removeEventListener('mouseup', events.mouseup, false);
      this.onRelease && this.onRelease();
    }
  };

  //helper functions
  function toArray(obj) {
    var len = obj.length, arr = new Array(len);
    for (var i = 0; i < len; i++) {
      arr[i] = obj[i];
    }
    return arr;
  }

  function bind(fn, ctx) {
    if (fn.bind) {
      return fn.bind(ctx);
    }
    return function() {
      fn.apply(ctx, arguments);
    };
  }

  function positionElement(el, left, top) {
    el.style.left = String(left) + 'px';
    el.style.top = String(top) + 'px';
  }

  function resizeElement(el, width, height) {
    el.style.width = String(width) + 'px';
    el.style.height = String(height) + 'px';
  }

  function getBoundingBox(window, el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width,
      height: rect.height
    };
  }
})();
