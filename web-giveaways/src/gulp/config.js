module.exports = {
	clean: {
		src: ['site/dist/css/*',
		    'site/dist/css/themes/*',
		    'site/dist/vender-js',
		    'site/dist/vendor-css',
		    'site/dist/vendor/*',
		    'site/dist/dto.*',
		    'site/dist/dto-*.min.js',
		    'site/dist/maps/*',
		    'site/**/*.gz'
		],
		styles: ['site/dist/css/*',
		    'site/dist/css/themes/*'
		],
		post: ['site/dist/*.temp.*', 'site/dist/**/*.temp.*']
	},
	vendorJS: {
		src:  [
	        'node_modules/jquery/dist/jquery.min.js',
	        'node_modules/jquery.maskedinput/src/jquery.maskedinput.js',
	        'node_modules/angular/angular.min.js',
	        'node_modules/angular-sanitize/angular-sanitize.min.js',
	        'node_modules/angular-resource/angular-resource.min.js',
	        'node_modules/angular-animate/angular-animate.min.js',
	        'node_modules/angular-messages/angular-messages.min.js',
	        'node_modules/angular-mocks/angular-mocks.js',
	        'node_modules/angular-cookies/angular-cookies.min.js',
	        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
			'node_modules/bootstrap/dist/js/bootstrap.min.js',
	        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
	        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
	        'node_modules/angular-fontawesome/dist/angular-fontawesome.min.js',
	        'node_modules/angular-translate/dist/angular-translate.min.js',
	        'node_modules/angular-translate-storage-local/angular-translate-storage-local.min.js',
	        'node_modules/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
	        'node_modules/angulartics/dist/angulartics.min.js',
	        'node_modules/angulartics-google-analytics/dist/angulartics-ga.min.js',
	        'node_modules/moment/min/moment.min.js',
	        'node_modules/angular-ui-mask/dist/mask.min.js',
	        'node_modules/ua-parser-js/dist/ua-parser.min.js'
	    ],
	    maps: [
	        'node_modules/angular/angular.min.js.map',
	        'node_modules/angular-sanitize/angular-sanitize.min.js.map',
	        'node_modules/angular-resource/angular-resource.min.js.map',
	        'node_modules/angular-animate/angular-animate.min.js.map',
	        'node_modules/angular-messages/angular-messages.min.js.map',
	        'node_modules/angular-cookies/angular-cookies.min.js.map',
	        'node_modules/angulartics-google-analytics/dist/angulartics-ga.min.js.map'
	    ]
	},
	vendorCSS: {
		src:  [
	        'node_modules/bootstrap/dist/css/bootstrap.min.css',
	        'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
	        'node_modules/font-awesome/css/font-awesome.min.css'
	    ],
	    maps: [
	        'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
	        'node_modules/bootstrap/dist/css/bootstrap-theme.min.css.map',
	        'node_modules/font-awesome/css/font-awesome.css.map'
	    ],
	    dependencies: {
	        'node_modules/bootstrap/fonts/**' : 'site/dist/fonts',
	        'node_modules/font-awesome/fonts/**' : 'site/dist/fonts',
	        'site/app/scss/fonts/**' : 'site/dist/fonts'
	    }
	},
	scripts: {
		src: [
	        'site/app/js/dto.js',
	        'site/app/js/core/core.module.js',
	        'site/app/js/**/core/*.module.js',
	        'site/app/js/**/*.module.js',
	        'site/app/js/**/*.js',
	        '!site/app/js/dto.cgi.js',
	        '!site/app/js/**/*.spec.js',
	        '!site/app/js/{mock,mock/**}',
	        '!site/app/js/{cgi,cgi/**}'
	    ],
	},
	cgi: {
		src: [
	        'site/app/js/dto.cgi.js',
	        'site/app/js/core/core.module.js',
	        'site/app/js/**/core/*.module.js',
	        'site/app/js/**/*.module.js',
	        'site/app/js/**/*.js',
	        '!site/app/js/dto.js',
	        '!site/app/js/{mock,mock/**}',
	        '!site/app/js/**/*.spec.js'
	    ],
	    scss: [
	    	'site/app/scss/cgi.scss',
	    	'site/app/scss/main.scss',
	    	'site/app/scss/print.scss'
	    ]
	},
    scss: {
    	src: [
	        'site/app/scss/main.scss',
	        'site/app/scss/print.scss'
	    ],
	    themes: [
	    	{ key: '180713DT1COM', file: 'site/app/scss/themes/180713DT1COM.scss'},
	        { key: 'chevrolet', file: 'site/app/scss/themes/chevrolet.scss' },
	        { key: 'chevy', file: 'site/app/scss/themes/chevy.scss' },
	        { key: 'buick', file: 'site/app/scss/themes/buick.scss' },
	        { key: 'G171213USAS5', file: 'site/app/scss/themes/G171213USAS5.scss' },	
	        { key: 'G180513USAS2', file: 'site/app/scss/themes/G180513USAS2.scss' },
	        { key: 'cadillac', file: 'site/app/scss/themes/cadillac.scss' },
	        { key: 'gmc', file: 'site/app/scss/themes/gmc.scss' },
	        { key: 'military', file: 'site/app/scss/themes/military.scss' },
			{ key: 'supplier', file: 'site/app/scss/themes/supplier.scss' },
			{ key: 'educator', file: 'site/app/scss/themes/educator.scss' },
			{ key: 'chevy-opg', file: 'site/app/scss/themes/chevy-opg.scss' },
			{ key: 'chevy-opg2', file: 'site/app/scss/themes/chevy-opg2.scss' },
			{ key: 'chevy-opg3', file: 'site/app/scss/themes/chevy-opg3.scss' },
			{ key: 'chevy-onst', file: 'site/app/scss/themes/chevy-onst.scss' },
			{ key: 'chevy-black-opg', file: 'site/app/scss/themes/chevy-black-opg.scss' },
			{ key: 'hershey', file: 'site/app/scss/themes/hershey.scss' },
			{ key: 'takata', file: 'site/app/scss/themes/takata.scss' },
			{ key: 'memphis', file: 'site/app/scss/themes/memphis.scss' },
			{ key: 'gm-opg', file: 'site/app/scss/themes/gm-opg.scss' },
			{ key: 'buick-d2d', file: 'site/app/scss/themes/buick-d2d.scss' },
			{ key: 'gmc-d2d', file: 'site/app/scss/themes/gmc-d2d.scss' },
			{ key: 'frd-d2d', file: 'site/app/scss/themes/frd-d2d.scss' },
			{ key: 'lego', file: 'site/app/scss/themes/lego.scss' },
			{ key: 'zerv', file: 'site/app/scss/themes/zerv.scss' },
			{ key: 'indy', file: 'site/app/scss/themes/indy.scss' },
			{ key: 'chevrolet-lake-placid', file: 'site/app/scss/themes/chevrolet-lake-placid.scss' },
			{ key: 'myrewards', file: 'site/app/scss/themes/myrewards.scss' },
			{ key: 'generic', file: 'site/app/scss/themes/generic.scss' },
			{ key: 'canada', file: 'site/app/scss/themes/canada.scss' }
	    ],
    	themesWatch: [
	        'site/app/scss/_theme.scss',
	        'site/app/scss/themes/*.scss',
	        'site/app/scss/fonts/*.scss'
	    ]
	},
	debug: {
		dev: 'site/app/debug/dev.js',
		prod: 'site/app/debug/prod.js'
	},
	webserver: {
		root: ['./site', './'],
		fallback: './site/index.html',
		port: 9090
	},
	test: {
		src: 'karma.conf.js'
	},
	gzip: {
		src: 'site/**/*.{html,json,css,js}'
	}
}