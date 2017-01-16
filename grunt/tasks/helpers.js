'use strict';

const minimatch = require('minimatch');
const esprima = require('esprima');
const mkdirp = require('mkdirp');
const async = require('async');
const path = require('path');
const fs = require('fs');

function _writeFile(dest, data, cb) {
    let options = {flag: 'wx'};

    let writeFile = function (dest, data, options, cb) {
        fs.writeFile(dest, data, options, function (err) {
            if (err && err.code === 'ENOENT') {
                mkdirp(path.dirname(dest), function (err) {
                    if (!err || err.code === 'EEXIST') {
                        writeFile(dest, data, options, cb);
                    } else {
                        console.log(`[ERROR]: ${err}`);
                        cb();
                    }
                });
            } else if (err && err.code !== 'EEXIST') {
                console.log(`[ERROR]: ${err}`);
                cb();
            } else {
                cb();
            }
        });
    };

    writeFile(dest, data, options, cb);
}

function _copyFile(target, dest, data, cb) {
    if (data) {
        _writeFile(dest, data, cb);
    } else {
        fs.readFile(target, (err, data) => {
            if (err) {
                console.log(`[ERROR]: ${err}`);
                cb();
            } else {
                _writeFile(dest, data, cb);
            }
        });
    }
}

function _mkSymlink(target, dest, cb) {
    let link = function (target, dest, cb) {
        fs.symlink(target, dest, (err) => {
            if (err && err.code === 'ENOENT') {
                mkdirp(path.dirname(dest), (err) => {
                    if (!err || err.code === 'EEXIST') {
                        link(target, dest, cb);
                    } else {
                        console.log(`[ERROR]: ${err}`);
                        cb();
                    }
                });
            } else if (err && err.code !== 'EEXIST') {
                console.log(`[ERROR]: ${err}`);
                cb();
            } else {
                cb();
            }
        });
    };

    link(target, dest, cb);
}

function _recurse(input, handler, done) {
    fs.readdir(input, function (err, files) {
        if (!err) {
            async.eachLimit(files, 10, function (file, cb) {
                let abspath = path.join(input, file);

                fs.lstat(abspath, function (err, stats) {
                    if (!err) {
                        if (stats.isDirectory()) {
                            _recurse(abspath, handler, cb);
                        } else {
                            handler(abspath, cb);
                        }
                    } else {
                        cb(err);
                    }
                });
            }, function (err) {
                done(err);
            });
        }
    });
}

function _validateFile(file, patterns) {
    let passed = true;

    for (let i = 0; i < patterns.length; i++) {
        if (!minimatch(file, patterns[i])) {
            passed = false;
            break;
        }
    }

    return passed;
}

function _parseModule(module) {
    let res;
    try {
        res = esprima.parse(module);
    } catch (e) {
        res = e;
    }
    return res;
}

function _percentage(x, all) {
    return Math.floor((x * 100) / all);
}

function _sortObject(obj, comparator) {
    let sorted = {};
    Object.keys(obj)
        .sort(comparator)
        .forEach(function (key) {
            let val = obj[key];
            if (Array.isArray(val)) {
                sorted[key] = val.sort();
            } else  if (val instanceof Object){
                sorted[key] = _sortObject(val, comparator);
            } else {
                sorted[key] = val;
            }
        });
    return sorted;
}

module.exports = {
    writeFile: _writeFile,
    copyFile: _copyFile,
    mkSymlink: _mkSymlink,
    recurse: _recurse,
    validateFile: _validateFile,
    parseModule: _parseModule,
    percentage: _percentage,
    sortObject: _sortObject
};