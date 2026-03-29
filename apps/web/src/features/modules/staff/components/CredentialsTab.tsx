/**
 * CredentialsTab Component
 * Displays staff credentials with expiry status
 */

import type { Staff } from "../types";

export interface CredentialsTabProps {
  staff: Staff;
}

export function CredentialsTab({ staff }: CredentialsTabProps) {
  return (
    <div className="p-4 space-y-3">
      {staff.credentials.map((credential, index) => (
        <div key={index} className="border-b pb-3">
          <div>{credential.type}</div>
          <div>{credential.number}</div>
          <div>{credential.expiry}</div>
          <div>{credential.status}</div>
          <div>{credential.daysLeft} days left</div>
        </div>
      ))}
    </div>
  );
}
