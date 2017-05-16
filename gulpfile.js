const gulp = require('gulp');
const stylus = require('gulp-stylus');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const pug = require('gulp-pug');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');


/*---------- Server ----------*/
gulp.task('server', () => {

    browserSync.init({
        server: {
            baseDir: './build',
            port: 9000
        },
        notify: false
    });

    gulp.watch('./build/**/*').on('change', browserSync.reload);

});

/*---------- JavaScript ----------*/
gulp.task('compile-scripts', () => {
    return gulp.src('./source/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./build/js/'))
});

/*---------- Pug ----------*/
gulp.task('compile-templates', () => {

    return gulp.src('./source/templates/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./build'))

});

/*---------- Stylus ----------*/
gulp.task('compile-styles', () => {

    return gulp.src('./source/styles/main.styl')
        .pipe(stylus({ compress: true }))
        .pipe(autoprefixer())       
        .pipe(gulp.dest('./build/css'))

});

/*---------- Fonts ----------*/
gulp.task('copy-fonts', () => {

    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'));

});

/*---------- Images ----------*/
gulp.task('copy-images', () => {

    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('./build/images'));

});

/*---------- Watchers ----------*/
gulp.task('watch', () => {
    
    gulp.watch('./source/templates/**/*.pug', gulp.series('compile-templates'));
    gulp.watch('./source/styles/**/*.styl', gulp.series('compile-styles'));
    gulp.watch('./source/js/**/*.js', gulp.series('compile-scripts'));

});

/*---------- SmartGrid ----------*/
gulp.task('smart-grid', () => {

    const smartgrid = require('smart-grid');

    const settings = {
        outputStyle: 'styl', /* less || scss || sass || styl */
        columns: 12, /* number of grid columns */
        offset: "30px", /* gutter width px || % */
        container: {
            maxWidth: '1200px', /* max-width оn very large screen */
            fields: '30px' /* side fields */
        },
        breakPoints: {
            lg: {
                'width': '1100px', /* -> @media (max-width: 1100px) */
                'fields': '30px' /* side fields */
            },
            md: {
                'width': '960px',
                'fields': '15px'
            },
            sm: {
                'width': '780px',
                'fields': '15px'
            },
            xs: {
                'width': '560px',
                'fields': '15px'
            }
            /*
            We can create any quantity of break points.
            some_name: {
                some_width: 'Npx',
                some_offset: 'N(px|%)'
            }
            */
        }
    };

    smartgrid('./source/styles/helpers', settings);

});

/*---------- Deleting ----------*/
gulp.task('del-build', () => {

    return del('./build');

});

/*---------- Default ----------*/
gulp.task('default', gulp.series(
    'del-build',
    gulp.parallel('copy-fonts', 'copy-images', 'compile-templates', 'compile-styles', 'compile-scripts'),
    gulp.parallel('watch', 'server')
    )
);