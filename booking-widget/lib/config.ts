const config = {
  apiBaseUrl: "http://jobplanner.ru/api",
  staticBaseUrl: "http://jobplanner.ru", // для картинок: /images/...
  widgetPort: 3001, // только для dev
  widgetPublicPath: "http://jobplanner.ru/widget/",
  widgetCssPath: "http://jobplanner.ru/widget/booking-widget.css",
  widgetJsPath: "http://jobplanner.ru/widget/booking-widget.js",
};

export { config };
export default config;

// CommonJS support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
  module.exports.config = config;
}