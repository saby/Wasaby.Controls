/// <amd-module name="Controls/Router/Helper" />
import getUrl = require('Transport/URL/getUrl');
import IoC = require('Core/IoC');

function _validateMask(mask) {
   if (mask.indexOf('/') !== -1 && mask.indexOf('=') !== -1) {
      IoC.resolve('ILogger').error('RouterHelper', 'Wrong mask, check it');
   }
}
function getRelativeUrl() {
   let url = getUrl();
   url = url.replace(/^http[s]?:\/\//, '');
   const indexOfSlash = url.indexOf('/');
   url = url.slice(indexOfSlash);
   return url;
}
function _generateFullmask(mask) {
   let fullMask = mask;
   if (fullMask.indexOf('/') !== -1) {
      if (fullMask[0] === '/') {
         fullMask = '([/]|.*?\\.html/)' + fullMask.slice(1);
      } else {
         fullMask = '(.*/)' + fullMask;
      }
   } else if (fullMask.indexOf('=') !== -1) {
      fullMask = '(.*\\?|.*&)' + fullMask;
   } else {
      fullMask = '(.*/)' + fullMask;
   }

   if (fullMask.indexOf('=') !== -1) {
      fullMask = fullMask + '(&.+)?';
   } else {
      fullMask = fullMask + '(/.*|\\?.+)?';
   }

   return fullMask;
}

function _matchParams(mask, cb) {
   const re = /:(\w+)/g;
   let paramMatched = re.exec(mask);

   while (paramMatched) {
      cb({
         preffixEnd: paramMatched.index,
         postfixStart: paramMatched.index + paramMatched[0].length,
         name: paramMatched[1]
      });

      paramMatched = re.exec(mask);
   }
}

function _calculateParams(mask, cfg, forUrl) {
   const url = forUrl || getRelativeUrl();
   const fullMask = _generateFullmask(mask);

   const paramIndexes = [];
   const result = [];

   _matchParams(fullMask, function(param) {
      paramIndexes.push({
         preffixEnd: param.preffixEnd,
         postfixStart: param.postfixStart
      });
      result.push({
         name: param.name,
         value: cfg[param.name]
      });
   });

   let newFullMask = fullMask;
   for (let i = paramIndexes.length - 1; i >= 0; i--) {
      newFullMask = newFullMask.slice(0, paramIndexes[i].preffixEnd) + '([^\\/?&]+?)' + newFullMask.slice(paramIndexes[i].postfixStart);
   }
   newFullMask = '^' + newFullMask + '$';

   const matched = url.match(newFullMask);

   if (matched) {
      for (let j = 0; j < paramIndexes.length; j++) {
         result[j].urlValue = decodeURIComponent(matched[j + 1 + 1]); // 0 это вся строка, 1 это префикс;
      }
   }
   return result;
}

function _resolveMask(mask, params) {
   const paramCount = 0, resolvedCount = 0;
   _matchParams(mask, function(param) {
      paramCount++;
      if (params[param.name] !== undefined) {
         let paramValue = params[param.name];
         if (typeof paramValue !== 'string') {
            paramValue = JSON.stringify(paramValue);
         }
         paramValue = encodeURIComponent(paramValue);
         mask = mask.replace(':' + param.name, paramValue);
         resolvedCount++;
      }
   });

   let result = '';
   if (resolvedCount === paramCount) {
      result = mask;
   } else if (resolvedCount !== 0) {
      IoC.resolve('ILogger').error('RouterHelper', 'wrong resolvedCount, check it');
   }
   return result;
}

function _getCfgParams(params) {
   const res = {};
   params.forEach(function(param) {
      res[param.name] = encodeURIComponent(param.value);
   });
   return res;
}
function _getUrlParams(params) {
   const res = {};
   params.forEach(function(param) {
      res[param.name] = param.urlValue===undefined?undefined:decodeURIComponent(param.urlValue);
   });
   return res;
}
function calculateUrlParams(mask, forUrl) {
   _validateMask(mask);
   return _getUrlParams(_calculateParams(mask, {}, forUrl));
}
function calculateCfgParams(mask, cfg) {
   _validateMask(mask);
   return _getCfgParams(_calculateParams(mask, cfg));
}

function _resolveHref(href, mask, cfg) {
   const params = _calculateParams(mask, cfg);
   const cfgParams = _getCfgParams(params);
   const urlParams = _getUrlParams(params);

   const toFind = _resolveMask(mask, urlParams);
   const toReplace = _resolveMask(mask, cfgParams);

   let result = href;
   if (toFind) {
      if (toReplace) {
         result = href.replace(toFind, toReplace);
      } else {
         if (href.indexOf('/' + toFind) !== -1) {
            result = href.replace('/' + toFind, '');
         } else if (href.indexOf('?' + toFind) !== -1) {
            result = href.replace('?' + toFind, '');
         } else if (href.indexOf('&' + toFind) !== -1) {
            result = href.replace('&' + toFind, '');
         } else {
            result = href.replace(toFind, '');
         }
      }
   } else if (toReplace) {
      const qIndex = href.indexOf('?');
      if (toReplace[0] === '/') {
         result = toReplace;
      } else {
         if (toReplace.indexOf('=') !== -1) {
            if (qIndex !== -1) {
               result = href.replace(/\/$/, '') + '&' + toReplace;
            } else {
               result = href.replace(/\/$/, '') + '?' + toReplace;
            }
         } else {
            if (qIndex !== -1) {
               result = href.slice(0, qIndex) + '/' + toReplace + href.slice(qIndex);
            } else {
               result = href + '/' + toReplace;
            }
         }
      }
   }
   return result;
}
function calculateHref(mask, cfg) {
   _validateMask(mask);
   cfg = cfg.clear ? {} : cfg;
   const url = getRelativeUrl();
   const result = _resolveHref(url, mask, cfg);
   return result;
}

export default {
   getRelativeUrl: getRelativeUrl,
   calculateUrlParams: calculateUrlParams,
   calculateCfgParams: calculateCfgParams,
   calculateHref: calculateHref
};
