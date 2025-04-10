console.log("Page loaded. Starting JS execution...");

// --- Element References ---
const sentenceElement = document.getElementById('sentence');
const section_1_HistoryOf = document.getElementById('static-message-0');
const section_3_TypingCont = document.getElementById('content');
const section_5_DaysMissing = document.getElementById('days-missing-message');
const section_4_CaseCard = document.getElementById('case-card');
const section_6_MessageOne = document.getElementById('static-message-1');
const section_7_MessageTwo = document.getElementById('static-message-2');
const navigationInstructions = document.getElementById('navigation-instructions');
const navigationReadyMessage = document.getElementById('navigation-ready-message');
const cursorElement = document.querySelector('.input-cursor'); // Mover aquí para acceso global

// Placeholders for dynamic data
const sm0NombreElement = document.getElementById('sm0-nombre');
const caseImageElement = document.getElementById('case-image');
const section_2_ImgContainer = document.getElementById('case-image-container');
const caseImageDisplay = document.getElementById('case-image-display');
const caseIdElement = document.getElementById('case-id');
const caseAuthElement = document.getElementById('case-auth');
const caseNombreElement = document.getElementById('case-nombre');
const caseEdadElement = document.getElementById('case-edad');
const caseSexoElement = document.getElementById('case-sexo');
const caseGeneroElement = document.getElementById('case-genero');
const caseComplexionElement = document.getElementById('case-complexion');
const caseEstaturaElement = document.getElementById('case-estatura');
const caseTezElement = document.getElementById('case-tez');
const caseCabelloElement = document.getElementById('case-cabello');
const caseOjosElement = document.getElementById('case-ojos');
const caseMunicipioElement = document.getElementById('case-municipio');
const caseEstadoElement = document.getElementById('case-estado');
const caseFechaElement = document.getElementById('case-fecha');
const caseEstatusElement = document.getElementById('case-estatus');
const dmmNombreElement = document.getElementById('dmm-nombre');
const dmmGeneroSuffixElement = document.getElementById('dmm-genero-suffix');
const daysMissingValueElement = document.getElementById('days-missing');

// Share buttons
const shareFacebook = document.getElementById('share-facebook');
const shareTwitter = document.getElementById('share-twitter');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareInstagram = document.getElementById('share-instagram');

// --- Global Variables ---
let currentCase = null; // To store the selected case data
let typingIndex = 0;    // Index for the typing animation
let textToType = "";    // Narrative text to be typed

// Switch to control navigation availability
const enableNavigationFromStart = false; // Set to true for testing, false for production
let enableNavigation = false; // Control variable for navigation

// --- Helper Functions ---

/**
 * Pauses execution for a specified number of milliseconds.
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>}
 */
function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Simple CSV parser. Assumes comma delimiter and quotes for fields containing commas.
 * Handles basic cases, might need a library (like PapaParse) for complex CSVs.
 * @param {string} csvText - The CSV content as a string.
 * @returns {Array<Object>} - An array of objects representing CSV rows.
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return []; // No data rows

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        // Basic handling for quoted fields - might not cover all edge cases
        const values = [];
        let currentVal = '';
        let inQuotes = false;
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentVal.trim().replace(/^"|"$/g, '')); // Remove surrounding quotes if any
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        values.push(currentVal.trim().replace(/^"|"$/g, '')); // Add the last value

        if (values.length === headers.length) {
            const rowObject = {};
            headers.forEach((header, index) => {
                rowObject[header] = values[index];
            });
            data.push(rowObject);
        } else {
            console.warn(`Skipping row ${i + 1}: Mismatched number of columns. Expected ${headers.length}, got ${values.length}. Line: ${lines[i]}`);
        }
    }
    return data;
}

/**
 * Calculates the number of days between a date string and now.
 * @param {string} fechaDesaparicion - Date string in 'YYYY-MM-DD' format.
 * @returns {number|null} - Number of days or null if date is invalid.
 */

function calculateDaysMissing(fechaDesaparicion) {
    try {
        // Ensure correct parsing (handle potential timezone issues if necessary)
        const disappearanceDate = new Date(fechaDesaparicion + 'T00:00:00'); // Assume start of day
        const now = new Date();
        // Reset time part of 'now' to compare dates only
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (isNaN(disappearanceDate.getTime())) {
            throw new Error("Invalid date format");
        }

        const diffTime = Math.abs(today - disappearanceDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    } catch (e) {
        console.error(`Error processing disappearance date "${fechaDesaparicion}":`, e);
        return null; // Return null or a default value like 0 or -1
    }
}

/**
 * Capitalizes the first letter of each word in a string.
 * @param {string} str - The input string.
 * @returns {string} - The title-cased string.
 */
function toTitleCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

/**
 * Get query parameters from the URL.
 * @returns {Object} - An object containing key-value pairs of query parameters.
 */
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const query = {};
    for (const [key, value] of params.entries()) {
        query[key] = value;
    }
    return query;
}

