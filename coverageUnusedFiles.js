var path = require('path'),
    fs = require('fs'),
    nyc = require('nyc'),
    componentsPath = path.join(__dirname, 'components'),
    controlsPath = path.join(__dirname, 'Controls'),
    coveragePath = path.join(__dirname, 'artifacts', 'coverage.json'),
    coverageAllPath = path.join(__dirname, 'artifacts', 'coverageAll.json'),
    coverageControlsPath = path.join(__dirname, 'artifacts', 'coverageControls.json'),
    coverageComponentsPath = path.join(__dirname, 'artifacts', 'coverageComponents.json'),
    allFiles = [];

dirWalker = function (dir) {
    var pattern = /\.js$/,
        files = fs.readdirSync(dir),
        newPath = '';
    for (var i = 0; i < files.length; i++) {
        newPath = path.join(dir, files[i]);
        if (fs.statSync(newPath).isDirectory()) {
            dirWalker(newPath);
        } else {
            if (pattern.test(files[i])) {
                allFiles.push(newPath);
            }
        }
    }
};

dirWalker(componentsPath);
dirWalker(controlsPath);

var rawCover = fs.readFileSync(coveragePath, 'utf8'),
    cover = JSON.parse(rawCover),
    newCover = JSON.parse("{}"),
    instrumenter = new nyc().instrumenter(),
    transformer = instrumenter.instrumentSync.bind(instrumenter);

allFiles.forEach(function (name) {
    var replacer = null;
    if (name.contains('Controls')){
        replacer = controlsPath;
    } else if (name.contains('components')){
        replacer = componentsPath
    }
    var coverName = name.replace(replacer, '').slice(1);
    console.log(name);
//    if (!cover[coverName]) {
//        var rawFile = fs.readFileSync(name, 'utf-8');
//        transformer(rawFile, name);
//        var coverState = instrumenter.lastFileCoverage();
//        Object.keys(coverState.s).forEach(function (key) {
//           coverState.s[key] = 0;
//        });
//        nycCover = coverState;
//        nycCover['path'] = name;
//        newCover[name] = nycCover;
//        console.log('File ' + name + ' not using in tests')
//    } else {
//        nycCover = cover[coverName];
//        nycCover['path'] = name;
//        newCover[name] = nycCover;
//    }
});

//fs.writeFileSync(coverageAllPath, JSON.stringify(newCover), 'utf8');
//
//function getCoverByPath(path) {
//    var coverageByPath = {};
//    Object.keys(newCover).forEach(function (name) {
//        if (name.includes(path)) {
//            coverageByPath[name] = newCover[name]
//        }
//    });
//    return coverageByPath
//}
//
//var componentsCoverage = getCoverByPath(componentsPath),
//    controlsCoverage = getCoverByPath(controlsPath);
//
//fs.writeFileSync(coverageControlsPath, JSON.stringify(controlsCoverage), 'utf8');
//fs.writeFileSync(coverageComponentsPath, JSON.stringify(componentsCoverage), 'utf8');