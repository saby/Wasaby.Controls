/**
 * Parser for simple config notation.
 * Based on parseObjectLiteral function from Knockout JavaScript library
 *
 * Usage :
 *
 * parse("attr: { href: url, title: details }") == {"attr":{"href":"url","title":"details"}}
 */
define("js!SBIS3.CORE.AttributeCfgParser", function(){
   var
      stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
      stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
   // Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
   // as a regular expression (this is handled by the parsing loop below).
      stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
   // These characters have special meaning to the parser and must not appear in the middle of a
   // token, except as part of a string.
      specials = ',"\'{}()/:[\\]',
   // Match text (at least two characters) that does not contain any of the above special characters,
   // although some of the special characters are allowed to start it (all but the colon and comma).
   // The text can contain spaces, but leading or trailing spaces are skipped.
      everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
   // Match any non-space character not matched already. This will match colons and commas, since they're
   // not matched by "everyThingElse", but will also match any other single character that wasn't already
   // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
      oneNotSpace = '[^\\s]',

   // Create the actual regular expression by or-ing the above strings. The order is important.
      bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),

   // Match end of previous token to determine whether a slash is a division or regex.
      divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
      keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

   // parseObjectLiteral function from Knockout JavaScript library v3.0.0beta
   // (c) Steven Sanderson - http://knockoutjs.com/
   // License: MIT (http://www.opensource.org/licenses/mit-license.php)
   function parseObjectLiteral(objectLiteralString) {
      // Trim leading and trailing spaces from the string
      var str = String.trim(objectLiteralString);

      // Trim braces '{' surrounding the whole object literal
      if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

      // Split into tokens
      var result = [], toks = str.match(bindingToken), key, values, depth = 0;

      if (toks) {
         // Append a comma so that we don't need a separate code block to deal with the last item
         toks.push(',');

         for (var i = 0, tok; tok = toks[i]; ++i) {
            var c = tok.charCodeAt(0);
            // A comma signals the end of a key/value pair if depth is zero
            if (c === 44) { // ","
               if (depth <= 0) {
                  if (key)
                     result.push(values ? {key: key, value: values.join('')} : {'unknown': key});
                  key = values = depth = 0;
                  continue;
               }
               // Simply skip the colon that separates the name and value
            } else if (c === 58) { // ":"
               if (!values)
                  continue;
               // A set of slashes is initially matched as a regular expression, but could be division
            } else if (c === 47 && i && tok.length > 1) {  // "/"
               // Look at the end of the previous token to determine if the slash is actually division
               var match = toks[i-1].match(divisionLookBehind);
               if (match && !keywordRegexLookBehind[match[0]]) {
                  // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
                  str = str.substr(str.indexOf(tok) + 1);
                  toks = str.match(bindingToken);
                  toks.push(',');
                  i = -1;
                  // Continue with just the slash
                  tok = '/';
               }
               // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
            } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
               ++depth;
            } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
               --depth;
               // The key must be a single token; if it's a string, trim the quotes
            } else if (!key && !values) {
               key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
               continue;
            }
            if (values)
               values.push(tok);
            else
               values = [tok];
         }
      }
      return result;
   }
   return function parse(str){
      var
         parsed = parseObjectLiteral(str),
         result = {};

      if (parsed.length == 1 && "unknown" in parsed[0]){
         return parsed[0]["unknown"];
      }

      for (var i = 0, l = parsed.length; i < l; i++){
         if ("key" in parsed[i]){
            result[parsed[i]["key"]] = parse(parsed[i]["value"]);
         }
      }

      return result;
   }
});