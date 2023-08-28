const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const sourceMaps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const newer = require('gulp-newer')
const notify = require('gulp-notify')
const gulpResolveUrl = require('gulp-resolve-url')
const cssMin = require('gulp-cssmin')
const imagemin = require('gulp-imagemin')
const imgCompress = require('imagemin-jpeg-recompress')
const svgSprite = require('gulp-svg-sprite')
const svgmin = require('gulp-svgmin')
const cheerio = require('gulp-cheerio')
const browserSync = require('browser-sync').create()
const pug = require('gulp-pug')
const plumber = require('gulp-plumber')
const gulpIf = require('gulp-if')
const debug = require('gulp-debug')
const htmlmin = require('gulp-htmlmin')
const autoPrefixer = require('gulp-autoprefixer')
const webpack = require('webpack-stream')
const webPack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const rename = require('gulp-rename')
const cache = require('gulp-cached')
const replace = require('gulp-replace')

// const isDebug = process.env.NODE_ENV === 'debug'
const isDevelopment = true; // true - write sourcemaps, false - no sourcemaps

function sassCompile() {
  return gulp.src('./src/assets/scss/style.scss')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(gulpIf(isDevelopment, sourceMaps.init()))
    .pipe(debug({title: 'sourceMaps'}))
    .pipe(sass({
      includePaths: ['node_modules']
    })).on('error', notify.onError())
    .pipe(debug({title: 'sass'}))
    .pipe(gulpIf(isDevelopment, sourceMaps.write('../css')))
    .pipe(debug({title: 'sourceMaps'}))
    .pipe(gulp.dest('./public/assets/css/')).pipe(debug())
}

function sassCompress() {
  return gulp.src('./src/assets/scss/style.scss')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(gulpIf(isDevelopment, sourceMaps.init()))
    .pipe(debug({title: 'sourceMaps'}))
    .pipe(sass({
      includePaths: ['node_modules']
    })).on('error', notify.onError())
    .pipe(debug({title: 'sass'}))
    .pipe(autoPrefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(debug({title: 'autoPrefixer'}))
    .pipe(gulpResolveUrl())
    .pipe(debug({title: 'gulpResolveUrl'}))
    .pipe(cssMin())
    .pipe(debug({title: 'cssMin'}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(debug({title: 'rename'}))
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(debug())
}

function imgCompressor() {
  return gulp.src('src/assets/img/**/*')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(imagemin([
      imgCompress({
        loops: 4,
        min: 70,
        max: 80,
        quality: 'high'
      }),
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(debug({title: 'imagemin'}))
    .pipe(gulp.dest('public/assets/img/'))
}

function spriteSvg() {
  let config = {
    shape: {
      dimension: {
        maxWidth: 500,
        maxHeight: 500
      },
      spacing: {
        padding: 0
      }
    },
    mode: {
      symbol: {
        dest: '.',
        sprite: 'sprite.svg'
      }
    }
  }

  return gulp.src('src/assets/img/sprites/svg/*.svg')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    // minify svg
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(debug({title: 'svgmin'}))
    // remove all fill and style declarations in out shapes
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(debug({title: 'cheerio'}))
    // cheerio plugin create unnecessary string '&gt;', so replace it.
    .pipe(replace('&gt;', '>'))
    .pipe(debug({title: 'replace'}))
    .pipe(svgSprite(config)).on('error', function(error) {
      console.log(error)
    })
    .pipe(debug({title: 'svgSprite'}))
    .pipe(gulp.dest('public/assets/img/'))
}

function js() {
  return gulp.src('./src/assets/js/index.js')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      },
      plugins: [
        new webPack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        })
      ]
    })).on('error', notify.onError())
    .pipe(debug({title: 'webpack'}))
    .pipe(gulp.dest('./public/assets/js/'))
    .pipe(debug())
}

