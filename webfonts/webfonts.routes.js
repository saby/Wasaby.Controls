var WEEK = 7 * 24 * 60 * 60;
var EXPIRE_WEEK = Date.now() + WEEK;
var FONT_ROOT = __dirname;

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var cache = {};

var glyphs = fs.readFileSync(path.join(FONT_ROOT, 'glyphs.css'));
var icons = fs.readFileSync(path.join(FONT_ROOT, 'icons.css'));

function createCSS(root, type, fonts) {
   var
      css = [],
      ttf = type === 'ttf',
      eot = type === 'eot',
      ext = '.' + (eot ? 'eot' : ttf ? 'ttf' : 'woff'),
      urlPrefix = 'data:application/' + (ttf ? 'x-font-ttf' : 'font-woff') + ';charset=utf-8;base64,%s',
      stylesheet =
         '@font-face {\
             font-family: \'%font-family%\';\
             font-weight: %font-weight%;\
             font-style: %font-style%;\
             src: url(\'%url%\')' + (eot ? '' : ' format(\'' + (ttf ? 'truetype' : 'woff') + '\')') + ';\
         }\n',
      fontFamily, fontPath, file, v;

   function attachFont(storedFontCss, fontFamily, fontWeight, fontStyle) {
      var
         cssText = stylesheet
            .replace('%font-family%', fontFamily)
            .replace('%font-weight%', fontWeight)
            .replace('%font-style%', fontStyle)
            .replace('%url%', storedFontCss);

      css.push(cssText);
   }

   fonts.forEach(function(font) {
      if (font['use']) {
         fontFamily = font['font-family'];
         fontPath = font['path'] || fontFamily;

         if (eot) {
            v = font.version.replace(/\./g, '');
            file = path.join(FONT_ROOT, fontPath, fontPath + '.v' + v + ext);
            file = '/' + path.relative(root, file).replace('\\', '/');
         } else {
            file = path.join(FONT_ROOT, fontPath, fontPath + ext);
            file = new Buffer(fs.readFileSync(file)).toString('base64');
            file = urlPrefix.replace('%s', file);
         }
         attachFont(file, fontFamily, font['font-weight'], font['font-style']);
      }
   });

   css.push(glyphs, icons);

   return css.join('\n');
}

module.exports = function (Component, Service) {
   return {
      '/webfonts/': function(req, res) {
         try {
            var root = process.application.getPathResolver().getRoot();
            var fonts = JSON.parse(req.query.fonts) || [];
            var type = req.query.type || 'woff';
            var hash = crypto.createHash('md5').update(req.query.type + req.query.fonts).digest('hex');
            var css;

            if (cache[hash]) {
               css = cache[hash];
            } else {
               css = createCSS(root, type, fonts);
               cache[hash] = css;
            }

            res.set('X-Accel-Expires', EXPIRE_WEEK);
            res.set('Cache-Control', 'public, max-age=' + WEEK);
            res.set('Expires', new Date(EXPIRE_WEEK).toUTCString());
            res.set('Content-Type', 'text/css; charset=UTF-8');

            res.send(css);
         } catch(err) {
            res.status(500).send(err.message);
         }
      }
   }
};