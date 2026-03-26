export default function AppointmentSection() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", boxSizing: "border-box" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.8rem", fontWeight: 600 }}>Book an Appointment</h2>
      <iframe
        src="https://framayson.simplybook.me"
        style={{ width: "100%", flex: 1, border: "none", borderRadius: "8px" }}
        title="Book an Appointment"
      />
    </div>
  );
}
