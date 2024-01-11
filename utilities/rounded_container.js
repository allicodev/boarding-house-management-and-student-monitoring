const RoundedContainer = ({ title, children, style, bodyStyle }) => {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 10,
        display: "block",
        margin: 5,
      }}
    >
      {title != null && <div style={{ marginBottom: 10 }}>{title}</div>}
      <div style={bodyStyle}>{children}</div>
    </div>
  );
};

export default RoundedContainer;
