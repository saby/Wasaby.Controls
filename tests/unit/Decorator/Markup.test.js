/**
 * Created by rn.kondakov on 24.10.2018.
 */
define([
   'Controls/decorator',
   'Controls/Decorator/Markup/resources/template',
   'Controls/Decorator/Markup/resolvers/highlight',
   'Controls/Decorator/Markup/resources/linkDecorateUtils',
   'Env/Env'
], function(
   decorator,
   template,
   highlightResolver,
   linkDecorateUtils,
   Env) {
   'use strict';

   var simpleNode = ['span', 'text'],
      deepNode = ['span',
         {
            'style': 'text-decoration: line-through;',
            'data-mce-style': 'text-decoration: line-through;'
         },
         'text',
         ['strong',
            'text',
            ['em',
               'text',
               ['span',
                  {
                     'style': 'text-decoration: underline;',
                     'data-mce-style': 'text-decoration: underline;'
                  },
                  'text'
               ],
               'text'
            ],
            'text'],
         'text'
      ],
      decoratedLinkFirstChildNode = ['a',
         {
            'href': 'https://ya.ru',
            'target': '_blank',
            'class': 'LinkDecorator__linkWrap',
            'rel': 'noreferrer'
         },
         ['img',
            {
               'class': 'LinkDecorator__image',
               'alt': 'https://ya.ru',
               'src': (typeof location === 'object' ? location.protocol + '//' + location.host : '') + '/test/?method=LinkDecorator.DecorateAsSvg&params=eyJTb3VyY2VMaW5rIjoiaHR0cHM6Ly95YS5ydSJ9&id=0&srv=1'
            }
         ]
      ],
      attributedNode = ['span', { 'class': 'someClass' }, 'text'],
      linkNode = ['a',
         {
            'class': 'asLink',
            rel: 'noreferrer',
            href: 'https://ya.ru',
            target: '_blank'
         },
         'https://ya.ru'
      ],
      httpLinkNode = ['a',
         {
            'class': 'asLink',
            rel: 'noreferrer',
            href: 'http://ya.ru',
            target: '_blank'
         },
         'http://ya.ru'
      ],
      wwwLinkNode = ['a',
         {
            'class': 'asLink',
            rel: 'noreferrer',
            href: 'http://www.ya.ru',
            target: '_blank'
         },
         'http://www.ya.ru'
      ],
      ftpLinkNode = ['a',
         {
            'class': 'asLink',
            rel: 'noreferrer',
            href: 'ftp://ya.ru',
            target: '_blank'
         },
         'ftp://ya.ru'
      ],
      fileLinkNode = ['a',
         {
            'class': 'asLink',
            rel: 'noreferrer',
            href: 'file://ya.ru',
            target: '_blank'
         },
         'file://ya.ru'
      ],
      smbLinkNode = ['a',
         {
            'class': 'asLink',
            rel: 'noreferrer',
            href: 'smb://ya.ru',
            target: '_blank'
         },
         'smb://ya.ru'
      ],
      decoratedLinkService,
      currentVersion = '2',
      nbsp = String.fromCharCode(160),
      openTagRegExp = /(<[^/][^ >]* )([^>]*")(( \/)?>)/g,
      deepHtml = '<span style="text-decoration: line-through;" data-mce-style="text-decoration: line-through;">text<strong>text<em>text<span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">text</span>text</em>text</strong>text</span>',
      linkHtml = '<a class="asLink" rel="noreferrer" href="https://ya.ru" target="_blank">https://ya.ru</a>',
      decoratedLinkHtml = '<span class="LinkDecorator__wrap"><a class="LinkDecorator__linkWrap" rel="noreferrer" href="https://ya.ru" target="_blank"><img class="LinkDecorator__image" alt="https://ya.ru" src="' + (typeof location === 'object' ? location.protocol + '//' + location.host : '') + '/test/?method=LinkDecorator.DecorateAsSvg&amp;params=eyJTb3VyY2VMaW5rIjoiaHR0cHM6Ly95YS5ydSJ9&amp;id=0&amp;srv=1" /></a></span>';

   describe('Controls.Decorator.Markup.Converter', function() {
      function sortAttrs(html) {
         return html.replace(openTagRegExp, function(match, begin, attrs, end) {
            return begin + (attrs + ' ').split('" ').sort().join('" ') + end;
         });
      }

      function equalsHtml(html1, html2) {
         return sortAttrs(html1) === sortAttrs(html2);
      }

      describe('deepCopyJson', function() {
         it('one big', function() {
            var json = [['p', 'text'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var newJson = decorator.Converter.deepCopyJson(json);
            assert.notEqual(newJson, json);
            assert.deepEqual(newJson, json);
         });
      });

      describe('htmlToJson', function() {
         beforeEach(function() {
            if (typeof document === 'undefined') {
               this.skip();
            }
         });
         it('basic', function() {
            var html = '<p>text&amp;</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p>';
            var json = [['p', { version: currentVersion }, 'text&'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            assert.deepEqual(decorator.Converter.htmlToJson(html), json);
         });
         it('version', function() {
            assert.deepEqual(decorator.Converter.htmlToJson('<p>No attributes</p>'), [
               ['p',
                  { version: currentVersion },
                  'No attributes'
               ]
            ]);
            assert.deepEqual(decorator.Converter.htmlToJson('<p style="text-align: center;">With attributes</p>'), [
               ['p',
                  { version: currentVersion, style: 'text-align: center;' },
                  'With attributes'
               ]
            ]);
            assert.deepEqual(decorator.Converter.htmlToJson(''), []);
            assert.deepEqual(decorator.Converter.htmlToJson('just a string'), ['just a string']);
         });
         it('trim', function() {
            var html = '\n  \n<p>text&amp;</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p>  \n\n\n';
            var json = [['p', { version: currentVersion }, 'text&'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            assert.deepEqual(decorator.Converter.htmlToJson(html), json);
            assert.deepEqual(decorator.Converter.htmlToJson('   \n    \n   '), []);
         });

         it('undecorate link', function() {
            var html = '<p>' + decoratedLinkHtml + '</p>';
            var json = [['p', { version: currentVersion }, linkNode]];
            assert.deepEqual(decorator.Converter.htmlToJson(html), json);
         });

         it('long html', function() {
            var text = 'a'.repeat(2000);
            assert.deepEqual(decorator.Converter.htmlToJson('<p>' + text + '</p>'), [['p', { version: currentVersion }, text]]);
         }).timeout(1000);

         it('Wrapping url', function() {
            var html =
               '<p>' + linkHtml + '</p>' +
               '<p> a </p>' +
               '<p>texthttps://ya.ru. More text</p>' +
               '<p><a>https://ya.ru</a>https://ya.ru<a>https://ya.ru</a></p>' +
               '<p>https://ya.ru</p>' +
               '<p><iframe style="min-width: 350px; min-height: 214px;" src="https://www.youtube.com/embed/LY2I4IXN1zQ" width="430" height="300" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>' +
               '<p><img src="https://ya.ru" alt="a2ae6fcf-a3fa-471f-8b92-2017f78e8155" /></p>' +
               '<p>https://ya.ru&nbsp;https://ya.ru&nbsp;</p>' +
               '<p>  https://ya.ru  </p>' +
               '<p><strong>https://ya.ru</strong></p>' +
               '<p>https://ya.ru: text</p>' +
               '<p>http://ya.ru</p>' +
               '<p>http://ya.ru, text</p>' +
               '<p>www.ya.ru</p>' +
               '<p>www.ya.ru. Text</p>' +
               '<p>ftp://ya.ru</p>' +
               '<p>file://ya.ru</p>' +
               '<p>smb://ya.ru</p>' +
               '<p><a> https://ya.ru </a></p>' +
               '<p>e@mail.ru</p>' +
               '<p><a>e@mail.ru</a></p>' +
               '<p><a>e@mail.ru.</a>https://ya.ru</p>' +
               '<p>http://update*.sbis.ru/tx_stat</p>';
            var json = [
               ['p', { version: currentVersion }, linkNode],
               ['p', ' a '],
               ['p', 'text', linkNode, '. More text'],
               ['p', ['a', 'https://ya.ru'], linkNode, ['a', 'https://ya.ru']],
               ['p', linkNode],
               ['p', ['iframe',
                  {
                     style: 'min-width: 350px; min-height: 214px;',
                     src: 'https://www.youtube.com/embed/LY2I4IXN1zQ',
                     width: '430',
                     height: '300',
                     frameborder: '0',
                     allowfullscreen: 'allowfullscreen'
                  }
               ]],
               ['p', ['img',
                  {
                     src: 'https://ya.ru',
                     alt: 'a2ae6fcf-a3fa-471f-8b92-2017f78e8155'
                  }
               ]],
               ['p', linkNode, nbsp, linkNode, nbsp],
               ['p', '  ', linkNode, '  '],
               ['p', ['strong', linkNode]],
               ['p', linkNode, ': text'],
               ['p', httpLinkNode],
               ['p', httpLinkNode, ', text'],
               ['p', wwwLinkNode],
               ['p', wwwLinkNode, '. Text'],
               ['p', ftpLinkNode],
               ['p', fileLinkNode],
               ['p', smbLinkNode],
               ['p', ['a', ' https://ya.ru ']],
               ['p', ['a', { href: 'mailto:e@mail.ru' }, 'e@mail.ru']],
               ['p', ['a', 'e@mail.ru']],
               ['p', ['a', 'e@mail.ru.'], linkNode],
               ['p',
                  ['a',
                     {
                        'class': 'asLink',
                        rel: 'noreferrer',
                        href: 'http://update*.sbis.ru/tx_stat',
                        target: '_blank'
                     },
                     'http://update*.sbis.ru/tx_stat'
                  ]
               ]
            ];
            assert.deepEqual(decorator.Converter.htmlToJson(html), json);
         });
      });

      describe('jsonToHtml', function() {
         beforeEach(function() {
            decoratedLinkService = Env.constants.decoratedLinkService;
            Env.constants.decoratedLinkService = '/test/';
         });
         afterEach(function() {
            Env.constants.decoratedLinkService = decoratedLinkService;
         });
         it('empty', function() {
            assert.isTrue(equalsHtml(decorator.Converter.jsonToHtml([]), ''));
            assert.isTrue(equalsHtml(decorator.Converter.jsonToHtml(), ''));
         });
         it('only text', function() {
            // TODO: remove case in https://online.sbis.ru/opendoc.html?guid=a8a904f8-6c0d-4754-9e02-d53da7d32c99.
            assert.equal(decorator.Converter.jsonToHtml(['']), '<div><p></p></div>');
            assert.equal(decorator.Converter.jsonToHtml(['some text']), '<div><p>some text</p></div>');
            assert.equal(decorator.Converter.jsonToHtml(['some\ntext']), '<div><p>some</p><p>\ntext</p></div>');
            assert.equal(decorator.Converter.jsonToHtml(['p', 'some text']), '<div><p>some text</p></div>');
         });
         it('escape', function() {
            var json = ['p', { title: '"&lt;<>' }, '&gt;&lt;><&#39;'];
            var vdomTemplate = template({ '_options': { 'value': json } }, {}, undefined, true);
            assert.isTrue(equalsHtml(decorator.Converter.jsonToHtml(json), '<div><p title="&quot;&amp;lt;&lt;&gt;">&amp;gt;&amp;lt;&gt;&lt;&amp;#39;</p></div>'));
            assert.equal(vdomTemplate[0].children[0].children[0].children, '&amp;gt;&amp;lt;><&amp;#39;');
            assert.equal(vdomTemplate[0].children[0].hprops.attributes.title, '"&amp;lt;<>');
         });
         it('one big', function() {
            var json = [['p', 'text&amp;'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var html = '<div><p>text&amp;amp;</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p></div>';
            assert.isTrue(equalsHtml(decorator.Converter.jsonToHtml(json), html));
         });
         it('no XSS', function() {
            var
               json = [
                  ['p',
                     ['script', 'alert(123);']
                  ],
                  ['p',
                     { onclick: 'alert(123)' },
                     'click me'
                  ],
                  ['p',
                     ['iframe', { name: 'javascript:alert(123)', src: 'javascript:alert(123)' }]
                  ],
                  ['p',
                     ['a', { name: 'javascript:alert(123)', href: 'javascript:alert(123)' }, 'xss']
                  ],
                  ['p',
                     ['a', { href: '  javascript:alert(123)  ' }, 'leading spaces']
                  ],
                  ['p',
                     ['a', { href: 'jAvAsCrIpT:alert(123)' }, 'upper and lower case']
                  ],
                  ['p',
                     ['iframe', { src: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==' }, 'base64 alert']
                  ],
               ],
               goodHtml = '<div>' +
                  '<p></p>' +
                  '<p>click me</p>' +
                  '<p><iframe name="javascript:alert(123)"></iframe></p>' +
                  '<p><a name="javascript:alert(123)">xss</a></p>' +
                  '<p><a>leading spaces</a></p>' +
                  '<p><a>upper and lower case</a></p>' +
                  '<p><iframe>base64 alert</iframe></p>' +
                  '</div>',
               checkHtml = decorator.Converter.jsonToHtml(json);
            assert.isTrue(equalsHtml(checkHtml, goodHtml));
         });
         it('all valid tags and attributes', function() {
            var json = [
               ['p',
                  ['html',
                     ['head',
                        ['title', 'Test title'],
                        ['meta', { charset: 'utf-8' }],
                        ['script', 'alert("Test script");'],
                        ['style', '.testStyle { color: red; }'],
                        ['link', { rel: 'stylesheet', type: 'text/css', href: '/resources/WS.Core/css/core-min.css' }]
                     ],
                     ['body',
                        ['div', 'Test division'],
                        ['code', 'Test code'],
                        ['p', 'Test paragraph'],
                        ['span', 'Test span'],
                        ['img', { alt: 'Test image', src: '/test.gif', onclick: 'alert("Test")' }],
                        ['br'],
                        ['hamlet', 'Not to be: that is the answer'],
                        ['a', { rel: 'noreferrer', target: '_blank' }, 'Test link'],
                        ['pre', 'Test pretty print'],
                        ['label', 'Test label'],
                        ['font', { color: 'red', face: 'verdana', size: '5' }, 'Test font'],
                        ['blockquote', { cite: 'http://www.worldwildlife.org/who/index.html' }, ['div', 'Test block quote']],
                        ['p', ['b', 'T'], ['strong', 'e'], ['i', 's'], ['em', 't'], ['u', ' '], ['s', 's'], ['strike', 't'], ['q', 'yles']],
                        ['p', ['h0', 'No!'], ['h1', 'head'], ['h2', 'head'], ['h3', 'head'], ['h4', 'head'], ['h5', 'head'], ['h6', 'head'], ['h7', 'No!']],
                        ['input', { id: 'testInput', type: 'text', value: 'Test input' }],
                        ['dl', ['dt', 'Test description list'], ['dd', 'Yes'], ['dt', 'Test filthy language'], ['dd', 'No']],
                        ['dir', ['li', 'Test'], ['li', 'directed'], ['li', 'titles']],
                        ['ol', ['li', 'Test'], ['li', 'ordered'], ['li', 'list']],
                        ['ul', ['li', 'Test'], ['li', 'unordered'], ['li', 'list']],
                        ['table',
                           ['caption', 'Test table'],
                           ['colgroup', ['col', { style: 'background-color: yellow;' }], ['col', { style: 'background-color: red;' }]],
                           ['thead', ['tr', ['th', 'Test'], ['th', 'head']]],
                           ['tbody', ['tr', ['td', 'Test'], ['td', 'body']]],
                           ['tfoot', ['tr', ['td', 'Test'], ['td', 'foot']]]
                        ]
                     ]
                  ]
               ],
               ['p',
                  {
                     alt: 'testAlt',
                     'class': 'testClass',
                     colspan: 'testColspan',
                     config: 'testConfig',
                     'data-bind': 'testDataOne',
                     'data-random-ovdmxzme': 'testDataTwo',
                     'data-some-id': 'testDataThree',
                     hasmarkup: 'testHasmarkup',
                     height: 'testHeight',
                     href: 'http://testHref.com',
                     id: 'testId',
                     name: 'testName',
                     rel: 'testRel',
                     rowspan: 'testRowspan',
                     src: '/testSrc',
                     style: 'testStyle',
                     tabindex: 'testTabindex',
                     target: 'testTarget',
                     title: 'testTitle',
                     width: 'testWidth'
                  },
                  'All valid attributes'
               ]
            ];
            var html = '<div>' +
               '<p>' +
               '<html>' +
               '<head></head>' +
               '<body>' +
               '<div>Test division</div>' +
               '<code>Test code</code>' +
               '<p>Test paragraph</p>' +
               '<span>Test span</span>' +
               '<img alt="Test image" src="/test.gif" />' +
               '<br />' +
               '<a rel="noreferrer" target="_blank">Test link</a>' +
               '<pre>Test pretty print</pre>' +
               '<label>Test label</label>' +
               '<font>Test font</font>' +
               '<blockquote><div>Test block quote</div></blockquote>' +
               '<p><b>T</b><strong>e</strong><i>s</i><em>t</em><u> </u><s>s</s><strike>t</strike><q>yles</q></p>' +
               '<p><h1>head</h1><h2>head</h2><h3>head</h3><h4>head</h4><h5>head</h5><h6>head</h6></p>' +
               '<input id="testInput" />' +
               '<dl><dt>Test description list</dt><dd>Yes</dd><dt>Test filthy language</dt><dd>No</dd></dl>' +
               '<dir><li>Test</li><li>directed</li><li>titles</li></dir>' +
               '<ol><li>Test</li><li>ordered</li><li>list</li></ol>' +
               '<ul><li>Test</li><li>unordered</li><li>list</li></ul>' +
               '<table>' +
               '<caption>Test table</caption>' +
               '<colgroup><col style="background-color: yellow;" /><col style="background-color: red;" /></colgroup>' +
               '<thead><tr><th>Test</th><th>head</th></tr></thead>' +
               '<tbody><tr><td>Test</td><td>body</td></tr></tbody>' +
               '<tfoot><tr><td>Test</td><td>foot</td></tr></tfoot>' +
               '</table>' +
               '</body>' +
               '</html>' +
               '</p>' +
               '<p alt="testAlt" class="testClass" colspan="testColspan" config="testConfig" data-bind="testDataOne" data-random-ovdmxzme="testDataTwo" data-some-id="testDataThree" hasmarkup="testHasmarkup" height="testHeight" href="http://testHref.com" id="testId" name="testName" rel="testRel" rowspan="testRowspan" src="/testSrc" style="testStyle" tabindex="testTabindex" target="testTarget" title="testTitle" width="testWidth">All valid attributes</p>' +
               '</div>';
            assert.isTrue(equalsHtml(decorator.Converter.jsonToHtml(json), html));
         });
         it('with linkDecorate resolver', function() {
            // Link with length 1500.
            var longLink = 'https://ya.ru/' + 'a'.repeat(1486);
            var json = [
               ['p', linkNode],
               ['pre', linkNode],
               ['div', linkNode],
               ['p', linkNode, nbsp + nbsp + '   '],
               ['p', linkNode, '   ', decorator.Converter.deepCopyJson(linkNode)],
               ['p', linkNode, 'text '],
               ['p', linkNode, ['br'], 'text'],
               ['p', linkNode, '   ', ['br'], 'text'],
               ['p', ['strong', linkNode], 'text'],
               ['p',
                  ['a',
                     {
                        rel: 'noreferrer',
                        href: 'https:\\\\ya.ru\\som"e'
                     },
                     'https:\\\\ya.ru\\som"e'
                  ]
               ],
               ['p', ['a', { href: longLink }, longLink]],
               ['p', ['a', { href: 'https://ya.ru' }, 'text']]
            ];
            var html = '<div>' +
               '<p>' + decoratedLinkHtml + '</p>' +
               '<pre>' + decoratedLinkHtml + '</pre>' +
               '<div>' + decoratedLinkHtml + '</div>' +
               '<p>' + decoratedLinkHtml + '&nbsp;&nbsp;   </p>' +
               '<p>' + linkHtml + '   ' + decoratedLinkHtml + '</p>' +
               '<p>' + linkHtml + 'text </p>' +
               '<p>' + decoratedLinkHtml + '<br />text</p>' +
               '<p>' + decoratedLinkHtml + '   <br />text</p>' +
               '<p><strong>' + linkHtml + '</strong>text</p>' +
               '<p><span class="LinkDecorator__wrap"><a class="LinkDecorator__linkWrap" rel="noreferrer" href="https:\\\\ya.ru\\som&quot;e" target="_blank"><img class="LinkDecorator__image" alt="https:\\\\ya.ru\\som&quot;e" src="' + (typeof location === 'object' ? location.protocol + '//' + location.host : '') + '/test/?method=LinkDecorator.DecorateAsSvg&amp;params=eyJTb3VyY2VMaW5rIjoiaHR0cHM6XFxcXHlhLnJ1XFxzb21cImUifQ%3D%3D&amp;id=0&amp;srv=1" /></a></span></p>' +
               '<p><a href="' + longLink + '">' + longLink + '</a></p>' +
               '<p><a href="https://ya.ru">text</a></p>' +
            '</div>';
            assert.isTrue(equalsHtml(decorator.Converter.jsonToHtml(json, decorator.linkDecorate), html));
         });
         it('with highlight resolver', function() {
            var json = [
               ['p', ['strong', 'BaBare;gjwergo'], 'aBaweruigerhw', ['em', 'aBa']],
               ['p', 'aba, abA, aBa, aBA, Aba, AbA, ABa, ABA'],
               ['p', 'abababababa'],
               ['p', 'no highlight']
            ];
            var html = '<div>' +
               '<p><strong>B<span class="controls-MarkupDecorator_highlight">aBa</span>re;gjwergo</strong><span class="controls-MarkupDecorator_highlight">aBa</span>weruigerhw<em><span class="controls-MarkupDecorator_highlight">aBa</span></em></p>' +
               '<p><span class="controls-MarkupDecorator_highlight">aba</span>, <span class="controls-MarkupDecorator_highlight">abA</span>, <span class="controls-MarkupDecorator_highlight">aBa</span>, <span class="controls-MarkupDecorator_highlight">aBA</span>, <span class="controls-MarkupDecorator_highlight">Aba</span>, <span class="controls-MarkupDecorator_highlight">AbA</span>, <span class="controls-MarkupDecorator_highlight">ABa</span>, <span class="controls-MarkupDecorator_highlight">ABA</span></p>' +
               '<p><span class="controls-MarkupDecorator_highlight">aba</span>b<span class="controls-MarkupDecorator_highlight">aba</span>b<span class="controls-MarkupDecorator_highlight">aba</span></p>' +
               '<p>no highlight</p>' +
               '</div>';
            assert.isTrue(equalsHtml(decorator.Converter.jsonToHtml(json, highlightResolver, { textToHighlight: 'aBa' }), html));
         });
         it('with innerText resolver', function() {
            var json = [['p', 'text&amp;', ['br'], 'more text'], ['p', deepNode], ['p'], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            assert.equal(decorator.Converter.jsonToHtml(json, decorator.InnerText), 'text&amp;\nmore text\ntexttexttexttexttexttexttext\n\ntext\nhttps://ya.ru\ntext\n');
         });
         it('with noOuterTag resolver', function() {
            var json = [['p', 'text&amp;'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var html = '<p>text&amp;amp;</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p>';
            assert.isTrue(equalsHtml(decorator.Converter.jsonToHtml(json, decorator.noOuterTag), html));
            assert.equal(decorator.Converter.jsonToHtml([], decorator.noOuterTag), '');
         });
      });
   });

   describe('Controls.Decorator.Markup.resources.linkDecorateUtils', function() {
      describe('isDecoratedLink', function() {
         it('decorated link node', function() {
            assert.isTrue(linkDecorateUtils.isDecoratedLink('span', decoratedLinkFirstChildNode));
         });
         it('wrong tag name', function() {
            assert.isFalse(linkDecorateUtils.isDecoratedLink('div', decoratedLinkFirstChildNode));
            assert.isFalse(linkDecorateUtils.isDecoratedLink('', decoratedLinkFirstChildNode));
         });
         it('have not first child', function() {
            assert.isFalse(linkDecorateUtils.isDecoratedLink('span'));
            assert.isFalse(linkDecorateUtils.isDecoratedLink('span', null));
            assert.isFalse(linkDecorateUtils.isDecoratedLink('span', []));
            assert.isFalse(linkDecorateUtils.isDecoratedLink('span', ''));
         });
         it('wrong class name first child', function() {
            assert.isFalse(linkDecorateUtils.isDecoratedLink('span', ['a',
               {
                  'href': 'https://ya.ru',
                  'target': '_blank',
                  'class': 'LinkDecorator__linkWrapOrNotLinkWrap'
               },
               ['img',
                  {
                     'class': 'LinkDecorator__image',
                     'alt': 'https://ya.ru',
                  }
               ]
            ]));
         });
         it('wrong have not href first child', function() {
            assert.isFalse(linkDecorateUtils.isDecoratedLink('span', ['a',
               {
                  'target': '_blank',
                  'class': 'LinkDecorator__linkWrap'
               },
               ['img',
                  {
                     'class': 'LinkDecorator__image',
                     'alt': 'https://ya.ru',
                  }
               ]
            ]));
         });
      });
      describe('getUndecoratedLink', function() {
         it('undecorate a decorated link', function() {
            assert.deepEqual(linkDecorateUtils.getUndecoratedLink(decoratedLinkFirstChildNode), linkNode);
         });
      });
      describe('needDecorate', function() {
         beforeEach(function() {
            decoratedLinkService = Env.constants.decoratedLinkService;
            Env.constants.decoratedLinkService = '/test/';
         });
         afterEach(function() {
            Env.constants.decoratedLinkService = decoratedLinkService;
         });
         it('not a link', function() {
            var parentNode = ['p', ['b',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'https://ya.ru'
            ]];
            assert.isFalse(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('parent node is not a paragraph', function() {
            var parentNode = ['span', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'https://ya.ru'
            ]];
            assert.isFalse(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('link href is not equal link value', function() {
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'not https://ya.ru'
            ]];
            assert.isFalse(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('link href length more then given maximum', function() {
            var maxLenght = linkDecorateUtils.getHrefMaxLength(),
               linkHref = 'https://ya.ru/';
            linkHref = linkHref + 'a'.repeat(maxLenght - linkHref.length + 1);
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: linkHref,
                  target: '_blank'
               },
               linkHref
            ]];
            assert.isFalse(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('link href starts from "file://"', function() {
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'file://test-perfleakps/leaks/test/30_03_19/21_06_58.zip',
                  target: '_blank'
               },
               'file://test-perfleakps/leaks/test/30_03_19/21_06_58.zip'
            ]];
            assert.isFalse(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('link href starts from "smb://"', function() {
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'smb://test-perfleakps/leaks/test/30_03_19/21_06_58.zip',
                  target: '_blank'
               },
               'smb://test-perfleakps/leaks/test/30_03_19/21_06_58.zip'
            ]];
            assert.isFalse(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('link is not in the end of paragraph', function() {
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'not https://ya.ru'
            ], 'some node after link'];
            assert.isFalse(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('need decorate case - 1', function() {
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'https://ya.ru'
            ]];
            assert.isTrue(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('need decorate case - 2', function() {
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'https://ya.ru'
            ], '       '];
            assert.isTrue(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('need decorate case - 3', function() {
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'https://ya.ru'
            ], ['br']];
            assert.isTrue(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('need decorate case - 4', function() {
            var parentNode = ['p', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'https://ya.ru'
            ], '      ', ['br']];
            assert.isTrue(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('need decorate case - 5', function() {
            var parentNode = ['pre', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'https://ya.ru'
            ]];
            assert.isTrue(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('need decorate case - 6', function() {
            var parentNode = ['div', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'https://ya.ru',
                  target: '_blank'
               },
               'https://ya.ru'
            ]];
            assert.isTrue(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
         it('need decorate case - 7', function() {
            var parentNode = ['div', ['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: 'http://ya.ru',
                  target: '_blank'
               },
               'http://ya.ru'
            ]];
            assert.isTrue(linkDecorateUtils.needDecorate(parentNode[1], parentNode));
         });
      });
      describe('decorateLink', function() {
         beforeEach(function() {
            decoratedLinkService = Env.constants.decoratedLinkService;
            Env.constants.decoratedLinkService = '/test/';
         });
         afterEach(function() {
            Env.constants.decoratedLinkService = decoratedLinkService;
         });
         it('decorate a good link', function() {
            assert.deepEqual(linkDecorateUtils.getDecoratedLink(linkNode), ['span',
               { 'class': 'LinkDecorator__wrap' },
               decoratedLinkFirstChildNode
            ]);
         });
      });
   });
});
