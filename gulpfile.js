var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var gulp = require('gulp');
var gzip = require('gulp-gzip');
var htmlmin = require('gulp-htmlmin');
var minifyInline = require('gulp-minify-inline');
var notifier = require('node-notifier');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

var isProduction = process.env.NODE_ENV === 'production' ? true : false;
var distFolder = isProduction ? 'dist_prod' : 'dist_local';


var mainTasks = [
  'clean',
  'sass',
  'html',
  'img',
  'htaccess',
  'pwa'
];

var devTasks = [
  'server',
  'watch'
];

var prodTasks = [];

// start dev server (express)
gulp.task('server', shell.task(['nodemon server.js']));

// distribution gulp task + watch
gulp.task('dist', ['clean'], function() {

  if (isProduction) {
    gulp.start(mainTasks.concat(prodTasks));
  } else {
    gulp.start(mainTasks.concat(devTasks));
  }
  
});

/***************
 * watch tasks *
 ***************/
gulp.task('watch', [
  'js:watch',
  'sass:watch',
  'html:watch'
]);

/* js watch */
gulp.task('js:watch', function() {
  gulp.watch('./src/js/**/*.js', ['js']);
});

/* sass watch */
gulp.task('sass:watch', function() {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});

/* html watch */
gulp.task('html:watch', function() {
  gulp.watch('./src/**/*.html', ['html']);
});

// clean up old dist folder
gulp.task('clean', function() {

  return del(['dist_prod', 'dist_local']);
});

// html task (minification)
gulp.task('html', function() {

  return gulp.src('./src/html/*.html')
    .pipe(minifyInline())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(distFolder + '/'));
});

// sass to css (autoprefixer + minification + rename)
gulp.task('sass', function() {

  return gulp.src('./src/scss/main.scss')
    .pipe(sass().on('error', notifyDev))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }).on('error', notifyDev))
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'styles.min'
    }))
    // .pipe(gzip({
    //   append: false
    // }))
    .pipe(gulp.dest('./' + distFolder + '/css'));
});

gulp.task('img', function() {

  return gulp.src('./src/assets/img/**')
    .pipe(gulp.dest(distFolder + '/img'));
});

/*******
 * PWA *
 *******/
gulp.task('pwa', ['manifest', 'serviceWorker'], function() {

  return gulp.src('./manifest.json')
    .pipe(gulp.dest(distFolder));
});

gulp.task('manifest', function() {
  // move this to root (dist)

  return gulp.src('./src/server/manifest.json')
    .pipe(gulp.dest(distFolder));
});

gulp.task('serviceWorker', function() {
  // move this to root (dist)

  return gulp.src('./src/js/service-worker.js')
    .pipe(gulp.dest(distFolder));
});

// .htaccess moved over
gulp.task('htaccess', function() {
  // move this to root (dist)

  return gulp.src('./src/server/.htaccess')
    .pipe(gulp.dest(distFolder));
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
