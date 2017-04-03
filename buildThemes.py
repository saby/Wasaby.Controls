import os
import os.path
import subprocess
import platform


def process_file(name):
    css_name = name[:-4] + "css"
    # https://docs.python.org/3/library/subprocess.html#subprocess.call
    print(name)
    util = "lessc"
    if platform.system() == "Windows":
        util = os.path.join("build","duncansmart-less","lessc.cmd")
    else:
        util = "lessc"
    subprocess.call([util, name, css_name])


def main():
    # for root, dirs, files in os.walk(r'themes'):
    #    for dirname in dirs:
    #       fname = os.path.join(root, dirname, os.path.basename(dirname) + \
    #                            ".less")
    #       if os.path.exists(fname):
    #          process_file(fname)

    # INSTALLING GRUNT LOCALY
    if platform.system() == "Windows":
        shell = True
    else:
        shell = False
    subprocess.call(["npm", "config", "set", "registry", "http://npmregistry.sbis.ru/"], shell=shell)
    subprocess.call(['npm', 'install'], shell=shell)
    subprocess.call(['npm', 'install', 'grunt'], shell=shell)
    subprocess.call(['npm', 'install', 'grunt-cli'], shell=shell)
    subprocess.call(['npm', 'install', 'async'], shell=shell)
    subprocess.call(['node', 'node_modules/grunt-cli/bin/grunt', 'css'], shell=shell)


if __name__ == "__main__":
    main()
