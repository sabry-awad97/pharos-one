/**
 * ProfileTab Component
 * Displays staff profile information: contact, branch, competencies, compliance
 */

import type { Staff } from "../types";

export interface ProfileTabProps {
  staff: Staff;
}

export function ProfileTab({ staff }: ProfileTabProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Contact Info */}
      <div>
        <div>{staff.email}</div>
        <div>{staff.phone}</div>
      </div>

      {/* Branch */}
      <div>
        <div>{staff.branch}</div>
      </div>

      {/* Competencies */}
      <div>
        {staff.competencies.map((comp) => (
          <span key={comp}>{comp}</span>
        ))}
      </div>

      {/* Compliance Score */}
      <div>
        <div>{staff.complianceScore}</div>
      </div>
    </div>
  );
}
