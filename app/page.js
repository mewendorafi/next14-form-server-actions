// //! SSR (default)
import styles from './page.module.css';
import SubmitButton from './SubmitButton';
import { postFormData, preloadFormInputValues } from '@/app/actions';

export default async function Home() {
	const preload = await preloadFormInputValues();

	return (
		<main className={styles.main}>
			<form action={postFormData}>
				<input required type='text' name='firstname' defaultValue={preload.firstname} />
				<input required type='text' name='lastname' defaultValue={preload.lastname} />
				<SubmitButton />
			</form>
		</main>
	);
}

//! CSR
'use client';

import styles from './page.module.css';
import { useState, useTransition, useEffect } from 'react';
import { postFormData, preloadFormInputValues } from '@/app/actions';
import { useFormStatus, useFormState } from 'react-dom';

const initialFormState = {
	firstname: '',
	lastname: '',
};

export default function Home() {
	const { pending } = useFormStatus(); // status of the last form submission
	const [formPreload, setFormPreload] = useState(initialFormState);
	const [firstnameInput, setFirstnameInput] = useState('');
	const [lastnameInput, setLastnameInput] = useState('');
	const [isServerActionPending, startTransition] = useTransition();
	const [formState, formAction] = useFormState(postFormData, initialFormState);

	useEffect(() => {
		startTransition(async () => {
			const preload = await preloadFormInputValues();
			setFormPreload(preload);
		});
	}, []);

	return (
		<main className={styles.main}>
			<form action={formAction}>
				<input
					required
					type='text'
					name='firstname'
					placeholder={isServerActionPending ? 'Loading saved values...' : ''}
					onChange={e => setFirstnameInput(e.target.value)}
					defaultValue={formPreload?.firstname}
				/>
				<input
					required
					type='text'
					name='lastname'
					placeholder={isServerActionPending ? 'Loading saved values...' : ''}
					onChange={e => setLastnameInput(e.target.value)}
					defaultValue={formPreload?.lastname}
				/>
				<button type='submit' aria-disabled={isServerActionPending}>
					Submit
				</button>
				{pending && <p>Submitting form...</p>}
				{formState.firstname && formState.lastname ? (
					<>
						<h4>Form successfully submitted</h4>
						<p>
							Saved: {formState.firstname} {formState.lastname}
						</p>
					</>
				) : null}
			</form>
		</main>
	);
}
