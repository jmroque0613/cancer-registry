export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: "M" | "F" | "U";
  philhealthId?: string;
  contactNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
