import { Component, TemplateRef } from '@angular/core';

import { ToastService } from '@app/@core/services/toast.service';

@Component({
	selector: 'app-toasts',
	templateUrl: './toasts-container.component.html',
	host: { class: 'toast-container w-100 d-flex justify-content-center position-fixed p-3', style: 'z-index: 1200' },
})
export class ToastsContainer {
	constructor(public toastService: ToastService) {}

	isTemplate(toast: any) {
		return toast.textOrTpl instanceof TemplateRef;
	}
}