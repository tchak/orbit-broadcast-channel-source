'use strict';

const build = require('@glimmer/build');
const packageDist = require('@glimmer/build/lib/package-dist');
const toES5 = require('@glimmer/build/lib/to-es5');
const funnel = require('broccoli-funnel');
const path = require('path');

let buildOptions = {
  external: ['@orbit/utils', '@orbit/core', '@orbit/data', 'broadcast-channel']
};

if (process.env.BROCCOLI_ENV === 'tests') {
  buildOptions.vendorTrees = [
    packageDist('@orbit/utils'),
    packageDist('@orbit/core'),
    packageDist('@orbit/data'),
    toES5(
      funnel(path.join(require.resolve('broadcast-channel'), '../'), {
        include: ['index.js'],
        dest: 'broadcast-channel',
        getDestinationPath: () => 'index.js'
      }),
      {
        namespace: 'broadcast-channel'
      }
    )
  ];
}

module.exports = build(buildOptions);
