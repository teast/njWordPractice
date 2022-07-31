module.exports = async function(context) {
    const script_executer = require('./script_executer.js');

    const path = require('path');
    const {execSync} = require('child_process');
    const browserify = require('browserify');
    const gulp = require('gulp');
    const source = require('vinyl-source-stream');
    const buffer = require('vinyl-buffer');
    const sourcemaps = require('gulp-sourcemaps');
    const gutil = require('gulp-util');
    
    await script_executer(async root_path => {
        return new Promise(resolve => {
            const ts_file = root_path + '/js/index.ts';
            const js_file = root_path + '/js/index.js';
            // Compile typescript
            execSync(`npx tsc -m commonjs --target es5 --sourceMap true ${ts_file}`);


            // Browserify (combine all js files into one)

            const b = browserify({
                entries: js_file,
                debug: false,
            });
            var t = b.bundle()
                .pipe(source('bundle.js'))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
                    .on('error', gutil.log)
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(root_path + '/js/'));

            t.on('end', () => {
                // Remove all files that is not wanted
                const fs = require('fs');
                const js_path = path.join(root_path, 'js');
                fs.readdirSync(js_path).map(file => {
                    if (file.toLowerCase() == 'bundle.js' || file.toLowerCase() == 'bundle.js.map') {
                        return;
                    }

                    const path_file = path.join(js_path, file);
                    fs.rmSync(path_file, { recursive: true, force: true });
                });

                resolve();
            });
        });
    }, context);
}

