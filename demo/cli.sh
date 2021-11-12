# COMMAND

# * Prerequisites *
sudo npm i -g npm nodemon
npm i -s

# I. REACT CLIENT
cd /workspace/cloud-drive-16/client; clear; npm start
npx create-react-app client
cd client; npm i -s node-sass react-router-dom axios bootstrap@4.6 reactstrap@8.9 --legacy-peer-deps
heroku login
heroku create clouddrive16
xdg-open https://dashboard.heroku.com/apps/clouddrive16/settings
git init
heroku git:remote -a clouddrive16
git add .
git commit -am "Create client"
git branch -m main
git push heroku main

# II. EXPRESS.JS SERVER
cd /workspace/cloud-drive-16/server; clear; npm start
mkdir server; cd server; mkdir src; touch src/index.js; npm init
cd server; npm i -s dotenv mongoose express bcryptjs cors jsonwebtoken passport passport-local lodash nodemailer rimraf
heroku login
heroku create clouddrive16-server
xdg-open https://dashboard.heroku.com/apps/clouddrive16-server/settings
git init
heroku git:remote -a clouddrive16-server
git add .
git commit -am "Create server"
git branch -m main
git push heroku main

# III. PORTS
kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:5000)
