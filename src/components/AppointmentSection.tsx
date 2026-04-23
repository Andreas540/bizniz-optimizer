import "./AppointmentSection.css";

const bookingBaseUrl = "https://app.biznizoptimizer.com/book/framayson";

const serviceUrls: Record<string, string> = {
  "YOUR_KEY_FOR_Bizniz_Optimizer_Introduction": "?service=57c14a79-c541-4e61-ac24-f1fd55dd5b58",
};

export default function AppointmentSection() {
  const url = bookingBaseUrl + serviceUrls["YOUR_KEY_FOR_Bizniz_Optimizer_Introduction"];

  return (
    <div className="appointment-scroll">
      <div className="appointment">
        <h2 className="appointment__title">Book an Appointment</h2>
        <div className="appointment__button-wrap">
          <a href={url} className="appointment__button">
            Bizniz Optimizer Introduction
          </a>
        </div>
      </div>
    </div>
  );
}
