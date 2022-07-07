module.exports = function(context) {
    const path = require('path');
    const {exec} = require('child_process');
    const glob = require('glob');

    const project_root = context.opts.projectRoot;
    const src = path.join(project_root, 'src');
    const dst = path.join(project_root, 'www');

    // Make sure glob have time to run
    let done = false;

    //console.log('searching for "' + src + '/**/*.ts' + '"');
    //glob(src + '/**/*.ts', function(err, files) {
    //    console.log('files', files);
    //    done = true;
    //});

    exec("npx webpack", (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        console.log(`stdout: ${stdout}`);

        done = true;
    });

    // Make sure glob have time to run
    return new Promise(resolve => {
        let counter = 0;
        const ticker = setInterval(() => {
            counter++;
            if (done || counter > 3000) { // Wait 30 seconds at most for webpack
                clearInterval(ticker);
                resolve();
            }
        }, 10);
    }).then(_ => {
        console.log('t', dst);
    })

}