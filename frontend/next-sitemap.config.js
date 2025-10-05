/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.lerah.in", 
  generateRobotsTxt: true, 
  sitemapSize: 7000, 
  exclude: ["/admin/*", "/cart", "/checkout"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://www.lerah.in/sitemap.xml"],
  },
};
