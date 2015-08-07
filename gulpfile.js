var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-ruby-sass');
var zip = require('gulp-zip');
var size = require('gulp-size');
var eslint = require('gulp-eslint');
var colors = require('colors');

// default task - lint the js
gulp.task('default', ['lint'], function() {
  console.log('JavaScript passed the lint!'.green);
});

// build task
gulp.task('build', ['compress', 'minify', 'sass', 'cssmin']);

// zip up everything.
// to be done last...
gulp.task('zip', function() {
  return gulp.src('./dist/*')
    .pipe(zip('min.zip'))
    .pipe(size({ title: 'full zip'}))
    .pipe(gulp.dest('./release'));
});

// The background tasks
gulp.task('lint', function() {
  return gulp.src(['./game.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('compress', function() {
  return gulp.src('./game.js')
    // update the copy in the src folder
    .pipe(gulp.dest('./release/src'))
    // uglify the javascript
    .pipe(uglify())
    .pipe(size({ title: 'game.js'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
  return gulp.src('./index.html')
    // update the copy in the src folder
    .pipe(gulp.dest('./release/src'))
    // minify the HTML
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(size({ title: 'index.html' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
  return sass('styles.scss', { style: 'expanded'})
    .pipe(gulp.dest('./'))
    // update the copy in the src folder
    .pipe(gulp.dest('./release/src'));
});

gulp.task('cssmin', function() {
  return gulp.src('./styles.css')
    .pipe(cssmin())
    .pipe(size({ title: 'styles.css'}))
    .pipe(gulp.dest('dist'));
});
