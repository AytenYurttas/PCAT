const mongoose= require('mongoose');

const{Schema}= mongoose

const photoSchema= new Schema({
    title:{
        type: String,
        require: true,
        
    },
    description:{
        type: String,
        require:true,
       
    },
    image:{
        type: String,
        
    },
    uploadeAt:{
        type: Date,
        default: Date.now,
    },
});

const Photo = mongoose.model('Photo',photoSchema)

module.exports = Photo;