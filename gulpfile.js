var gulp = require('gulp');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');

gulp.task('dist', ['clean'], function() {

  gulp.start('html', 'css');

});

gulp.task('clean', function() {

  return del(['_dist/*.html', '_dist/css']);
});

gulp.task('html', function() {

  return gulp.src('*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('_dist'));
});

gulp.task('css', function() {

  return gulp.src('css/*.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('_dist/css'));
});
