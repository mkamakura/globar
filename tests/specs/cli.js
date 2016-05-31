#!/usr/bin/env node
const childProcess = require('child_process');

childProcess.exec('../../bin/index.js \"./sample-package/**/*.js\" -o \"./dist/**/*.bundle.min.js\"');
