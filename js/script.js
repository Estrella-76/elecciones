document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const authModule = document.getElementById('authModule');
    const votingModule = document.getElementById('votingModule');
    const statsModule = document.getElementById('statsModule');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const changePasswordForm = document.getElementById('changePasswordForm');

    const formTitle = document.getElementById('formTitle'); // Título principal para Login/Registro
    const formTitleStats = document.getElementById('formTitleStats'); // Título específico para Estadísticas

    // Navegación
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navRegisterBtn = document.getElementById('navRegisterBtn');
    const navVoteBtnContainer = document.getElementById('navVoteBtnContainer');
    const navStatsBtnContainer = document.getElementById('navStatsBtnContainer');
    const navLogoutBtnContainer = document.getElementById('navLogoutBtnContainer');
    const navVoteBtn = document.getElementById('navVoteBtn');
    const navStatsBtn = document.getElementById('navStatsBtn');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    // Módulo I: Login/Registro
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginFromForgotLink = document.getElementById('backToLoginFromForgot');
    const backToLoginFromChangeLink = document.getElementById('backToLoginFromChange');

    // Nuevos elementos para mostrar/ocultar contraseña
    const loginPasswordInput = document.getElementById('loginPassword');
    const toggleLoginPasswordBtn = document.getElementById('toggleLoginPassword');
    const loginPasswordIcon = document.getElementById('loginPasswordIcon');

    // Módulo II: Votación
    const candidatesList = document.getElementById('candidatesList');
    const voteButton = document.getElementById('voteButton');

    // Módulo III: Estadísticas
    let votingChart; // Variable para almacenar la instancia del gráfico

    // --- Datos simulados (LocalStorage) ---
    // Simulación de usuarios registrados. El límite es 10 para usuarios de la demo.
    let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // --- Candidatos Primarios (Basado en la información proporcionada para simulación) ---
    // NOTA: Esta lista se basa en los nombres y partidos/alianzas de la imagen 'image_57e712.png'.
    // Las candidaturas oficiales para 2025 pueden variar y serán definidas por los organismos electorales.
    const candidates = [
        // Candidatos Principales (según la imagen)
        { id: 'cand1', name: 'Eduardo Del Castillo', party: 'MAS-IPSP / Pacto de Unidad', photo: 'imagenes/im1.jpeg' },
        { id: 'cand2', name: 'Samuel Doria Medina', party: 'Unidad Nacional, etc.', photo: 'imagenes/im2.jpg' },
        { id: 'cand3', name: 'Jorge Quiroga Ramírez', party: 'Libre', photo: 'imagenes/im3.png' },
        { id: 'cand4', name: 'Manfred Reyes Villa', party: 'Autonomía Para Bolivia - Súmate', photo: 'imagenes/im4.jpeg' },
        { id: 'cand5', name: 'Jaime Dunn', party: 'Nueva Generación Patriótica', photo: 'imagenes/im5.jpg' },
        { id: 'cand6', name: 'Paulo Rodríguez Folster', party: 'Libertad y Progreso ADN', photo: 'imagenes/im6.jpeg' },

        // Otras precandidaturas/figuras relevantes (según la imagen)
        { id: 'cand7', name: 'Antonio Saravia', party: 'Independiente', photo: 'imagenes/im7.jpg' },
        { id: 'cand8', name: 'José Carlos Sánchez Verazaín', party: 'Independiente', photo: 'imagenes/im8.jpeg' },
        { id: 'cand9', name: 'Leopoldo Chui', party: 'Independiente', photo: 'imagenes/im9.jpeg' },
        { id: 'cand10', name: 'Rodrigo Paz', party: 'Independiente', photo: 'imagenes/im10.jpg' }
        // Si necesitas más de 10, puedes añadir hasta 10 para tu demo
        // { id: 'cand11', name: 'Carol Brenda Illievski', party: 'Independiente', photo: 'https://via.placeholder.com/100x100?text=C.Illievski' },
        // { id: 'cand12', name: 'Miguel Cadima', party: 'Independiente', photo: 'https://via.placeholder.com/100x100?text=M.Cadima' },
        // { id: 'cand13', name: 'Wilman Cardozo', party: 'Nacional', photo: 'https://via.placeholder.com/100x100?text=W.Cardozo' },
        // { id: 'cand14', name: 'Marco Antonio Pumari', party: 'Cívico', photo: 'https://via.placeholder.com/100x100?text=M.Pumari' },
        // { id: 'cand15', name: 'Félix Patzi', party: 'Exgobernador', photo: 'https://via.placeholder.com/100x100?text=F.Patzi' },
        // { id: 'cand16', name: 'Leonardo Loza', party: 'Senador', photo: 'https://via.placeholder.com/100x100?text=L.Loza' }
    ];


    // Inicializar votos a 0 si no existen o si se agregó un nuevo candidato
    let votes = JSON.parse(localStorage.getItem('electionVotes')) || {};
    let shouldUpdateVotes = false;

    candidates.forEach(candidate => {
        if (votes[candidate.id] === undefined) {
            votes[candidate.id] = 0;
            shouldUpdateVotes = true;
        }
    });

    // Remover votos de candidatos que ya no existen (opcional, para limpieza)
    for (const voteId in votes) {
        if (!candidates.some(c => c.id === voteId)) {
            delete votes[voteId];
            shouldUpdateVotes = true;
        }
    }

    if (shouldUpdateVotes || Object.keys(votes).length === 0) {
        localStorage.setItem('electionVotes', JSON.stringify(votes));
    }

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null; // Para saber si hay un usuario logueado


    // --- Funciones de control de UI ---

    // Muestra un módulo y oculta los otros
    function showModule(moduleToShow) {
        authModule.classList.add('d-none');
        votingModule.classList.add('d-none');
        statsModule.classList.add('d-none');

        moduleToShow.classList.remove('d-none');
    }

    // Muestra un formulario específico dentro del módulo de autenticación
    function showAuthForm(formToShow, title) {
        loginForm.classList.add('d-none');
        registerForm.classList.add('d-none');
        forgotPasswordForm.classList.add('d-none');
        changePasswordForm.classList.add('d-none');
        formToShow.classList.remove('d-none');
        formTitle.textContent = title; // Usa el formTitle principal
        formTitle.classList.remove('d-none'); // Asegurarse de que el título principal sea visible
        formTitleStats.classList.add('d-none'); // Asegurarse de que el título de estadísticas esté oculto
        showModule(authModule); // Asegurarse de que el módulo de autenticación esté visible
    }

    // Actualiza la visibilidad de los botones de navegación
    function updateNavVisibility() {
        if (currentUser) {
            // Usuario logueado: Ocultar Login/Registro, mostrar Votar/Estadísticas/Cerrar Sesión
            navLoginBtn.classList.add('d-none');
            navRegisterBtn.classList.add('d-none');
            navVoteBtnContainer.classList.remove('d-none');
            navStatsBtnContainer.classList.remove('d-none');
            navLogoutBtnContainer.classList.remove('d-none');
        } else {
            // Usuario no logueado: Mostrar Login/Registro, ocultar Votar/Estadísticas/Cerrar Sesión
            navLoginBtn.classList.remove('d-none');
            navRegisterBtn.classList.remove('d-none');
            navVoteBtnContainer.classList.add('d-none');
            navStatsBtnContainer.classList.add('d-none');
            navLogoutBtnContainer.classList.add('d-none');
        }
    }

    // --- Event Listeners de Navegación ---
    navLoginBtn.addEventListener('click', () => {
        showAuthForm(loginForm, 'Iniciar Sesión');
    });

    navRegisterBtn.addEventListener('click', () => {
        showAuthForm(registerForm, 'Crear Cuenta');
    });

    navVoteBtn.addEventListener('click', () => {
        if (currentUser) {
            if (currentUser.hasVoted) {
                alert('Ya has emitido tu voto.');
                showStatsModule(); // Si ya votó, mostrar estadísticas directamente
            } else {
                showVotingModule();
            }
        } else {
            alert('Debes iniciar sesión para votar.');
            showAuthForm(loginForm, 'Iniciar Sesión');
        }
    });

    navStatsBtn.addEventListener('click', () => {
        showStatsModule();
    });

    navLogoutBtn.addEventListener('click', () => {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        alert('Sesión cerrada correctamente.');
        updateNavVisibility();
        showAuthForm(loginForm, 'Iniciar Sesión'); // Volver a la pantalla de login
    });


    // --- Módulo I: Lógica de Autenticación y Registro ---

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(registerForm, 'Crear Cuenta');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(loginForm, 'Iniciar Sesión');
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(forgotPasswordForm, 'Recuperar Contraseña');
    });

    backToLoginFromForgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(loginForm, 'Iniciar Sesión');
    });

    backToLoginFromChangeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(loginForm, 'Iniciar Sesión');
    });

    // Función para mostrar/ocultar contraseña en el login
    toggleLoginPasswordBtn.addEventListener('click', () => {
        const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        loginPasswordInput.setAttribute('type', type);
        // Cambiar el ícono del ojo
        loginPasswordIcon.classList.toggle('bi-eye');
        loginPasswordIcon.classList.toggle('bi-eye-slash');
    });

    // Lógica para el registro de usuarios
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (users.length >= 10) {
            alert('Se ha alcanzado el límite de 10 votantes registrados para esta demo.');
            return;
        }

        const name = document.getElementById('registerName').value;
        const ci = document.getElementById('registerCi').value;
        const email = document.getElementById('registerEmail').value;
        const sexo = document.querySelector('input[name="sexo"]:checked')?.value; // Usar optional chaining para evitar error si no hay radio seleccionado
        const phone = document.getElementById('registerPhone').value;
        const department = document.getElementById('registerDepartment').value;
        const birthDate = document.getElementById('registerBirthDate').value;
        const voteDate = document.getElementById('registerVoteDate').value;

        // Validar que se haya seleccionado un sexo
        if (!sexo) {
            alert('Por favor, selecciona tu sexo.');
            return;
        }
        // Validar que se haya seleccionado un departamento
        if (!department) {
            alert('Por favor, selecciona tu departamento.');
            return;
        }

        // --- Validación de Correo Electrónico con Expresión Regular ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('registerEmail').classList.add('is-invalid');
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        } else {
            document.getElementById('registerEmail').classList.remove('is-invalid');
        }

        // Validar si el CI ya existe
        if (users.some(user => user.ci === ci)) {
            alert('Ya existe una cuenta con esta Cédula de Identidad.');
            return;
        }

        const newUser = {
            name,
            ci,
            email,
            sexo,
            phone,
            department,
            birthDate,
            voteDate,
            password: ci, // Contraseña por defecto: CI
            hasVoted: false
        };

        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        alert('Cuenta creada exitosamente. Tu contraseña por defecto es tu CI.');
        registerForm.reset(); // Limpiar el formulario de registro
        showAuthForm(loginForm, 'Iniciar Sesión');
    });

    // Lógica para el inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const ci = document.getElementById('loginCi').value;
        const password = document.getElementById('loginPassword').value;

        const user = users.find(u => u.ci === ci && u.password === password);

        if (user) {
            currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser)); // Guardar sesión
            alert(`¡Bienvenido, ${user.name}! Sesión iniciada.`);
            loginForm.reset(); // Limpiar el formulario de login
            updateNavVisibility(); // Actualizar botones de navegación

            if (user.hasVoted) {
                alert('Ya has emitido tu voto.');
                showStatsModule(); // Si ya votó, mostrar estadísticas
            } else {
                showVotingModule(); // Si no ha votado, ir al módulo de votación
            }
        } else {
            alert('CI o contraseña incorrectos.');
        }
    });

    // Lógica para recuperar contraseña
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recoveryEmail = document.getElementById('recoveryEmail').value;
        // En una aplicación real, aquí se enviaría un correo electrónico con un código.
        // Por simplicidad, simularemos que el código es "123456" y lo pediremos al usuario.
        alert(`Se ha enviado un código de recuperación a ${recoveryEmail}. (Simulación: El código es 123456)`);

        const enteredCode = prompt('Ingresa el código de recuperación:');
        if (enteredCode === '123456') { // Simulación del código correcto
            const ciToRecover = prompt('Ingresa tu Cédula de Identidad para establecer la nueva contraseña:');
            const user = users.find(u => u.ci === ciToRecover && u.email === recoveryEmail); // Buscar por CI Y email

            if (user) {
                const newPass = prompt('Ingresa tu nueva contraseña:');
                const confirmPass = prompt('Confirma tu nueva contraseña:');

                if (newPass && newPass === confirmPass) {
                    user.password = newPass;
                    localStorage.setItem('registeredUsers', JSON.stringify(users));
                    alert('Contraseña actualizada exitosamente.');
                    forgotPasswordForm.reset(); // Limpiar el formulario de recuperación
                    showAuthForm(loginForm, 'Iniciar Sesión');
                } else {
                    alert('Las contraseñas no coinciden o están vacías.');
                }
            } else {
                alert('CI o Correo Electrónico no encontrados o no coinciden.');
            }
        } else {
            alert('Código de recuperación incorrecto.');
        }
    });

    // Lógica para cambiar contraseña
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (!currentUser) {
            alert('No hay un usuario logueado para cambiar la contraseña.');
            return;
        }

        if (currentUser.password === currentPassword) {
            if (newPassword === confirmNewPassword && newPassword !== '') { // Asegurarse que la nueva contraseña no esté vacía
                const userIndex = users.findIndex(u => u.ci === currentUser.ci);
                if (userIndex !== -1) {
                    users[userIndex].password = newPassword;
                    currentUser.password = newPassword; // Actualizar el usuario en sesión
                    localStorage.setItem('registeredUsers', JSON.stringify(users));
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                    alert('Contraseña cambiada exitosamente.');
                    changePasswordForm.reset(); // Limpiar el formulario
                    showAuthForm(loginForm, 'Iniciar Sesión'); // Volver al login
                }
            } else {
                alert('Las nuevas contraseñas no coinciden o están vacías.');
            }
        } else {
            alert('Contraseña actual incorrecta.');
        }
    });


    // --- Módulo II: Votación ---

    function showVotingModule() {
        showModule(votingModule);
        formTitle.textContent = 'Módulo de Votación'; // Usa el formTitle principal
        formTitle.classList.remove('d-none'); // Asegurarse de que el título principal sea visible
        formTitleStats.classList.add('d-none'); // Ocultar el título de estadísticas
        renderCandidates();
    }

    function renderCandidates() {
        candidatesList.innerHTML = ''; // Limpiar lista anterior
        candidates.forEach(candidate => {
            const candidateCard = `
                <div class="col-md-6 mb-4">
                    <div class="card h-100 text-center p-3 hover-scale">
                        <img src="${candidate.photo}" class="card-img-top rounded-circle mx-auto mb-3" alt="${candidate.name}" style="width: 100px; height: 100px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${candidate.name}</h5>
                            <p class="card-text text-muted">${candidate.party}</p>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="candidate" id="${candidate.id}" value="${candidate.id}">
                                <label class="form-check-label" for="${candidate.id}">
                                    Votar por ${candidate.name}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            candidatesList.innerHTML += candidateCard;
        });
    }

    voteButton.addEventListener('click', () => {
        if (!currentUser) {
            alert('Debes iniciar sesión para votar.');
            showAuthForm(loginForm, 'Iniciar Sesión');
            return;
        }

        if (currentUser.hasVoted) {
            alert('Ya has emitido tu voto. No puedes votar dos veces.');
            showStatsModule(); // Si ya votó, llevar a estadísticas
            return;
        }

        const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
        if (!selectedCandidate) {
            alert('Por favor, selecciona un candidato antes de votar.');
            return;
        }

        const candidateId = selectedCandidate.value;

        // Actualizar el voto
        votes[candidateId]++;
        localStorage.setItem('electionVotes', JSON.stringify(votes));

        // Marcar al usuario como que ya votó
        const userIndex = users.findIndex(u => u.ci === currentUser.ci);
        if (userIndex !== -1) {
            users[userIndex].hasVoted = true;
            currentUser.hasVoted = true; // Actualizar el usuario en sesión
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        alert(`¡Gracias por tu voto por ${candidates.find(c => c.id === candidateId).name}!`);
        showStatsModule(); // Ir a estadísticas después de votar
    });


    // --- Módulo III: Estadísticas ---

    function showStatsModule() {
        showModule(statsModule);
        formTitle.classList.add('d-none'); // Ocultar el título principal del formulario
        formTitleStats.classList.remove('d-none'); // Asegurarse de que el título de estadísticas sea visible
        formTitleStats.textContent = 'Resultados de Votación'; // Usa el id específico para estadísticas
        renderChart();
    }

    function renderChart() {
        if (votingChart) {
            votingChart.destroy(); // Destruir la instancia anterior si existe
        }

        const candidateNames = candidates.map(c => c.name);
        const voteCounts = candidates.map(c => votes.hasOwnProperty(c.id) ? votes[c.id] : 0);
        const totalVotes = voteCounts.reduce((sum, count) => sum + count, 0);

        // Encontrar el valor máximo de votos para ajustar la escala del eje X dinámicamente
        // Se establece un mínimo de 11 para asegurar que la escala siempre sea visible para al menos 11 votos.
        const maxVotes = Math.max(...voteCounts, 11);

        const backgroundColors = [
            'rgba(255, 99, 132, 0.8)', // Rojo claro
            'rgba(54, 162, 235, 0.8)', // Azul claro
            'rgba(255, 206, 86, 0.8)', // Amarillo claro
            'rgba(75, 192, 192, 0.8)', // Verde agua
            'rgba(153, 102, 255, 0.8)', // Morado claro
            'rgba(255, 159, 64, 0.8)', // Naranja claro
            'rgba(128, 0, 128, 0.8)', // Morado oscuro
            'rgba(0, 128, 0, 0.8)',   // Verde oscuro
            'rgba(0, 128, 128, 0.8)', // Teal oscuro
            'rgba(139, 69, 19, 0.8)'  // Marrón
        ];

        const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));

        votingChart = new Chart(document.getElementById('votingChart'), {
            type: 'bar',
            data: {
                labels: candidateNames,
                datasets: [{
                    label: 'Número de Votos',
                    data: voteCounts,
                    backgroundColor: backgroundColors.slice(0, candidates.length),
                    borderColor: borderColors.slice(0, candidates.length),
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Hace el gráfico horizontal
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: maxVotes, // El eje X ahora se ajustará al máximo de votos o al menos a 11
                        ticks: {
                            precision: 0 // Asegura que los ticks del eje X sean números enteros
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'right',
                        color: '#000',
                        font: {
                            weight: 'bold'
                        },
                        formatter: (value, context) => {
                            if (totalVotes > 0) {
                                const percentage = ((value / totalVotes) * 100).toFixed(1);
                                return `${value} (${percentage}%)`;
                            } else {
                                return `${value} (0.0%)`;
                            }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // --- Inicialización al cargar la página ---
    updateNavVisibility(); // Ajusta la visibilidad de la navegación al cargar
    if (!currentUser) {
        showAuthForm(loginForm, 'Iniciar Sesión'); // Mostrar el formulario de inicio de sesión por defecto
    } else {
        // Si hay un usuario logueado al recargar, decidir a qué módulo ir
        if (currentUser.hasVoted) {
            showStatsModule();
        } else {
            showVotingModule();
        }
    }
});