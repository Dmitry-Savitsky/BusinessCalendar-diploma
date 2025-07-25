const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  apiBaseUrl: isDevelopment ? "http://localhost:5221/api" : "http://jobplanner.ru/api",
  staticBaseUrl: isDevelopment ? "http://localhost:5221" : "http://jobplanner.ru",
  widgetPort: 3001,
  widgetPublicPath: isDevelopment ? "http://localhost:3001/" : "http://jobplanner.ru/widget/",
  widgetCssPath: isDevelopment ? "http://localhost:3001/booking-widget.css" : "http://jobplanner.ru/widget/booking-widget.css",
  widgetJsPath: isDevelopment ? "http://localhost:3001/booking-widget.js" : "http://jobplanner.ru/widget/booking-widget.js",
};

module.exports = config;
module.exports.config = config; 