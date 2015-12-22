// Define plugins
var gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    babelify = require("babelify"),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    precss = require('precss'),
    source = require('vinyl-source-stream');
var bs = require('browser-sync').create();
var $ = require('gulp-load-plugins')();

var reload = bs.reload();

// Process the app JavaScript (own and required)
gulp.task('scripts', function() {
    var b = browserify({
      entries: './src/js/app.js',
      debug: true
    });

    return b.transform(babelify)
      .bundle()
      .pipe(source('./app.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .on('error', $.util.log)
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./app/js'));
});
// Process CSS files with PostCSS
gulp.task('styles', function () {
  var processors = [
    autoprefixer('last 2 versions'),
    precss
  ];

  return gulp.src('./src/css/*.css')
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.postcss(processors))
      .pipe($.minifyCss())
      .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./app/css'));
});

// Serve and watch for changes in files
gulp.task('serve', function() {
  bs.init({
    server: "./app"
  });
  var appFiles = ['./app/*', './app/js/*', './app/css/*'];
  gulp.watch('./src/js/*.js', ['scripts']);
  gulp.watch('./src/css/*.css', ['styles']);
  gulp.watch(appFiles).on('change',reload);
});

gulp.task('default', ['scripts', 'styles', 'serve']);
