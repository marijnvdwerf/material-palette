var babelify = require('babelify');
var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var through2 = require('through2');

gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('build:bower', ['clean'], function() {
    return gulp.src('./lib/Palette.js')
        .pipe(through2.obj(function(file, enc, next) {
            browserify({
                entries: file.path,
                debug: true,
                standalone: 'Palette'
            })
                .transform(babelify)
                .bundle(function(err, res) {
                    // assumes file.contents is a Buffer
                    file.contents = res;
                    next(null, file);
                });
        }))
        .pipe(rename('palette.js'))
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'))

});

gulp.task('uglify:bower', ['build:bower'], function() {
    return gulp.src('./dist/palette.js')
        .pipe(uglify())
        .pipe(rename('palette.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build:bower', 'uglify:bower']);
gulp.task('default', ['build']);
