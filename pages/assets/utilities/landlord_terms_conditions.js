import React, { useRef, useEffect, useState } from "react";
import { Button, Modal, Typography } from "antd";

// ! disabled button still on construction

const LandlordTermsCondition = ({ open, name, close, onProceed }) => {
  const ref = useRef(null);
  const [isBottom, setIsBottom] = useState(false);

  const handleScroll = () => {
    console.log("called");
    if (scrollContainerRef.current) {
      const scrollContainer = ref.current;
      const atBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight ===
        scrollContainer.scrollHeight;
      setIsBottom(atBottom);
    }
  };

  useEffect(() => {
    const scrollContainer = ref.current;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <Modal
      open={true}
      onCancel={close}
      closable={false}
      title="Terms and Condition"
      width={700}
      bodyStyle={{
        height: 500,
        overflow: "scroll",
      }}
      ref={(node) => (window.modal = node)}
      footer={
        <Button
          type="primary"
          onClick={onProceed}
          block /*disabled={!isBottom} */
        >
          I Understand and Agree to the Terms and Conditions
        </Button>
      }
    >
      <Typography.Text
        style={{ color: "#777", maxHeight: 500, overflow: "scroll" }}
        ref={ref}
      >
        Dear {name},
        <br />
        <br />
        We trust this message finds you well. As part of our commitment to
        ensuring the well-being and safety of students residing in off-campus
        accommodations, we are pleased to introduce Accredited Boarding House
        Management and Student Monitoring System for University Student
        Services.
        <br />
        <br />
        At Bukidnon State University, we prioritize the health, safety, and
        overall welfare of our students, both on and off campus. Recognizing the
        vital role that boarding houses and dormitories play in the student
        living experience, we have established a comprehensive accreditation
        process to ensure that these accommodations meet the highest standards
        of safety, cleanliness, and overall well-being.
        <br />
        <br />
        To be eligible for accreditation, landlords are required to adhere to a
        set of criteria that cover crucial aspects such as fire safety, building
        security, electrical safety, cleaning and sanitation, cleanliness and
        maintenance, ventilation, health and sanitation, structural safety,
        emergency preparedness, and visitor management.
        <br />
        <br />
        Accredited boarding houses and dormitories not only provide a secure and
        conducive living environment but also contribute significantly to the
        overall positive experience of students during their academic journey.
        We believe that by setting and maintaining these standards, we can
        collectively create a community that fosters academic success, personal
        growth, and a sense of belonging.
        <br />
        <br />
        We encourage all landlords to review the accreditation criteria outlined
        in the accompanying documentation and take the necessary steps to meet
        these standards. Upon successful completion of the accreditation
        process, your boarding house will be officially recognized as a
        University Health and Safety Accredited Residence, demonstrating your
        commitment to providing a safe and supportive living environment for our
        students.
        <br />
        <br />
        Should you have any questions or require assistance during the
        accreditation process, please do not hesitate to reach out to Office of
        the Vice President For Culture, Arts, Sports And Student Services at
        0936 105 7042 and <a href="mailto:oss@buksu.edu.ph">oss@buksu.edu.ph</a>
        .
        <br />
        <br />
        Thank you for your dedication to student well-being and safety.
        <br />
        <br />
        Sincerely,
        <br /> Bukidnon State University
        <br />
        <br />
        Office of the Vice President For Culture, Arts, Sports And Student
        Services University health and safety accreditation for student boarding
        houses and dormitories.
        <br />
        <br />
        <br />
        <strong>Fire Safety</strong>
        <ul>
          {[
            "Working fire extinguishers are present in common areas and on each floor",
            "Smoke detectors are installed and functional in every room and common areas.",
            "Clear evacuation routes are posted and easily accessible.",
            "A fire alarm system is in place with a well-maintained functionality.",
            "Fire exit doors are unlocked and unobstructed.",
            "A fire evacuation plan is posted in visible locations with instructions for residents.",
          ].map((e, i) => (
            <li key={`a-${i}`}>{e}</li>
          ))}
        </ul>
        <strong>Building security</strong>
        <ul>
          {[
            "There is controlled access at the main entrance.",
            "Locks on doors are in functional working condition.",
            "Functioning security cameras are installed in common areas, entrances and exits, and other key locations.",
            "Adequate lighting is provided in common areas, entrances and outside the boarding house.",
          ].map((e, i) => (
            <li key={`b-${i}`}>{e}</li>
          ))}
        </ul>
        <strong>Electrical safety</strong>
        <ul>
          {[
            "All electrical outlets and switches are functional.",
            "Extension cords are used appropriately and not overloaded.",
            "There is proper grounding for electrical equipment.",
            "Electrical systems and equipment are regularly inspected for potential hazards.",
          ].map((e, i) => (
            <li key={`c-${i}`}>{e}</li>
          ))}
        </ul>
        <strong>Cleaning and sanitation</strong>
        <ul>
          {[
            "Common areas (kitchen, bathrooms, living rooms) are cleaned and sanitized frequently.",
            "Cleaning protocols are clearly communicated to the residents.",
          ].map((e, i) => (
            <li key={`d-${i}`}>{e}</li>
          ))}
        </ul>
        <strong>Cleanliness and Maintenance</strong>
        <ul>
          {[
            "Waste is properly segregated and disposed of.",
            "Plumbing fixtures, ventilation systems, and lighting are in functional condition.",
            "Regular pest control measures are established.",
          ].map((e, i) => (
            <li key={`e-${i}`}>{e}</li>
          ))}
        </ul>
        <strong>Ventilation</strong>
        <ul>
          {[
            "There is adequate ventilation in the boarding house, such as windows, fans, or air conditioning.",
            "Ventilations systems are regularly maintained and cleaned.",
          ].map((e, i) => (
            <li key={`f-${i}`}>{e}</li>
          ))}
        </ul>
        <strong>Health and sanitation</strong>
        <ul>
          {[
            "There are sufficient toilets, showers, and sinks available for residents.",
            "Water quality is regularly checked for safety and compliance.",
          ].map((e, i) => (
            <li key={`g-${i}`}>{e}</li>
          ))}
        </ul>
        <strong>Structural safety</strong>
        <ul>
          {[
            "Any visible signs of structural damage or hazards are addressed promptly.",
            "Staircases, handrails, and balconies are in good condition.",
            "The boarding house is compliant with local building codes and regulations.",
          ].map((e, i) => (
            <li key={`h-${i}`}>{e}</li>
          ))}
        </ul>
        <strong> Emergency preparedness</strong>
        <ul>
          {[
            "Residents are provided with first aid kits during minor accidents.",
            "Health emergency contact numbers are readily provided for residents.",
          ].map((e, i) => (
            <li key={`i-${i}`}>{e}</li>
          ))}
        </ul>
        <strong>Visitors and guests</strong>
        <ul>
          <li>
            There are restrictions on visitors or guests entering the boarding
            house.
          </li>
        </ul>
      </Typography.Text>
    </Modal>
  );
};

export default LandlordTermsCondition;
