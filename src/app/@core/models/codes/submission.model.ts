export class Submission {
  id?: string;
  create_time: string | number;
  email_address: string;
  // plan_id is equivalent to a user's billingId
  plan_id: string;
  // transaction_id is equivalent to a code's subscriptionId
  transaction_id: string;
  user: string;
  referral?: string;
}