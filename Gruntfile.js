module.exports = function (grunt) {
    var _ = require('underscore'),
        defaultDirs = {
            dist: 'dist',
            src: 'src'
        };

    var dirs = _.defaults(
        grunt.file.readJSON('package.json').directories,
        defaultDirs
    );

    if (_.isUndefined(dirs)) {
        dirs = defaultDirs;
    }

    grunt.initConfig({
        dirs: dirs,
        clean: {
            dist: ['<%= dirs.dist %>/**']
        },
        csscomb: {
            dist: {
                expand: true,
                cwd: '<%= dirs.dist %>/',
                src: ['*.css', '!*.pretty.css'],
                dest: '<%= dirs.dist %>/',
                ext: '.pretty.css'
            }
        },
        cssmin: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.dist %>/',
                    src: ['*.css', '!*.pretty.css'],
                    dest: '<%= dirs.dist %>/'
                }]
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')
                ]
            },
            dist: {
                src: '<%= dirs.dist %>/*.css'
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= dirs.src %>/',
                        src: ['**/*.scss', '**/*.css'],
                        dest: '<%= dirs.dist %>',
                        ext: '.css'
                    }
                ]
            }
        },
        watch: {
            scss: {
                files: ['<%= dirs.src %>/**/*.scss'],
                tasks: ['sass:dist']
            }
        }
    });

    require('jit-grunt')(grunt);

    grunt.registerTask('build', [
        'clean:dist',
        'sass:dist',
        'postcss',
        'csscomb',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'clean:dist',
        'sass:dist',
        'watch'
    ]);
};
