/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
 import '@angular/localize/init';
 import 'zone.js/dist/zone-node';
 const fs = require('fs')
 const https = require('https')
 
 import { ngExpressEngine } from '@nguniversal/express-engine';
 import * as express from 'express';
 import { join } from 'path';
 
 
 import { isDevMode } from '@angular/core';
 
 import { AppServerModule } from './src/main.server';
 import { APP_BASE_HREF } from '@angular/common';
 import { existsSync } from 'fs';
//  import { Meta } from 'src/app/models/model';
 import axios from 'axios';
 const PRODUCTION = false
 
 // The Express app is exported so that it can be used by serverless Functions.
 export function app(): express.Express {
   const server = express();
   var distFolder = join(process.cwd(), 'dist/SuperVisor/browser');;
   /* if(PRODUCTION){
     distFolder = join('/var/www/html/StudentKare/dist/Angular-SSR-Demo/browser');
   }else{
     distFolder = join(process.cwd(), 'dist/Angular-SSR-Demo/browser');
   } */
   const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
   const domino = require('domino');
   const win = domino.createWindow(indexHtml);
   // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
   server.engine('html', ngExpressEngine({
     bootstrap: AppServerModule,
   }));
 
   global['window'] = win;
   global['document'] = win.document;
   global['navigator'] = win.navigator;
   
 
   server.set('view engine', 'html');
   server.set('views', distFolder);
 
   // Example Express Rest API endpoints
   // server.get('/api/**', (req, res) => { });
   // Serve static files from /browser
   server.get('*.*', express.static(distFolder, {
     maxAge: '1y'
   }));
 
   const addMetaInfo = (metaObj:any,html:string) => {
 
     html = html.replace(/\$TITLE/g, metaObj.title );
     html = html.replace(/\$DESCRIPTION/g, metaObj.description);
     html = html.replace(/\$OG_META_KEYWORDS/g,metaObj.og_meta_keywords);
     html = html.replace(/\$OG_META_DESCRIPTION/g, metaObj.og_meta_description);
     html = html.replace(/\$OG_DESCRIPTION/g, metaObj.og_description);
     html = html.replace(/\$OG_TITLE/g, metaObj.og_title);
     html = html.replace(/\$OG_IMAGE/g,metaObj.og_image );
     html = html.replace(/\$OG_SITE/g, metaObj.og_site);
 
     return html
   }
 
   // All regular routes use the Universal engine
   // header 
   server.get('/*', (req, res) => {
     console.log(indexHtml)
 
     res.render(indexHtml, {req, res}, (err, html) => {
       if(err){
         console.log(err);
         
       }
       if (html) {
           // This is where you get hold of HTML which "is about to be rendered"      
           // after some conditional checks make a HTTP call
           html = addMetaInfo({
             title : "SuperVisor - Home",
             description : "SuperVisor Description",
             og_meta_keywords : "SuperVisor",
             og_meta_description : "SuperVisor",
             og_description : "SuperVisor",
             og_title : "SuperVisor",
             og_image : "SuperVisor",
             og_site : "SuperVisor",
           },html)
          res.send(html);
 
        }
     })
   }
     // res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
   );
 
 
 
   return server;
 }
 
 function run(): void {
   const port = process.env.PORT || 4007;
   console.log(isDevMode())
   // Start up the Node server
   
   if(isDevMode()){
     const server = app();
     server.listen(port, () => {
       console.log(`Node Express server listening on http://localhost:${port}`);
     });
   }else{
     var options = {
       key: fs.readFileSync('/etc/letsencrypt/live/production.promaticstechnologies.com/privkey.pem', 'utf8'),
       cert: fs.readFileSync('/etc/letsencrypt/live/production.promaticstechnologies.com/fullchain.pem', 'utf8')
       //key: fs.readFileSync('/var/www/html/privkey.pem', 'utf8'),
       //cert: fs.readFileSync('/var/www/html/fullchain.pem', 'utf8')
     };
 
     var httpsServer = https.createServer(options, app());
     httpsServer.listen(port,function(){
       console.log(`Node Express server listening on https://localhost:${port}`);
     });
   }
     
 
 
  
 }
 
 // Webpack will replace 'require' with '__webpack_require__'
 // '__non_webpack_require__' is a proxy to Node 'require'
 // The below code is to ensure that the server is run only when not requiring the bundle.
 declare const __non_webpack_require__: NodeRequire;
 const mainModule = __non_webpack_require__.main;
 const moduleFilename = mainModule && mainModule.filename || '';
 if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
   run();
 }
 
 export * from './src/main.server';
 