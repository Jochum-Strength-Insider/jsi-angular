export class Submission {
  id?: string;
  create_time: string | number;
  email_address: string;
  plan_id: string;
  transaction_id: string;
  user: string;
  referral?: string;
}