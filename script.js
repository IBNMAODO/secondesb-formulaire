const socket = io('https://secondesb-formulaire.onrender.com');

let isModalOpen = false; 

function highlightInvalidField(field) {
    field.classList.add('invalid');
    setTimeout(() => {
        field.classList.remove('invalid');
    }, 1500);
}

function handleFormSubmit(event) {
    event.preventDefault();


    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const avis = document.getElementById('avis').value.trim();

    let isValid = true;

    if (!nom) {
        highlightInvalidField(document.getElementById('nom'));
        isValid = false;
    }

    if (!prenom) {
        highlightInvalidField(document.getElementById('prenom'));
        isValid = false;
    }

    if (isValid) {
        const feedbackData = { nom, prenom, avis };

        socket.emit('user_disconnect'); 
        document.getElementById('preloader').style.display = 'flex';
        fetch('https://secondesb-formulaire.onrender.com/feedbacks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('preloader').style.display = 'none';
            socket.emit('user_connect'); 
            if (data.message) {
                window.location.href = "reponse.html"; 
            } else {
                alert('Une erreur est survenue.');
            }
        })
        .catch(() => {
            document.getElementById('preloader').style.display = 'none';
            socket.emit('user_connect'); 
            alert('Erreur de connexion avec le serveur.');
        });
    } else {
        alert('Veuillez remplir tous les champs obligatoires.');
    }
}

document.getElementById('feedbackForm').addEventListener('submit', handleFormSubmit);


['nom', 'prenom', 'avis'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    field.addEventListener('input', () => {
        field.classList.remove('invalid');
        socket.emit('user_connect');
    });
});
