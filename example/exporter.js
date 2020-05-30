#!/usr/bin/env node

const iconJarExporter = require('../dist').default;

iconJarExporter('example set')
  .addNewGroup('Just a test Group', group => {
    group.addNewSet('Example Set', set => {
      set.addNewIcon('Some Bear', `${__dirname}/example.png`, icon => {
        icon
          .setDimensions(10, 10)
          .addNewLicense('Example License', {
            url: 'https://geticonjar.com',
            description: 'Do whatever you please :-)',
          })
          .addTags(['example', 'tags', 'hello', 'world']);
      });
    });
  })

  .save(`${__dirname}/exports`, true);
