/**
 * converts the raw uploaded JSON into a format that is legible to the diagrams
 *
 * @param file - The JSON Object to be converted
 * @returns The new JSON Object
 */
export default function processUploadedJSON(file: Object) {
  const newJSON = {
    nodes: [],
    links: { haru: [], user: [] },
    attributes: {},
  };
  console.log(newJSON)
}
