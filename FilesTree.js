var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var moduleName=process.argv[2];//Name of module
var modulePath=path.resolve(moduleName);//Absolute path of module
var theme=process.argv[3];
var dirName=moduleName+'-'+theme+'-'+'theme';//Name of directory with theme
var dirPath=path.resolve(dirName);//Absolute path to directory
var addDownLine = process.argv[4];//add files with _ in path if  value is true
function CreateDir( dPath ) {

    fs.access(dPath, function(err){
        if(err) {
            fs.mkdir(dPath, {recursive: true}, (err) => {
                if (err) throw err;
            });
        }
    });
}
CreateDir(dirPath);
function getFiles(modulePath, callback) {
    fs.readdir(modulePath, function(err, files) {
        if (err) {
            return callback(err);
        }
        var filePaths = [];
        async.eachSeries(files, function(fileName, eachCallback) {
            var filePath = path.join(modulePath, fileName);//filePath - absolute path to file

            fs.stat(filePath, function(err, stat) {
                if (err) {
                    return eachCallback(err);
                }
                if ((filePath.indexOf('_') === -1)||(addDownLine==='true')) {
                    if (stat.isDirectory()) {
                        let separator=moduleName+'\\';
                        var newDirPath=dirPath+'\\'+filePath.split(separator)[1];
                        CreateDir(newDirPath);
                        getFiles(filePath, function(err, subDirFiles) {
                            if (err|| !(/\.less$/.test(subDirFiles))) {
                                fs.remove(newDirPath,function (err) {
                                    if (err) throw err;

                                });
                                return eachCallback(err);
                            }
                            filePaths = filePaths.concat(subDirFiles);
                            eachCallback(null);
                        });
                    } else {
                        if (stat.isFile() && /\.less$/.test(filePath)) {

                            filePaths.push(filePath);
                            let separator=moduleName+'\\';
                            var newFilePath=dirPath+'\\'+filePath.split(separator)[1];
                            var relativeFilePath=filePath.split(separator)[1];//relative path,root directory -moduleName,uses for resolve path to the _theme.less
                            filePath=filePath.split('\\');
                            var count=relativeFilePath.split('\\').length;
                            var content='@import ' + '"' + filePath.join('/').split("controls/")[1]+ '";';
                            content+= '\n' + '@import  ' + '"';
                            if(count===1)
                            {
                                content += './';
                            }
                            while ( count>1 )
                            {
                                content +='../';
                                count--;
                            }
                            content += '_theme.less";';
                            fs.writeFile(newFilePath,content,function(err){
                                if (err) throw err;
                            });

                        }

                        eachCallback(null);
                    }
                } else {
                    return eachCallback(err);
                }
            });
        }, function(err) {
            callback(err, filePaths);
        });
    });
}
getFiles(modulePath, function(err, files) {
    console.log(err || files);
});
