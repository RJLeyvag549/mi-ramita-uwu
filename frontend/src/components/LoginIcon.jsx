const LoginIcon = () => {
  return (
    <div style={styles.container}>
      <img src="/family.png" alt="Family Icon" style={styles.image} />
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    border: "3px solid white",
    borderRadius: "80%",
    padding: "10px",
    backgroundColor: "white",
    width: "90px",
    height: "90px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  image: {
    width: "110px",
    objectFit: "contain",
  },
};

export default LoginIcon;
