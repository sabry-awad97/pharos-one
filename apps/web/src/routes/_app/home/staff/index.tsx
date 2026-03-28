import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/home/staff/")({
  component: StaffRoute,
});

function StaffRoute() {
  // Redirect to overview sub-route
  return <Navigate to="/home/staff/overview" />;
}
