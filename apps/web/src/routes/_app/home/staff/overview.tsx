import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/home/staff/overview")({
  component: StaffOverviewRoute,
});

function StaffOverviewRoute() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontSize: 14,
        color: "#616161",
      }}
    >
      Staff overview route placeholder
    </div>
  );
}
