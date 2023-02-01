import styled, { css } from 'styled-components';
import { Portal } from './portal';
import { TextField } from '../textField/textField';
import { useEffect, useState } from 'react';
import { Button } from '../button/button';
import { spacing } from '../../styles';
import COUNTRIES from '../../data/listOfAllCountries.json';
import { useToasts } from '../toast/toast';
import { ContentTitle, WrapContainer } from './kycL2LegalModal';

const Wrapper = styled.div(() => {
	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		padding: ${spacing[10]} ${spacing[20]};
	`;
});

const Select = styled.select`
	width: 100%;
	height: 100%;
`;

type Props = {
	addSupervisor?: boolean;
	updateSupervisorModalShow?: any;
};
export const SupervisoryBoardMembers = ({
	addSupervisor = false,
	updateSupervisorModalShow
}: Props) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(false);
	// @ts-ignore
	const { addToast } = useToasts();
	const [client, setClient] = useState<any>({
		fullName: '',
		dateOfBirth: '',
		placeOfBirth: '',
		gender: 'Select gender',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: ''
		},
		citizenship: '',
		appliedSanctions: ''
	});

	const [emptyClient] = useState({
		fullName: '',
		dateOfBirth: '',
		placeOfBirth: '',
		gender: 'Select gender',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: ''
		},
		citizenship: [],
		appliedSanctions: ''
	});

	useEffect(() => {
		setIsValid(false);
		const {
			fullName,
			dateOfBirth,
			placeOfBirth,
			residence,
			citizenship,
			appliedSanctions,
			gender
		} = client;
		if (
			fullName.length &&
			dateOfBirth.length &&
			placeOfBirth.length &&
			residence.street.length &&
			residence.streetNumber.length &&
			residence.municipality.length &&
			residence.zipCode.length &&
			residence.stateOrCountry.length &&
			citizenship.length &&
			appliedSanctions.length &&
			gender !== 'Select gender'
		) {
			setIsValid(true);
		}
	}, [client]);

	const handleChangeClientInput = (event: any) => {
		setClient({
			...client,
			[event.target.name]: event.target.value
		});
	};
	const handleDropDownInput = (event: any) => {
		setClient({ ...client, [event.target.name]: event.target.value });
	};
	const handleChangeResidenceInput = (event: any) => {
		setClient({
			...client,
			residence: { ...client.residence, [event.target.name]: event.target.value }
		});
	};
	const handleChangeCheckBox = (event: any) => {
		const { value, checked } = event.target;
		const attributeValue: string = event.target.attributes['data-key'].value;

		if (checked && !client[attributeValue as keyof typeof client].includes(value)) {
			setClient({
				...client,
				[attributeValue]: [...client[attributeValue as keyof typeof client], value]
			});
		}
		if (!checked && client[attributeValue as keyof typeof client].includes(value)) {
			const filteredArray: string[] = client[attributeValue as keyof typeof client].filter(
				(item: any) => item !== value
			);
			setClient({ ...client, [attributeValue]: [...filteredArray] });
		}
	};
	const handleChangeDate = (event: any) => {
		setClient({ ...client, dateOfBirth: event.target.value });
	};
	const handleClose = () => {
		updateSupervisorModalShow(false);
	};
	const handleSubmit = () => {
		// TODO: send axios request to backEnd and wait for response
		// IF REQUEST STATUS === 201 and SUCCESS DO THIS
		console.log('Supervisor client', client);
		updateSupervisorModalShow(false, client);
		setClient(emptyClient);
		addToast('UBO was added!', 'info');
		// IF REQUEST STATUS GOT ERROR DO CATCH BLOCK AND THIS
		// updateSupervisorModalShow(false);
		// addToast('Error text', 'error');
	};
	const handleBack = () => {
		updateSupervisorModalShow(false);
	};

	useEffect(() => {
		setShowModal(addSupervisor);
	}, [addSupervisor]);

	return (
		<Portal
			size="large"
			isOpen={showModal}
			handleClose={handleClose}
			handleBack={handleBack}
			hasBackButton>
			<Wrapper>
				<ContentTitle>Information on members of the supervisory board</ContentTitle>
				<WrapContainer>
					<label
						htmlFor="label-supervisory-full-name"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Full name
					</label>
					<TextField
						id="label-supervisory-full-name"
						value={client.fullName}
						placeholder="Full name"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="fullName"
						maxLength={50}
						error={client.fullName.length < 2}
					/>
					<label
						htmlFor="label-shareholders-place-of-birth"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Place of Birth
					</label>
					<TextField
						id="label-shareholders-place-of-birth"
						value={client.placeOfBirth}
						placeholder="Place of Birth"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="placeOfBirth"
						maxLength={50}
						error={client.placeOfBirth.length < 2}
					/>
					<div style={{ marginBottom: '10px' }}>
						<label htmlFor="label-shareholder-select-gender" style={{ fontStyle: 'italic' }}>
							Gender
							<Select
								name="gender"
								onChange={handleDropDownInput}
								value={client.gender}
								id="label-shareholder-select-gender"
								style={{
									minHeight: '40px',
									marginTop: '15px',
									backgroundColor: '#1c2125',
									color: 'white',
									borderRadius: '6px'
								}}>
								<option value="Select gender">Select gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</Select>
						</label>
					</div>
					<div
						style={{
							margin: '26px 16px 26px 0',
							display: 'flex',
							justifyContent: 'space-between'
						}}>
						<label htmlFor="label-supervisory-date">Date of birth</label>
						<input
							type="date"
							id="label-supervisory-date"
							min="1900-01-01"
							onChange={(e: any) => handleChangeDate(e)}
						/>
					</div>
					<p style={{ marginBottom: '25px' }}>
						Person against whom are applied CZ/international sanctions?
					</p>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-evenly',
							width: '100%',
							marginBottom: '30px'
						}}>
						<label htmlFor="appliedSanctionsTrue">
							Yes
							<input
								id="appliedSanctionsTrue"
								type="radio"
								value="Yes"
								checked={client.appliedSanctions === 'Yes'}
								onChange={handleChangeClientInput}
								name="appliedSanctions"
							/>
						</label>
						<label htmlFor="appliedSanctionsFalse">
							No
							<input
								id="appliedSanctionsFalse"
								type="radio"
								value="No"
								checked={client.appliedSanctions === 'No'}
								onChange={handleChangeClientInput}
								name="appliedSanctions"
							/>
						</label>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column'
						}}>
						<span style={{ textAlign: 'center', fontSize: '20px' }}>
							Permanent or other residence
						</span>
						<label
							htmlFor="label-shareholder-address-permanent-state-Or-Country"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							State or Country
						</label>
						<TextField
							id="label-shareholder-address-permanent-state-Or-Country"
							value={client.residence.stateOrCountry}
							placeholder="State or Country"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="stateOrCountry"
							maxLength={50}
						/>
						<label
							htmlFor="label-shareholder-address-permanent-street"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							Street
						</label>
						<TextField
							id="label-shareholder-address-permanent-street"
							value={client.residence.street}
							placeholder="Street"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="street"
							maxLength={50}
						/>
						<label
							htmlFor="label-shareholder-address-permanent-street-number"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							Street number
						</label>
						<TextField
							id="label-shareholder-address-permanent-street-number"
							value={client.residence.streetNumber}
							placeholder="Street number"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="streetNumber"
							maxLength={50}
						/>
						<label
							htmlFor="label-shareholder-address-permanent-municipality"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							Municipality
						</label>
						<TextField
							id="label-shareholder-address-permanent-municipality"
							value={client.residence.municipality}
							placeholder="Municipality"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="municipality"
							maxLength={50}
						/>
						<label
							htmlFor="label-shareholder-address-permanent-zipCode"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							ZIP Code
						</label>
						<TextField
							id="label-shareholder-address-permanent-zipCode"
							value={client.residence.zipCode}
							placeholder="ZIP Code"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="zipCode"
							maxLength={50}
						/>
					</div>
					<div style={{ marginBottom: '10px', width: '100%' }}>
						<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
							Citizenship(s)
						</p>
						{COUNTRIES.map((country: any, index: number) => {
							return (
								<div
									key={index}
									style={{
										display: 'flex',
										justifyContent: 'flex-start',
										marginBottom: '8px'
									}}>
									<input
										type="checkbox"
										value={country.name}
										name={country.name}
										id={`citizenship-checkbox-${index}`}
										onChange={handleChangeCheckBox}
										// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
										checked={client.citizenship.includes(`${country.name}`)}
										required
										data-key="citizenship"
									/>
									<label htmlFor={`citizenship-checkbox-${index}`}>{country.name}</label>
								</div>
							);
						})}
					</div>
				</WrapContainer>
				<Button variant="secondary" onClick={handleSubmit} disabled={!isValid}>
					{isValid ? 'Submit' : 'Please fill up all fields'}
				</Button>
			</Wrapper>
		</Portal>
	);
};
