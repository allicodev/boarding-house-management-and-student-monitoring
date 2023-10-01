const RoundedContainer = ({ title, children }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 10,
        display: "block",
        margin: 5,
      }}
    >
      {title != null && <div style={{ marginBottom: 10 }}>{title}</div>}
      {children}
    </div>
  );
};

export default RoundedContainer;
