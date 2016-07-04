# -*- coding: utf-8 -*-
import os
import re


class Case:

    def __init__(self, name=""):
        self.name = name
        self.suites = []

    def add_suite(self, suite):
        self.suites.append(suite)


class Suite:

    def __init__(self, name="", url=""):
        self.name = name
        self.url = url


def scanner(source):

    result = []
    for paths, directories, files in os.walk(source):
        for file in files:
            full_path = os.path.join(paths, file)
            result.append(full_path)
    return result


def generator(file):

    f = open(file)
    lines = f.readlines()
    tc = Case()
    for line in lines:
        if 'gemini.suite' in line and 'SBIS3' in line:
            tc_names = re.findall(get_suite_regexp(), line)
            tc_name = tc_names[0][1].replace('SBIS3.CONTROLS.', '').replace(' Online', '')
            tc.name = tc_name
        if 'gemini.suite' in line and 'SBIS3' not in line:
            ts_names = re.findall(get_suite_regexp(), line)
            ts_name = ts_names[0][1]
            ts = Suite(ts_name)
            tc.add_suite(ts)
        if 'test.setUrl' in line:
            ts_urls = re.findall(get_url_regexp(), line)
            ts_url = '%s.html' % ts_urls[0]
            tc.suites[-1].url = ts_url.replace(').skip(\'firefox\').setCaptureElements(.html', '').replace(').skip(\'chrome\').setCaptureElements(.html', '')
    return tc


def get_suite_regexp():

    return re.compile(r'gemini\.suite\((\'(.+)\')')


def get_url_regexp():

    return re.compile(r'test\.setUrl\(\'/(.+).html\'\)')


def render(cases):

    counter = 0
    fx = open('StartPage.xhtml', 'w')
    fx.write('<div>\n')
    for case in cases:
        begin = """
    <component data-component="SBIS3.CONTROLS.MenuButton" name="{0}">
        <option name="caption">{0}</option>
        <option name="keyField">id</option>
        <options name="items" type="array">""".format(case.name)
        fx.write(begin)
        for suite in case.suites:
            counter += 1
            item = """
            <options>
                <option name="id">{0}</option>
                <option name="title">{1}</option>
            </options>""".format(counter, suite.name)
            fx.write(item)
        end = """
        </options>
    </component>
        """
        fx.write(end)
    fx.write('\n</div>')
    fx.close()

    counter = 0
    fx = open('StartPage.module.js', 'w')
    begin_2 = """define('js!StartPage', ['js!SBIS3.CORE.CompoundControl', 'html!StartPage', 'js!SBIS3.CONTROLS.MenuButton'], function(CompoundControl, dotTplFn) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function() {
      },

      init: function() {

         moduleClass.superclass.init.call(this);
         """
    fx.write(begin_2)

    for case in cases:
        first = True
        item_1 = """
         this.getChildControlByName('%s').subscribe('onMenuItemActivate', function (eventObject, id) {""" % case.name
        fx.write(item_1)
        for suite in case.suites:
            counter += 1
            if first is True:
                item_2 = """
                if (id === %d) { location.href="%s"; }""" % (counter, suite.url)
                first = False
            else:
                item_2 = """
                else if (id === %d) { location.href="%s"; }""" % (counter, suite.url)
            fx.write(item_2)
        item_3 = """
         });\n"""
        fx.write(item_3)
    end_2 = """
      }
   });

   moduleClass.webPage = {
      outFileName: "regression_start",
      htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
   }

   return moduleClass;
});"""
    fx.write(end_2)
    fx.close()

if __name__ == '__main__':
    test_dir = 'tests'
    files = scanner(test_dir)
    tc = []
    for file in files:
        tc.append(generator(file))
    render(tc)
