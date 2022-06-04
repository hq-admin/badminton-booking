import './App.css';
import BookingCalender from './components/BookingCalender';
import BookingSummary from './components/BookingSummary';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
  Navigate
} from "react-router-dom";
import EditBooking from './components/EditBooking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<BookingSummary/>}/>
        <Route path='/editbooking/:id' element={<EditBooking/>}/>
          
      </Routes>
    </Router>
  );
}

export default App;