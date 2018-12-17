/**
 * Created by rn.kondakov on 24.10.2018.
 */
define([
   'Controls/Decorator/Markup/Converter',
   'Controls/Decorator/Markup/resources/template',
   'Controls/Decorator/Markup/resolvers/highlight',
   'Controls/Decorator/Markup/resolvers/linkDecorate',
   'Core/constants'
], function(Converter,
   template,
   highlightResolver,
   linkDecorateResolver,
   cConstants) {
   'use strict';

   describe('Controls.Decorator.Markup.Converter', function() {
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
            'www.ya.ru'
         ],
         decoratedLinkService,
         openTagRegExp = /(<[^/][^ >]* )([^>]*")(( \/)?>)/g,
         deepHtml = '<span style="text-decoration: line-through;" data-mce-style="text-decoration: line-through;">text<strong>text<em>text<span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">text</span>text</em>text</strong>text</span>',
         linkHtml = '<a class="asLink" rel="noreferrer" href="https://ya.ru" target="_blank">https://ya.ru</a>',
         decoratedLinkHtml = '<span class="LinkDecorator__wrap"><a class="LinkDecorator__linkWrap" rel="noreferrer" href="https://ya.ru" target="_blank"><img class="LinkDecorator__image" alt="https://ya.ru" src="' + (typeof location === 'object' ? location.protocol + '//' + location.host : '') + '/test/?method=LinkDecorator.DecorateAsSvg&amp;params=eyJTb3VyY2VMaW5rIjoiaHR0cHM6Ly95YS5ydSJ9&amp;id=0&amp;srv=1" /></a></span>';

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
            var newJson = Converter.deepCopyJson(json);
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
            var json = [['p', 'text&'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            assert.deepEqual(Converter.htmlToJson(html), json);
         });

         it('Wrapping url', function() {
            var html =
               '<p>' + linkHtml + '</p>' +
               '<p>https://ya.ru</p>' +
               '<p>  https://ya.ru  </p>' +
               '<p><strong>https://ya.ru</strong></p>' +
               '<p>https://ya.ru: text</p>' +
               '<p>http://ya.ru</p>' +
               '<p>http://ya.ru, text</p>' +
               '<p>www.ya.ru</p>' +
               '<p>www.ya.ru. Text</p>' +
               '<p><a> https://ya.ru </a></p>' +
               '<p>e@mail.ru</p>' +
               '<p><a>e@mail.ru</a></p>' +
               '<p><a>e@mail.ru.</a>https://ya.ru</p>' +
               '<p>http://update*.sbis.ru/tx_stat</p>';
            var json = [
               ['p', linkNode],
               ['p', linkNode],
               ['p', '  ', linkNode, '  '],
               ['p', ['strong', linkNode]],
               ['p', linkNode, ': text'],
               ['p', httpLinkNode],
               ['p', httpLinkNode, ', text'],
               ['p', wwwLinkNode],
               ['p', wwwLinkNode, '. Text'],
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
            assert.deepEqual(Converter.htmlToJson(html), json);
         });
      });

      describe('jsonToHtml', function() {
         beforeEach(function() {
            decoratedLinkService = cConstants.decoratedLinkService;
            cConstants.decoratedLinkService = '/test/';
         });
         afterEach(function() {
            cConstants.decoratedLinkService = decoratedLinkService;
         });
         it('empty', function() {
            assert.isTrue(equalsHtml(Converter.jsonToHtml([]), '<div></div>'));
            assert.isTrue(equalsHtml(Converter.jsonToHtml(), '<div></div>'));
         });
         it('escape', function() {
            var json = ['p', { title: '"&lt;<>' }, '&gt;&lt;><'];
            var vdomTemplate = template({ '_options': { 'value': json } }, {}, undefined, true);
            assert.isTrue(equalsHtml(Converter.jsonToHtml(json), '<div><p title="&quot;&amp;lt;&lt;&gt;">&amp;gt;&amp;lt;&gt;&lt;</p></div>'));
            assert.equal(vdomTemplate[0].children[0].children[0].children, '&amp;gt;&amp;lt;><');
            assert.equal(vdomTemplate[0].children[0].hprops.attributes.title, '"&amp;lt;<>');
         });
         it('one big', function() {
            var json = [['p', 'text&amp;'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var html = '<div><p>text&amp;amp;</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p></div>';
            assert.isTrue(equalsHtml(Converter.jsonToHtml(json), html));
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
                        ['img', { alt: 'Test image', src: 'test.gif', onclick: 'alert("Test")' }],
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
                     href: 'testHref',
                     id: 'testId',
                     name: 'testName',
                     rel: 'testRel',
                     rowspan: 'testRowspan',
                     src: 'testSrc',
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
               '<img alt="Test image" src="test.gif" />' +
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
               '<p alt="testAlt" class="testClass" colspan="testColspan" config="testConfig" data-bind="testDataOne" data-random-ovdmxzme="testDataTwo" data-some-id="testDataThree" hasmarkup="testHasmarkup" height="testHeight" href="testHref" id="testId" name="testName" rel="testRel" rowspan="testRowspan" src="testSrc" style="testStyle" tabindex="testTabindex" target="testTarget" title="testTitle" width="testWidth">All valid attributes</p>' +
               '</div>';
            assert.isTrue(equalsHtml(Converter.jsonToHtml(json), html));
         });
         it('with linkDecorate resolver', function() {
            var json = [
               ['p', linkNode],
               ['p', linkNode, '   '],
               ['p', linkNode, '   ', Converter.deepCopyJson(linkNode)],
               ['p', linkNode, 'text '],
               ['p', linkNode, ['br'], 'text'],
               ['p', linkNode, '   ', ['br'], 'text'],
               ['p', ['strong', linkNode], 'text'],
               ['p',
                  ['a',
                     {
                        rel: 'noreferrer',
                        href: 'https:\\\\ya.ru',
                        target: '_blank'
                     },
                     'https:\\\\ya.ru'
                  ]
               ],
               ['p', ['a', { href: 'https://ya.ru' }, 'text']]
            ];
            var html = '<div>' +
               '<p>' + decoratedLinkHtml + '</p>' +
               '<p>' + decoratedLinkHtml + '   </p>' +
               '<p>' + linkHtml + '   ' + decoratedLinkHtml + '</p>' +
               '<p>' + linkHtml + 'text </p>' +
               '<p>' + decoratedLinkHtml + '<br />text</p>' +
               '<p>' + decoratedLinkHtml + '   <br />text</p>' +
               '<p><strong>' + linkHtml + '</strong>text</p>' +
               '<p>' + decoratedLinkHtml + '</p>' +
               '<p><a href="https://ya.ru">text</a></p>' +
            '</div>';
            assert.isTrue(equalsHtml(Converter.jsonToHtml(json, linkDecorateResolver), html));
         });
         it('with highlight resolver', function() {
            var json = [
               ['p', ['strong', 'BaBare;gjwergo'], 'aBaweruigerhw', ['em', 'aBa']],
               ['p', 'aba, abA, aBa, aBA, Aba, AbA, ABa, ABA'],
               ['p', 'abababababa']
            ];
            var html = '<div>' +
               '<p><strong>B<span class="controls-Highlight_found">aBa</span>re;gjwergo</strong><span class="controls-Highlight_found">aBa</span>weruigerhw<em><span class="controls-Highlight_found">aBa</span></em></p>' +
               '<p><span class="controls-Highlight_found">aba</span>, <span class="controls-Highlight_found">abA</span>, <span class="controls-Highlight_found">aBa</span>, <span class="controls-Highlight_found">aBA</span>, <span class="controls-Highlight_found">Aba</span>, <span class="controls-Highlight_found">AbA</span>, <span class="controls-Highlight_found">ABa</span>, <span class="controls-Highlight_found">ABA</span></p>' +
               '<p><span class="controls-Highlight_found">aba</span>b<span class="controls-Highlight_found">aba</span>b<span class="controls-Highlight_found">aba</span></p>' +
               '</div>';
            assert.isTrue(equalsHtml(Converter.jsonToHtml(json, highlightResolver, { textToHighlight: 'aBa' }), html));
         });
      });
   });
});
