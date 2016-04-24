module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        replace: {
            index: {
                src: ['index.html'],
                overwrite: true,
                replacements: [{
                    from: '<!--devstart-->',
                    to: '<!--'
                }, {
                    from: '<!--devend-->',
                    to: '-->'
                }, {
                    from: '<!--productstart',
                    to: '<!--productstart-->'
                },{
                    from: 'productend-->',
                    to: '<!--productend-->'
                }
                ]
            },
            config: {
                src: ['js/common/config.js'],
                overwrite: true,
                replacements: [{
                    from: '/*devstart*/',
                    to: '/*devstart'
                }, {
                    from: '/*devend*/',
                    to: 'devend*/'
                }, {
                    from: '/*productstart',
                    to: '/*productstart*/'
                },{
                    from: 'productend*/',
                    to: '/*productend*/'
                }
                ]
            },
            app: {
                src: ['js/app.js'],
                overwrite: true,
                replacements: [{
                    from: '/*devstart*/',
                    to: '/*devstart'
                }, {
                    from: '/*devend*/',
                    to: 'devend*/'
                }, {
                    from: '/*productstart',
                    to: '/*productstart*/'
                },{
                    from: 'productend*/',
                    to: '/*productend*/'
                }
                ]
            }
        },

        html2js: {
            options: {
                //The prefix relative to the project directory that should be stripped from each template path
                //to produce a module identifier for the template. For example, a template located at
                //src/projects/projects.tpl.html would be identified as just projects/projects.tpl.html.
                base: '.'
            },
            main: {
                src: ['partials/**/*.html'],
                dest: 'partials/templates.js',
                module: 'app.templates'
            },
        },
        concat: {
            js: {
                src: ['libs/fastclick/fastclick.js','libs/wx/jweixin-1.0.0.js',
                    'libs/jquery/jquery-1.11.1.min.js', 'libs/jquery/jquery.slimscroll-1.3.3.min.js',
                    'libs/Chart.min.js','libs/angular-1.4.3.min.js',
                    'libs/qrcode.min.js','libs/angular-qr.min.js',
                    'libs/angular-module/*.js', 'libs/angular-module/*/*.js'],
                dest: 'dist/js/vendor.min.js'
            },
            css: {
                src: ['libs/css/*/css/*.css', 'libs/css/*.css', 'libs/angular-module/*/*.css'],
                dest: 'dist/css/vendor.min.css'
            }
        },
        cssmin: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['*.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        },
        uglify: {
            my_target: {
                files : {
                    'dist/js/app.min.js':['partials/templates.js','js/*/*.js', 'js/*/directives/*.js', 'js/*/services/*.js',
                        'js/*/controllers/*.js', 'js/app.js']
                }
            }
        },
        watch: {
            src: {
                files: ['js/**/*.js','css/**/*.css'],
                tasks: ['default']
            }
        }

    });

    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //grunt.registerTask('default',['html2js', 'concat', 'cssmin', 'uglify']);
    grunt.registerTask('default',['replace', 'html2js', 'concat', 'cssmin', 'uglify']);
};