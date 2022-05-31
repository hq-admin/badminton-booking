import React, { useState } from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import styled from 'styled-components';

const BookingPage = styled.div`
  border: 2px solid black;
  padding: 20px;
  width: 50%;
`

const Duration = styled.select`
  padding: 10px;
`

const BookingCalender = ({setButtonClick}) => {  
    const [value, setValue] = useState(new Date());
    const [duration, setDuration] = useState(1)
    

    console.log(value)
    //const date =  value._d.toString().split(" ")
    //console.log(date)

    console.log(duration)
  return (
    <BookingPage>   
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Play time"
                value={value}
                onChange={(newValue) => {
                setValue(newValue);
                }}
            />
        </LocalizationProvider>
        <div>
          <label>Duration</label>
          <Duration name='duration' id='duration' onChange={(e)=>setDuration(e.target.value)}>
            <option value={1}>1 hour</option>
            <option value={2}>2 hours</option>
          </Duration>
        </div>
        <button>Add</button>
        <button onClick={()=>setButtonClick(false)}>Close</button>
    </BookingPage>
  )
}

export default BookingCalender