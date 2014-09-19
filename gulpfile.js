var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),

    SRC_DIR = 'src';

gulp.task('run-and-watch', function () {
    return nodemon({
        script: SRC_DIR + '/index.js',
        options: '--harmony',
        execMap: {
            js: 'node --harmony'
        },
        watch: [SRC_DIR],
        ext: 'js'
    });
});

gulp.task('default', [
    'run-and-watch'
]);
