export interface PopupAction {
  label: string;
  type: 'primary' | 'danger' | 'outline';
  value: string; 
}

export interface PopupData {
  type: 'success' | 'danger';
  title: string;
  descriptionTextBeforeName?: string; 
  patientName?: string; 
  descriptionTextAfterName?: string; 
  fullDescription?: string;
  patientId?: string; 
  showClose: boolean; 
  actions: PopupAction[];
}
