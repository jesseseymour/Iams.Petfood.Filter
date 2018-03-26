#!/bin/bash
webpack -p --config webpack.prod.js
cp ./dist/assets/bundle.min.js ../SitefinityWebApp/Content/WildFrontier/dist/js/bundle.min.js