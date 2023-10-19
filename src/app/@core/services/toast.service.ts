import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ToastService {
	toasts: any[] = [];

	show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		this.toasts.push({ textOrTpl, ...options });
	}

	showSuccess(textOrTpl: string | TemplateRef<any> = 'Saved!') {
		const options = { classname: 'bg-success text-light', delay: 2000 };
		this.toasts.push({ textOrTpl, ...options });
	}

	showError(textOrTpl: string | TemplateRef<any> = 'An Error Occured. Please try again.') {
		const options = { classname: 'bg-danger text-light', delay: 5000 };
		this.toasts.push({ textOrTpl, ...options });
	}

	showWarning(textOrTpl: string | TemplateRef<any> = 'Warning. Please try again.') {
		const options = { classname: 'bg-warning text-light', delay: 5000 };
		this.toasts.push({ textOrTpl, ...options });
	}

	remove(toast: any) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
