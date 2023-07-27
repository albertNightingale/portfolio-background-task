export function scrapeContentList($: cheerio.Root) {
  // get all ul tags
  const projectList: Array<Map<string, string>> = $("ul").get()
    .map((el) => {
      const children = $(el).children().get();
      if (children.length > 0) {
        const dict = new Map<string, string>();
        children.forEach((el) => {
          const text = $(el).text();
          const splitIdx = text.indexOf(": ") + 2;
          const key = text.substring(0, splitIdx - 2).trim();
          const value = text.substring(splitIdx).trim();
          if (dict.has(key)) {
            throw new Error(`duplicate key ${key} when scraping the google doc, please check the google doc containing ${el}`);
          }
          dict.set(key, value);
        });
        return dict;
      }
      return null;
    })
    .filter(el => el !== null) as Array<Map<string, string>>;

  return projectList;
}

export function scrapeHeader($: cheerio.Root) {
  // get all h1 tags
  const titles = $("h1").get().map((el) => $(el).text());
  return titles;
}
