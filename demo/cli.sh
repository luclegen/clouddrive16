# COMMAND

# * Prerequisites *
sudo npm i -g npm nodemon
npm i -s

# I. REACT CLIENT
cd /workspace/cloud-drive-16/client; clear; npm start
npx create-react-app client --template redux
cd client; npm i -s node-sass react-router-dom axios bootstrap reactstrap react-circular-progressbar

# 1. ESLint: https://youtu.be/BVnwGwq9Ca4?si=34Wvhsf8PHAsiODD
npm i -D eslint eslint-config-prettier
npm i -D --save-exact prettier
npm init @eslint/config
npx eslint --init

# 2. Material UI
npm i -s  @mui/icons-material @mui/material @emotion/styled @emotion/react

# 3. React Avatar Edit
npm i -s react-avatar-edit

# 4. i18n
npm i -s i18next i18next-xhr-backend react-i18next i18next-browser-languagedetector

# 5.Heroku
heroku login
heroku create clouddrive16
xdg-open https://dashboard.heroku.com/apps/clouddrive16/settings
git init
heroku git:remote -a clouddrive16
git add .
git commit -am "Create web"
git branch -m main
git push heroku main

# II. EXPRESS.JS SERVER
cd /workspace/cloud-drive-16/server; clear; npm start
mkdir server; cd server; mkdir src; touch src/index.js; npm init -y
cd server; npm i -s dotenv mongoose express bcryptjs cors body-parser cookie-parser jsonwebtoken passport passport-local lodash swagger-ui-express swagger-jsdoc nodemailer rimraf i18next i18next-http-middleware i18next-fs-backend eslint prettier eslint-config-prettier prettier-eslint eslint-plugin-prettier jest
npm init @eslint/config
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

# IV. GIT
git remote -v 
git remote remove origin 
git remote add origin git@github.com:luclegen/clouddrive16.git
