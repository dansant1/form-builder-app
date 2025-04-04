export interface FormField {
    question: string;
    required: boolean;
}

export interface Form {
    id?: number;
    name: string;
    fields: FormField[];
}
  