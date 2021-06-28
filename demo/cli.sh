# COMMAND

# * Prerequisites *
sudo npm i -g npm nodemon
npm i -s

# I. REACT CLIENT
cd /workspace/cloud-drive-16/client; clear; npm start
npx create-react-app client
cd client; npm i -s node-sass react-router-dom axios bootstrap@4.6 reactstrap@8.9 --legacy-peer-deps

# II. EXPRESS.JS SERVER
cd /workspace/cloud-drive-16/server; clear; npm start
cd server; npm i -s dotenv mongoose express bcryptjs cors jsonwebtoken passport passport-local lodash nodemailer rimraf

# III. PORTS
kill -9 $(lsof -t -i:3000)