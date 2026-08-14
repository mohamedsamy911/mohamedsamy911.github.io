/**
 * Recorded model outputs for the three example briefs.
 *
 * Two jobs. They let the section work with no key, no Worker and no network,
 * so the demo is never broken in front of a visitor. And they are the corpus
 * the deterministic tests replay through the validator and the OpenAPI
 * compiler, so those can be tested without spending a token.
 */

import type { ProposalGraph } from "./schema.ts";

export type Example = {
  id: string;
  label: string;
  brief: string;
  proposal: ProposalGraph;
};

export const EXAMPLES: Example[] = [
  {
    id: "clinics",
    label: "Clinic booking",
    brief:
      "A booking system for a chain of physiotherapy clinics. Patients book slots with a named practitioner at a specific branch. Reception staff need to reschedule and cancel on a patient's behalf, and management wants to see how well each branch is utilised.",
    proposal: {
      systemName: "Clinic Booking Platform",
      summary:
        "Lets patients reserve practitioner slots across clinic branches, gives reception staff delegated control over those bookings, and reports utilisation back to management.",
      services: [
        {
          name: "identity-service",
          responsibility:
            "Owns patient and staff accounts, authentication, and the delegation rules that let reception act for a patient.",
          dependsOn: [],
        },
        {
          name: "notification-service",
          responsibility:
            "Sends booking confirmations and reminders over email and SMS, consuming booking events asynchronously.",
          dependsOn: [],
        },
        {
          name: "booking-service",
          responsibility:
            "Owns slots and bookings, and is the single writer that enforces double-booking rules.",
          dependsOn: ["identity-service", "notification-service"],
        },
        {
          name: "reporting-service",
          responsibility:
            "Builds branch utilisation figures from booking history on a read replica.",
          dependsOn: ["booking-service"],
        },
      ],
      entities: [
        {
          name: "Clinic",
          description: "A physical branch that offers appointments.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "name", type: "string", required: true },
            { name: "address", type: "string", required: true },
            { name: "timezone", type: "string", required: true },
          ],
        },
        {
          name: "Practitioner",
          description: "A physiotherapist who can be booked at one or more clinics.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "fullName", type: "string", required: true },
            { name: "specialism", type: "string", required: false },
            { name: "clinicId", type: "uuid", required: true },
          ],
        },
        {
          name: "Slot",
          description: "A bookable window of a practitioner's time.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "practitionerId", type: "uuid", required: true },
            { name: "startsAt", type: "datetime", required: true },
            { name: "durationMinutes", type: "number", required: true },
            { name: "isAvailable", type: "boolean", required: true },
          ],
        },
        {
          name: "Patient",
          description: "A person who books appointments.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "fullName", type: "string", required: true },
            { name: "email", type: "string", required: true },
            { name: "phone", type: "string", required: false },
          ],
        },
        {
          name: "Booking",
          description: "A reserved slot, held by a patient.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "slotId", type: "uuid", required: true },
            { name: "patientId", type: "uuid", required: true },
            { name: "status", type: "string", required: true },
            { name: "createdAt", type: "datetime", required: true },
            { name: "bookedByStaffId", type: "uuid", required: false },
          ],
        },
        {
          name: "UtilisationReport",
          description: "Booked versus available capacity for a branch over a period.",
          fields: [
            { name: "clinicId", type: "uuid", required: true },
            { name: "periodStart", type: "datetime", required: true },
            { name: "periodEnd", type: "datetime", required: true },
            { name: "utilisationPercent", type: "number", required: true },
          ],
        },
      ],
      endpoints: [
        {
          method: "GET",
          path: "/clinics",
          service: "booking-service",
          summary: "List clinic branches.",
          responseEntity: "Clinic",
        },
        {
          method: "GET",
          path: "/clinics/{clinicId}/slots",
          service: "booking-service",
          summary: "List available slots at a branch for a date range.",
          responseEntity: "Slot",
        },
        {
          method: "GET",
          path: "/practitioners",
          service: "booking-service",
          summary: "List practitioners, optionally filtered by clinic.",
          responseEntity: "Practitioner",
        },
        {
          method: "POST",
          path: "/patients",
          service: "identity-service",
          summary: "Register a patient account.",
          requestEntity: "Patient",
          responseEntity: "Patient",
        },
        {
          method: "POST",
          path: "/bookings",
          service: "booking-service",
          summary: "Reserve a slot for a patient.",
          requestEntity: "Booking",
          responseEntity: "Booking",
        },
        {
          method: "GET",
          path: "/bookings/{bookingId}",
          service: "booking-service",
          summary: "Retrieve a single booking.",
          responseEntity: "Booking",
        },
        {
          method: "PATCH",
          path: "/bookings/{bookingId}",
          service: "booking-service",
          summary: "Reschedule a booking to a different slot.",
          requestEntity: "Booking",
          responseEntity: "Booking",
        },
        {
          method: "DELETE",
          path: "/bookings/{bookingId}",
          service: "booking-service",
          summary: "Cancel a booking.",
        },
        {
          method: "GET",
          path: "/reports/utilisation",
          service: "reporting-service",
          summary: "Branch utilisation over a reporting period.",
          responseEntity: "UtilisationReport",
        },
      ],
      decisions: [
        {
          choice: "booking-service is the only writer of Slot and Booking.",
          because:
            "Double-booking is the one failure this system cannot tolerate, and a single writer lets it be enforced with a database constraint rather than coordination.",
        },
        {
          choice: "Reception acts through delegation on the patient's account, not a parallel staff booking path.",
          because:
            "One booking path means one set of rules to test, and the audit trail records who acted for whom.",
        },
        {
          choice: "notification-service consumes events instead of being called inline.",
          because:
            "A failing SMS provider should never be able to fail a booking.",
        },
        {
          choice: "reporting-service reads from a replica.",
          because:
            "Utilisation queries scan history and would otherwise compete with booking writes.",
        },
      ],
    },
  },

  {
    id: "fleet",
    label: "Fleet telemetry",
    brief:
      "A platform to track a municipal fleet of vehicles and fixed assets. Devices report position and sensor readings every few seconds. Operations staff need live maps, geofence alerts when a vehicle leaves its assigned zone, and maintenance scheduled off engine hours.",
    proposal: {
      systemName: "Fleet Telemetry Platform",
      summary:
        "Ingests high-frequency device telemetry for municipal vehicles and fixed assets, evaluates geofence rules in near real time, and schedules maintenance from accumulated engine hours.",
      services: [
        {
          name: "ingest-service",
          responsibility:
            "Terminates device connections and writes raw telemetry to the time-series store as fast as it arrives.",
          dependsOn: [],
        },
        {
          name: "geo-service",
          responsibility:
            "Stores geofences and answers point-in-polygon and proximity queries against PostGIS.",
          dependsOn: [],
        },
        {
          name: "asset-service",
          responsibility:
            "Owns the asset registry and the current state of each asset, derived from the telemetry stream.",
          dependsOn: ["ingest-service", "geo-service"],
        },
        {
          name: "alerting-service",
          responsibility:
            "Evaluates geofence breaches and maintenance thresholds, and raises alerts to operations staff.",
          dependsOn: ["asset-service"],
        },
      ],
      entities: [
        {
          name: "Asset",
          description: "A tracked vehicle or fixed piece of equipment.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "label", type: "string", required: true },
            { name: "kind", type: "string", required: true },
            { name: "deviceId", type: "string", required: true },
            { name: "engineHours", type: "number", required: false },
          ],
        },
        {
          name: "TelemetryReading",
          description: "One position and sensor sample from a device.",
          fields: [
            { name: "assetId", type: "uuid", required: true },
            { name: "recordedAt", type: "datetime", required: true },
            { name: "latitude", type: "number", required: true },
            { name: "longitude", type: "number", required: true },
            { name: "sensors", type: "json", required: false },
          ],
        },
        {
          name: "Geofence",
          description: "A polygon an asset is expected to stay inside.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "name", type: "string", required: true },
            { name: "polygon", type: "json", required: true },
            { name: "assignedAssetId", type: "uuid", required: false },
          ],
        },
        {
          name: "Alert",
          description: "A raised condition needing operator attention.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "assetId", type: "uuid", required: true },
            { name: "kind", type: "string", required: true },
            { name: "raisedAt", type: "datetime", required: true },
            { name: "acknowledged", type: "boolean", required: true },
          ],
        },
        {
          name: "MaintenanceTask",
          description: "Work scheduled against an asset.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "assetId", type: "uuid", required: true },
            { name: "dueAtEngineHours", type: "number", required: true },
            { name: "completedAt", type: "datetime", required: false },
          ],
        },
      ],
      endpoints: [
        {
          method: "POST",
          path: "/telemetry",
          service: "ingest-service",
          summary: "Accept a batch of device readings.",
          requestEntity: "TelemetryReading",
        },
        {
          method: "GET",
          path: "/assets",
          service: "asset-service",
          summary: "List assets with their latest known position.",
          responseEntity: "Asset",
        },
        {
          method: "GET",
          path: "/assets/{assetId}/history",
          service: "asset-service",
          summary: "Replay an asset's track over a time window.",
          responseEntity: "TelemetryReading",
        },
        {
          method: "POST",
          path: "/geofences",
          service: "geo-service",
          summary: "Define a geofence polygon.",
          requestEntity: "Geofence",
          responseEntity: "Geofence",
        },
        {
          method: "GET",
          path: "/geofences",
          service: "geo-service",
          summary: "List geofences.",
          responseEntity: "Geofence",
        },
        {
          method: "DELETE",
          path: "/geofences/{geofenceId}",
          service: "geo-service",
          summary: "Remove a geofence.",
        },
        {
          method: "GET",
          path: "/alerts",
          service: "alerting-service",
          summary: "List open alerts.",
          responseEntity: "Alert",
        },
        {
          method: "PATCH",
          path: "/alerts/{alertId}",
          service: "alerting-service",
          summary: "Acknowledge an alert.",
          requestEntity: "Alert",
          responseEntity: "Alert",
        },
        {
          method: "GET",
          path: "/maintenance",
          service: "alerting-service",
          summary: "List maintenance due or overdue.",
          responseEntity: "MaintenanceTask",
        },
      ],
      decisions: [
        {
          choice: "Raw telemetry goes to a time-series store, not the relational database.",
          because:
            "Writes arrive every few seconds per device and are append-only; mixing them with registry data would make both harder to operate.",
        },
        {
          choice: "ingest-service does no rule evaluation.",
          because:
            "The ingest path must never be the bottleneck, so geofence checks run downstream against derived state.",
        },
        {
          choice: "Geofence containment is delegated to PostGIS.",
          because:
            "Point-in-polygon at this rate is a solved problem in the database and reimplementing it in application code would be slower and wrong at the edges.",
        },
      ],
    },
  },

  {
    id: "licensing",
    label: "Municipal licensing",
    brief:
      "An online licence application service for a city authority. Citizens submit an application with supporting documents. A clerk checks it, anything above a fee threshold goes to a manager, and the applicant is notified at each step. The authority needs an audit trail of every decision.",
    proposal: {
      systemName: "Municipal Licensing Service",
      summary:
        "Takes citizen licence applications with supporting documents, routes them through clerk and manager review according to fee thresholds, and keeps an auditable record of every decision.",
      services: [
        {
          name: "identity-service",
          responsibility:
            "Authenticates citizens and authority staff, and holds the role assignments that reviews depend on.",
          dependsOn: [],
        },
        {
          name: "document-service",
          responsibility:
            "Stores uploaded supporting documents and issues short-lived access links.",
          dependsOn: [],
        },
        {
          name: "application-service",
          responsibility:
            "Owns licence applications and their current state, and is the system of record for the audit trail.",
          dependsOn: ["identity-service", "document-service"],
        },
        {
          name: "workflow-service",
          responsibility:
            "Runs the review process in Camunda, deciding what happens next and who it is assigned to.",
          dependsOn: ["application-service"],
        },
      ],
      entities: [
        {
          name: "Applicant",
          description: "A citizen or business applying for a licence.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "fullName", type: "string", required: true },
            { name: "nationalId", type: "string", required: true },
            { name: "email", type: "string", required: true },
          ],
        },
        {
          name: "LicenceApplication",
          description: "A submitted request for a licence.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "applicantId", type: "uuid", required: true },
            { name: "licenceType", type: "string", required: true },
            { name: "feeAmount", type: "number", required: true },
            { name: "status", type: "string", required: true },
            { name: "submittedAt", type: "datetime", required: true },
          ],
        },
        {
          name: "Document",
          description: "A file supporting an application.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "applicationId", type: "uuid", required: true },
            { name: "filename", type: "string", required: true },
            { name: "contentType", type: "string", required: true },
            { name: "uploadedAt", type: "datetime", required: true },
          ],
        },
        {
          name: "ReviewTask",
          description: "A unit of human work assigned by the workflow.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "applicationId", type: "uuid", required: true },
            { name: "assignedRole", type: "string", required: true },
            { name: "createdAt", type: "datetime", required: true },
            { name: "completedAt", type: "datetime", required: false },
          ],
        },
        {
          name: "LicenceDecision",
          description: "A recorded approval or rejection, kept permanently.",
          fields: [
            { name: "id", type: "uuid", required: true },
            { name: "applicationId", type: "uuid", required: true },
            { name: "decidedByStaffId", type: "uuid", required: true },
            { name: "outcome", type: "string", required: true },
            { name: "reason", type: "string", required: false },
            { name: "decidedAt", type: "datetime", required: true },
          ],
        },
      ],
      endpoints: [
        {
          method: "POST",
          path: "/applicants",
          service: "identity-service",
          summary: "Register an applicant.",
          requestEntity: "Applicant",
          responseEntity: "Applicant",
        },
        {
          method: "POST",
          path: "/applications",
          service: "application-service",
          summary: "Submit a licence application.",
          requestEntity: "LicenceApplication",
          responseEntity: "LicenceApplication",
        },
        {
          method: "GET",
          path: "/applications/{applicationId}",
          service: "application-service",
          summary: "Retrieve an application and its current status.",
          responseEntity: "LicenceApplication",
        },
        {
          method: "POST",
          path: "/applications/{applicationId}/documents",
          service: "document-service",
          summary: "Attach a supporting document.",
          requestEntity: "Document",
          responseEntity: "Document",
        },
        {
          method: "GET",
          path: "/applications/{applicationId}/documents",
          service: "document-service",
          summary: "List documents attached to an application.",
          responseEntity: "Document",
        },
        {
          method: "GET",
          path: "/tasks",
          service: "workflow-service",
          summary: "List review tasks assigned to the caller's role.",
          responseEntity: "ReviewTask",
        },
        {
          method: "POST",
          path: "/tasks/{taskId}/complete",
          service: "workflow-service",
          summary: "Complete a review task and advance the process.",
          requestEntity: "LicenceDecision",
          responseEntity: "ReviewTask",
        },
        {
          method: "GET",
          path: "/applications/{applicationId}/decisions",
          service: "application-service",
          summary: "Read the decision history for an application.",
          responseEntity: "LicenceDecision",
        },
      ],
      decisions: [
        {
          choice: "Routing lives in a Camunda process, not in application code.",
          because:
            "The fee threshold and escalation path are policy that changes without a deployment, and the process model doubles as documentation the authority can review.",
        },
        {
          choice: "application-service owns the audit trail rather than the workflow engine.",
          because:
            "Decisions have to outlive any particular process version, and the authority needs them readable without a Camunda licence.",
        },
        {
          choice: "Documents are served through short-lived links, never public URLs.",
          because:
            "Supporting documents contain personal data and the identifiers would otherwise be guessable forever.",
        },
      ],
    },
  },
];

export const findExample = (brief: string): Example | undefined =>
  EXAMPLES.find((e) => e.brief.trim() === brief.trim());
