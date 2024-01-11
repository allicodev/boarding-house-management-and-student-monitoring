const IconText = ({ icon, text, fontSize }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginRight: 5 }}>{icon}</span>
      <span style={{ fontSize, marginBottom: 3 }}>{text}</span>
    </div>
  );
};

export default IconText;