/**
 * Updates the browser's URL with the case ID.
 * @param {string} caseId - The case ID to include in the URL.
 */
function updateUrlWithCaseId(caseId) {
    if (!caseId) return;

    const baseUrl = window.location.origin + window.location.pathname;
    const newUrl = `${baseUrl}?id=${caseId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    console.log(`URL updated with case ID: ${caseId}`);
}

/**
 * Updates the DOM elements with the data from the selected case.
 * @param {Object} caseData - The selected case object.
 */
function populateCaseData(caseData) {
    if (!caseData) return;

    const nombreCompletoTitle = toTitleCase(caseData.nombre_completo || '');
    const diasDesaparecido = calculateDaysMissing(caseData.fecha_desaparicion);

    // Static Message 0
    sm0NombreElement.textContent = nombreCompletoTitle;

    // Case Image (Main Display)
    caseImageDisplay.src = caseData.ruta_foto || 'static/placeholder.png'; // Add a placeholder image path
    caseImageDisplay.alt = `Foto de ${nombreCompletoTitle}`;

    // Case Image (Ficha de desaparición)
    caseImageElement.src = caseData.ruta_foto || 'static/placeholder.png'; // Add a placeholder image path
    caseImageElement.alt = `Foto de ${nombreCompletoTitle}`;

    // Handle image loading errors for both images
    caseImageDisplay.onerror = caseImageElement.onerror = () => {
        console.warn(`Image not found: ${caseData.ruta_foto}. Using placeholder.`);
        caseImageDisplay.src = 'static/placeholder.png'; // Fallback to placeholder
        caseImageElement.src = 'static/placeholder.png'; // Fallback to placeholder
    };

    // Case Card
    caseIdElement.textContent = caseData.id_cedula_busqueda || 'N/A';
    caseAuthElement.textContent = toTitleCase(caseData.autorizacion_informacion_publica || 'N/A');
    caseNombreElement.textContent = nombreCompletoTitle;
    caseEdadElement.textContent = caseData.edad_momento_desaparicion || 'N/A';
    caseSexoElement.textContent = toTitleCase(caseData.sexo || 'N/A');
    caseGeneroElement.textContent = toTitleCase(caseData.genero || 'N/A');
    caseComplexionElement.textContent = toTitleCase(caseData.complexion || 'N/A');
    caseEstaturaElement.textContent = caseData.estatura || 'N/A';
    caseTezElement.textContent = toTitleCase(caseData.tez || 'N/A');
    caseCabelloElement.textContent = toTitleCase(caseData.cabello || 'N/A');
    caseOjosElement.textContent = toTitleCase(caseData.ojos_color || 'N/A');
    caseMunicipioElement.textContent = toTitleCase(caseData.municipio || 'N/A');
    caseEstadoElement.textContent = toTitleCase(caseData.estado || 'N/A');
    caseFechaElement.textContent = caseData.fecha_desaparicion || 'N/A';
    caseEstatusElement.textContent = toTitleCase(caseData.estatus_persona_desaparecida || 'N/A');

    // Days Missing Message
    dmmNombreElement.textContent = nombreCompletoTitle;
    dmmGeneroSuffixElement.textContent = (caseData.sexo && caseData.sexo.toUpperCase() === 'MUJER') ? 'desaparecida' : 'desaparecido';
    daysMissingValueElement.textContent = diasDesaparecido !== null ? diasDesaparecido : 'desconocidos';

    // Set Narrative for Typing
    textToType = caseData.descripcion_anonimizada || "No hay descripción disponible.";

    console.log("Case data populated into DOM.");
}

/**
 * Generates share links for the case.
 * @param {string} caseId - The case ID.
 */
function generateShareLinks(caseId) {
    if (!caseId) return;

    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?id=${caseId}`;

    if (shareFacebook) {
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }
    if (shareTwitter) {
        shareTwitter.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Conoce%20este%20caso%20de%20persona%20desaparecida`;
    }
    if (shareWhatsapp) {
        shareWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`;
    }
    if (shareInstagram) {
        shareInstagram.href = `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`;
    }

    console.log("Share links generated.");
}


// --- Animation and Sequencing Logic (Adapted from original script) ---

