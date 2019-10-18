import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFilePath);

const configFile = fs.readFileSync(path.resolve(thisDir, 'package.json'));
const config = JSON.parse(configFile);

export function getName() {
  return config.name;
}

export function getVersion() {
  return config.version;
}
