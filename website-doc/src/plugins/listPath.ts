const path = require('path');
const fs = require('fs');
const { parseMarkdownString } = require('@docusaurus/utils');

function components(type) {
  return all_components(type).filter(c => c.status == "stable" || c.status == "beta");
}

function all_components(type) {
  const components = [];
  const dir = path.join(__dirname, `../../../docs/components/${type}`);
  fs.readdirSync(dir).forEach(function (file) {
    if ( !/about\.mdx?/.test(file) ) {
      const name = file.split('.').slice(0, -1).join('.');
      const data = fs.readFileSync(path.join(dir, file));
      const { frontMatter } = parseMarkdownString(data);
      frontMatter["name"] = name;
      components.push(frontMatter);
    }
  });
  return components;
}

function listPaths(type) {
  const paths = [`components/${type}/about`];

  const components = all_components(type);

  components
    .filter(c => c.status == "stable" || c.status == "beta")
    .forEach(function (info) {
      paths.push(`components/${type}/${info.name}`);
    });

  const experimentalPaths = components
    .filter(c => c.status == "experimental")
    .map(c => `components/${type}/${c.name}`);

  if ( experimentalPaths.length > 0 ) {
    paths.push({
      type: 'category',
      label: 'Experimental',
      items: experimentalPaths,
    });
  }

  const deprecatedPaths = components
    .filter(c => c.status == "deprecated")
    .map(c => `components/${type}/${c.name}`);

  if ( deprecatedPaths.length > 0 ) {
    paths.push({
      type: 'category',
      label: 'Deprecated',
      items: deprecatedPaths,
    });
  }

  return paths;
}

module.exports = {
  components: components,
  listPaths: listPaths,
};