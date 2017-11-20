// Grunt JavaScript Document
module.exports = function(grunt) {

  
  // Configure grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Define drupal version the theme is designed for
    drupal: {
      version: '8.x',
    },

    // Watch the stylesheets created from the project SASS files so PostCSS processing is automatic
    watch: {
      sass_dist:{
        files: ['scss/**/*.scss', 'bootstrap/assets/stylesheets/**/*.scss'],
        tasks: ['sass:dist', 'postcss:dist'],
        options: {
          event: ['added','changed'],
        },
      },
      sass_dev:{
        files: ['scss/**/*.scss', 'bootstrap/assets/stylesheets/**/*.scss', '!scss/font-awesome/**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev'],
        options: {
          event: ['added','changed'],
          spawn: false,
          interrupt: true,
        },
      },
      js:{
        files: ['js/*.js','!js/main.min.js'],
        tasks: ['uglify'],
        options: {
          event: ['added','changed'],
        },
      },
    },
    
    // Concurrent Watch Tasks
    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      dist: {
        tasks: ["watch:sass_dist", "watch:js"],
      },
      dev: {
        tasks: ["watch:sass_dev", "watch:js"],
      },
    },
    
    // Compile SASS files to CSS
    sass: {
      dist: {
        options: {                 
          style: 'compressed',
        },
        files: {
          'css/style.css' : 'scss/style.scss',
          'css/font-awesome.css' : 'scss/font-awesome/font-awesome.scss',
        },
      },
      dev: {
        options: {                 
          style: 'expanded',
        },
        files: {
          'css/style.css' : 'scss/style.scss',
        },
      },
      fontawesome: {
        options: {                 
          style: 'compressed',
        },
        files: {
          'css/font-awesome.css' : 'scss/font-awesome/font-awesome.scss',
        },
      },
    },
    
    // Minify JS files
    uglify:{
      options: {
        // insert a banner at the top of the file
        banner: '/*! <%= pkg.name %>_drupal-<%= drupal.version %>-<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        
        output: {
          comments: 'all',        // Preserve all comments on JS files
        },
        
        sourceMap: true,          // Generate source map file
      },
      
      target:{
        files: {
          'js/main.min.js' : ['js/*.js','!js/main.min.js']
        },
      },
    },

    // Post process the CSS for 
    postcss: {
      options: {
        map: {
          inline: false,        // save all sourcemaps as separate files...
          annotation: 'css/'    // ... in this directory
        },
        processors: [
          require('postcss-cssnext')(),       // transform modern CSS so it works in all supported browsers
          require('cssnano-preset-default'),  // Minify the CSS
        ],
      },
      dist: {
        files: [
          {
            expand: true,      // enable dynamic expansion
            cwd: 'css/',       // Src matches are relative to this path
            src: [
              '*.css',         // All .css files...
              '!*.min.css'     // ... except .min.css files
            ],                 // Pattern to match for source files
            dest: 'css/',      // Destination path prefix
            ext: '.min.css',   // Destination file paths will have this extension
            extDot: 'first',   // Extensions in filenames begin after the first dot
          },
        ],
      },
      dev: {
        files: [
          {
            expand: true,      // enable dynamic expansion
            cwd: 'css/',       // Src matches are relative to this path
            src: 'style.css',  // style.css file
            dest: 'css/',      // Destination path prefix
            ext: '.min.css',   // Destination file paths will have this extension
            extDot: 'first',   // Extensions in filenames begin after the first dot
          },
        ],
      },
      fontawesome: {
        files: [
          {
            expand: true,      // enable dynamic expansion
            cwd: 'css/',       // Src matches are relative to this path
            src: 'font-awesome.css', // font-awesome.css file
            dest: 'css/',      // Destination path prefix
            ext: '.min.css',   // Destination file paths will have this extension
            extDot: 'first',   // Extensions in filenames begin after the first dot
          },
        ],
      },
    },

    // Create archive for theme upload
    'git-archive': {
      archive: {
        options: {                 
          format: 'tar.gz',
          prefix: '<%= pkg.name %>/',
          output: '<%= pkg.name %>_drupal-<%= drupal.version %>-<%= pkg.version %>.tar.gz', 
          'worktree-attributes': true,
          extra: 6,
          'tree-ish': '@',
        },
      },
    },
     
  });

  // Load the plugins that provide the specified tasks
  
  // "watch" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // "concurrent" task.
  grunt.loadNpmTasks('grunt-concurrent');
  
  // "sass" task.
  grunt.loadNpmTasks('grunt-contrib-sass');
 
  // "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
 
  // "postcss" task.
  grunt.loadNpmTasks('grunt-postcss');
  
  // "git-archive" task.
  grunt.loadNpmTasks('grunt-git-archive');
  
  // register tasks
  grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('dist', ['concurrent:dist']);
  grunt.registerTask('post_dist', ['uglify:target', 'postcss:dist']);
  grunt.registerTask('post_dev', ['uglify:target', 'postcss:dev']);
  grunt.registerTask('fontawesome', ['sass:fontawesome', 'postcss:fontawesome']);
  grunt.registerTask('archive', ['git-archive'])
};