import React from "react";
import { Button, Modal, Typography } from "antd";

const AdminEstabVerifyTermsCondition = ({ open, close, onProceed }) => {
  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      title="Terms and Condition"
      width={700}
      bodyStyle={{
        height: 500,
        overflow: "scroll",
      }}
      zIndex={999}
      footer={
        <Button
          type="primary"
          onClick={() => {
            onProceed();
            close();
          }}
          block /*disabled={!isBottom} */
        >
          I Understand and Agree to the Terms and Conditions
        </Button>
      }
    >
      <Typography.Text style={{ color: "#777" }}>
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

export default AdminEstabVerifyTermsCondition;
