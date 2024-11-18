document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const passwordInput = document.getElementById('password').value;
    const correctPassword = "AdminSbClass@25";

    if (passwordInput === correctPassword) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        window.location.href = 'admin.html';
    } else {
        document.getElementById('errorMessage').textContent = 'Mot de passe incorrect. Veuillez réessayer.';
    }
});
