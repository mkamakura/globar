import path from 'path';
import mkdirp from 'mkdirp';

export const getBaseDir = (pattern) => {
  const wildcard = pattern.indexOf('*');
  if (wildcard >= 0) pattern = pattern.substr(0, wildcard + 1);
  return path.dirname(pattern);
};

export const isDirectory = (pattern) => {
  const basename = path.basename(pattern);
  if (basename.indexOf('*') >= 0) return true;
  if (basename.indexOf('.') === -1) return true;
  return false;
};

export const rename = (prefix, pattern, file, baseDir) => {
  if (!file) return prefix + pattern;

  let fileExtName = path.extname(file);
  const fileBaseName = path.basename(file, fileExtName);
  const relativeDir = path.dirname(path.relative(baseDir, file));

  const patternFileName = path.basename(pattern);
  let patternDir;
  if (patternFileName.indexOf('*') === -1) {
    patternDir = pattern;
  } else {
    patternDir = exports.getBaseDir(pattern);
    fileExtName = patternFileName.substr(patternFileName.indexOf('*') + 1);
  }

  const outputDir = path.join(patternDir, relativeDir);
  const outputPath = path.join(outputDir, fileBaseName + fileExtName);

  mkdirp.sync(outputDir);
  return prefix + outputPath;
};
