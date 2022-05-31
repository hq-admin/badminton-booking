import './App.css';
import BookingCalender from './components/BookingCalender';
import BookingSummary from './components/BookingSummary';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      
      <BookingSummary/>
    </div>
  );
}

export default App;