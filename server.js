const express = require('express');
const app = express();

let data = [
  {
    id: 1,
    text: 'Hello from Tom',
    from: 'Tom',
    timeSent: '2020-10-26T10:09:02.016Z',
  },
  {
    id: 2,
    text: 'Hello from Jerry',
    from: 'Jerry',
    timeSent: '2020-10-26T10:09:02.016Z',
  },
  {
    id: 3,
    text: 'Hello from Mickey',
    from: 'Mickey',
    timeSent: '2020-10-26T10:09:02.016Z',
  },
];

// read body data as json
app.use(express.json());

// get all messages
app.get('/messages', (req, res) => {
  res.json({ success: true, data });
});

// get messages by search term
app.get('/messages/search', (req, res) => {
  const { term } = req.query;
  const matchingMessages = data.filter((msg) =>
    msg.text.toLowerCase().includes(term.toLowerCase())
  );
  res.json({ success: true, data: matchingMessages });
});

// get latest 10 messages
app.get('/messages/latest', (req, res) => {
  const latest10 = data.slice(-10);
  res.json({ success: true, data: latest10 });
});

// create a new message
app.post('/messages', (req, res) => {
  const message = req.body;
  if (message.text && message.from) {
    message.id = data.length + 1;
    message.timeSent = new Date();
    data.push(message);
    res.json({ success: true, message: 'Your message has been added.' });
  } else {
    res.status(400).json({
      success: false,
      message: 'No "text" or "from" has been supplied.',
    });
  }
});

app.put('/messages/edit/:id', (req, res) => {
  const id = Number(req.params.id);
  const message = req.body;

  if (!message.text || !message.from) {
    return res
      .status(400)
      .json({ success: false, message: "Message 'text' or 'from' missing." });
  }

  if (checkIfExists(id)) {
    data.map((msg) => {
      if (msg.id === id) {
        msg.text = message.text;
        msg.from = message.from;
      }
      return msg;
    });
    res.json({ success: true, message: 'Message updated' });
  } else {
    res
      .status(400)
      .json({ success: false, message: `Message with id ${id} don't exist.` });
  }

  function checkIfExists(id) {
    return data.find((msg) => msg.id === id);
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
