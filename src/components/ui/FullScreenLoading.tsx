const FullScreenLoading = () => {
  return (
    <div style={fullStyles.container}>
      <div style={fullStyles.spinner} />
    </div>
  );
};

const fullStyles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 9999,
  },
  spinner: {
    width: 50,
    height: 50,
    border: "5px solid #e5e7eb",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default FullScreenLoading;
