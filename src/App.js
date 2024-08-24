import React from 'react';
import HolidayFinder from './components/HolidayFinder';
import Footer from './components/Footer';
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Public Holiday Finder</h1>
      </header>
      <main>
        <HolidayFinder />
      </main>
      <Footer />
    </div>
  );
}

export default App;