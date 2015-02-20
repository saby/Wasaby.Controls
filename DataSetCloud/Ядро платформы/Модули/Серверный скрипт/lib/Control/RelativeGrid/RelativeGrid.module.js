/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 16:43
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.RelativeGrid", ["js!SBIS3.CORE.GridAbstract", "Core/js-template-doT"], function( GridAbstract, doT ) {

   "use strict";

   /**
    * @class $ws.proto.RelativeGrid
    * @extends $ws.proto.GridAbstract
    */
   $ws.proto.RelativeGrid = GridAbstract.extend(/** @lends $ws.proto.RelativeGrid.prototype */{
      $protected: {
         _options: {
            tabindex : false,
            controlList: {},
            display: [],
            minSizes : {},
            columns : [],
            rows : [],
            isRelativeTemplate: true
         }
      },

      $constructor : function() {
         if (!this._hasMarkup()){
            if (!$ws.proto.RelativeGrid.__markupTemplate){
               $ws.proto.RelativeGrid.__markupTemplate = doT.template(this._createMarkup());
            }
            this._options.horizontalAlignment = this._horizontalAlignment;
            this._options.verticalAlignment = this._verticalAlignment;
            var gridCfg = this._collectGridConfig(document, this._container.attr('id'), this._options);

            this._container.append( $ws.proto.RelativeGrid.__markupTemplate( gridCfg ) );

            for(var cid in gridCfg.controlsConfig) {
               if (gridCfg.controlsConfig.hasOwnProperty(cid)){

                  var control = document.getElementById(cid);
                  var place = document.getElementById('place' + cid);
                  place.parentNode.replaceChild(control, place);
               }
            }

            //интересно а он точно всегда есть???
            $ws.helpers.insertCss(this._createStyles(gridCfg));
         }
         this._container.addClass('ws-relativegrid');
      },

      _createStyles : function(cfg){
         return cfg.styleData;
      },

      _collectGridConfig : function(doc, id, options){
         var controlsCfg = {};
         var gridTag = doc.getElementById(id);
         var controlList = options.controlList;
         var firstNewGrid = gridTag.getAttribute('junctionToNewGrid');
         var styleData = '';
         for (var cell in controlList){
            if (controlList.hasOwnProperty(cell)){
               var controls = controlList[cell];
               for(var ctr = 0; ctr < controls.length; ctr++) {
                  controlsCfg[controls[ctr]] = this._getControlCfg( doc.getElementById(controls[ctr]) );
                  styleData += this._createControlStyle( controlsCfg[controls[ctr]], controls[ctr] );
               }
            }
         }
         var cfg = {
            id : id,
            proto : $ws.proto.RelativeGrid.prototype,
            firstNewGrid : (firstNewGrid && firstNewGrid == 'true') || false,
            controlsConfig : controlsCfg,
            parentId : gridTag.getAttribute('parentId'),
            inTab : (gridTag.parentNode.getAttribute('VerticalAlignment') == 'Stretch') && (gridTag.parentNode.getAttribute('type') == 'Control/Area:TabTemplatedArea')
         };
         cfg = $ws.core.merge(cfg, options);
         cfg = $ws.core.merge(cfg, this._getControlCfg(gridTag));
         cfg.styleData = this._createGridStyle(cfg) + styleData;
         return cfg;
      },

      _isPercent : function(value){
         if (typeof value === 'string'){
            if (/.*%$/.test(value)){
               return true;
            }
         }
         return false;
      },

      _getControlCfg : function(el){
         var cfg = {};
         if (el){
            var margins = el.getAttribute('alignMargin');
            if (margins)
               cfg.margins = margins.split(',');
            cfg.horizontalAlignment = el.getAttribute('HorizontalAlignment');
            if (!cfg.horizontalAlignment)
               delete cfg.horizontalAlignment;
            cfg.verticalAlignment = el.getAttribute('VerticalAlignment');
            if (!cfg.verticalAlignment)
               delete cfg.verticalAlignment;
            cfg.autoWidth = el.getAttribute('autoWidth') == 'true';
            cfg.autoHeight = el.getAttribute('autoHeight') == 'true';
            cfg.width = el.getAttribute('width');
            cfg.height = el.getAttribute('height');
            var cl = el.getAttribute('class') || '';
            if (cl.match(/.*ws-labeled-control.*ws-labeled-control-autosize.*/g)){
               if (el.getAttribute('width').toLowerCase() == 'auto') {
                  cfg.autoWidth = true;
               }
               if (el.getAttribute('height').toLowerCase() == 'auto') {
                  cfg.autoHeight = true;
               }
            }
         }
         return cfg;
      },

      _createControlStyle : function(cfg, id){
         var self = this;

         function makeRelativeStyles(params){
            var css = [];
            css.push("position:relative !important");
            if (params.autoWidth && params.horizontalAlignment != 'Stretch')
               css.push('display:table');
            else css.push('display:block');
            switch(params.horizontalAlignment){
               case 'Center': css.push('margin-right:auto;margin-left:auto');break;
               case 'Right': css.push('margin-left:auto');break;
               case 'Left': css.push('margin-right:auto');break;
            }

            if (!params.autoHeight)
               css.push('height:' + params.height + 'px');
            else css.push('height:auto');
            if (!params.autoWidth)
               css.push('width:' + params.width + 'px');
            else css.push('width:auto');
            return css;
         }

         function makeAbsoluteStyles(params){
            var css =  [],
               margins=params.margins;
            css.push("position:absolute");
            var halfWidth = 0,
               halfHeight = 0,
               width = (!self._isPercent(params.width) && parseInt(params.width, 10)) || params.width,
               height = (!self._isPercent(params.height) && parseInt(params.height, 10)) || params.height;

            if ( typeof width == 'number' ){
               halfWidth = width / 2 + 'px';
               width += 'px';
            }
            else if (params.minWidth)
               halfWidth = params.minWidth / 2 + 'px';

            if (typeof height == 'number'){
               halfHeight = height / 2 + 'px';
               height += 'px';
            }
            else if (params.minHeight)
               halfHeight = params.minHeight / 2 + 'px';

            switch(params.horizontalAlignment){
               case 'Left': css.push('left:' + margins[3] + 'px'); css.push('width:' + width); break;
               case 'Center': css.push('left:50%'); css.push('margin-left:-' + halfWidth); css.push('width:' + width); break;
               case 'Right': css.push('right:' + margins[1] + 'px'); css.push('width:' + width); break;
               case 'Stretch': css.push('right:' + margins[1] + 'px'); css.push('left:' + margins[3] + 'px'); css.push('width: auto'); break;
            }

            switch(params.verticalAlignment){
               case 'Top': css.push('top:' + margins[0] + 'px'); css.push('height:' + height); break;
               case 'Center': css.push('top:50%'); css.push('margin-top:-' + halfHeight); css.push('height:' + height); break;
               case 'Bottom': css.push('bottom:' + margins[2] + 'px'); css.push('height:' + height); break;
               case 'Stretch': css.push('bottom:' + margins[2] + 'px;top:' + margins[0] + 'px;height:auto'); break;
            }
            return css;
         }
         var style = [];
         if (cfg.autoHeight || cfg.autoWidth){
            style = makeRelativeStyles(cfg);
         }
         else style = makeAbsoluteStyles(cfg);

         return '#' + id + '{' + style.join(';') + '}';
      },

      _genDisplay : function (m){
         var r = [];
         var c = [];
         for(var i = m.length - 1; i >= 0; i--){
            r[i] = [];
            c[i] = [];
            for (var j = m[i].length - 1; j >= 0; j--){
               if (m[i][j] == m[i][j + 1]){
                  r[i][j] = r[i][j + 1] + 1;
                  r[i][j + 1] = 0;
               }
               else r[i][j] = 1;
               if (m[i + 1] && m[i][j] == m[i+1][j]){
                  c[i][j] = c[i + 1][j] + 1;
                  c[i + 1][j] = 0;
               }
               else c[i][j] = 1;
            }
         }
         return {r : c, c : r};
      },

      _createGridStyle : function(gridCfg){
         var width = 'auto',
            height = 'auto',
            hasStarSizedRow=false;

         for (var i = 0; i < gridCfg.rows.length; i++){
            if (this._isPercent(gridCfg.rows[i]))
               hasStarSizedRow=true;
         }

         if (gridCfg.horizontalAlignment == 'Stretch')
            width = '100%';

         if (hasStarSizedRow && gridCfg.verticalAlignment == 'Stretch')
         {
            height = "100%";
         } else {
            if ( !gridCfg.autoHeight)
               height = gridCfg.height + 'px';
         }
         var style =  '#' + gridCfg.id + ' > table {width:' + width + ';height:' + height + '}',
            isSingleGrid = (gridCfg.rows.length == 1 && gridCfg.columns.length == 1),
            gridMinSizeWidth = 0,
            gridMinSizeHeight = 0;
         if (isSingleGrid && (gridCfg.verticalAlignment != 'Stretch' || (gridCfg.autoWidth || gridCfg.autoHeight))){
            style += '#' + gridCfg.id + '{min-height: ' + gridCfg.minSizes.rows[0] + 'px;min-width: ' + gridCfg.minSizes.columns[0] + 'px;}';
            gridMinSizeHeight = parseInt(this._isPercent(gridCfg.rows[0]) ? gridCfg.minSizes.rows[0] : gridCfg.rows[0], 10);
            gridMinSizeWidth = parseInt(this._isPercent(gridCfg.columns[0]) ? gridCfg.minSizes.columns[0] : gridCfg.columns[0], 10);
            if (gridCfg.autoWidth && gridCfg.autoHeight && gridCfg.horizontalAlignment != 'Stretch'){
               style += '#' + gridCfg.id + '{height: ' + gridMinSizeHeight + 'px}';
            }
         }

         if (gridCfg.firstNewGrid || !gridCfg.parentId || gridCfg.inTab){
            var newCfg = $ws.core.merge({}, gridCfg);
            if (newCfg.width === '') newCfg.width = "auto";
            if (newCfg.height === '') newCfg.height = "auto";
            if (gridCfg.firstNewGrid){
               newCfg.autoWidth = newCfg.autoHeight = false;
               if (gridMinSizeWidth !== 0 && isSingleGrid && newCfg.horizontalAlignment != 'Stretch' )
                  newCfg.width = 'auto';
               if (gridMinSizeHeight !== 0 && isSingleGrid && newCfg.verticalAlignment != 'Stretch')
                  newCfg.height = 'auto';
               newCfg.minHeight = gridMinSizeHeight;
               newCfg.minWidth = gridMinSizeWidth;
            }
            style += this._createControlStyle(newCfg, newCfg.id);
         }
         return style;
      },

      /**
       * Наследует разметку для контрола от родителя
       * @param {String} parentMarkup - разметка родителя
       * @param {String} childMarkup - разметка наследника
       * @return {String}
       * @protected
       */
      _extendMarkup : function(parentMarkup, childMarkup){
         parentMarkup = parentMarkup || "<innerTpl></innerTpl>";
         return parentMarkup.replace("<innerTpl></innerTpl>", childMarkup);
      },

      _createMarkup : function(tpl){
         var tmplSingle = this._createMarkupSingle();
         var tmplCommon = this._createMarkupCommon();
         var gridTpl = "\
         {{ var trans = {'Top' : 'top', 'Center' : 'middle', 'Bottom' : 'bottom', 'Stretch' : 'middle'}; }}\
         {{? (it.rows.length == 1 && it.columns.length == 1)}}" +
         tmplSingle +
         "{{??}}" +
         tmplCommon +
         "{{?}}\
         ";
         return this._extendMarkup(tpl, gridTpl);
      },

      _createMarkupSingle : function(){
         var tpl = "\
{{ var controls = it.controlList[it.display[0][0]]; }}\
{{? controls && controls.length }}\
{{ for(var ctr = 0; ctr < controls.length; ctr++) { }}\
{{ var cfg = it.controlsConfig[controls[ctr]]; }}\
{{? ((cfg.autoWidth || cfg.autoHeight))}}\
<div class=\"ws-relativegrid-relativewrapperouter\" style=\"width:100%;\">\
<div class=\"ws-relativegrid-relativewrapperinner\" style=\"vertical-align: {{=trans[cfg.verticalAlignment]}};padding:{{=cfg.margins.join('px ')+'px'}}\">\
<div id=\"place{{=controls[ctr]}}\">&nbsp;</div>\
</div>\
</div>\
{{??}}\
<div id=\"place{{=controls[ctr]}}\">&nbsp;</div>\
{{?}}\
{{ } }}\
{{?}}\
";
         return tpl;
      },

      _createMarkupCommon : function(){

         var tpl = "{{var displays = it.proto._genDisplay(it.display);}}\
<table>\
<colgroup>\
{{ for(var i=0;i<it.columns.length;i++){ }}\
<col width=\"{{=(it.proto._isPercent(it.columns[i]) && it.autoWidth && it.horizontalAlignment != 'Stretch' ) ? it.minSizes.columns[i] : it.columns[i]}}\"/>\
{{ } }}\
</colgroup>\
<tbody>\
{{ var cellNum = 0; }}\
{{ for(var r = 0; r < it.display.length; r++) { }}\
<tr \
{{? (it.proto._isPercent(it.rows[r])) }}\
class=\"ws-relativegrid-firefox_100_height ws-relativegrid-IEFix\" \
{{?}}\
{{? !it.proto._isPercent(it.rows[r])}}\
height=\"{{=it.autoHeight ? it.minSizes.rows[r] : it.rows[r]}}\"\
{{?}}\
>\
{{ for(var c = 0; c < it.display[r].length; c++) { }}\
{{ if (!(displays.c[r][c] && displays.r[r][c])) continue; }}\
{{ cellNum++; }}\
{{ var cell = it.display[r][c]; }}\
{{ var controls = it.controlList[cell]; }}\
{{ var verticalAlignment = 'top'; }}\
{{ var hasStaticControls = false; }}\
{{ var margins = []; }}\
{{? controls && controls.length }}\
{{ for(var ctr = 0; ctr < controls.length; ctr++) { }}\
{{ var cfg = it.controlsConfig[controls[ctr]]; }}\
{{? ( !(cfg.autoHeight || cfg.autoWidth) )}}\
{{ hasStaticControls = true; }}\
{{??}}\
{{ verticalAlignment = cfg.verticalAlignment; }}\
{{ margins = cfg.margins; }}\
{{?}}\
{{ } }}\
{{?}}\
<td \
{{? (displays.r[r][c] != 1) }}\
rowspan=\"{{=displays.r[r][c]}}\" \
{{?}}\
{{? (displays.c[r][c] != 1) }}\
colspan=\"{{=displays.c[r][c]}}\" \
{{?}}\
class=\"ws-relativegrid-cell\" id=\"{{='cell_' + cellNum + '_' + it.id}}\" \
style=\"vertical-align: {{=trans[verticalAlignment]}};\
{{? (!hasStaticControls) }} \
padding:{{=margins.join('px ')||0}}px; \
{{?}}\
\"\
>\
{{? hasStaticControls || !controls || !controls.length}}\
<div class=\"ws-relativegrid-cellwrapper ws-relativegrid-firefox_100_height\" \
style=\"height:100%;\
{{? it.minSizes.rows[r]}}\
min-height:{{=it.minSizes.rows[r]}}px;\
{{?}}\
{{? it.minSizes.columns[c]}}\
min-width:{{=it.minSizes.columns[c]}}px;\
{{?}}\
\"\
>\
{{?}}\
{{? controls && controls.length }}\
{{ for(var ctr = 0; ctr < controls.length; ctr++) { }}\
{{ var cfg = it.controlsConfig[controls[ctr]]; }}\
{{? ((cfg.autoWidth || cfg.autoHeight) && hasStaticControls && verticalAlignment != 'Top')}}\
<div class=\"ws-relativegrid-relativewrapperouter\" style=\"width:100%;\
{{? it.minSizes.rows[r]}}\
height:{{=it.minSizes.rows[r]}}px;\
{{?}}\
\">\
<div class=\"ws-relativegrid-relativewrapperinner\" style=\"vertical-align: {{=trans[cfg.verticalAlignment]}};padding:{{=cfg.margins.join('px ')+'px'}}\">\
<div id=\"place{{=controls[ctr]}}\">&nbsp;</div>\
</div>\
</div>\
{{??}}\
{{? ((cfg.autoWidth || cfg.autoHeight) && hasStaticControls) }}\
<div style=\"padding:{{=cfg.margins.join('px ')+'px'}}\">\
<div id=\"place{{=controls[ctr]}}\">&nbsp;</div>\
</div>\
{{??}}\
<div id=\"place{{=controls[ctr]}}\">&nbsp;</div>\
{{?}}\
{{?}}\
{{ } }}\
{{?}}\
{{? hasStaticControls || !controls || !controls.length}}\
</div>\
{{?}}\
</td>\
{{ } }}\
</tr>\
{{ } }}\
</tbody>\
</table>\
";
         return tpl;
      },

      _fixIETdHeights: function RelativeGrid_fixIETdHeights() {
         if ($ws._const.browser.isIE) {
            //в IE 8 и 9 и 10 не работает вертикальный stretch, нужно обрабатывать скриптом
            var cells = $('> table > tbody > .ws-relativegrid-IEFix > td', this._container);
            cells.each(function(){
               $(this).css('height','auto');
            });
            cells.each(function(){
               var cell = $(this);
               cell.css('height',cell.height()+'px');
            });
         }
      },

      //TODO: сделать расчёт тут пооптимальнее - выкинуть _fixIETdHeights из  _onResizeHandler, например...
      _onSizeChangedBatch: function RelativeGrid_onSizeChangedBatch() {
         $ws.proto.RelativeGrid.superclass._onSizeChangedBatch.apply(this, arguments);

         this._fixIETdHeights();
         return true;
      },

      _onResizeHandler: function RelativeGrid_onResizeHandler(event, initiator){
         if (this._skipOnResizeHandler())
            return;

         this._resizeChilds();
         this._fixIETdHeights();
      }
   });

   return $ws.proto.RelativeGrid;

});