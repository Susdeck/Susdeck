const path = require('node:path');
const tar = require('tar');
const picocolors = require(path.resolve('./src/utils/picocolors.js'));
const fs = require('node:fs');

function openPackage({debug, filePath, pluginManager}) {
  const resolved = path.resolve(`./plugins/${filePath}`);
  const pathToEx = path.resolve(`./tmp/_${filePath.replaceAll("/", "_")}`);
  fs.mkdirSync(pathToEx, { recursive: true });
  tar.x({
    file: resolved,
    cwd: pathToEx,
    sync: true
  });
  const cfgPath = path.resolve(pathToEx, "package.json");
  const { main, name, description, author, version, freedeck } = require(cfgPath);
  if(!freedeck) {
    console.error(`${picocolors.blue("Plugins / FDPackage")} >> ${picocolors.red(`Error: ${filePath} does not contain a Freedeck package definition.`)}`);
    return;
  }
  if(freedeck.disabled && freedeck.disabled === "true") {
    console.log(`${picocolors.blue("Plugins / FDPackage")} >> ${picocolors.gray(`Plugin ${freedeck.title} is disabled. Skipping.`)}`);
    return;
  }
  if(freedeck.package !== 'plugin' && freedeck.package !== 'theme') {
    console.error(`${picocolors.blue("Plugins / FDPackage")} >> ${picocolors.red(`Error: ${freedeck.title} does not contain a valid Freedeck package type.`)}`);
    return;
  }
  if(freedeck.package === 'plugin') {
    const entryPath = path.resolve(pathToEx, main);
    const entry = require(entryPath);
    try {
      entry.class._usesAsar = false;
      const instantiated = entry.exec();
      pluginManager._plc.set(instantiated.id, { instance: instantiated });
      if (instantiated.disabled) {
        pluginManager._disabled.push(filePath);
        return;
      }
      if (fs.existsSync(path.resolve(`./plugins/${instantiated.id}/settings.json`))) {
        const settings = JSON.parse(
          fs.readFileSync(
            path.resolve(`./plugins/${instantiated.id}/settings.json`),
          ),
        );
        pluginManager._settings.set(instantiated.id, settings);
      }
    } catch(er) {
      console.error(`${picocolors.blue("Plugins / FDPackage")} >> ${picocolors.red(`Error loading ${filePath}: ${er.toString()}`)}`);
    }
  } else if(freedeck.package === 'theme') {
    if(!fs.existsSync(path.resolve(`webui/hooks/_themes/${name}`))) {
      fs.mkdirSync(path.resolve(`webui/hooks/_themes/${name}`), { recursive: true });
    }
    if(freedeck.files) {
      for(const file of freedeck.files) {
        if(!fs.existsSync(path.resolve(pathToEx, file))) {
          console.error(`${picocolors.blue("Plugins / FDPackage")} >> ${picocolors.red(`Error adding theme file: ${file} does not exist.`)}`);
          continue;
        }
        const dest = path.resolve(`webui/hooks/_themes/${name}/${file}`);
        fs.copyFileSync(path.resolve(pathToEx, file), dest);
      }
    }
    const themeMeta = `:theme-meta {
      --name: "${freedeck.title}";
      --description: "${description}";
      --author: "${author}";
      --version: "${version}";
      }\n`;  
    fs.appendFileSync(path.resolve(`webui/hooks/_themes/${name}.css`), themeMeta);

    fs.appendFileSync(path.resolve(`webui/hooks/_themes/${name}.css`), fs.readFileSync(path.resolve(pathToEx, main)));
  }
  console.log(`${picocolors.blue("Plugins / FDPackage")} >> ${picocolors.green(`${freedeck.type === 'plugin' ? "Plugin": "Theme"} loaded: ${freedeck.title} (${name})`)}`);
}


module.exports = openPackage