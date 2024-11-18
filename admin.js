const socket = io('https://secondesb-formulaire.onrender.com');

window.onload = function() {
    if (!localStorage.getItem('isAdminAuthenticated')) {
        window.location.href = 'admin-login.html';
    }

    updateAdminTable();

    socket.on('loading_start', function() {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.style.display = 'block'; 
        }
    });

    socket.on('loading_end', function() {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.style.display = 'none'; 
        }
    });

    socket.on('newFeedback', function(feedback) {
        const feedbackTable = document.getElementById('feedbackTable').getElementsByTagName('tbody')[0];
        const row = feedbackTable.insertRow();
        row.insertCell(0).textContent = feedback.nom;
        row.insertCell(1).textContent = feedback.prenom;
        row.insertCell(2).textContent = feedback.avis ? feedback.avis : 'Aucun avis';
    });

    document.getElementById('resetButton').addEventListener('click', function() {
        if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
            fetch('https://secondesb-formulaire.onrender.com/feedbacks', { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    updateAdminTable();
                })
                .catch(err => {
                    alert('Erreur lors de la réinitialisation.');
                });
        }
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('isAdminAuthenticated');
        window.location.href = 'admin-login.html'; 
    });
};

function updateAdminTable() {
    fetch('https://secondesb-formulaire.onrender.com/feedbacks')
        .then(response => response.json())
        .then(feedbacks => {
            const feedbackTable = document.getElementById('feedbackTable').getElementsByTagName('tbody')[0];
            feedbackTable.innerHTML = '';

            if (feedbacks.length > 0) {
                feedbacks.forEach(feedback => {
                    const row = feedbackTable.insertRow();
                    row.insertCell(0).textContent = feedback.nom;
                    row.insertCell(1).textContent = feedback.prenom;
                    row.insertCell(2).textContent = feedback.avis ? feedback.avis : 'Aucun avis';
                });
            } else {
                const row = feedbackTable.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 3;
                cell.textContent = 'Aucun feedback disponible.';
                cell.style.textAlign = 'center';
            }
        })
        .catch(err => {
            document.getElementById('feedbackStatus').textContent = 'Erreur de récupération des données.';
        });
}
