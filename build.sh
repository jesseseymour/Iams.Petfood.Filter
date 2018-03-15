#!/bin/bash
webpack -p --config webpack.prod.js
cp ./dist/assets/bundle.min.js ../SitefinityWebApp/Content/WildFrontier/js/bundle.min.js