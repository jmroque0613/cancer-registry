export interface CancerCase {
  id: string;
  patientId: string;
  primarySite: string;
  histology: string;
  behavior: string;
  laterality?: string;
  stage?: string;
  tnmT?: string;
  tnmN?: string;
  tnmM?: string;
  diagnosisDate: string;
  status: "active" | "remission" | "deceased" | "lost_to_followup";
  createdAt: string;
}
