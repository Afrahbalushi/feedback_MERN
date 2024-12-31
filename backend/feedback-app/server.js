const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/feedbackApp', {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const cardSchema = new mongoose.Schema({
  text: String,
  column: String,
});

const Card = mongoose.model('Card', cardSchema);

let cards = [];


app.post('/cards', async (req, res) => {
  const { text, column } = req.body;
  
  const newCard = new Card({ text, column });

  try {
    const savedCard = await newCard.save();
    cards.push({
      _id: savedCard._id.toString(),
      text,
      column,
    });

    res.status(201).json(savedCard);  
  } catch (err) {
    console.error('Error creating card:', err);
    res.status(500).send({ message: 'Error creating card' });
  }
});


app.delete('/cards/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid card ID' });
  }

  try {
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).send({ message: 'Card not found' });
    }

    cards = cards.filter(card => card._id !== id);

    res.status(200).send({ message: 'Card deleted successfully' });
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).send({ message: 'Error deleting card' });
  }
});


app.get('/cards', (req, res) => {
  res.status(200).json(cards);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
