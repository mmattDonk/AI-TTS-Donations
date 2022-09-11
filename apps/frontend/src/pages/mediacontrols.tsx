import MediaControls from "../components/MediaControls";

export default function MediaControlsPage() {
  return (
    <div
      style={{
        // center vertically and horizontally
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <MediaControls />
    </div>
  );
}
