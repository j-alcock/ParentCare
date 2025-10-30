import { Medication } from './Healthcare';

export interface PharmacyInfo {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  locationId?: string; // store/location identifier on the label
}

export interface PatientInfo {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface PrescriberInfo {
  name?: string;
  phone?: string;
}

export interface MedicationProduct {
  name?: string; // e.g., "METFORMIN HCL"
  strength?: string; // e.g., "1000MG"
  form?: string; // e.g., "TABLET", "CAPSULE"
  quantity?: number; // Qty filled
  manufacturer?: string; // MFR
  ndcUpc?: string; // NDC/UPC code
  pillMarkings?: string; // imprint text/shape/color
  description?: string; // free text physical description
}

export interface DirectionsInfo {
  sigRaw?: string; // full SIG as printed, e.g., "TAKE 1 TABLET BY MOUTH DAILY"
  route?: string; // e.g., "BY MOUTH"
  schedule?: string; // e.g., "DAILY", "THREE TIMES DAILY"
  whenToTake?: string; // e.g., "8am, 2pm" or "morning/evening"
  takeWithFood?: boolean;
}

export interface PrescriptionInfo {
  rxNumber?: string; // pharmacy Rx number
  refillsRemaining?: number;
  refillsAuthorized?: number; // total authorized refills
  rxWrittenDateISO?: string;
  filledOnDateISO?: string;
  reorderAfterDateISO?: string; // or next refill date
  discardAfterDateISO?: string; // do not use after
}

export interface PillBottleLabel {
  pharmacy?: PharmacyInfo;
  patient?: PatientInfo;
  prescriber?: PrescriberInfo;
  product?: MedicationProduct;
  directions?: DirectionsInfo;
  prescription?: PrescriptionInfo;
  barcode?: string;
  notes?: string;
}

function joinNonEmpty(parts: Array<string | undefined>, separator: string): string | undefined {
  const filtered = parts.filter((p) => (p ?? '').trim().length > 0) as string[];
  return filtered.length ? filtered.join(separator) : undefined;
}

export function normalizeToMedication(label: PillBottleLabel): Medication {
  const name = label.product?.name?.trim();
  const strength = label.product?.strength?.trim();
  const form = label.product?.form?.trim();
  const dosage = joinNonEmpty([strength, form], ' ');

  const schedule = label.directions?.schedule?.trim();
  const whenToTake = label.directions?.whenToTake?.trim();
  const takeWithFood = typeof label.directions?.takeWithFood === 'boolean' ? label.directions?.takeWithFood : undefined;

  const pharmacyName = label.pharmacy?.name?.trim();
  const prescriberName = label.prescriber?.name?.trim();

  const refillDateISO = label.prescription?.reorderAfterDateISO?.trim();
  const refillsRemaining = label.prescription?.refillsRemaining;

  const metadataNotes = joinNonEmpty(
    [
      label.product?.manufacturer ? `Manufacturer: ${label.product.manufacturer}` : undefined,
      label.product?.ndcUpc ? `NDC/UPC: ${label.product.ndcUpc}` : undefined,
      label.product?.pillMarkings ? `Pill: ${label.product.pillMarkings}` : undefined,
      label.product?.description ? `Desc: ${label.product.description}` : undefined,
      label.prescription?.rxNumber ? `Rx#: ${label.prescription.rxNumber}` : undefined,
      label.prescription?.filledOnDateISO ? `Filled: ${label.prescription.filledOnDateISO}` : undefined,
      label.prescription?.rxWrittenDateISO ? `Written: ${label.prescription.rxWrittenDateISO}` : undefined,
      label.prescription?.discardAfterDateISO ? `Discard after: ${label.prescription.discardAfterDateISO}` : undefined,
      label.pharmacy?.phone ? `Pharmacy phone: ${label.pharmacy.phone}` : undefined,
    ],
    ' | '
  );

  const notes = joinNonEmpty([metadataNotes, label.notes], ' | ');

  return {
    id: String(Date.now()),
    name: name || 'Medication',
    dosage: dosage,
    schedule: schedule,
    whenToTake: whenToTake,
    takeWithFood: takeWithFood,
    refillsRemaining: refillsRemaining,
    refillDateISO: refillDateISO,
    pharmacy: pharmacyName,
    prescribedBy: prescriberName,
    notes: notes,
  };
}


