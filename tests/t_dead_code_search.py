#! /usr/bin/env python
# -*- coding: utf-8 -*-
#
# vulture - Find dead code.
#
# Copyright (c) 2012-2016 Jendrik Seipp (jendrikseipp@web.de)
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
# CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from __future__ import print_function

import ast
import os
import re
import sys
from fnmatch import fnmatchcase

from atf import *

__version__ = '0.11'


# Parse variable names in template strings.
FORMAT_STRING_PATTERNS = [re.compile(r'\%\((\w+)\)'), re.compile(r'{(\w+)}')]

IGNORED_VARIABLE_NAMES = ['object', 'self', 'cls']
# True and False are NameConstants since Python 3.4.
if sys.version_info < (3, 4):
    IGNORED_VARIABLE_NAMES += ['True', 'False']

IGNORED_ATTRIBUTE_NAMES = Config().get('IGNORE_ATTRIBUTES').split(',')


def _ignore_function(name):
    return ((name.startswith('__') and name.endswith('__') or name.startswith('Test') or name.startswith('test_') or
             name in Config().get('IGNORE_FUNCTIONS').split(',')))


def format_path(path):
    if not path:
        return path
    relpath = os.path.relpath(path)
    return relpath if not relpath.startswith('..') else path


class Item(str):
    def __new__(cls, name, typ, file, lineno):
        item = str.__new__(cls, name)
        item.typ = typ
        item.file = file
        item.lineno = lineno
        return item


