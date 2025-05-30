// material-ui
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

// ==============================|| LOADER ||============================== //

export default function LinearLoading() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2001,
        width: "100%",
        minHeight: "100vh",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <LinearProgress
        variant="indeterminate"
        color="primary"
        sx={{
          height: "6px",
          background: "linear-gradient(269deg, rgb(185, 0, 246) 0.91%, rgb(220, 30, 175) 23.38%, rgb(255, 98, 0) 45.85%, rgb(253, 185, 46) 92.62%)",
          "> span": { backgroundColor: "red" },
        }}
      />
    </Box>
  );
}
