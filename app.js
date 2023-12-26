const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const dotenv = require('dotenv');
const path = require("path");
const fs = require('fs');
const authRoutes = require("./Routes/auth");
const expenseRoutes = require("./Routes/expense");
const purchaseRoutes = require("./Routes/purchase");
const passwordRoutes = require("./Routes/password")
const sequelize = require("./Util/database");
const User = require("./Models/user");
const Expense = require("./Models/expense");
const Order = require("./Models/order");
const Forgotpassword = require("./Models/forgotpassword");
const Expensedownload = require("./Models/downloadexpense");

const app = express();

const builtPath = path.join(__dirname, "../ExpenseTrackerFrontend/dist");

dotenv.config();

// const accessLogs = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(bodyParser.json({ limit: '1mb' }))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',  // Allow requests from this origin
  methods: ['OPTIONS', 'POST', 'GET', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorisation'],  // Allow these headers
}));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Origin-Agent-Cluster', 'true');
  next();
});
app.use("/user/", authRoutes);
app.use("/expense/", expenseRoutes);
app.use("/purchase/", purchaseRoutes);
app.use("/password/", passwordRoutes);
app.use(express.static(builtPath));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../ExpenseTrackerFrontend/dist/index.html"));
})

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
Forgotpassword.hasMany(User);
User.belongsTo(Forgotpassword);
User.hasMany(Expensedownload);
Expensedownload.belongsTo(User)

sequelize
  // .sync({force:true})
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is running on port 3000");
    });const express = require("express");
    const bodyParser = require("body-parser");
    const cors = require("cors");
    const dotenv = require('dotenv');
    const path = require("path");
    const fs = require('fs');
    const https = require('https');
    const authRoutes = require("./Routes/auth");
    const expenseRoutes = require("./Routes/expense");
    const purchaseRoutes = require("./Routes/purchase");
    const passwordRoutes = require("./Routes/password");
    const sequelize = require("./Util/database");
    const User = require("./Models/user");
    const Expense = require("./Models/expense");
    const Order = require("./Models/order");
    const Forgotpassword = require("./Models/forgotpassword");
    const Expensedownload = require("./Models/downloadexpense");
    
    const app = express();
    
    dotenv.config();
    
    const options = {
      key: fs.readFileSync('/etc/letsencrypt/live/expensetracker.uk.to/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/expensetracker.uk.to/fullchain.pem'),
    };
    
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors({
      origin: '*',
      methods: ['OPTIONS', 'POST', 'GET', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorisation'],
    }));
    
    app.use((req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Origin-Agent-Cluster', 'true');
      next();
    });
    
    app.use("/user/", authRoutes);
    app.use("/expense/", expenseRoutes);
    app.use("/purchase/", purchaseRoutes);
    app.use("/password/", passwordRoutes);
    app.use(express.static(builtPath));
    app.use((req, res) => {
      res.sendFile(path.join(__dirname, "../ExpenseTrackerFrontend/dist/index.html"));
    });
    
    User.hasMany(Expense);
    Expense.belongsTo(User);
    User.hasMany(Order);
    Order.belongsTo(User);
    Forgotpassword.hasMany(User);
    User.belongsTo(Forgotpassword);
    User.hasMany(Expensedownload);
    Expensedownload.belongsTo(User);
    
    sequelize.sync().then(() => {
      const server = https.createServer(options, app);
    
      server.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port 3000");
      });
    }).catch((err) => {
      console.log(err);
    });
    
  }).catch((err) => { console.log(err) })


