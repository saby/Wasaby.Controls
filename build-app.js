var root = process.cwd(),
   fs = require('fs'),
   path = require('path');

function getBuildMode(gultConfig) {
   return gultConfig.minimize ? 'release' : 'debug';
}

var gultConfig = require('./buildTemplate.json');
var buildMode = getBuildMode(gultConfig);
var gultConfigStringified = JSON.stringify(gultConfig);
gultConfigStringified = gultConfigStringified.replace(/%cd%/ig, root).replace(/\\/ig, '/');

if (!fs.existsSync(path.join(root, 'application'))) {
   fs.mkdirSync(path.join(root, 'application'));
}
if (!fs.existsSync(path.join(root, 'application', 'resources'))) {
   fs.mkdirSync(path.join(root, 'application', 'resources'));
}

fs.writeFile(path.join(root, 'builderCfg.json'), gultConfigStringified, function(){
   const { spawn } = require('child_process');

   const child = spawn('node',[
      root+'/node_modules/gulp/bin/gulp.js',
      '--gulpfile', root+'/node_modules/sbis3-builder/gulpfile.js',
      'build',
      '--config='+root+'/builderCfg.json',
      '-LLLL'
   ]);

   child.stdout.on('data', (data) => {
         console.log(`${data}`);
   });

      child.stderr.on('data', (data) => {
         console.log(`ERROR: ${data}`);
   });


   child.on('exit', function (code, signal) {
      console.log('child process exited with ' +
         `code ${code} and signal ${signal}`);

      gultConfigStringified = JSON.parse(gultConfigStringified);
      gultConfigStringified.modules.forEach((one) => {
         let oldName = one.path.split('/');
         oldName = oldName[oldName.length - 1];
         if (one.name !== oldName) {
            fs.renameSync(path.join(root, 'application', oldName), path.join(root, 'application', 'tempName'));
            fs.renameSync(path.join(root, 'application', 'tempName'), path.join(root, 'application', one.name));
         }
      });

      const allJson = {links: {}, nodes: {}};
      const contents = { buildMode: buildMode, modules: {} };
      const bundles = {};

      gultConfigStringified.modules.forEach((one) => {
         if (one.name.indexOf('WS.Core') === -1)
         {
            let fileName = path.join(root, 'application', one.name, 'module-dependencies.json');
            if (fs.existsSync(fileName)) {
               let oneJson = require(fileName);

               for (let i in oneJson.links) {
                  allJson.links[i] = oneJson.links[i];
               }

               for (let j in oneJson.nodes) {
                  allJson.nodes[j] = oneJson.nodes[j];
               }
            }
         }
      });

      if (!fs.existsSync(path.join(root, 'application', 'resources'))) {
         fs.mkdirSync(path.join(root, 'application', 'resources'));
      }

      fs.writeFileSync(path.join(root, 'application', 'contents.js'),
         'contents = ' + JSON.stringify(contents, '', 3)+';' );
      fs.writeFileSync(path.join(root, 'application', 'contents.json'),
         JSON.stringify(contents, '', 3) );
      try {
         fs.linkSync(path.join(root, 'application', 'contents.js'), path.join(root, 'application', 'contents.min.js'));
         fs.linkSync(path.join(root, 'application', 'contents.json'), path.join(root, 'application', 'resources', 'contents.min.json'));
         fs.linkSync(path.join(root, 'application', 'contents.json'), path.join(root, 'application', 'resources', 'contents.json'));
      }
      catch (e) {
         console.log('Couldn\'n create symlink to content.js: ' + e);
      }
      fs.writeFileSync(path.join(root, 'application', 'bundles.js'),
         'bundles = ' + JSON.stringify(bundles, '', 3)+';' );

      fs.writeFileSync(path.join(root, 'application', 'resources', 'module-dependencies.json'),
         JSON.stringify(allJson, '', 3).replace(/ws\/core/ig, 'WS.Core/core').replace(/resources\//i, ''));
   });

});
