# Missing Persons Visualization

This project is a web-based visualization tool designed to highlight the stories of missing persons. It dynamically displays case details, allows users to navigate through sections, and provides options to share cases on social media. The tool is built using HTML, CSS, and JavaScript, and it processes data from a CSV file.

---

## Features

### 1. **Dynamic Case Display**
- Displays a random case or a specific case based on the URL parameter (`?id=<case_id>`).
- Includes details such as name, age, gender, location, and more.

### 2. **Keyboard and Touch Navigation**
- Navigate between sections using:
  - **Keyboard:** Arrow keys (`←` and `→`).
  - **Touch:** Swipe gestures on mobile devices.

### 3. **Social Media Sharing**
- Share cases directly on:
  - Facebook
  - Twitter
  - WhatsApp
  - Instagram
- Each shared link includes the case's unique identifier for direct access.

### 4. **Regenerate Case**
- A "Regenerate" button allows users to load a new random case.

### 5. **Smooth Transitions**
- Sections fade in and out smoothly for a better user experience.

---

## How It Works

### 1. **Data Source**
- The tool reads data from a CSV file (`data/processed_cases.csv`).
- Each row in the CSV represents a missing person's case.

### 2. **URL Parameters**
- If a case ID is provided in the URL (`?id=<case_id>`), the corresponding case is displayed.
- If no ID is provided, a random case is selected.

### 3. **Navigation**
- The tool uses a sequence of sections:
  1. Static introductory message.
  2. Case image.
  3. Typing effect for the narrative.
  4. Case details (card format).
  5. Days missing message.
  6. Static closing messages.
  7. Social media sharing and regenerate button.

### 4. **Social Media Links**
- Links are dynamically generated based on the current case's ID.

---

## Setup and Usage

### 1. **Requirements**
- A web browser.
- A local or remote server to host the files.

### 2. **Run Locally**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd missing-persons-visualization
   ```
2. Start a local server:
   ```bash
   python3 -m http.server 8000 --bind 0.0.0.0
   ```
3. Access the tool in your browser:
   ```
   http://<your-local-ip>:8000
   ```
   Replace `<your-local-ip>` with your computer's local IP address.

### 3. **File Structure**
- `index.html`: Main HTML file.
- `css/styles.css`: Styles for the tool.
- `js/main.js`: JavaScript logic for dynamic behavior.
- `data/processed_cases.csv`: Data source for the cases.
- `static/icons/`: Icons for social media and regenerate button.

---

## Customization

### 1. **Enable/Disable Navigation from Start**
- Control navigation availability using the `enableNavigationFromStart` variable in `js/main.js`:
  ```javascript
  const enableNavigationFromStart = true; // Set to true for testing, false for production
  ```

### 2. **Modify Data**
- Update the `data/processed_cases.csv` file with new cases.
- Ensure the file includes the required columns (e.g., `id_cedula_busqueda`, `nombre_completo`, `fecha_desaparicion`, etc.).

### 3. **Change Icons**
- Replace icons in the `static/icons/` folder to customize the appearance of social media buttons and the regenerate button.

---

## Example

### URL with Case ID
- Access a specific case using:
  ```
  http://<your-local-ip>:8015/?id=<case_id>
  ```

### Random Case
- Access a random case by visiting:
  ```
  http://<your-local-ip>:8000
  ```

---

## Troubleshooting

### 1. **Data Not Loading**
- Ensure the `data/processed_cases.csv` file exists and is accessible.
- Check the browser console for errors.

### 2. **Navigation Not Working**
- Verify the `enableNavigationFromStart` variable is set correctly.
- Ensure the `sections` array in `js/main.js` includes all sections.

### 3. **Social Media Links Not Working**
- Confirm the `shareFacebook`, `shareTwitter`, etc., elements exist in `index.html`.
- Check the generated URLs in the browser console.

---

## Contributing

Feel free to submit issues or pull requests to improve the project.

---

## License

This project is licensed under the MIT License.
