import { useEffect } from "react";

export default function AppointmentSection() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//widget.simplybook.me/v2/widget/widget.js";
    script.type = "text/javascript";
    script.onload = () => {
      // @ts-ignore
      new window.SimplybookWidget({
        widget_type: "iframe",
        url: "https://framayson.simplybook.me",
        theme: "default",
        theme_settings: {
          timeline_hide_unavailable: "1",
          hide_past_days: "0",
          timeline_show_end_time: "0",
          timeline_modern_display: "as_slots",
          sb_base_color: "#c2def7",
          display_item_mode: "block",
          booking_nav_bg_color: "#e3f0fc",
          body_bg_color: "#f2f2f2",
          sb_review_image: "",
          dark_font_color: "#474747",
          light_font_color: "#f5fcff",
          btn_color_1: "#c2def7",
          sb_company_label_color: "#ffffff",
          hide_img_mode: "0",
          show_sidebar: "1",
          sb_busy: "#c7b3b3",
          sb_available: "#d6ebff",
        },
        timeline: "modern",
        datepicker: "top_calendar",
        is_rtl: false,
        app_config: { clear_session: 0, allow_switch_to_ada: 0, predefined: [] },
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.8rem", fontWeight: 600 }}>Book an Appointment</h2>
      <div className="simplybookme-widget" style={{ width: "100%", maxWidth: "900px", flex: 1 }} />
    </div>
  );
}