function jsCompress() {
  return gulp.src('./src/assets/js/index.js')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      },
      plugins: [
        new webPack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        }),
        new UglifyJsPlugin()
      ]
    })).on('error', notify.onError())
    .pipe(debug({title: 'webpack'}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(debug({title: 'rename'}))
    .pipe(gulp.dest('./public/assets/js/'))
    .pipe(debug())
}

function fonts() {
  return gulp.src('./src/assets/fonts/**/*.*')
    .pipe(plumber())
    .pipe(newer('./public/assets/fonts/'))
    .pipe(gulp.dest('./public/assets/fonts/'))
    .pipe(debug())
}

function img() {
  return gulp.src([
    'src/assets/img/**/*.*',
    '!src/assets/img/sprites'
  ])
    .pipe(plumber())
    .pipe(newer('./public/assets/img/'))
    .pipe(gulp.dest('public/assets/img/'))
    .pipe(debug())
}

function docs() {
  return gulp.src('src/assets/docs/**/*.*')
    .pipe(plumber())
    .pipe(newer('./public/docs/'))
    .pipe(gulp.dest('public/docs/'))
    .pipe(debug())
}

function files() {
  return gulp.src(['src/resources/**/*.*'])
    .pipe(plumber())
    .pipe(newer('./public/'))
    .pipe(gulp.dest('public/'))
    .pipe(debug())
}

function pugFiles() {
  return gulp.src('./src/*.pug')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(pug(
      {pretty: true}
    ))
    .pipe(debug({title: 'pug'}))
    .pipe(cache('pug'))
    .pipe(debug({title: 'cache'}))
    .pipe(gulp.dest('public/'))
    .pipe(debug())
}

function pugCompress() {
  return gulp.src('./src/*.pug')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(pug(
      {pretty: true}
    ))
    .pipe(debug({title: 'pug'}))
    .pipe(cache('pug'))
    .pipe(debug({title: 'cache'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(debug({title: 'htmlmin'}))
    .pipe(gulp.dest('public/'))
    .pipe(debug())
}

function deployHtml() {
  return gulp.src(['./public/*.html'])
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(replace('.css', '.min.css'))
    .pipe(replace('.min.min.css', '.min.css'))
    .pipe(replace('.js', '.min.js'))
    .pipe(replace('.min.min.js', '.min.js'))
    .pipe(gulp.dest('public/'))
    .pipe(debug())
}

function watch() {
  browserSync.init({
    server: 'public'
  })
  gulp.watch('./src/assets/scss/**/*.scss', sassCompile)
  gulp.watch('./src/assets/img/**/*', img)
  gulp.watch('./src/assets/img/**/*', imgCompressor)
  gulp.watch(['./src/*.pug', './src/pug/**/*.pug'], gulp.series(pugFiles))
  gulp.watch('./src/assets/js/**/*.js', js)
  gulp.watch('./src/assets/docs/**/*', docs)
  gulp.watch('./src/*.*', files)
  gulp.watch('./public/**/*').on('change', browserSync.reload)
}

function cleanDirectory() {
  return gulp.src('public/*')
    .pipe(debug({title: 'src'}))
    .pipe(plumber())
    .pipe(clean())
    .pipe(debug())
}

gulp.task('sass', sassCompile)

gulp.task('sass:compress', sassCompress)

gulp.task('img:compress', imgCompressor)

gulp.task('sprite:svg', spriteSvg)

gulp.task('js', js)

gulp.task('js:compress', jsCompress)

gulp.task('fonts', fonts)

gulp.task('img', img)

gulp.task('docs', docs)

gulp.task('files', files)

gulp.task('pug', pugFiles)

gulp.task('pug:compressor', pugCompress)

gulp.task('clean', cleanDirectory)

gulp.task('watch', watch)

gulp.task('deploy-html', deployHtml)

gulp.task('collectDev', gulp.series(cleanDirectory, gulp.parallel(sassCompile, img, spriteSvg, fonts, js, pugFiles, docs, files)))

gulp.task('collectBuild', gulp.series(cleanDirectory, gulp.parallel(sassCompress, imgCompressor, spriteSvg, fonts, jsCompress, pugCompress, docs, files)))

gulp.task('dev', gulp.series('collectDev', 'watch'))

gulp.task('build', gulp.series('collectBuild', 'deploy-html'))




