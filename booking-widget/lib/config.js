const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  apiBaseUrl: isDevelopment ? "https://localhost:5221/api" : "https://jobplanner.ru/api",
  staticBaseUrl: isDevelopment ? "https://localhost:5221" : "https://jobplanner.ru",
  widgetPort: 3001,
  widgetPublicPath: isDevelopment ? "https://localhost:3001/" : "https://jobplanner.ru/widget/",
  widgetCssPath: isDevelopment ? "https://localhost:3001/booking-widget.css" : "https://jobplanner.ru/widget/booking-widget.css",
  widgetJsPath: isDevelopment ? "https://localhost:3001/booking-widget.js" : "https://jobplanner.ru/widget/booking-widget.js",
};

module.exports = config;
module.exports.config = config; 