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
app.get('/',async (req,res)=>{
    const photos = await Photo.find({}).sort('-uploadeAt');
    res.render("index",{
      photos
    })
});

app.get('/photos/:id', async(req,res)=>{
  const photo = await Photo.findById(req.params.id)
  res.render('photo',{
    photo
  })
});

app.get('/about',(req,res)=>{
    res.render("about")
});

app.get('/add',(req,res)=>{
    res.render("add")
});

app.post('/photos',async (req,res)=>{

  // console.log(req.files.image);
  // await Photo.create(req.body)
  // res.redirect('/');
  
  const  uploadeDir = 'public/uploads';

  if(!fs.existsSync(uploadeDir)){
    fs.mkdirSync(uploadeDir)
  }
  
  let uploadeImage = req.files.image
  let uploadPath =  __dirname + '/public/uploads/' + uploadeImage.name;
  
  uploadeImage.mv(uploadPath, async ()=> {
  await Photo.create({
    ...req.body,
    image:'/uploads/' + uploadeImage.name
  });
  res.redirect('/');
  });
});


app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title
  photo.description = req.body.description
  photo.save()

  res.redirect(`/photos/${req.params.id}`)
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

const port =3000;
app.listen(port, ()=>{
    console.log(`sunucu ${port} portunda başlatıldı..`)
});