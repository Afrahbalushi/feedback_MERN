import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ text: '', column: 'To Do' });

  
  useEffect(() => {
    axios.get('http://localhost:5000/cards')
      .then(response => setCards(response.data))
      .catch(error => console.error('Error fetching cards:', error));
  }, []);

  
  const handleAddCard = () => {
    if (!newCard.text.trim()) return;

    axios.post('http://localhost:5000/cards', newCard)
      .then(response => {
        setCards([...cards, response.data]);
        setNewCard({ text: '', column: 'To Do' });
      })
      .catch(error => console.error('Error adding card:', error));
  };

 
  const handleDeleteCard = (id) => {
    axios.delete(`http://localhost:5000/cards/${id}`)
      .then(() => {
        setCards(cards.filter(card => card._id !== id));
      })
      .catch(error => console.error('Error deleting card:', error));
  };


  const renderCardsByColumn = (column) => {
    return cards.filter(card => card.column === column).map(card => (
      <div className="card" key={card._id}>
        <div className="card-header">
          <button onClick={() => handleDeleteCard(card._id)}>Delete</button>
        </div>
        <p>{card.text}</p>
      </div>
    ));
  };

  return (
    <div className="app">
      <h1>Feedback Here!</h1>
      <div className="columns">
        <div className="column">
          <h2>To Do</h2>
          <hr className='hrgreen'></hr>
          {renderCardsByColumn('To Do')}
        </div>
        <div className="column">
          <h2>Went Well</h2>
          <hr className='hrred'></hr>
          {renderCardsByColumn('Went Well')}
        </div>
        <div className="column">
          <h2>Action Items</h2>
          <hr className='hrpurple'></hr>
          {renderCardsByColumn('Action Items')}
        </div>
      </div>

      <div className="add-card">
        <input
          type="text"
          placeholder="Card text"
          value={newCard.text}
          onChange={(e) => setNewCard({ ...newCard, text: e.target.value })}
        />
        <select
          value={newCard.column}
          onChange={(e) => setNewCard({ ...newCard, column: e.target.value })}
        >
          <option value="To Do">To Do</option>
          <option value="Went Well">Went Well</option>
          <option value="Action Items">Action Items</option>
        </select>
        <button onClick={handleAddCard}>Add Card</button>
      </div>
    </div>
  );
};

export default App;
