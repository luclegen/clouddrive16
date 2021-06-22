# COMMAND

# * Prerequisites *
sudo npm i -g npm nodemon

# I. REACT CLIENT
clear; npm start
npx create-react-app client
cd client; npm i -s node-sass react-router-dom axios bootstrap@4.6 reactstrap@8.9 --legacy-peer-deps

# II. EXPRESS.JS SERVER
clear; npm start
cd server; npm i -s dotenv mongoose express bcryptjs cors jsonwebtoken passport passport-local lodash nodemailer rimraf
