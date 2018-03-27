// Grunt JavaScript Document
module.exports = function(grunt) {

  
  // Configure grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    info: grunt.file.readYAML('sphinxcon/sphinxcon.info.yml'),
    
    // Define drupal version the theme is designed for
    drupal: {
      version: '<%= info.core %>',
    },
                   
    // Concurrent Watch Tasks
    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      dist: {
        tasks: ['watch:sass_dist', 'watch:js_main'],
      },
      dev: {
        tasks: ['watch:sass_dev', 'watch:js_main'],
      },
    },
    
    // Watch stylesheets and script files for changes so post processing is automatic
    watch: {
      sass_dist:{
        files: ['sphinxcon/scss/**/*.scss', 'sphinxcon/bootstrap/assets/stylesheets/**/*.scss'],
        tasks: ['sass:dist', 'postcss:dist'],
        options: {
          event: ['added','changed'],
        },
      },
      sass_dev:{
        files: ['sphinxcon/scss/**/*.scss', 'sphinxcon/bootstrap/assets/stylesheets/**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev'],
        options: {
          event: ['added','changed'],
        },
      },
      js_main:{
        files: ['sphinxcon/js/*.js','!sphinxcon/js/*.min.js'],
        tasks: ['uglify'],
        options: {
          event: ['added','changed'],
        },
      },
    },
    
    // Compile SASS files to CSS
    sass: {
      dist: {
        options: {                 
          style: 'compressed',
        },
        files: {
          'sphinxcon/css/style.css' : 'sphinxcon/scss/style.scss',
        },
      },
      dev: {
        options: {                 
          style: 'expanded',
        },
        files: {
          'sphinxcon/css/style.css' : 'sphinxcon/scss/style.scss',
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
      
      main:{
        files: {
          'sphinxcon/js/main.min.js' : ['sphinxcon/js/*.js','!sphinxcon/js/*.min.js'],
        },
      },

      bootstrap:{
        files: {
          'sphinxcon/js/bootstrap.min.js' : ['sphinxcon/bootstrap/assets/javascripts/bootstrap/**/*.js'],
        },
      },
    },

    // Post process the CSS for 
    postcss: {
      options: {
        map: {
          inline: false,                  // save all sourcemaps as separate files...
          annotation: 'sphinxcon/css/'    // ... in this directory
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
            cwd: 'sphinxcon/css/',       // Src matches are relative to this path
            src: [
              '*.css',         // All .css files...
              '!*.min.css'     // ... except .min.css files
            ],                 // Pattern to match for source files
            dest: 'sphinxcon/css/',      // Destination path prefix
            ext: '.min.css',   // Destination file paths will have this extension
            extDot: 'first',   // Extensions in filenames begin after the first dot
          },
        ],
      },
      dev: {
        files: [
          {
            expand: true,      // enable dynamic expansion
            cwd: 'sphinxcon/css/',       // Src matches are relative to this path
            src: 'style.css',  // style.css file
            dest: 'sphinxcon/css/',      // Destination path prefix
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
          output: 'archives/<%= pkg.name %>_drupal-<%= info.version %>.tar.gz', 
          'worktree-attributes': true,
          extra: 6,
          'tree-ish': 'master',
          path: 'sphinxcon/',
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
  grunt.registerTask('default',       ['dev']);
  grunt.registerTask('dev',           ['concurrent:dev']);
  grunt.registerTask('dist',          ['concurrent:dist']);
  grunt.registerTask('post_dist',     ['uglify:main', 'uglify:bootstrap', 'postcss:dist']);
  grunt.registerTask('post_dev',      ['uglify:main', 'postcss:dev']);
  grunt.registerTask('sass_dist',     ['sass:dist', 'postcss:dist']);
  grunt.registerTask('sass_dev',      ['sass:dev', 'postcss:dev']);
  grunt.registerTask('js_dist',       ['uglify:main', 'uglify:bootstrap']);
  grunt.registerTask('js_dev',        ['uglify:main']);
  grunt.registerTask('js_bootstrap',  ['uglify:bootstrap']);
  grunt.registerTask('archive',       ['git-archive']);
};