let currentSectionIndex = 0; // Start with the first visual element in the sequence

const sections = [
    section_1_HistoryOf,
    section_2_ImgContainer,   // Nuevo contenedor de la imagen
    section_3_TypingCont,       // Typing container
    section_4_CaseCard,      // Case card
    section_5_DaysMissing,   // Days missing message
    section_6_MessageOne,
    section_7_MessageTwo
];

/**
 * Makes a specific section visible and hides others.
 * @param {number} index - Index of the section to show.
 */
function showSection(index) {
    sections.forEach((section, i) => {
        if (!section) return; // Skip if element doesn't exist
        if (i === index) {
             // Use 'flex' for elements that need it, 'block' otherwise
             setTimeout(() => {
                section.style.display = (section === section_3_TypingCont || section === section_4_CaseCard || section === section_2_ImgContainer) ? 'flex' : 'block';
                // Force reflow before adding class to ensure transition runs
                void section.offsetWidth;
                section.classList.add('visible');
                section.style.opacity = 1; // Ensure opacity is set
             }, 2000); // Match transition duration start
        } else {
            // Force reflow before adding class to ensure transition runs
            void section.offsetWidth;
            section.classList.remove('visible');
            section.style.opacity = 0;

            // Use setTimeout to hide after fade-out transition completes Match with CSS
            setTimeout(() => {
                // Only hide if it's still not the current section
                 if (sections.indexOf(section) !== currentSectionIndex) {
                    section.style.display = 'none';
                 }
             }, 2000); // Match transition duration in CSS
        }
    });
    currentSectionIndex = index; // Update the global index
    console.log(`Showing section ${index}:`, sections[index]?.id);

}

/**
 * The main sequence of displaying elements.
 */
async function runDisplaySequence() {
    console.log("Starting display sequence...");
    typingIndex = 0; // Reset typing index
    sentenceElement.innerHTML = ''; // Clear previous sentence
    navigationReadyMessage.classList.remove('visible');

    // 1. Show Static Message 0
    showSection(0); // Show Message 0
    await waitForMs(10000); // Display for

    // 2. Show Case Image
    showSection(1); // Show case image
    await waitForMs(6000); // Display for

    // 3. Transition to Typing Container
    showSection(2); // Show typing container
    await waitForMs(3000); // Wait for fade-in
    await typeSentence(); // Start typing effect

    // 4. Transition to Case Card after typing
    await waitForMs(2000); // Pause after typing
    showSection(3); // Show case card
    await waitForMs(12000); // Display card for 12s

    // 5. Transition to Days Missing Message
    showSection(4); // Show days missing
    await waitForMs(5000); // Display for 5s

    // 6. Transition to Static Message 1
    showSection(5); // Show sm1
    await waitForMs(5000); // Display for 5s

    // 7. Transition to Static Message 2 (Share)
    showSection(6); // Show sm2 (final state)
    await waitForMs(3000); // Short wait after sm2 appears

    // 8. Enable Navigation
    enableNavigation = true; // Reactiva la navegación
    navigationEnabled();
    console.log("Display sequence finished. Navigation enabled.");
}

/**
 * Simulates the typing effect for the narrative.
 */
async function typeSentence() {
    console.log("Typing effect started...");
    if (!cursorElement) {
        console.error("Cursor element not found!");
        return;
    }

    // Initial cursor blink
    cursorElement.style.opacity = '1';
    await waitForMs(500);
    cursorElement.style.opacity = '0';
    await waitForMs(500);
    cursorElement.style.opacity = '1';
    await waitForMs(500);

    // Type the sentence
    while (typingIndex < textToType.length) {
        sentenceElement.innerHTML += textToType[typingIndex];
        typingIndex++;
        await waitForMs(60); // Typing speed
    }
    // cursorElement.style.display = 'none'; // Hide cursor when done
    console.log("Typing effect finished.");
}

// --- Navigation Logic ---

/**
 * Enables keyboard navigation between sections.
 */
function enableKeyboardNavigation() {
    if (enableNavigation) {
        document.addEventListener('keydown', (event) => {
            let newIndex = currentSectionIndex;
            if (event.key === 'ArrowLeft') {
                newIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
            } else if (event.key === 'ArrowRight') {
                newIndex = (currentSectionIndex + 1) % sections.length;
            }
    
            if (newIndex !== currentSectionIndex) {
                console.log(`Navigating to section ${newIndex}`);
                showSection(newIndex);
            }
        });
    }
}

function enableTouchNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const swipeThreshold = 50; // Minimum swipe distance
        let newIndex = currentSectionIndex;

        if (touchEndX < touchStartX - swipeThreshold) { // Swipe Left
            newIndex = (currentSectionIndex + 1) % sections.length;
        } else if (touchEndX > touchStartX + swipeThreshold) { // Swipe Right
            newIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
        }

        if (newIndex !== currentSectionIndex) {
            showSection(newIndex);
        }
    }
    console.log("Touch navigation enabled.");
}

function showNavigationReadyMessageFunc() {
    if (navigationReadyMessage) {
        navigationReadyMessage.classList.add('visible');
        // Hide the message after 5 seconds
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                navigationReadyMessage.classList.remove('visible');
            }
        }),
        console.log("Navigation ready message shown.");
    } else {
        console.error("Element 'navigation-ready-message' not found.");
    }
}

/* Starts navigation based on the control variable. */
// function startNavigation() {
//     if (enableNavigationFromStart) {
//         console.log("Navigation enabled from the start (testing mode).");
//         enableKeyboardNavigation();
//         enableTouchNavigation();
//     } else {
//         enableKeyboardNavigation();
//         enableTouchNavigation();
//         showNavigationReadyMessageFunc(); // Show the temporary "ready" message
//     }
// }

function navigationEnabled() {
    enableKeyboardNavigation();
    // enableTouchNavigation();
    showNavigationReadyMessageFunc(); // Show the temporary "ready" message
}

/**
 * Regenerates a new random story and updates the DOM.
 */
function regenerateStory() {
    fetch('data/processed_cases.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(csvText => {
        const cases = parseCSV(csvText);
        if (cases.length > 0) {
            // Seleccionar un caso aleatorio
            currentCase = cases[Math.floor(Math.random() * cases.length)];
            
            console.log("New random case selected:", currentCase);
            
            // Actualizar la URL con el ID del nuevo caso
            updateUrlWithCaseId(currentCase.id_cedula_busqueda);
            
            // Actualizar el DOM con los datos del nuevo caso
            populateCaseData(currentCase);
            generateShareLinks(currentCase.id_cedula_busqueda);
            
            // Reiniciar la secuencia visual si es necesario
            runDisplaySequence();
        } else {
            console.error("No cases found or parsed from CSV.");
        }
    })
    .catch(error => {
        console.error("Error fetching or processing CSV:", error);
    });
}

// Agregar evento al botón de regenerar historia
document.getElementById('regenerate-story').addEventListener('click', function() {
    enableNavigation = false; // Desactiva la navegación dentro de la función
    regenerateStory(); // Ejecuta la función regenerateStory
});

// --- Main Execution ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");
    
    const queryParams = getQueryParams();
    const caseId = queryParams.id; // Obtener el identificador de la URL

    // Fetch and process CSV data
    fetch('data/processed_cases.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            console.log("CSV data fetched.");
            const cases = parseCSV(csvText);
            console.log(`Parsed ${cases.length} cases.`);

            if (cases.length > 0) {
                if (caseId) {
                    // Buscar el caso con el identificador proporcionado
                    currentCase = cases.find(c => c.id_cedula_busqueda === caseId);
                    if (!currentCase) {
                        console.warn(`Case with ID ${caseId} not found. Showing a random case.`);
                        currentCase = cases[Math.floor(Math.random() * cases.length)];
                    }
                } else {
                    // Seleccionar un caso aleatorio si no hay identificador
                    currentCase = cases[Math.floor(Math.random() * cases.length)];
                }

                console.log("Selected case:", currentCase);

                // Actualizar la URL con el ID del caso seleccionado
                updateUrlWithCaseId(currentCase.id_cedula_busqueda);

                // Populate DOM with case data
                populateCaseData(currentCase);
                generateShareLinks(currentCase.id_cedula_busqueda);

                // // Habilitar navegación desde el principio si está activada
                // if (enableNavigationFromStart) {
                //     startNavigation();
                // }

                // Iniciar la secuencia visual
                runDisplaySequence();

            } else {
                console.error("No cases found or parsed from CSV.");
                // Display an error message to the user
                document.body.innerHTML = '<p style="color: red; text-align: center; margin-top: 50px;">Error: No se pudieron cargar los datos de los casos.</p>';
            }
        })
        .catch(error => {
            console.error("Error fetching or processing CSV:", error);
            // Display a more specific error message
            document.body.innerHTML = `<p style="color: red; text-align: center; margin-top: 50px;">Error al cargar la aplicación: ${error.message}. Asegúrate de que el archivo 'data/processed_cases.csv' exista y sea accesible por el servidor web.</p>`;
        });
});