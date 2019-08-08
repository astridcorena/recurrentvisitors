const express = require('express');
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
app.set('view engine', 'pug');
app.set('views', 'views');
//definimos el schema
const VisitorSchema = new mongoose.Schema({
  name : {type: String},
  count : {type: Number}
});
//definimos el modelo
const Visitor = mongoose.model("Visitor", VisitorSchema);

app.get("/", async(req, res) => {
var visitor
var name = req.query.name || 'Anónimo';
if(name === 'Anónimo')
 visitor = new Visitor({name: name, count:1});
 else{
   visitor = await Visitor.findOne({name: name})
   if(visitor)
    visitor.count +=1;
    else
    visitor = new Visitor({name: name, count: 1});
 }
  await visitor.save()
  const visitors = await Visitor.find()
  res.render('visitors', {visitors: visitors})
});

app.listen(3000, () => console.log("Listening on port 3000 ..."));
