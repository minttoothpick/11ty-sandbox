const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

module.exports = function (eleventyConfig) {

  /* Shortcodes
   ======================================================================== */
  
  /**
   * https://youtu.be/YDNouZ8ozv0
   */
  eleventyConfig.addNunjucksShortcode("button", (props) => {
    // Get path to the include we made
    const filePath = path.join(__dirname, "src/_includes/button.njk");
    // Make sure file exists
    if (!fs.existsSync(filePath)) {
      return "File does not exist.";
    }
    // Read the file to get its content
    const content = fs.readFileSync(filePath).toString();
    // Render content
    return nunjucks.renderString(content, { button: props });
  });

  /**
   * Format author string
   */
  eleventyConfig.addFilter("formatAuthor", (string) => {
    var newString = "";
    let arr = string.split(";");
    arr.forEach((item, index, arr) => {
      // If there's only one author, do nothing
      if (arr.length === 1) {
        return newString = item;
      }
      // If this is last item, do nothing
      if (index === arr.length - 1) {
        newString += item;
      // If this is penultimate item and there are only two, don't add comma
      } else if (index === arr.length - 2 && arr.length === 2) {
        newString += item + " and ";
      // If this is penultimate item, add "and"
      } else if (index === arr.length - 2 && arr.length > 2) {
        newString += item + ", and ";
      // Otherwise, add a comma
      } else {
        newString += item + ", ";
      }
    });
    return newString;
  });

  /**
   * Return book title before colon (subtitle)
   */
  eleventyConfig.addFilter("removeSubtitle", (str) => {
    return str.split(":", 1);
  });

  eleventyConfig.addCollection("booksFinished", (collection) => {
    const books = collection.getAll()[0].data.books.filter(d => 
      (d.finish.length > 0) &&
      (d.finish != "Reading") &&
      (d.finish != "Shelved") &&
      (d.finish != "0")
    );
    // Sort books by finish date
    return books.sort((a, b) => (b.finish) > (a.finish) ? 1 : -1);
  });

  eleventyConfig.addCollection("booksReading", (collection) => {
    const books = collection.getAll()[0].data.books.filter(d => (d.finish == "Reading"));
    // Sort books by start date
    return books.sort((a, b) => (b.start) > (a.start) ? 1 : -1);
  });

  /**
   * Add CSV as custom data file format
   * 
   * https://maxkoehler.com/posts/eleventy-csv/
   */
  const parse = require("csv-parse/lib/sync");
  eleventyConfig.addDataExtension("csv", (contents) => {
    const records = parse(contents, {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  });

  eleventyConfig.addPassthroughCopy("./src/css");

  /**
   * Config
   *
   * https://www.11ty.dev/docs/config/
   */
  return {
    // Use Nunjucks
    markdownTemplateEngine: "njk",
    // Override default input and output directories
    dir: {
      input: "src",
      output: "_site"
    }
  };

};