#!/bin/bash
webpack --config webpack.prod.js
cp ./dist/assets/bundle.min.js ../Nutro.Web/App_Data/Sitefinity/WebsiteTemplates/Base_Template/App_Themes/WildFrontier/dist/js/bundle.min.js