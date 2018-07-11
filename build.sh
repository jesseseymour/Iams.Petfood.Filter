#!/bin/bash
env NODE_ENV=production webpack -p --config webpack.prod.js
cp ./dist/productfilter.min.js ../iams/MarsIamsWebApp/App_Data/Sitefinity/WebsiteTemplates/BaseTemplate/js/productfilter.min.js
