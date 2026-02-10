# UnityTemple: Brahmanbaria’s Sacred Map

**UnityTemple** is an interactive digital repository and geographic portal dedicated to preserving and promoting the architectural and spiritual temple legacy of Brahmanbaria, Bangladesh. This project maps sacred sites across various Upazilas, allowing researchers, devotees, and tourists to explore the rich cultural history of the region.

![Project Banner](./bg.jpg)

## 🌟 Features

- **Interactive Map Explorer**: dynamic map powered by Leaflet.js visualizing temple locations across Brahmanbaria.
- **Advanced Search & Filtering**: comprehensive search functionality to find temples by name, village, or Upazila (region).
- **real-Time Statistics**: Visual dashboard using Chart.js displaying the distribution of temples across different regions.
- **responsive Design**: Fully responsive interface built with Tailwind CSS, ensuring a seamless experience on mobile, tablet, and desktop.
- **Detailed Information**: Quick access to temple details, including location, photos, and direct Google Maps directions.

## 🛠️ Technology Stack

- **Frontend Core**: HTML5, Vanilla JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN)
- **Mapping Engine**: [Leaflet.js](https://leafletjs.com/) & OpenStreetMap
- **Data Visualization**: [Chart.js](https://www.chartjs.org/)
- **Typography**: Google Fonts (Inter, Playfair Display, Poppins)
- **Icons**: Standard UTF-8 emojis and custom markers

## 📂 Project Structure

```
├── index.html          # Main application structure
├── script.js           # Core application logic (Map, Search, Data Fetching)
├── styles.css          # Custom styling and overrides
├── *.json              # Data files for each Upazila (e.g., sadar.json, ashuganj.json)
├── *.jpg/png           # Images and static resources (bg.jpg, etc.)
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites

This application uses the `fetch` API to load local JSON data files. Due to browser security restrictions (CORS), you cannot simply double-click `index.html` to run it. You must use a local development server.

### Installation & Running

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/unity-temple.git
   cd unity-temple
   ```

2. **Run with a Local Server**

   - **Using VS Code Live Server Extension (Recommended):**
     - Open the project folder in VS Code.
     - Right-click `index.html` and select "Open with Live Server".

   - **Using Python:**
     ```bash
     # Python 3.x
     python -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser.

   - **Using Node.js (http-server):**
     ```bash
     npx http-server .
     ```

## 📊 Data Source

The temple data is curated and stored in individual JSON files corresponding to each Upazila in Brahmanbaria:
- Sadar
- Bijayanagar
- Nasirnagar
- Ashuganj
- Akhaura
- Sarail
- Kasba
- Nabinagar
- Bancharampur

## 🤝 Contributing

Contributions are welcome! If you have data on more temples or want to improve the code:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 📞 Contact

**Project Developer**: Avibrata Saha Ratul  
**Email**: avibratasaharatul@gmail.com  
**Region**: Brahmanbaria, Bangladesh
