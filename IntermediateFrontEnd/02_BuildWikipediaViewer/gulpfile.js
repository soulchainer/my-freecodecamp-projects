var postcss = require('gulp-postcss');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var install = require("gulp-install");
var reload = browserSync.reload;

var src = {
    styles: './src/css/*.css',
    css:  'app/css',
    scripts: './src/js/*.js',
    js: 'app/js',
    vendor: 'app/vendor'
};
// Copy bower assets in vendor folder, with subfolders for each type
gulp.task('bower', function() {
  var jsFilter = gulpFilter('*.js');
  return gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(src.vendor + '/js/'));
});
// Process the app own JavaScript
gulp.task('scripts', function(){
  return gulp.src(src.scripts)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(src.js));
});
// Process CSS files with PostCSS
gulp.task('styles', function () {
    var processors = [
        autoprefixer('last 2 versions'),
        precss
    ];
    return gulp.src(src.styles)
      .pipe(sourcemaps.init())
      .pipe(postcss(processors))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(src.css));
});
// Serve and watch for changes in files
gulp.task('serve', function() {
  browserSync({
      server: "./app"
  });
  var appFiles = ['app/*', 'app/js/*', 'app/css/*', 'app/assets/*',
                  'app/templates/*'];
  gulp.watch(src.scripts, ['scripts']);
  gulp.watch(src.styles, ['styles']);
  gulp.watch(appFiles).on('change',reload);
});
// Install bower and npm packages
gulp.task('install', function() {
  gulp.src(['./bower.json', './package.json'])
  .pipe(install());
});

gulp.task('default', ['bower', 'scripts', 'styles', 'serve']);
