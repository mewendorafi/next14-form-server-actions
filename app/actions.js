'use server';

import { revalidatePath } from 'next/cache';

export async function postFormData(prevState, formData) {
	try {
		// console.log('POST/ FORM ACTION', formData);
		const user = {
			firstname: formData.get('firstname'),
			lastname: formData.get('lastname'),
		};
		// console.log('FORM DATA', user);
		revalidatePath('/');
		return user;
	} catch (error) {
		return error;
	}
}

export async function preloadFormInputValues() {
	try {
		// Dummy API call simulating server delay
		const rawResponse = await fetch('https://reqres.in/api/users/1?delay=2');
		const { data } = await rawResponse.json();
		const preload = {
			firstname: data.first_name,
			lastname: data.last_name,
		};

		// console.log('GET/ SERVER ACTION', savedFormPreload);
		revalidatePath('/');
		return preload;
	} catch (error) {
		return error;
	}
}
