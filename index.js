const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(express.static('dist'))
app.use(express.json());
app.use(cors());
morgan.token('body', (req, res)=> JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')); 


/*const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger);*/

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(req, res) => {
    res.json(persons);
})
app.get('/api/info',(req, res) => {
    const date = new Date();
    //console.log(date);
    res.send(`phonebook has info for ${persons.length} people <br/> ${date}`);
})
app.get('/api/persons/:id',(req, res)=>{
   const id = Number(req.params.id);
   const person = persons.find(person => person.id === id);
   if(person){
    res.json(person);
   }
   else{
    res.status(404).end();
   }
})

app.delete('/api/persons/:id', (req,res)=>{
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id)
    res.status(204).end();
})

app.post('/api/persons',(req, res)=>{
    const request = req.body;
    if(persons.find(person => person.name.toLowerCase() === request.name.toLowerCase())){
        return res.status(400).json({error: 'name must be unique'});
    }
    else if(!request.name){
        return res.status(400).json({error: "name is missing"});
    }
    else if(!request.number){
        return res.status(400).json({error: "number is missing"});
    }
    else{
        const id = Math.floor(Math.random()*1000000);
        const newPerson = {...request, "id":id};
        persons = [...persons, newPerson];
        //console.log(newPerson);
        res.json(request);
    }
})


const PORT = 3001;
app.listen(PORT);
console.log("Server is running on port 3001");
