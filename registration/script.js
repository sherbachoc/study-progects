document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const loginLink = document.getElementById('loginLink');

    // Функция для отображения ошибки
    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}Error`);
        errorElement.textContent = message;
        errorElement.classList.add('show');
        input.classList.add('error');
    }

    // Функция для скрытия ошибки
    function hideError(input) {
        const errorElement = document.getElementById(`${input.id}Error`);
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        input.classList.remove('error');
    }

    // Валидация имени пользователя
    function validateUsername() {
        const username = usernameInput.value.trim();
        if (username.length < 3) {
            showError(usernameInput, 'Имя пользователя должно содержать минимум 3 символа');
            return false;
        }
        hideError(usernameInput);
        return true;
    }

    // Валидация email
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, 'Введите корректный email адрес');
            return false;
        }
        hideError(emailInput);
        return true;
    }

    // Валидация пароля
    function validatePassword() {
        const password = passwordInput.value;
        if (password.length < 6) {
            showError(passwordInput, 'Пароль должен содержать минимум 6 символов');
            return false;
        }
        hideError(passwordInput);
        return true;
    }

    // Валидация подтверждения пароля
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (password !== confirmPassword) {
            showError(confirmPasswordInput, 'Пароли не совпадают');
            return false;
        }
        hideError(confirmPasswordInput);
        return true;
    }

    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            // Здесь можно добавить код для отправки данных на сервер
            const userData = {
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };
            
            // Сохраняем данные в localStorage (для демонстрации)
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Показываем сообщение об успешной регистрации
            alert('Регистрация успешно завершена!');
            form.reset();
        }
    });

    // Обработка перехода на страницу входа
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Здесь можно добавить код для перехода на страницу входа
        alert('Функция входа будет доступна в следующей версии');
    });

    // Валидация при вводе
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
}); 