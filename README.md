# waitui-express-jade
waitui node-express project with jade template engine

## Install express-generator
Assuming you’ve already installed Node.js。

Use the application generator tool, express-generator, to quickly create an application skeleton。

```
npm install express-generator -g
express --view waitui-express-jade

   create : waitui-express-jade
   create : waitui-express-jade/package.json
   create : waitui-express-jade/app.js
   create : waitui-express-jade/public
   create : waitui-express-jade/public/javascripts
   create : waitui-express-jade/public/images
   create : waitui-express-jade/routes
   create : waitui-express-jade/routes/index.js
   create : waitui-express-jade/routes/users.js
   create : waitui-express-jade/public/stylesheets
   create : waitui-express-jade/public/stylesheets/style.css
   create : waitui-express-jade/views
   create : waitui-express-jade/views/index.jade
   create : waitui-express-jade/views/layout.jade
   create : waitui-express-jade/views/error.jade
   create : waitui-express-jade/bin
   create : waitui-express-jade/bin/www
```
If you want to use other template engine(like ejs)(defaults to jade), then
```
express --view=ejs myapp
```
Then install dependencies:
```
cd waitui-express-jade
npm install
```
Run the app:
```
npm start
```
Then load http://localhost:3000/ in your browser to access the app
