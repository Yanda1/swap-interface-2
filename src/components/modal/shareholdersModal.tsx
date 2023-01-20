import styled, { css } from 'styled-components';
import { Portal } from './portal';
import { TextField } from '../textField/textField';
import { useEffect, useState } from 'react';
import { Button } from '../button/button';
import { useStore } from '../../helpers';
import { pxToRem } from '../../styles';
import COUNTRIES from '../../data/listOfAllCountries.json';

const Wrapper = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		flex-wrap: wrap;
		overflow-y: auto;

		::-webkit-scrollbar {
			display: block;
			width: 1px;
			background-color: ${theme.background.tertiary};
		}

		::-webkit-scrollbar-thumb {
			display: block;
			background-color: ${theme.button.default};
			border-radius: ${pxToRem(4)};
			border-right: none;
			border-left: none;
		}

		::-webkit-scrollbar-track-piece {
			display: block;
			background: ${theme.button.disabled};
		}
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
	// TODO: uncomment addToast
	// @ts-ignore
	// const { addToast } = useToasts();
	const [client, setClient] = useState<any>({
		companyName: '',
		idNumber: '',
		placeOfBirth: '',
		gender: 'Male',
		citizenship: '',
		taxResidency: 'Afghanistan',
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
		companyName: '',
		idNumber: '',
		placeOfBirth: '',
		gender: 'Male',
		citizenship: '',
		taxResidency: 'Afghanistan',
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
		const { residence, identification, citizenship } = client;
		const result = Object.values(client);
		if (
			!result.includes('') &&
			!Object.values(residence).includes('') &&
			!Object.values(identification).includes('') &&
			citizenship.length > 0
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

	const handleClose = () => {
		updateShareHoldersModalShow(false);
	};

	const handleSubmit = () => {
		// TODO: send axios request to backEnd and waiting for response
		// handle success
		updateShareHoldersModalShow(false, client);
		setClient(emptyClient);
		// handle error
		// updateSupervisorModalShow(false);
		// addToast('Error text', 'error');
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
				<h3 style={{ margin: '0' }}>
					Information on majority shareholders or person in control of client (more than 25%)
					(optional)
				</h3>
				<div style={{ padding: '6px' }}>
					<label
						htmlFor="label-shareholder-company-name"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Name and surname / business company name
					</label>
					<TextField
						id="label-shareholders-company-name"
						value={client.companyName}
						placeholder="Name and surname / business company /name"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="companyName"
						error={client.companyName.length < 2}
					/>
					<label
						htmlFor="label-shareholders-id-number"
						style={{
							margin: '6px 0 8px 0',
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
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</Select>
						</label>
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
					<p style={{ marginBottom: '25px' }}>Politically exposed person?</p>
					<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
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
						<label
							htmlFor="label-shareholder-identification-validThru"
							style={{
								margin: '6px 0 8px 0',
								display: 'inline-block',
								fontStyle: 'italic'
							}}>
							Valid thru
						</label>
						<TextField
							id="label-shareholder-identification-validThru"
							value={client.identification.validThru}
							placeholder="Valid thru"
							type="text"
							onChange={handleChangeIdentificationInput}
							size="small"
							align="left"
							name="validThru"
							error={client.identification.validThru < 2}
						/>
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
							<label
								htmlFor="label-shareHolderInfo-dateOfBirth"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Date of birth
							</label>
							<TextField
								id="label-shareHolderInfo-dateOfBirth"
								value={client.shareHolderInfo.dateOfBirth}
								placeholder="Date of birth"
								type="text"
								onChange={handleChangeShareHolderInfoInput}
								size="small"
								align="left"
								name="dateOfBirth"
							/>
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
						</div>
					)}
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
				</div>
				<Button variant="secondary" onClick={handleSubmit} disabled={!isValid}>
					{isValid ? 'Submit' : 'Please fill up all fields'}
				</Button>
			</Wrapper>
		</Portal>
	);
};
