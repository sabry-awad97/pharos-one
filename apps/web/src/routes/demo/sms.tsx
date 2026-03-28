import { StaffManagementStudio } from "@/mockups/staff-management/StaffManagementStudio";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/sms")({
  component: RouteComponent,
});

function RouteComponent() {
  return <StaffManagementStudio />;
}
