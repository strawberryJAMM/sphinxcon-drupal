// Grunt JavaScript Document
module.exports = function(grunt) {
  
  // Configure grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // Watch the stylesheets created from the project SASS files so PostCSS processing is automatic
    watch: {
      sass:{
        files: ['scss/**/*.scss', 'bootstrap/assets/stylesheets/**/*.scss'],
        tasks: ['sass', 'postcss'],
        options: {
          event: ['added','changed'],
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
    
    // Compile SASS files to CSS
    sass: {
      dist: {
        options: {                 
          style: 'nested',
        },
        files: {
          'css/style.css' : 'scss/style.scss',
        },
      },
    },
     
    // Minify JS files
    uglify:{
      options: {
        // insert a banner at the top of the file
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        
        output: {
          comments: 'all',        // Preserve all comments on JS files
        },
        
        sourceMap: true,          // Generate source map file
      },
      
      dist:{
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
    },

    // Create archive for theme upload
    'git-archive': {
      archive: {
        options: {                 
          format: 'tar.gz',
          prefix: 'sphinxcon/',
          output: 'sphinxcon_drupal-<%= pkg.version %>.tar.gz',
          'worktree-attributes': true,
          extra: 6,
          'tree-ish': '@',
        },
        files: {
          'css/style.css' : 'scss/style.scss',
        },
      },
    },
     
  });

  
  // Load the plugins that provide the specified tasks
  
  // "watch" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // "sass" task.
  grunt.loadNpmTasks('grunt-contrib-sass');
 
  // "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
 
  // "postcss" task.
  grunt.loadNpmTasks('grunt-postcss');
  
  // "git-archive" task.
  grunt.loadNpmTasks('grunt-git-archive');
  
  // register tasks
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('post', ['uglify', 'postcss']);
};