class Vulture(ast.NodeVisitor):
    """Find dead stuff."""
    def __init__(self, exclude=None, verbose=False):
        self.exclude = []
        for pattern in exclude.split(',') or []:
            if not any(char in pattern for char in ['*', '?', '[']):
                pattern = '*%s*' % pattern
            self.exclude.append(pattern)

        self.verbose = verbose

        self.defined_attrs = []
        self.defined_funcs = []
        self.defined_imports = []
        self.defined_props = []
        self.defined_vars = []
        self.used_attrs = []
        self.used_vars = []
        self.tuple_assign_vars = []
        self.names_imported_as_aliases = []

        self.file = ''
        self.code = None

    def scan(self, node_string):
        self.code = node_string.splitlines()
        node = ast.parse(node_string, filename=self.file)
        self.visit(node)

    def _get_modules(self, paths, toplevel=True):
        """Take files from the command line even if they don't end with .py."""
        modules = []
        for path in paths:
            path = os.path.abspath(path)
            if toplevel and path.endswith('.pyc'):
                sys.exit('.pyc files are not supported: {0}'.format(path))
            if os.path.isfile(path) and (path.endswith('.py') or toplevel):
                modules.append(path)
            elif os.path.isdir(path):
                subpaths = [
                    os.path.join(path, filename)
                    for filename in sorted(os.listdir(path))]
                modules.extend(self._get_modules(subpaths, toplevel=False))
            elif toplevel:
                sys.exit('Error: %s could not be found.' % path)
        return modules

    def scavenge(self, paths, exclude_files=' '):
        modules = self._get_modules(paths)
        included_modules = []
        for module in modules:
            if any(fnmatchcase(module, pattern) for pattern in self.exclude) or \
                    module.endswith(tuple(exclude_files.split(','))):
                self.log('Excluded:', module)
            else:
                included_modules.append(module)

        for module in included_modules:
            self.log('Scanning:', module)
            with open(module, encoding='utf-8') as f:
                module_string = f.read()
            self.file = module
            self.scan(module_string)

    @staticmethod
    def report(items, report_file):
        """
        Вывод неиспользуемых объектов

        :param items: список неиспользуемых объектов
        :param report_file: файл с отчётом
        :return: найдены или не найдены неиспользуемые объекты

        """

        def file_lineno(item_):
            return item_.file.lower(), item_.lineno

        unused_item_found = False
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), report_file), 'w+') as report:
            for item in sorted(items, key=file_lineno):
                path = item.file
                unused_row = "%s:%d: Unused %s '%s'" % (path, item.lineno, item.typ, item)
                print(unused_row)
                report.write(unused_row + '\n')
                unused_item_found = True
        return unused_item_found

    @staticmethod
    def get_unused(defined, used):
        return list(sorted(set(defined) - set(used), key=lambda x: x.lower()))

    @property
    def unused_funcs(self):
        return self.get_unused(
            self.defined_funcs,
            self.used_attrs + self.used_vars + self.names_imported_as_aliases)

    @property
    def unused_imports(self):
        return self.get_unused(self.defined_imports, self.used_vars)

    @property
    def unused_props(self):
        return self.get_unused(self.defined_props, self.used_attrs)

    @property
    def unused_vars(self):
        return self.get_unused(
            self.defined_vars,
            self.used_attrs + self.used_vars + self.tuple_assign_vars +
            self.names_imported_as_aliases)

    @property
    def unused_attrs(self):
        return self.get_unused(
            self.defined_attrs,
            self.used_attrs + self.used_vars)

    def _define_variable(self, name, lineno):
        # Ignore _, _x (pylint convention), __x, __x__ (special method).
        if name not in IGNORED_VARIABLE_NAMES and not name.startswith('_'):
            self.defined_vars.append(
                Item(name, 'variable', self.file, lineno))

    @staticmethod
    def _get_lineno(node):
        return getattr(node, 'lineno', 1)

    def _get_line(self, node):
        return self.code[self._get_lineno(node) - 1] if self.code else ''

    def _get_item(self, node, typ):
        name = getattr(node, 'name', None)
        id_ = getattr(node, 'id', None)
        attr = getattr(node, 'attr', None)
        assert bool(name) ^ bool(id_) ^ bool(attr), (typ, dir(node))
        return Item(name or id_ or attr, typ, self.file, node.lineno)

    def log(self, *args):
        if self.verbose:
            print(*args)

    def print_node(self, node):
        # Only create the strings if we'll also print them.
        if self.verbose:
            self.log(
                self._get_lineno(node), ast.dump(node), self._get_line(node))

    def visit_arg(self, node):
        """Function argument. Python 3 only. Has lineno since Python 3.4"""
        self._define_variable(node.arg, getattr(node, 'lineno', -1))

    def visit_FunctionDef(self, node):
        for decorator in node.decorator_list:
            if getattr(decorator, 'id', None) == 'property':
                self.defined_props.append(self._get_item(node, 'property'))
                break
        else:
            # Function is not a property.
            if not _ignore_function(node.name):
                self.defined_funcs.append(self._get_item(node, 'function'))

    def visit_Attribute(self, node):
        item = self._get_item(node, 'attribute')
        if item not in IGNORED_ATTRIBUTE_NAMES:
            if isinstance(node.ctx, ast.Store):
                self.defined_attrs.append(item)
            elif isinstance(node.ctx, ast.Load):
                self.used_attrs.append(item)

    def visit_Name(self, node):
        if (isinstance(node.ctx, ast.Load) and
                node.id not in IGNORED_VARIABLE_NAMES):
            self.used_vars.append(node.id)
        elif isinstance(node.ctx, (ast.Param, ast.Store)):
            self._define_variable(node.id, node.lineno)

    @staticmethod
    def visit_alias(node):
        """
        Use the methods below for imports to have access to line numbers
        and to filter imports from __future__.
        """
        pass

    def visit_Import(self, node):
        self._add_aliases(node)

    def visit_ImportFrom(self, node):
        if node.module != '__future__':
            self._add_aliases(node)

    def _add_aliases(self, node):
        assert isinstance(node, (ast.Import, ast.ImportFrom))
        for name_and_alias in node.names:
            alias = name_and_alias.asname
            if alias is not None:
                name = name_and_alias.name
                self.log('names_imported_as_aliases <- %s' % name)
                self.names_imported_as_aliases.append(name)

    def _find_tuple_assigns(self, node):
        # Find all tuple assignments. Those have the form
        # Assign->Tuple->Name or For->Tuple->Name or comprehension->Tuple->Name
        for child in ast.iter_child_nodes(node):
            if not isinstance(child, ast.Tuple):
                continue
            for grandchild in ast.walk(child):
                if (isinstance(grandchild, ast.Name) and
                        isinstance(grandchild.ctx, ast.Store)):
                    self.log('tuple_assign_vars <-', grandchild.id)
                    self.tuple_assign_vars.append(grandchild.id)

    def visit_Assign(self, node):
        self._find_tuple_assigns(node)

    def visit_For(self, node):
        self._find_tuple_assigns(node)

    def visit_comprehension(self, node):
        self._find_tuple_assigns(node)

    def visit_ClassDef(self, node):
        if not _ignore_function(node.name):
            self.defined_funcs.append(self._get_item(node, 'class'))

    def visit_str(self, node):
        """
        Variables may appear in format strings:

        '%(my_var)s' % locals()
        '{my_var}'.format(**locals())

        """
        for pattern in FORMAT_STRING_PATTERNS:
            self.used_vars.extend(pattern.findall(node.s))

    def visit(self, node):
        try:
            method = 'visit_' + node.__class__.__name__
            visitor = getattr(self, method, None)
            if visitor is not None:
                self.print_node(node)
                visitor(node)
            return self.generic_visit(node)
        except Exception as error:
            print(error)


