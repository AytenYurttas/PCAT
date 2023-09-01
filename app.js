const expresss =require('express')

const app =expresss();
app.get('/',(req,res)=>{
    res.send('merhaba')
});
const port =3000;
app.listen(port, ()=>{
    console.log(`sunucu ${port} portunda başlatıldı..`)
});