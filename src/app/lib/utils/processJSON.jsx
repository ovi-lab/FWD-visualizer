import { promises as fs } from 'fs';
/**
 * converts the raw uploaded JSON into a format that is legible to the diagrams
 *
 * @param file - The JSON Object to be converted
 * @returns The new JSON Object
 */
export default async function processUploadedJSON() {
  const newJSON = {
    nodes: [],
    links: { haru: [], user: [] },
    attributes: {},
  };
console.log(process.cwd())
  const file = await fs.readFile(process.cwd() + 'data/log-01_22_2024, 06_22_56 PM.json', 'utf8')
  console.log(file)
  
}
