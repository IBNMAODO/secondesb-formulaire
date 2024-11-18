const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000; 

app.use(cors()); 
app.use(bodyParser.json());

app.get('/feedbacks', (req, res) => {
    fs.readFile('feedbacks.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture des feedbacks.' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/feedbacks', (req, res) => {
    const { nom, prenom, avis } = req.body;

    if (!nom || !prenom) {
        return res.status(400).json({ error: 'Nom et prénom sont obligatoires.' });
    }

    fs.readFile('feedbacks.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture des feedbacks.' });
        }

        const feedbacks = JSON.parse(data);
        feedbacks.push({ nom, prenom, avis });
        
        fs.writeFile('feedbacks.json', JSON.stringify(feedbacks, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'enregistrement des feedbacks.' });
            }
            res.status(201).json({ message: 'Feedback ajouté avec succès.' });
        });
    });
});

app.delete('/feedbacks', (req, res) => {
    fs.writeFile('feedbacks.json', '[]', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la réinitialisation des feedbacks.' });
        }
        res.json({ message: 'Feedbacks réinitialisés.' });
    });
});

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté.');

    
    socket.on('user_connect', () => {
        console.log('Utilisateur connecté sur index.html');
        io.emit('loading_start'); 
    });

   
    socket.on('user_disconnect', () => {
        console.log('Utilisateur déconnecté de index.html');
        io.emit('loading_end');
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté.');
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
