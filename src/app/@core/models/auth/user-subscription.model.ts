export class UserSubscription {
    id: string;
    createdAt: number;
    billingId: string;
    subscriptionId?: string;
    active: boolean;
    cancelledAt?: number;

    constructor(billingId: string, subscriptionId: string = "", active: boolean = true, createdAt: number | null = null){
        this.billingId = billingId;
        this.subscriptionId = subscriptionId;
        this.active = active;
        this.createdAt = createdAt || new Date().getTime();
        if(active === false){
            this.cancelledAt = new Date().getTime();
        }
    }
}