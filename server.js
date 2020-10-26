const express = require('express');
const app = express();

let data = [
  {
    id: 1,
    text: 'Hello from Tom',
    from: 'Tom',
  },
  {
    id: 2,
    text: 'Hello from Jerry',
    from: 'Jerry',
  },
  {
    id: 3,
    text: 'Hello from Mickey',
    from: 'Mickey',
  },
];

app.use(express.json());

// get all messages
app.get('/messages', (req, res) => {
  res.json(data);
});

// create a new message
app.post('/messages', (req, res) => {
  const message = req.body;
  if (message.text && message.from) {
    message.id = data.length + 1;
    data.push(message);
    res.json({ success: true, message: 'Your message has been added.' });
  } else {
    res.json({
      success: false,
      message: 'No "text" or "from" has been supplied.',
    });
  }
});

// Get message by specified id
app.get('/messages/:id', (req, res) => {
  const { id } = req.params;
  const message = data.filter((msg) => msg.id === id);
  if (message.length > 0) {
    res.json({ success: true, message });
  } else {
    res.json({
      success: false,
      message: `No message with id ${id} was found.`,
    });
  }
});

// Delete message by specified id
app.delete('/messages/:id', (req, res) => {
  const { id } = req.params;
  data = data.filter((msg) => msg.id !== id);

  res.json({ success: true, message: 'Message deleted.' });
});

app.listen(3000, () => console.log(`Server listening on port 3000`));
