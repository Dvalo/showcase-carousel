/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2020 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.11.0-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const gulp = require("gulp"),
  deploy = require("gulp-gh-pages"),
  del = require("del"),
  sourcemaps = require("gulp-sourcemaps"),
  plumber = require("gulp-plumber"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  minifyCss = require("gulp-clean-css"),
  babel = require("gulp-babel"),
  webpack = require("webpack-stream"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  imagemin = require("gulp-imagemin"),
  browserSync = require("browser-sync").create(),
  dependents = require("gulp-dependents"),
  src_folder = "./src/",
  src_assets_folder = src_folder + "assets/",
  dist_folder = "./dist/",
  dist_assets_folder = dist_folder + "assets/";

gulp.task("clear", () => del([dist_folder]));

gulp.task("html", () => {
  return gulp
    .src([src_folder + "**/*.html"], {
      base: src_folder,
      since: gulp.lastRun("html"),
    })
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task("sass", () => {
  return gulp
    .src(
      [
        src_assets_folder + "sass/**/*.sass",
        src_assets_folder + "scss/**/*.scss",
      ],
      { since: gulp.lastRun("sass") }
    )
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(dependents())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(dist_assets_folder + "css"))
    .pipe(browserSync.stream());
});

gulp.task("js", () => {
  return gulp
    .src([src_assets_folder + "js/**/*.js"], { since: gulp.lastRun("js") })
    .pipe(plumber())
    .pipe(
      webpack({
        mode: "production",
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(dist_assets_folder + "js"))
    .pipe(browserSync.stream());
});

gulp.task("images", () => {
  return gulp
    .src([src_assets_folder + "images/**/*.+(png|jpg|jpeg|gif|svg|ico)"], {
      since: gulp.lastRun("images"),
    })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist_assets_folder + "images"))
    .pipe(browserSync.stream());
});

gulp.task("videos", () => {
  return gulp
    .src([src_assets_folder + "videos/**/*.+(mp4)"], {
      since: gulp.lastRun("videos"),
    })
    .pipe(plumber())
    .pipe(gulp.dest(dist_assets_folder + "videos"))
    .pipe(browserSync.stream());
});

gulp.task(
  "build",
  gulp.series("clear", "html", "sass", "js", "images", "videos")
);

gulp.task("dev", gulp.series("html", "sass", "js"));

gulp.task("serve", () => {
  return browserSync.init({
    server: {
      baseDir: ["dist"],
    },
    port: 3000,
    https: true,
    open: true,
  });
});

gulp.task("watch", () => {
  const watchImages = [
    src_assets_folder + "images/**/*.+(png|jpg|jpeg|gif|svg|ico)",
  ];

  const watch = [
    src_folder + "**/*.html",
    src_assets_folder + "sass/**/*.sass",
    src_assets_folder + "scss/**/*.scss",
    src_assets_folder + "js/**/*.js",
  ];

  gulp.watch(watch, gulp.series("dev")).on("change", browserSync.reload);
  gulp
    .watch(watchImages, gulp.series("images"))
    .on("change", browserSync.reload);
});

gulp.task("default", gulp.series("build", gulp.parallel("serve", "watch")));
