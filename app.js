//NODE MODULES
const express = require('express');
const mongoose= require('mongoose');
const fileUpload = require('express-fileupload'); 
const methodOverride = require('method-override');
const path = require('path');
const ejs =require('ejs');
const fs = require('fs');
const Photo =require('./models/Photo');
const dotenv = require('dotenv');
dotenv.config();
const photoController = require('./controllers/photoControllers');
const pageController =require('./controllers/pageControllers');
const app = express();


// CONNECT MONGODB
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('db çalıştı');
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
  });


//TEMPLATE ENGİNE
app.set("view engine","ejs");

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method',{
  methods:['POST','GET']
}));


//ROUTES
app.get('/',photoController.getAllPhotos);
app.get('/photos/:id',photoController.getPhoto );
app.post('/photos',photoController.creatPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);


app.get('/about',pageController.getAboutPage);
app.get('/add',pageController.getAddPage);
app.get('/photos/edit/:id',pageController.getEditPage);



const port =3000;
app.listen(port, ()=>{
    console.log(`sunucu ${port} portunda başlatıldı..`)
});