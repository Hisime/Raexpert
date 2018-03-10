const gulp = require('gulp');
const less = require('gulp-less');
const plumberNotifier = require('gulp-plumber-notifier');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cleanss = require('gulp-cleancss');//css uglifier
const uglify = require('gulp-uglify');//js uglifier
const browserSync = require('browser-sync').create();
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const fileinclude = require('gulp-file-include');
const imagemin = require('gulp-imagemin');
const run = require('run-sequence');
const del = require('del');
const concat = require('gulp-concat');
const posthtml = require("gulp-posthtml");
const include = require('posthtml-include');

const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const path = require('path');
const cheerio = require('gulp-cheerio');


// LESS compile
gulp.task('less', function () {
  return gulp.src('src/less/style.less')
    .pipe(plumberNotifier())
    .pipe(less())
    .pipe(postcss([
        autoprefixer({browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 10",
          "iOS >= 6",
          "Opera >= 11",
          "Safari >= 4"
          ]}),
        mqpacker ({
          sort: true
        })
    ]))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(cleanss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('lessPlugins', function () {
  return gulp.src('./src/less/plugins.less')
    .pipe(less())
    .pipe(cleanss())
    .pipe(rename('plugins.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(plumberNotifier())
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('concat-jsPlugins', function(){
  return gulp.src('src/js/plugins/*.js')
    .pipe(concat('plugins.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(plumberNotifier())
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*.{png,jpg,svg}')
/*    .pipe(plumberNotifier())
    .pipe(imagemin([
       imagemin.optipng({optimizationLevel: 3}),
       imagemin.jpegtran({progressive: true}),
     ]))*/
    .pipe(gulp.dest('build/img/'));
});

gulp.task('copy', function() {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/img/**",
    "src/svg/**",
    "src/fonts/**"
    ], {
      base: 'src'
    })
    .pipe(gulp.dest("build"));
});

gulp.task('del', function() {
  return del('build');
})

//build project
gulp.task('build', function(done){
  run(
    'del',
    'images',
    'copy',
    'less',
    'js',
    'html',
    'concat-jsPlugins',
    'lessPlugins',
    done
    );
});

// browserSync
gulp.task('sync', ['build'], function(){
  browserSync.init({
    server: "build"
    });
  //следим за файлами, выполняем задачи
  gulp.watch('src/less/**/*.less', ['less']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/img/**/*.*', ['images']);
});

/*svg */
gulp.task('svg', function () {
    return gulp
        .src('src/img/sprite/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(cheerio(function ($) {
        $('svg').attr('style',  'display:none');
      }))
        .pipe(gulp.dest('src/img'));
});


gulp.task("sprite", function () {
  return gulp.src("src/img/sprite/*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("src/img/"));
});



