const gulp = require('gulp')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const prettier = require('gulp-prettier')
const browser = require('browser-sync').create()

const EXAMPLE_FOLDER = 'example'
const SOURCE_FOLDER = 'src'
const PRODUCT_FOLDER = 'dist'
const SOURCE_COMPONENT_NAME = 'index.js'
const PRODUCT_COMPONENT_NAME = 'sequential-shots.js'
const BABEL_CONFIG = {
    presets: ['@babel/preset-env', 'minify'],
    plugins: ['transform-html-import-to-string']
}

async function product() {
    gulp.src(`${SOURCE_FOLDER}/${SOURCE_COMPONENT_NAME}`)
        .pipe(babel(BABEL_CONFIG))
        .pipe(rename(PRODUCT_COMPONENT_NAME))
        .pipe(gulp.dest(PRODUCT_FOLDER))
}

async function example() {
    return gulp
        .src(`${SOURCE_FOLDER}/${SOURCE_COMPONENT_NAME}`)
        .pipe(babel(BABEL_CONFIG))
        .pipe(prettier())
        .pipe(rename(PRODUCT_COMPONENT_NAME))
        .pipe(gulp.dest(EXAMPLE_FOLDER))
        .pipe(browser.stream())
}

function watch() {
    browser.init({server: {baseDir: EXAMPLE_FOLDER}})
    gulp.watch([`${EXAMPLE_FOLDER}/media/*`], gulp.parallel([product, example]))
    gulp.watch([`${EXAMPLE_FOLDER}/*.html`], gulp.parallel([product, example]))
    gulp.watch([`${EXAMPLE_FOLDER}/*.css`], gulp.parallel([product, example]))
    gulp.watch([`${SOURCE_FOLDER}/**/*`], gulp.parallel([product, example]))
}

exports.watch = watch
exports.example = example
exports.product = product
exports.default = gulp.parallel([product, example])
