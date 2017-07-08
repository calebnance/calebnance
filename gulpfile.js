var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var notifier = require('node-notifier');
var sass = require('gulp-sass');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

var distFolder = '_dist';

var mainTasks = [
  'clean',
  'sass',
  'html',
  'img',
  'pwa'
];

var devTasks = [
  'watch'
];

var prodTasks = [];

// distribution gulp task
gulp.task('dist', ['clean'], function() {

  gulp.start('html', 'sass');

});

// clean up old dist folder
gulp.task('clean', function() {

  return del(
    [
      distFolder + '/*.html',
      distFolder + '/css'
    ]
  );
});

// html task (minification)
gulp.task('html', function() {

  return gulp.src('*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./' + distFolder));
});

// sass to css (autoprefixer + minification + rename)
gulp.task('sass', function() {
  gulp.src(['./src/scss/main.scss'])
  .pipe(sass().on('error', notifyDev))
  .pipe(autoprefixer({
    browsers: [
      'Chrome >= 25', // released 2013-02-21
      'Firefox >= 25', // released 2013-10-29
      'Explorer >= 10', // released 2012-10-26
      'Opera >= 15', // released 2013-07-02
      'Safari >= 5' // released 2010-06-07
    ],
    cascade: false
  }))
  .pipe(cleanCSS())
  .pipe(rename({
    basename: 'styles.min'
  }))
  .pipe(gulp.dest('./' + distFolder + '/css'));
});

gulp.task('img', function() {

  return gulp.src('./src/assets/img/**')
    .pipe(gulp.dest('./' + distFolder + '/img'));
});

/*******
 * PWA *
 *******/
gulp.task('pwa', ['manifest', 'serviceWorker'], function() {

  return gulp.src('./manifest.json')
    .pipe(gulp.dest('./' + distFolder));
});

gulp.task('manifest', function() {
  // move this to root (_dist)

  return gulp.src('./src/server/manifest.json')
    .pipe(gulp.dest('./' + distFolder));
});

gulp.task('serviceWorker', function() {
  // move this to root (_dist)

  return gulp.src('./src/js/service-worker.js')
    .pipe(gulp.dest('./' + distFolder));
});

// this will notify the dev working.. something is wrong
// with a visual and sound! i don't care how loud your music is sir...
function notifyDev(error) {
  // if you want details of the error in the console
  // console.log(error.toString());

  // display a message to the dev!
  notifier.notify({
    'contentImage': 'logo.png',
    'icon': false,
    'message': 'Check that code son..',
    'sound': 'Basso',
    'timeout': 10,
    'title': 'calebnance.com',
    'wait': true
  });

  // doesn't kill the build with error..
  this.emit('end');
}
