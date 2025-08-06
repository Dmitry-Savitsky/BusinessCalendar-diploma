const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  apiBaseUrl: isDevelopment ? "http://localhost:5221/api" : "https://jobplanner.ru/api",
  staticBaseUrl: isDevelopment ? "http://localhost:5221" : "https://jobplanner.ru",
  widgetPort: 3001, // только для dev
  widgetPublicPath: isDevelopment ? "http://localhost:3001/" : "https://jobplanner.ru/widget/",
  widgetCssPath: isDevelopment ? "http://localhost:3001/booking-widget.css" : "https://jobplanner.ru/widget/booking-widget.css",
  widgetJsPath: isDevelopment ? "http://localhost:3001/booking-widget.js" : "https://jobplanner.ru/widget/booking-widget.js",
};

export { config };
export default config;

// CommonJS support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
  module.exports.config = config;
}