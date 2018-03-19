# WildFrontier.Petfood.Filter

This is a ReactJS based site used in the Wild Frontier web site. This repo has the source code and tools
to make it easy

## Getting Started

Run `npm install` to install the needed node modules.  

After opening the main solution with Visual Studio and starting the SitefinityWebApp website, you can run this
site using `npm start`. This will start the webpack-dev-server to proxy the main SitefinityWebApp website to fetch
data from the /api/ web services.

When ready to test your React code changes in the main site run `npm run build`, which will compile the 
react code in production mode and copy the *bundle.min.js* file to the correct folder in the SitefinityWebApp
website.

