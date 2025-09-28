const express = require('express')
const cors = require('cors')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(cors());
const PORT = process.env.PORT || 3000

const dbPath = path.join(__dirname, 'driverdetails.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`)
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

app.use(express.json())

// Simple route
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// Get ALL driver details
app.get('/driverdetails', async (req, res) => {
  try {
    const getDriverDetail = `
      SELECT *
      FROM driverdata;`
    const detailsArray = await db.all(getDriverDetail)
    res.send(detailsArray)
  } catch (e) {
    res.status(500).send({error: e.message})
  }
})

app.get('/driverdetails/:number', async (req, res) => {
  try {
    const {number} = req.params
    const getDetailsQuery = `
      SELECT *
      FROM driverdata
      WHERE Phonenumber = ?;`
    const details = await db.get(getDetailsQuery, [number])

    if (details) {
      res.send(details)
    } else {
      res.status(404).send({message: 'Driver not found'})
    }
  } catch (e) {
    res.status(500).send({error: e.message})
  }
})




initializeDBAndServer()