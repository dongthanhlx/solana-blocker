const YAML = require('yaml');
const _ = require('lodash');
const fs = require('fs');

let config = null;
let path = __dirname + '/../config.yaml';
let yamlOptions = {schema: 'core'};
let env = process.env.NODE_ENV || 'production';

console.log(process.env.NODE_ENV);

function load() {
  if (!config) {
    config = YAML.parse(
      fs.readFileSync(path).toString(), yamlOptions
    );
  }
}

function persist() {
  fs.writeFileSync(path,
    YAML.stringify(config, yamlOptions)
  );
}

function reset() {
  config = null;
  load();
}

function get(path) {
  load();
  return _.get(config, `${env}.${path}`);
}

function set(env, path, value) {
  _.set(config, `${env}.${path}`, value);
  persist();
}

function all() {
  return config;
}

module.exports = {
  load, get, all, reset, set
};
