
'use strict';
/**
 * 引入包
 */
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');//sass的编译
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;


/*
 * default
 * */
gulp.task('default', ['styles-jiukuai'],function(){

});

// 实时刷新浏览器
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: [
                "./"
            ]
        }
    });

});

/*
 * 监听
 * */
gulp.task("watch",['server'], function(){
    gulp.watch('./scss/*.scss', ['styles-jiukuai']);
    gulp.watch('./dist/*.css').on('change', reload);
    gulp.watch("./*.html").on('change', reload);
});


//玖快租房css
gulp.task('styles-jiukuai', function(){
    //编译sass
    return sass('./scss/*.scss')

    //保存编译之后的css文件到指定的目录
    .pipe(gulp.dest('./dist/'))

});
