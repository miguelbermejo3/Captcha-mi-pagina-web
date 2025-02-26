<?php
/*
Plugin Name: CAPTCHA Personalizado para los formularios
Description: CAPTCHA personalizado con preguntas sobre mi página web.
Version: 0.1
Author: Miguel Bermejo Fierro
*/

function captcha_personalizado_enqueue_scripts() {
    wp_enqueue_style('captcha-personalizado-style', plugin_dir_url(__FILE__) . 'css/style.css');
    wp_enqueue_script('captcha-personalizado-script', plugin_dir_url(__FILE__) . 'js/script.js', array('jquery'), null, true);

    // Cargar el JSON de preguntas
    $questions_json = file_get_contents(plugin_dir_path(__FILE__) . 'questions.json');
    $questions_array = json_decode($questions_json, true);

    // Asegurarse de que el JSON se cargó correctamente antes de pasarlo
    if ($questions_array) {
        wp_localize_script('captcha-personalizado-script', 'captchaQuestions', $questions_array);
    }
}
add_action('wp_enqueue_scripts', 'captcha_personalizado_enqueue_scripts');


function captcha_personalizado_shortcode($atts) {
    $atts = shortcode_atts(array(
        'button_name' => 'form-submit-button', // Nombre del botón por defecto
    ), $atts, 'captcha_personalizado');
    
    return '
    <div id="captcha-container" data-button-id="' . esc_attr($atts['button_name']) . '">
        <div id="questions-container"></div>
    </div>';
}
add_shortcode('captcha_personalizado', 'captcha_personalizado_shortcode');


