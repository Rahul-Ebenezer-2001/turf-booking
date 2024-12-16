import React, { useState, useEffect } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, addMinutes, set } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookingId, setBookingId] = useState();

  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const handlePreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleDateChange = (date) => setCurrentDate(date);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });

  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const startTime = set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const slotStartTime = addMinutes(startTime, i * 15);
    const slotEndTime = addMinutes(slotStartTime, 15);

    return {
      range: `${format(slotStartTime, 'h:mm a')} - ${format(slotEndTime, 'h:mm a')}`,
      startTime: slotStartTime,
      endTime: slotEndTime,
    };
  });
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/booking/display');
        const bookings = response.data;
  
        console.log("Raw Booking Data:", bookings);
  
        const updatedBookings = { ...bookedSlots };
  
        bookings.forEach((booking) => {
          const dayKey = booking.date;
  
          // Extract booking start and end times
          const startDateTime = new Date(booking.date);
          const [startHour, startMinute] = booking.startTime.split(':');
          const [endHour, endMinute] = booking.endTime.split(':');
  
          startDateTime.setHours(startHour, startMinute);
          const endDateTime = new Date(booking.date);
          endDateTime.setHours(endHour, endMinute);
  
          let currentStartTime = startDateTime;
          const slotRanges = [];
  
          // Generate 15-minute time slots
          while (currentStartTime < endDateTime) {
            const nextStartTime = addMinutes(currentStartTime, 15);
            const timeRange = `${format(currentStartTime, 'h:mm a')} - ${format(nextStartTime, 'h:mm a')}`;
            slotRanges.push(timeRange);
            currentStartTime = nextStartTime;
          }
  
          // Initialize the bookings object for the day if it doesn't exist
          if (!updatedBookings[dayKey]) {
            updatedBookings[dayKey] = {};
          }
  
          // Store the bookingId and other details in updatedBookings
          updatedBookings[dayKey][slotRanges[0]] = {
            booked: true,
            span: slotRanges.length,
            endRange: slotRanges[slotRanges.length - 1],
            bookingId: booking.id, // Store the bookingId for each booking
          };
  
          // Optionally store bookingId in localStorage for persistence
          localStorage.setItem('bookingId', booking.id);
  
        });
  
        console.log("Processed Booked Slots:", updatedBookings);
  
        setBookedSlots(updatedBookings);
      } catch (error) {
        console.error('Error fetching bookings', error);
      }
    };
  
    fetchBookings();
  }, []); // Add dependencies like `bookedSlots` if necessary
  

  
  const handleSlotBooking = (day, timeRange) => {
    // Only trigger modal if the slot is not already booked
    const dayKey = format(day, 'yyyy-MM-dd');
    const isBooked = bookedSlots[dayKey]?.[timeRange];
  
    if (!isBooked) {
      setSelectedDay(day);
      setStartTime(''); // Reset start time
      setEndTime(''); // Reset end time
      setFirstName(''); // Reset first name
      setPhoneNumber(''); // Reset phone number
      setShowModal(true); // Open the modal for booking
    }
  };
  

  const handlePlusClick = (day) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleBookingSubmit = async () => {
    if (firstName && phoneNumber && startTime && endTime) {
      const startDateTime = new Date(selectedDay);
      const endDateTime = new Date(selectedDay);
  
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');
  
      startDateTime.setHours(startHour, startMinute);
      endDateTime.setHours(endHour, endMinute);
  
      // Initialize the bookingData object
      const bookingData = {
        firstName,
        phoneNumber,
        date: selectedDay.toLocaleDateString('en-CA'),  // Format the date
        startTime: startDateTime.toTimeString().split(' ')[0],
        endTime: endDateTime.toTimeString().split(' ')[0]
      };
  
      try {
        const response = await axios.post('http://localhost:8080/api/booking/create', bookingData);
        if (response.status === 201) {
          console.log('Booking successful', response.data);
  
          // Store the bookingId in the bookingData
          bookingData.bookingId = response.data.id;
  
          // Store bookingId in localStorage
          localStorage.setItem('bookingId', bookingData.bookingId);
  
          // Prepare updatedBookings only after booking is confirmed
          const updatedBookings = { ...bookedSlots };
          const dayKey = format(selectedDay, 'yyyy-MM-dd');
  
          // Calculate time ranges and slot span for merged cell
          let currentStartTime = startDateTime;
          const slotRanges = [];
  
          while (currentStartTime < endDateTime) {
            const nextStartTime = addMinutes(currentStartTime, 15);
            const timeRange = `${format(currentStartTime, 'h:mm a')} - ${format(nextStartTime, 'h:mm a')}`;
            slotRanges.push(timeRange);
            currentStartTime = nextStartTime;
          }
  
          // Store the merged cell data in updatedBookings
          if (!updatedBookings[dayKey]) updatedBookings[dayKey] = {};
          updatedBookings[dayKey][slotRanges[0]] = {
            booked: true,
            span: slotRanges.length, // Number of cells to span
            endRange: slotRanges[slotRanges.length - 1],
            bookingId: bookingData.bookingId, // Store the bookingId in the updated booking data
          };
  
          // Update bookedSlots state
          setBookedSlots(updatedBookings); // Update state only after successful booking
          setShowModal(false); // Close the modal after booking
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert('Slot already booked');
        } else {
          console.error('Error booking slot', error);
          alert('Error booking slot');
        }
      }
    } else {
      alert('Please fill all fields!');
    }
  };
  

  const openUpdateModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/booking/display/${id}`);
      if (response.status === 200) {
        const data = response.data;
        console.log('Fetched Data:', data); // Log fetched data
  
        // Populate update modal fields with fetched data
        setFirstName(data.firstName || '');
        setPhoneNumber(data.phoneNumber || '');
        setStartTime(data.startTime || '');
        setEndTime(data.endTime || '');
        setSelectedDay(new Date(data.date)); // Format if necessary
  
        setBookingId(data.id); // Store the booking ID for the update
        setShowUpdateModal(true); // Open the update modal
      } else {
        alert('Failed to fetch booking details.');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      alert('Error fetching booking details. Please try again.');
    }
  };

  const handleUpdateBooking = async () => {
    if (firstName && phoneNumber && startTime && endTime) {
      const startDateTime = new Date(selectedDay);
      const endDateTime = new Date(selectedDay);
  
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');
  
      startDateTime.setHours(startHour, startMinute);
      endDateTime.setHours(endHour, endMinute);
      
      console.log('Booking ID:', bookingId); 

      const updatedBooking = {
        id: bookingId, // Use the ID from the state
        firstName,
        phoneNumber,
        date: selectedDay.toLocaleDateString('en-CA'),
        startTime: startDateTime.toTimeString().split(' ')[0],
        endTime: endDateTime.toTimeString().split(' ')[0],
      };

      console.log('Updated Booking:', updatedBooking);
  
      try {
        const response = await axios.put(`http://localhost:8080/api/booking/update/${bookingId}`, updatedBooking);
        if (response.status === 200) {
          console.log('Booking updated successfully:', response.data);
          alert('Booking updated successfully!');
          setShowUpdateModal(false); // Close the modal after a successful update
        } else {
          alert('Failed to update booking.');
        }
      } catch (error) {
        console.error('Error updating booking:', error);
        alert('Slot is already booked.');
      }
    } else {
      alert('Please fill all fields!');
    }
  };
  
  const openDeleteModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/booking/display/${id}`);
      if (response.status === 200) {
        const data = response.data;
        console.log('Fetched Data for Deletion:', data); // Log fetched data for deletion
    
        // Populate delete modal fields with fetched data (in a read-only manner)
        setFirstName(data.firstName || '');
        setPhoneNumber(data.phoneNumber || '');
        setStartTime(data.startTime || '');
        setEndTime(data.endTime || '');
        setSelectedDay(new Date(data.date)); // Format if necessary
    
        setBookingId(data.id); // Store the booking ID for deletion
        setShowDeleteModal(true); // Open the delete modal
      } else {
        alert('Failed to fetch booking details for deletion.');
      }
    } catch (error) {
      console.error('Error fetching booking details for deletion:', error);
      alert('Error fetching booking details for deletion. Please try again.');
    }
  };
  
  const handleDeleteBooking = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/booking/delete/${bookingId}`);
      
      // Log the response to check the status code
      console.log('Delete Response:', response);
      
      // Check for 204 No Content, which indicates a successful deletion
      if (response.status === 204) {
        alert('Booking deleted successfully!');
        setShowDeleteModal(false); // Close the modal after successful deletion
        // Optionally refresh the bookings or update UI
      } else {
        alert('Failed to delete booking.');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Error deleting booking. Please try again.');
    }
  };
  
  return (
    <div className="weekly-calendar" style={{ display: 'flex',margin:'20px',  width: '98%', maxWidth: '100%', maxHeight: '950px', padding: '30px',border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',minSheight:'100vh' }}>
      <div className="left-section" style={{ flexDirection:'column',justifyContent:'center',gap: '20px',alignItems: "flex-start",maxWidth:'300px',padding:'20px',marginRight:'50px'}}>
        {/* Week Navigation - first */}
        <div className="week-navigation d-flex align-items-center" style={{ justifyContent:'center', marginBottom: '0' ,padding:'20px' }}>
          <span 
            onClick={handlePreviousWeek} 
            style={{ cursor: 'pointer', fontSize: '1.5rem', margin: 0, marginRight: '10px' }}
          >
            &#x25C0; {/* Black Left-Pointing Triangle */}
          </span>
          <span style={{ margin: 0 }}>
            {format(startOfCurrentWeek, 'MMM dd')} - {format(endOfCurrentWeek, 'MMM dd')}
          </span>
          <span 
            onClick={handleNextWeek} 
            style={{ cursor: 'pointer', fontSize: '1.5rem', margin: 0, marginLeft: '10px' }}
          >
            &#x25B6; {/* Black Right-Pointing Triangle */}
          </span>
        </div>

        {/* Date Picker - second */}
          <div className="date-picker" style={{ zIndex: 10, maxWidth:'300px',margin: 0,padding:'20px' }}>
            <DatePicker
              selected={currentDate}
              onChange={handleDateChange}
              className="form-control"
              dateFormat="MMM dd, yyyy"
              inline
            />
          </div>
      </div>


      {/* Calendar Table with Time Slots */}

        <div className="calendar-table" style={{display: 'flex',overflowX:'auto',  padding: '10px', width: '100%', maxHeight: '900px', minWidth: '600px', maxWidth:'1200px'}}>
          <table className="table table-bordered" style={{width: '100%', tableLayout: 'fixed',marginRight: '10px', marginBottom: '10px', overflowX: 'auto',overflowY: 'hidden',border: '3px solid black',zIndex: 1,borderSpacing: '0',padding: '10px'}}>
            <thead>
            <tr>
            <th style={{position: 'sticky',left: 0,top: '-11px',textAlign: 'center',zIndex: 3,backgroundColor: '#4169e1', color: 'white', width: '100px',border: '2px solid black'}}>
                Time
            </th>
            {weekDays.map((day) => (
              <th key={day} style={{position: 'sticky',top: '-11px',backgroundColor: '#4169e1', color: 'white', zIndex: 2, width: '150px', border: '2px solid black'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>{format(day, 'MMM')}</strong> {format(day, 'dd')}</span>
                  <span>{format(day, 'EEE')}</span>
                </div>
              </th>
            ))}
          </tr>
              <tr>
                <td style={{ position: 'sticky', top: 38,  left: 0, zIndex:2, borderRight: '2px solid black', width: '100px' ,backgroundColor:'white'}}></td>
                {weekDays.map((day) => (
                  <td key={day} onClick={() => handlePlusClick(day)} style={{cursor: 'pointer', height: '50px', textAlign: 'center', position: 'sticky', top: 38, zIndex: 1,  border: '2px solid black', backgroundColor: 'transparent'}}>
                    <span style={{ display: 'inline-block', width: '90px',  height: '30px', lineHeight: '30px',  textAlign: 'center', fontSize: "25px", fontWeight: "bold", color: "white", borderRadius: '10px',  backgroundColor: 'grey'}}>
                      +
                    </span>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
            {timeSlots.map(({ range }) => (
              <tr key={range}>
                <td style={{ position: 'sticky', left: 0, zIndex: 2,  width: '100px', verticalAlign: 'top', padding: 0, borderRight: '2px solid black', borderTop: range.split(' - ')[0].endsWith(':00 AM') || range.split(' - ')[0].endsWith(':00 PM') ? '2px solid black' : '1px solid #ccc', backgroundColor: 'white'}}>
                <div style={{ position: 'absolute', top: range.split(' - ')[0].endsWith(':00 AM') || range.split(' - ')[0].endsWith(':00 PM') ? '-13px' : '-10px', left: '50%', transform: 'translateX(-50%)',
                    fontSize: range.split(' - ')[0].endsWith(':00 AM') || range.split(' - ')[0].endsWith(':00 PM') ? '14px' : '10px', color: '#333', whiteSpace: 'nowrap',
                    fontWeight: range.split(' - ')[0].endsWith(':00 AM') || range.split(' - ')[0].endsWith(':00 PM') ? 'bold' : 'normal', backgroundColor: '#fff', padding: '2px 4px', borderRadius: '4px', zIndex: 4}}>
                    {range.split(' - ')[0]}
                </div>
                </td>

                {weekDays.map((day) => {
                  const dayKey = format(day, 'yyyy-MM-dd');
                  const bookingData = bookedSlots[dayKey]?.[range];
                  const isThickBorderTime = range.split(' - ')[0].endsWith(':00 AM') || range.split(' - ')[0].endsWith(':00 PM');

                  const storedBookingId = localStorage.getItem('bookingId');
                  const currentBookingId = bookingData?.bookingId || storedBookingId;

                  if (bookingData?.booked) {
                    return (
                      <td
                        key={dayKey + range}
                        rowSpan={bookingData.span}
                        className="slot booked"
                        style={{ cursor: 'pointer', backgroundColor: 'lightgreen', color: '#333', minWidth: '150px', height: 'auto', textAlign: 'center', verticalAlign: 'middle', padding: '10px', border: '3px solid black',  position: 'relative', overflow: 'hidden',  fontWeight: 'bold',  transition: 'all 0.3s ease', boxSizing: 'border-box'}}
                      >
                        <div>Booked</div>
                        <div style={{ height: '10px' }}></div>
                        <div>{range.split(' - ')[0]}</div>
                        <div>to</div>
                        <div>{bookingData.endRange.split(' - ')[1]}</div>
                        {/* Update and Cancel buttons */}
                        <div style={{ marginTop: '10px',display: 'flex' }}>
                          <button
                            style={{ width: '65px', height: '30px',  lineHeight: '30px',  backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'center'}}
                            onClick={() => openUpdateModal(currentBookingId)} 
                          >
                            Update
                          </button>

                          <button
                            style={{marginLeft: '5px',  width: '65px', height: '30px', lineHeight: '30px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'center'}}
                            onClick={() => openDeleteModal(currentBookingId)}
                          >
                            Remove
                          </button>
                        </div>

                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={dayKey + range}
                        onClick={() => handleSlotBooking(day, range)} // Handle booking logic
                        className="slot"
                        style={{cursor: 'pointer', backgroundColor: 'white', minWidth: '150px', height: '35px', borderTop: isThickBorderTime ? '2px solid black' : '1px solid #ccc', borderRight:'2px solid black'}}
                      />
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
          </table>
        </div>


    {/* Modal for Booking */}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">Create Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group mb-3">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />
        </div>

        <div className="form-group mb-3">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          className="form-control"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
        />
        </div>

        <div className="form-group mb-3">
        <label htmlFor="startTime">Start Time</label>
        <input
          type="time"
          id="startTime"
          className="form-control"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        </div>

        <div className="form-group mb-3">
        <label htmlFor="endTime">End Time</label>
        <input
          type="time"
          id="endTime"
          className="form-control"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        </div>
        </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button
            variant="primary"
            onClick={handleBookingSubmit}
            className="py-1 px-3"
            style={{
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              fontSize: '14px', // Adjust font size if needed
            }}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            className="py-1 px-3"
            style={{
              fontSize: '14px', // Adjust font size if needed
            }}
          >
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>

    <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">Update Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group mb-3">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button
            variant="primary"
            onClick={handleUpdateBooking}
            className="py-1 px-3"
            style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
          >
            Update
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowUpdateModal(false)}
            className="py-1 px-3"
          >
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>

    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">Delete Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group mb-3">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={firstName}
            readOnly
            disabled
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            className="form-control"
            value={phoneNumber}
            readOnly
            disabled
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="text"
            id="startTime"
            className="form-control"
            value={startTime}
            readOnly
            disabled
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="endTime">End Time</label>
          <input
            type="text"
            id="endTime"
            className="form-control"
            value={endTime}
            readOnly
            disabled
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button
            variant="danger"
            onClick={handleDeleteBooking}
            className="py-1 px-3"
            style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            className="py-1 px-3"
          >
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>

    </div>
  );
};

export default AdminCalendar;
