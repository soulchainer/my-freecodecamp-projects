var autoprefixer = require('autoprefixer');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var install = require("gulp-install");
var postcss = require('gulp-postcss');
var precss = require('precss');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var cleancss = require('gulp-minify-css');

var reload = browserSync.reload;

// Process the app JavaScript (own and required)
gulp.task('scripts', function() {
  var b = browserify({
    entries: './src/js/app.js',
    debug: true
  });

  return b.ignore('crypto').bundle()
    .pipe(source('./app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/js'));
});
// Process CSS files with PostCSS
gulp.task('styles', function () {
  var processors = [
    autoprefixer('last 2 versions'),
    precss
  ];

  return gulp.src('./src/css/*.css')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(postcss(processors))
      .pipe(cleancss())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/css'));
});

// Serve and watch for changes in files
gulp.task('serve', function() {
  browserSync({
      server: "./app"
  });
  var appFiles = ['./app/*', './app/js/*', './app/css/*'];
  gulp.watch('./src/js/*.js', ['scripts']);
  gulp.watch('./src/css/*.css', ['styles']);
  gulp.watch(appFiles).on('change',reload);
});
// Install npm packages
gulp.task('install', function() {
  gulp.src(['./package.json'])
  .pipe(install());
});

gulp.task('default', ['install', 'scripts', 'styles', 'serve']);
