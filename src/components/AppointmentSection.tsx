import "./AppointmentSection.css";

export default function AppointmentSection() {
  return (
    <div className="appointment-scroll">
      <div className="appointment">
        <h2 className="appointment__title">Book an Appointment</h2>
        <iframe
          src="https://framayson.simplybook.me"
          className="appointment__iframe"
          title="Book an Appointment"
        />
      </div>
    </div>
  );
}
