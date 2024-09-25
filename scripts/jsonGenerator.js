const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const JSON_FOLDER = "./.json";
const CONTENT_ROOT = "src/content";
const CONTENT_DEPTH = 3;

// get data from markdown
const getData = (folder, groupDepth) => {
  const dir = path.join(CONTENT_ROOT, folder);
  return fs
    .readdirSync(dir)
    .filter(
      (filename) =>
        !filename.startsWith("-") &&
        (filename.endsWith(".md") || filename.endsWith(".mdx")),
    )
    .flatMap((filename) => {
      const filepath = path.join(dir, filename);
      const stats = fs.statSync(filepath);
      const isFolder = stats.isDirectory();

      if (isFolder) {
        return getData(filepath, groupDepth);
      } else {
        const file = fs.readFileSync(filepath, "utf-8");
        const { data, content } = matter(file);
        const pathParts = filepath.split(path.sep);

        let slug;
        if (data.slug) {
          slug = data.slug;
        } else {
          slug = pathParts
            .slice(CONTENT_DEPTH)
            .join("/")
            .replace(/\.[^/.]+$/, "");
        }
        data.slug = slug;
        const group = "content";

        return {
          group: group,
          slug: data.slug,
          frontmatter: data,
          content: content,
        };
      }
    })
    .flat();
};

try {
  // create folder if it doesn't exist
  if (!fs.existsSync(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER);
  }

  // create json files
  fs.writeFileSync(
    `${JSON_FOLDER}/content.json`,
    JSON.stringify(getData("content", 3)),
  );

  // merge json files for search
  const content = require(`../${JSON_FOLDER}/content.json`);
  const search = [...content];
  fs.writeFileSync(`${JSON_FOLDER}/search.json`, JSON.stringify(search));
} catch (err) {
  console.error(err);
}
