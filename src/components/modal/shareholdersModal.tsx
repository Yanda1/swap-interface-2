import styled, { css } from 'styled-components';
import { Portal } from './portal';
import { TextField } from '../textField/textField';
import { useEffect, useState } from 'react';
import { Button } from '../button/button';
import { spacing } from '../../styles';
import COUNTRIES from '../../data/listOfAllCountries.json';
import { useToasts } from '../toast/toast';
import { ContentTitle, WrapContainer } from './kycL2LegalModal';
import { useAxios } from '../../hooks';
import { BASE_URL } from '../../helpers';

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
	addShareHolder?: boolean;
	updateShareHoldersModalShow?: any;
};
export const ShareHoldersModal = ({
	addShareHolder = false,
	updateShareHoldersModalShow
}: Props) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(false);
	// @ts-ignore
	const { addToast } = useToasts();
	const [client, setClient] = useState<any>({
		fullName: '',
		idNumber: '',
		placeOfBirth: '',
		gender: 'Select gender',
		citizenship: '',
		taxResidency: 'Select country',
		permanentAndMailAddressSame: '',
		appliedSanctions: '',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: ''
		},
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: ''
		},
		identification: {
			type: '',
			number: '',
			issuedBy: '',
			validThru: ''
		},
		politicallPerson: '',
		shareHolderIsLegalEntity: '',
		shareHolderInfo: {
			nameAndSurname: '',
			dateOfBirth: '',
			permanentResidence: '',
			citizenship: '',
			subsequentlyBusinessCompany: '',
			registeredOffice: '',
			idNumber: ''
		}
	});
	const [emptyClient] = useState({
		fullName: '',
		idNumber: '',
		placeOfBirth: '',
		gender: 'Select gender',
		citizenship: '',
		taxResidency: 'Select country',
		permanentAndMailAddressSame: '',
		appliedSanctions: '',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: ''
		},
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: ''
		},
		identification: {
			type: '',
			number: '',
			issuedBy: '',
			validThru: ''
		},
		politicallPerson: '',
		shareHolderIsLegalEntity: '',
		shareHolderInfo: {
			nameAndSurname: '',
			dateOfBirth: '',
			permanentResidence: '',
			citizenship: '',
			subsequentlyBusinessCompany: '',
			registeredOffice: '',
			idNumber: ''
		}
	});

	useEffect(() => {
		setIsValid(false);
		const { residence, identification, citizenship, gender, taxResidency, shareHolderInfo } = client;
		const result = Object.values(client);
		if (
			!result.includes('') &&
			!Object.values(residence).includes('') &&
			!Object.values(identification).includes('') &&
			citizenship.length > 0 &&
			gender !== 'Select gender' &&
			taxResidency !== 'Select country'
		) {
			if (client.shareHolderIsLegalEntity === 'Yes' && !Object.values(shareHolderInfo).includes('')) {
				setIsValid(true);
			} else if(client.shareHolderIsLegalEntity === 'No') {
				setIsValid(true);
			}
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
	const handleChangeMailInput = (event: any) => {
		setClient({
			...client,
			mailAddress: { ...client.mailAddress, [event.target.name]: event.target.value }
		});
	};
	const handleChangeIdentificationInput = (event: any) => {
		setClient({
			...client,
			identification: { ...client.identification, [event.target.name]: event.target.value }
		});
	};
	const handleChangeShareHolderInfoInput = (event: any) => {
		setClient({
			...client,
			shareHolderInfo: { ...client.shareHolderInfo, [event.target.name]: event.target.value }
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

	const handleChangeShareHolderInfoCheckBox = (event: any) => {
		const { value, checked } = event.target;
		const attributeValue: string = event.target.attributes['data-key'].value;

		if (checked && !client.shareHolderInfo[attributeValue as keyof typeof client.shareHolderInfo].includes(value)) {
			setClient({
				...client,
				uboInfo: { ...client.shareHolderInfo, [attributeValue]: [...client.shareHolderInfo[attributeValue as keyof typeof client.shareHolderInfo], value] }
			});
			
		}
		if (!checked && client.shareHolderInfo[attributeValue as keyof typeof client.shareHolderInfo].includes(value)) {
			const filteredArray: string[] = client.shareHolderInfo[attributeValue as keyof typeof client.shareHolderInfo].filter(
				(item: any) => item !== value
			);
			setClient({
				...client,
				uboInfo: { ...client.shareHolderInfo, [attributeValue]: [...filteredArray] }
			});
		}
	};

	const handleClose = () => {
		updateShareHoldersModalShow(false);
	};

	const api = useAxios();

	const handleSubmit = () => {
		console.log('ShareHolder data', client);
		const bodyFormData = new FormData();
		bodyFormData.append('full_name', client.fullName);
		bodyFormData.append('birth_id', client.idNumber);
		bodyFormData.append('place_of_birth', client.placeOfBirth);
		bodyFormData.append('gender', client.gender);
		bodyFormData.append('citizenship', client.citizenship.join(', '));
		bodyFormData.append('tax_residency', client.taxResidency);
		bodyFormData.append('residence_address', JSON.stringify(client.residence));
		if (client.permanentAndMailAddressSame === 'No') {
			bodyFormData.append('mail_address', JSON.stringify(client.mailAddress));
		}
		bodyFormData.append('political_person', client.politicallPerson === 'Yes' ? 'true' : 'false');
		bodyFormData.append('applied_sanctions', client.appliedSanctions === 'Yes' ? 'true' : 'false');
		bodyFormData.append('identification_type', client.identification.type);
		bodyFormData.append('identification_number', client.identification.number);
		bodyFormData.append('identification_issued_by', client.identification.issuedBy);
		bodyFormData.append('identification_valid_thru', client.identification.validThru);
		if (client.uboIsLegalEntity === 'Yes') {
			bodyFormData.append('statutory_full_name', client.uboInfo.nameAndSurname);
			bodyFormData.append('statutory_dob', client.uboInfo.dateOfBirth);
			bodyFormData.append('statutory_permanent_residence', client.uboInfo.permanentResidence);
			bodyFormData.append('statutory_citizenship', client.uboInfo.citizenship.join(', '));
			bodyFormData.append('statutory_subsequently_business', client.uboInfo.subsequentlyBusinessCompany);
			bodyFormData.append('statutory_office_address', client.uboInfo.registeredOffice);
			bodyFormData.append('statutory_birth_id', client.uboInfo.idNumber);
		}

		api.request({
			method: 'POST',
			url: `${BASE_URL}kyc/l2-business/shareholder/`,
			data: bodyFormData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		})
			.then(function (response) {
				// handle success
				console.log(response);
				client.id = response.data.id;
				updateShareHoldersModalShow(false, client);
				setClient(emptyClient);
				addToast('Shareholder was added', 'info');
			})
			.catch(function (response) {
				// handle error
				console.log(response);
				updateShareHoldersModalShow(false);
				addToast('Something went wrong, please fill the form and try again!', 'error');
			});
	};

	const handleBack = () => {
		updateShareHoldersModalShow(false);
	};

	useEffect(() => {
		setShowModal(addShareHolder);
	}, [addShareHolder]);

	return (
		<Portal
			size="large"
			isOpen={showModal}
			handleClose={handleClose}
			handleBack={handleBack}
			hasBackButton>
			<Wrapper>
				<ContentTitle>
					Information on majority shareholders or person in control of client (more than 25%)
				</ContentTitle>
				<WrapContainer style={{ paddingRight: '10px' }}>
					<label
						htmlFor="label-shareholder-company-name"
						style={{
							marginBottom: '8px',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Name and surname / business company name
					</label>
					<TextField
						id="label-shareholders-company-name"
						value={client.fullName}
						placeholder="Name and surname / business company /name"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="fullName"
						error={client.fullName.length < 2}
					/>
					<label
						htmlFor="label-shareholders-id-number"
						style={{
							margin: '10px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Birth identification number / identification number
					</label>
					<TextField
						id="label-shareholders-id-number"
						value={client.idNumber}
						placeholder="Birth identification number / identification number"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="idNumber"
						error={client.idNumber.length < 2}
					/>
					<label
						htmlFor="label-shareholders-place-of-birth"
						style={{
							margin: '10px 0',
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
						error={client.placeOfBirth.length < 2}
					/>
					<div style={{ margin: '10px 0' }}>
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
					<div style={{ margin: '10px 0 30px', width: '100%' }}>
						<label htmlFor="label-select-shareholder-tax-residency" style={{ fontStyle: 'italic' }}>
							Tax Residency
							<Select
								name="taxResidency"
								onChange={handleDropDownInput}
								value={client.taxResidency}
								id="label-select-shareholder-tax-residency"
								style={{
									minHeight: '40px',
									marginTop: '15px',
									backgroundColor: '#1c2125',
									color: 'white',
									borderRadius: '6px'
								}}>
								<option value="Select country">Select country</option>
								{COUNTRIES.map((country: any) => {
									return (
										<option value={country.name} key={country.name}>
											{country.name}
										</option>
									);
								})}
								;
							</Select>
						</label>
					</div>
					<div
						style={{
							margin: '10px 0',
							display: 'flex',
							flexDirection: 'column'
						}}>
						<span style={{ textAlign: 'center', fontSize: '20px' }}>
							Permanent or other residence
						</span>
						<label
							htmlFor="label-shareholder-address-permanent-state-Or-Country"
							style={{ margin: '10px 0', display: 'inline-block', fontStyle: 'italic' }}>
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
						/>
						<label
							htmlFor="label-shareholder-address-permanent-street"
							style={{ margin: '10px 0', display: 'inline-block', fontStyle: 'italic' }}>
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
						/>
						<label
							htmlFor="label-shareholder-address-permanent-street-number"
							style={{ margin: '10px 0', display: 'inline-block', fontStyle: 'italic' }}>
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
						/>
					</div>
					<p style={{ marginBottom: '25px' }}>
						Is your permanent (RESIDENCE) address the same as your mailing address?
					</p>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-evenly',
							width: '100%',
							marginBottom: '20px'
						}}>
						<label htmlFor="label-shareholder-mailing-permanent-address-true">
							Yes
							<input
								id="label-shareholder-mailing-permanent-address-true"
								type="radio"
								value="Yes"
								checked={client.permanentAndMailAddressSame === 'Yes'}
								onChange={handleChangeClientInput}
								name="permanentAndMailAddressSame"
							/>
						</label>
						<label htmlFor="label-shareholder-mailing-permanent-address-false">
							No
							<input
								id="label-shareholder-mailing-permanent-address-false"
								type="radio"
								value="No"
								checked={client.permanentAndMailAddressSame === 'No'}
								onChange={handleChangeClientInput}
								name="permanentAndMailAddressSame"
							/>
						</label>
					</div>
					{client.permanentAndMailAddressSame === 'No' && (
						<div
							style={{
								marginBottom: '12px',
								display: 'flex',
								flexDirection: 'column'
							}}>
							<span style={{ textAlign: 'center', fontSize: '20px' }}>Mailing address</span>
							<label
								htmlFor="label-shareholder-address-permanent-state-Or-Country"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								State or Country
							</label>
							<TextField
								id="label-shareholder-address-permanent-state-Or-Country"
								value={client.mailAddress.stateOrCountry}
								placeholder="State or Country"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="stateOrCountry"
							/>
							<label
								htmlFor="label-shareholder-address-street"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								Street
							</label>
							<TextField
								id="label-shareholder-address-street"
								value={client.mailAddress.street}
								placeholder="Street"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="street"
							/>
							<label
								htmlFor="label-shareholder-address-street-number"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								Street number
							</label>
							<TextField
								id="label-shareholder-address-street-number"
								value={client.mailAddress.streetNumber}
								placeholder="Street number"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="streetNumber"
							/>
							<label
								htmlFor="label-shareholder-address-municipality"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								Municipality
							</label>
							<TextField
								id="label-shareholder-address-municipality"
								value={client.mailAddress.municipality}
								placeholder="Municipality"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="municipality"
							/>
							<label
								htmlFor="label-shareholder-address-zipCode"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								ZIP Code
							</label>
							<TextField
								id="label-shareholder-address-zipCode"
								value={client.mailAddress.zipCode}
								placeholder="ZIP Code"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="zipCode"
							/>
						</div>
					)}
					<p style={{ marginBottom: '10px' }}>Politically exposed person?</p>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-evenly',
							width: '100%',
							margin: '0 0 30px 0'
						}}>
						<label htmlFor="politicallPersonTrue">
							Yes
							<input
								id="politicallPersonTrue"
								type="radio"
								value="Yes"
								checked={client.politicallPerson === 'Yes'}
								onChange={handleChangeClientInput}
								name="politicallPerson"
							/>
						</label>
						<label htmlFor="politicallPersonFalse">
							No
							<input
								id="politicallPersonFalse"
								type="radio"
								value="No"
								checked={client.politicallPerson === 'No'}
								onChange={handleChangeClientInput}
								name="politicallPerson"
							/>
						</label>
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
					<div>
						<p>Identification (ID card or passport)</p>
						<label
							htmlFor="label-shareholder-identification-type"
							style={{
								margin: '6px 0 8px 0',
								display: 'inline-block',
								fontStyle: 'italic'
							}}>
							Type
						</label>
						<TextField
							id="label-shareholder-identification-type"
							value={client.identification.type}
							placeholder="Type"
							type="text"
							onChange={handleChangeIdentificationInput}
							size="small"
							align="left"
							name="type"
						/>
						<label
							htmlFor="label-shareholder-identification-number"
							style={{
								margin: '6px 0 8px 0',
								display: 'inline-block',
								fontStyle: 'italic'
							}}>
							Number
						</label>
						<TextField
							id="label-shareholder-identification-number"
							value={client.identification.number}
							placeholder="Number"
							type="text"
							onChange={handleChangeIdentificationInput}
							size="small"
							align="left"
							name="number"
						/>
						<label
							htmlFor="label-shareholder-identification-issuedBy"
							style={{
								margin: '6px 0 8px 0',
								display: 'inline-block',
								fontStyle: 'italic'
							}}>
							Issued by
						</label>
						<TextField
							id="label-shareholder-identification-issuedBy"
							value={client.identification.issuedBy}
							placeholder="Issued by"
							type="text"
							onChange={handleChangeIdentificationInput}
							size="small"
							align="left"
							name="issuedBy"
						/>
						<div
							style={{
								margin: '26px 16px 26px 0',
								display: 'flex',
								justifyContent: 'space-between'
							}}>
							<label
								htmlFor="label-identification-validThru"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								Valid thru
							</label>
							<input
								type="date"
								id="label-identification-validThru"
								value={client.identification.validThru}
								min="2023-01-01"
								name="validThru"
								onChange={handleChangeIdentificationInput}
							/>
						</div>
					</div>
					<p style={{ marginBottom: '25px' }}>Is the controlling person is a legal entity ?</p>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-evenly',
							width: '100%',
							marginBottom: '20px'
						}}>
						<label htmlFor="label-shareHolderIsLegalEntity-true">
							Yes
							<input
								id="label-shareHolderIsLegalEntity-true"
								type="radio"
								value="Yes"
								checked={client.shareHolderIsLegalEntity === 'Yes'}
								onChange={handleChangeClientInput}
								name="shareHolderIsLegalEntity"
							/>
						</label>
						<label htmlFor="label-shareHolderIsLegalEntity-false">
							No
							<input
								id="label-shareHolderIsLegalEntity-false"
								type="radio"
								value="No"
								checked={client.shareHolderIsLegalEntity === 'No'}
								onChange={handleChangeClientInput}
								name="shareHolderIsLegalEntity"
							/>
						</label>
					</div>
					{client.shareHolderIsLegalEntity === 'Yes' && (
						<div
							style={{
								margin: '10px 0',
								display: 'flex',
								flexDirection: 'column'
							}}>
							<span style={{ textAlign: 'center', fontSize: '20px' }}>
								Provide information about your statutory body.
							</span>
							<label
								htmlFor="label-shareHolderInfo-name-surname"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Name and Surname
							</label>
							<TextField
								id="label-shareHolderInfo-name-surname"
								value={client.shareHolderInfo.nameAndSurname}
								placeholder="Name and Surname"
								type="text"
								onChange={handleChangeShareHolderInfoInput}
								size="small"
								align="left"
								name="nameAndSurname"
							/>
							<div
								style={{
									margin: '26px 16px 26px 0',
									display: 'flex',
									justifyContent: 'space-between'
								}}>
								<label
									htmlFor="label-uboInfo-dateOfBirth"
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
									Date of birth
								</label>
								<input
									type="date"
									id="label-uboInfo-dateOfBirth"
									value={client.shareHolderInfo.dateOfBirth}
									min="1900-01-01"
									name="dateOfBirth"
									onChange={handleChangeShareHolderInfoInput}
								/>
							</div>
							<label
								htmlFor="label-shareHolderInfo-permanentResidence"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Permanent Residence
							</label>
							<TextField
								id="label-shareHolderInfo-permanentResidence"
								value={client.shareHolderInfo.permanentResidence}
								placeholder="Permanent Residence"
								type="text"
								onChange={handleChangeShareHolderInfoInput}
								size="small"
								align="left"
								name="permanentResidence"
							/>
							<label
								htmlFor="label-shareHolderInfo-citizenship"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Citizenship
							</label>
							<TextField
								id="label-shareHolderInfo-citizenship"
								value={client.shareHolderInfo.citizenship}
								placeholder="Citizenship"
								type="text"
								onChange={handleChangeShareHolderInfoInput}
								size="small"
								align="left"
								name="citizenship"
							/>
							<label
								htmlFor="label-shareHolderInfo-subsequentlyBusinessCompany"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Subsequently business company
							</label>
							<TextField
								id="label-shareHolderInfo-subsequentlyBusinessCompany"
								value={client.shareHolderInfo.subsequentlyBusinessCompany}
								placeholder="Subsequently business company"
								type="text"
								onChange={handleChangeShareHolderInfoInput}
								size="small"
								align="left"
								name="subsequentlyBusinessCompany"
							/>
							<label
								htmlFor="label-shareHolderInfo-registeredOffice"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Registered Office
							</label>
							<TextField
								id="label-shareHolderInfo-registeredOffice"
								value={client.shareHolderInfo.registeredOffice}
								placeholder="Registered Office"
								type="text"
								onChange={handleChangeShareHolderInfoInput}
								size="small"
								align="left"
								name="registeredOffice"
							/>
							<label
								htmlFor="label-shareHolderInfo-idNumber"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Identification number
							</label>
							<TextField
								id="label-shareHolderInfo-idNumber"
								value={client.shareHolderInfo.idNumber}
								placeholder="Identification number"
								type="text"
								onChange={handleChangeShareHolderInfoInput}
								size="small"
								align="left"
								name="idNumber"
							/>
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
												id={`shareHolderInfo-citizenship-checkbox-${index}`}
												onChange={handleChangeShareHolderInfoCheckBox}
												checked={client.shareHolderInfo.citizenship.includes(`${country.name}`)}
												required
												data-key="citizenship"
											/>
											<label htmlFor={`shareHolderInfo-citizenship-checkbox-${index}`}>{country.name}</label>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</WrapContainer>
				<Button variant="secondary" onClick={handleSubmit} disabled={!isValid}>
					{isValid ? 'Submit' : 'Please fill up all fields'}
				</Button>
			</Wrapper>
		</Portal>
	);
};
