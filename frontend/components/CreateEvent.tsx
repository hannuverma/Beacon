import { useState } from "react";
import axios from "axios";

interface Props {
  onClose: () => void;
}

const CreateEventForm: React.FC<Props> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (latitude === null || longitude === null) {
      alert("Please pin a location");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/listings/",
        {
          title,
          description,
          latitude,
          longitude,
          event_date: eventDate,
          listing_type: "event",
        },
        { withCredentials: true }
      );
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Event</h2>
      
      <input 
        type="text"
        placeholder="Event title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />

      <textarea 
        placeholder="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />

      <input 
        type="datetime-local" 
        value={eventDate} 
        onChange={(e) => setEventDate(e.target.value)} 
      />

      <div className="form-actions">
        <button onClick={handleSubmit} className="btn-submit">
          Create Event
        </button>
        <button onClick={onClose} className="btn-cancel">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateEventForm;