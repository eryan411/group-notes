const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = process.env.PORT
require('dotenv').config

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'notes'


MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
.then(client => {
    console.log('Connected to Database');
    db = client.db('group-notes')
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req, res) => {
    const userNames = await db.collection('notes').distinct('author')
    const itemstext = await db.collection('notes').find().toArray()
    const itemsLeft = await db.collection('notes').countDocuments()
    res.render('index.ejs', {info: itemstext, total: itemsLeft, users: userNames})
})

app.post('/addNote', (req, res) => {
    db.collection('notes').insertOne({note: req.body.note, author: req.body.author, date: req.body.date, completed: false})
    .then(result => {
        console.log(`${req.body.author} has added a note on ${req.body.date}, set to ${req.body.completed}`)
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markcomplete', (req, res) => {
    db.collection('notes').updateOne(
        {
            $and: [
                {note: req.body.itemFromJS},
                {author: req.body.author},
                {date: req.body.date}
            ]
        },
        {
            $set: {
                completed: true
            }
        },
        {
            sort: {_id: -1},
            upsert: false
        }
    ).then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    }).catch(error => console.error)
    
})


app.put('/markUnComplete', (req, res) => {
    db.collection('notes').updateOne(
    {
        $and: [
            {note: req.body.itemFromJS},
            {author: req.body.author},
            {date: req.body.date}
        ]
    },{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.listen(PORT || 8000, () => {
    console.log(`Your app is running on ${PORT || 8000}`)
})