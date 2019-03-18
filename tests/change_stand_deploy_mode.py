#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
Меняет deployment_type в InTest.s3deploy
"""

import argparse
import xml.etree.ElementTree as ET
import os


def main(stand, mode):
    """Обрабатываем InTest.s3deploy"""
    file_name = os.path.join(stand, 'InTest.s3deploy')
    tree = ET.parse(file_name)
    root = tree.getroot()
    root.attrib['deployment_type'] = mode
    tree.write(file_name, xml_declaration=True, encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--stand', help='Full path to stand')
    parser.add_argument('-m', '--mode', help='Deploy mode')
    arg = parser.parse_args()
    main(arg.stand, arg.mode)