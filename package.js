Package.describe({
  name: 'jeffpatzer:waning-session',
  version: '0.0.4_5',
  // Brief, one-line summary of the package.
  summary: 'Log the user out after a specified period of inactivity. All done within the browser.',
  // URL to the Git repository containing the source code for this package.
  git: 'git@github.com:jpatzer/meteor-waning-session.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(
		[
			'templating',
      'jquery',
      'momentjs:moment@2.0.0',
      'alanning:roles@1.2.0',
      'simply:reactive-local-storage@0.1.0'
		],
		'client');
  api.addFiles([
    'lib/logout-modal.html',
    'waning-session.js'
  ],'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jeffpatzer:waning-session');
  api.addFiles('waning-session-tests.js');
});
