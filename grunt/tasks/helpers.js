'use strict';

const minimatch = require('minimatch');
const async = require('async');
const path = require('path');
const fs = require('fs');


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


module.exports = {
    recurse: _recurse,
    validateFile: _validateFile
};
