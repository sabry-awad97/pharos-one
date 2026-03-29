/**
 * Staff workspace component
 * Main workspace shell with sidebar navigation and content area
 */

import { useState, useMemo } from "react";
import { StaffSidebar } from "./components/StaffSidebar";
import { StaffDirectory } from "./components/StaffDirectory";
import { StaffDetailPanel } from "./components/StaffDetailPanel";
import { CredentialsTracker } from "./components/CredentialsTracker";
import { OverviewTab } from "./components/OverviewTab";
import { AttendanceWorkspace } from "./components/AttendanceWorkspace";
import { AttendanceDetailPanel } from "./components/AttendanceDetailPanel";
import { MetricsWorkspace } from "./components/MetricsWorkspace";
import { AuditTrailWorkspace } from "./components/AuditTrailWorkspace";
import { STAFF_DATA, LEAVE_REQUESTS, ATTENDANCE_RECORDS } from "./mock-data";
import type { StaffTabId, Staff } from "./types";

/**
 * Staff workspace showing sidebar and active view content
 */
export function StaffWorkspace() {
  const [activeTab, setActiveTab] = useState<StaffTabId>("overview");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Calculate badge counts from mock data
  const credentialsAlertCount = useMemo(() => {
    return STAFF_DATA.reduce((count, staff) => {
      const alertCredentials = staff.credentials.filter(
        (cred) =>
          cred.status === "critical" ||
          cred.status === "expiring" ||
          cred.status === "expired",
      );
      return count + alertCredentials.length;
    }, 0);
  }, []);

  const pendingLeaveCount = useMemo(() => {
    return LEAVE_REQUESTS.filter((req) => req.status === "pending").length;
  }, []);

  const onDutyCount = useMemo(() => {
    return STAFF_DATA.filter((staff) => staff.dutyStatus === "On Duty").length;
  }, []);

  return (
    <div className="flex flex-row flex-1 overflow-hidden font-sans bg-background">
      {/* Sidebar */}
      <StaffSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        credentialsAlertCount={credentialsAlertCount}
        pendingLeaveCount={pendingLeaveCount}
        totalStaff={STAFF_DATA.length}
        onDutyCount={onDutyCount}
      />

      {/* Main content area */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {activeTab === "overview" ? (
          <OverviewTab
            selectedStaff={selectedStaff}
            onSelectStaff={setSelectedStaff}
          />
        ) : activeTab === "staff" ? (
          <>
            <div className="flex-1 overflow-hidden">
              <StaffDirectory onSelectStaff={setSelectedStaff} />
            </div>
            {selectedStaff && (
              <aside className="w-[380px] shrink-0">
                <StaffDetailPanel
                  staff={selectedStaff}
                  onClose={() => setSelectedStaff(null)}
                />
              </aside>
            )}
          </>
        ) : activeTab === "credentials" ? (
          <div className="flex-1 overflow-hidden">
            <CredentialsTracker />
          </div>
        ) : activeTab === "attendance" ? (
          <>
            <div className="flex-1 overflow-hidden flex flex-col">
              <AttendanceWorkspace
                allStaff={STAFF_DATA}
                selectedStaff={selectedStaff}
                onSelectStaff={setSelectedStaff}
                records={ATTENDANCE_RECORDS}
                leaves={LEAVE_REQUESTS}
              />
            </div>
            {selectedStaff && (
              <aside className="w-[380px] shrink-0">
                <AttendanceDetailPanel
                  staff={selectedStaff}
                  records={ATTENDANCE_RECORDS}
                  leaves={LEAVE_REQUESTS}
                  onClose={() => setSelectedStaff(null)}
                />
              </aside>
            )}
          </>
        ) : activeTab === "metrics" ? (
          <div className="flex-1 overflow-hidden">
            <MetricsWorkspace
              allStaff={STAFF_DATA}
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
            />
          </div>
        ) : activeTab === "audit_trail" ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <AuditTrailWorkspace
              allStaff={STAFF_DATA}
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
            />
          </div>
        ) : (
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
            Staff {activeTab} view placeholder
          </div>
        )}
      </div>
    </div>
  );
}
