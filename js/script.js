document.addEventListener('DOMContentLoaded', function () {
    // Buscar el botón de envío de Contact Form 7
    const submitButton = document.querySelector('.wpcf7-form-control.wpcf7-submit');

    if (submitButton) {
        submitButton.id = 'custom-submit-button'; // Asignar el ID al botón
        submitButton.disabled = true; // Deshabilitar el botón al inicio
        submitButton.classList.add('disabled'); // Aplicar clase de estilo deshabilitado
        console.log("ID asignado al botón de envío:", submitButton);
    } else {
        console.error("No se encontró el botón de envío.");
        return;
    }

    // Obtener el contenedor del CAPTCHA
    const captchaContainer = document.getElementById('captcha-container');

    // Verificar si el CAPTCHA está presente
    if (!captchaContainer) {
        console.error("No se encontró el contenedor del CAPTCHA.");
        return;
    }

    // Cargar las preguntas del CAPTCHA desde questions.json
    fetch('/wp-content/plugins/captcha-personalizado/questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error cargando questions.json");
            }
            return response.json();
        })
        .then(questions => {
            iniciarCaptcha(questions);
        })
        .catch(error => {
            console.error("Error cargando el CAPTCHA:", error);
        });

    function iniciarCaptcha(questions) {
        const questionsContainer = document.getElementById('questions-container');
        let currentQuestionIndex = 0;

        function renderQuestion() {
            if (currentQuestionIndex < questions.length) {
                const questionData = questions[currentQuestionIndex];
                const questionHTML = `
                    <div class="question">
                        <label>${questionData.question}</label>
                        <div class="options">
                            ${questionData.options.map((option, index) => 
                                `<button class="option" data-correct="${option.correct}" data-index="${index}">
                                    ${option.text}
                                </button>`
                            ).join('')}
                        </div>
                    </div>
                `;
                questionsContainer.innerHTML = questionHTML;

                // Agregar evento a las opciones
                const options = questionsContainer.querySelectorAll('.option');
                options.forEach(option => {
                    option.addEventListener('click', handleAnswerClick);
                });
            }
        }

        function handleAnswerClick(event) {
            const button = event.target;
            const isCorrect = button.getAttribute('data-correct') === 'true';
            
            if (isCorrect) {
                currentQuestionIndex++;
                if (currentQuestionIndex === questions.length) {
                    submitButton.disabled = false; // Habilitar el botón si todas las preguntas son correctas
                    submitButton.classList.remove('disabled');
                    submitButton.classList.add('enabled'); // Cambiar la apariencia del botón
                } else {
                    renderQuestion();
                }
            }
        }

        // Iniciar la primera pregunta
        renderQuestion();
    }
});