def get_trees():
    """Получить набор последних веток с тестами"""

    cur_dir = os.path.dirname(os.path.realpath(__file__))
    # products = ('reg', 'int')
    # path_reg, path_int = [os.path.join(cur_dir, pr) for pr in products]
    #
    # excl = Config().get('EXCLUDE_PATHS').split(',')
    # reg_trees = [os.path.join(path_reg, item) for item in os.listdir(path_reg)
    #              if os.path.isdir(os.path.join(path_reg, item)) and item not in excl]
    # int_trees = [os.path.join(path_int, item) for item in os.listdir(path_int)
    #                  if os.path.isdir(os.path.join(path_int, item)) and item not in excl]
    # trees = (reg_trees, int_trees)
    # log('--------------- СУЩЕСТВУЮЩИЕ ВЕТКИ ---------------')
    # for tr in trees:
    #     log(tr)
    # log('--------------------------------------------------')
    #
    # tree_list = []
    # for tr in trees:
    #
    #     [tree_list.append(folder) for folder in tr ]
    # log('--------------- ПРОВЕРЯЕМЫЕ ВЕТКИ ---------------')
    # log(tree_list)
    # log('--------------------------------------------------')
    #
    # return tree_list

    return (os.path.join(cur_dir, 'int'), os.path.join(cur_dir, 'reg'))

class TestDeadCodeSearch(TestCase):
    """Поиск мёртвого кода"""

    @classmethod
    def setup_class(cls):
        cls.vulture = Vulture(exclude=cls.config.get('EXCLUDE_PATHS'), verbose=cls.config.get('VERBOSE'))
        cls.vulture.scavenge(get_trees(), exclude_files=cls.config.get('EXCLUDE_FILES'))

    def test_01_dead_methods(self):
        """Проверяем на наличие мёртвых методов"""

        log('Выводим список мёртвых методов')
        file_name = 'unused_functions.log'
        result = self.vulture.report(self.vulture.unused_funcs, file_name)
        log('КОЛИЧЕСТВО МЕРТВЫХ МЕТОДОВ: {}'.format(len(self.vulture.unused_funcs)))
        log('Отчёт: {}'.format(os.path.join(self.config.get('HTTP_PATH'), file_name)))
        assert_that(result, is_(False), 'Найдены мёртвые методы!')

    def test_02_dead_properties(self):
        """Проверяем на наличие мёртвых свойств"""

        log('Выводим список мёртвых свойств')
        file_name = 'unused_properties.log'
        result = self.vulture.report(self.vulture.unused_props, file_name)
        log('КОЛИЧЕСТВО МЕРТВЫХ СВОЙСТВ: {}'.format(len(self.vulture.unused_props)))
        log('Отчёт: {}'.format(os.path.join(self.config.get('HTTP_PATH'), file_name)))
        assert_that(result, is_(False), 'Найдены мёртвые свойства!')

    def test_03_dead_variables(self):
        """Проверяем на наличие мёртвых переменных"""

        log('Выводим список мёртвых переменных')
        file_name = 'unused_variables.log'
        result = self.vulture.report(self.vulture.unused_vars, file_name)
        log('КОЛИЧЕСТВО МЕРТВЫХ ПЕРЕМЕННЫХ: {}'.format(len(self.vulture.unused_vars)))
        log('Отчёт: {}'.format(os.path.join(self.config.get('HTTP_PATH'), file_name)))
        assert_that(result, is_(False), 'Найдены мёртвые переменные!')

    def test_04_dead_attributes(self):
        """Проверяем на наличие мёртвых атрибутов"""

        log('Выводим список мёртвых атрибутов')
        file_name = 'unused_attributes.log'
        result = self.vulture.report(self.vulture.unused_attrs, file_name)
        log('КОЛИЧЕСТВО МЕРТВЫХ АТРИБУТОВ: {}'.format(len(self.vulture.unused_attrs)))
        log('Отчёт: {}'.format(os.path.join(self.config.get('HTTP_PATH'), file_name)))
        assert_that(result, is_(False), 'Найдены мёртвые атрибуты!')

    def test_05_dead_imports(self):
        """Проверяем на наличие мёртвых импортов"""

        log('Выводим список мёртвых импортов')
        file_name = 'unused_imports.log'
        result = self.vulture.report(self.vulture.unused_imports, file_name)
        log('КОЛИЧЕСТВО МЕРТВЫХ ИМПОРТОВ: {}'.format(len(self.vulture.unused_imports)))
        log('Отчёт: {}'.format(os.path.join(self.config.get('HTTP_PATH'), file_name)))
        assert_that(result, is_(False), 'Найдены мёртвые импорты!')


if __name__ == '__main__':
    run_tests()
