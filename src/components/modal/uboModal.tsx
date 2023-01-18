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
	addUbo?: any;
	updateUboModalShow?: any;
};
export const UboModal = ({ addUbo = false, updateUboModalShow }: Props) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [client, setClient] = useState<any>({
		companyName: '',
		idNumber: '',
		placeOfBirth: '',
		gender: '',
		citizenship: '',
		taxResidency: '',
		permanentAndMailAddressSame: '',
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
		uboIsLegalEntity: '',
		uboInfo: {
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
		gender: '',
		citizenship: '',
		taxResidency: '',
		permanentAndMailAddressSame: '',
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
		uboIsLegalEntity: '',
		uboInfo: {
			nameAndSurname: '',
			dateOfBirth: '',
			permanentResidence: '',
			citizenship: '',
			subsequentlyBusinessCompany: '',
			registeredOffice: '',
			idNumber: ''
		}
	});
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

	const handleChangeUboInfoInput = (event: any) => {
		setClient({
			...client,
			uboInfo: { ...client.uboInfo, [event.target.name]: event.target.value }
		});
	};

	const handleClose = () => {
		updateUboModalShow(false);
	};

	const handleSubmit = () => {
		updateUboModalShow(false, client);
		setClient(emptyClient);
	};

	const handleBack = () => {
		updateUboModalShow(false);
	};

	useEffect(() => {
		setShowModal(addUbo);
	}, [addUbo]);

	return (
		<Portal
			size="large"
			isOpen={showModal}
			handleClose={handleClose}
			handleBack={handleBack}
			hasBackButton>
			<Wrapper>
				<h3 style={{ margin: '0' }}>Information on Ultimate Beneficial Owner(s) (optional)</h3>
				<div style={{ padding: '6px' }}>
					<label
						htmlFor="label-ubo-company-name"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Name and surname / business company name
					</label>
					<TextField
						id="label-ubo-company-name"
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
						htmlFor="label-ubo-id-number"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Birth identification number / identification number
					</label>
					<TextField
						id="label-ubo-id-number"
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
						htmlFor="label-ubo-place-of-birth"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Place of Birth
					</label>
					<TextField
						id="label-ubo-place-of-birth"
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
						<label htmlFor="label-select-gender" style={{ fontStyle: 'italic' }}>
							Gender
							<Select
								name="gender"
								onChange={handleDropDownInput}
								value={client.gender}
								id="label-select-gender"
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
						<label htmlFor="label-select-tax-residency" style={{ fontStyle: 'italic' }}>
							Tax Residency
							<Select
								name="taxResidency"
								onChange={handleDropDownInput}
								value={client.taxResidency}
								id="label-select-tax-residency"
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
							htmlFor="label-address-permanent-state-Or-Country"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							State or Country
						</label>
						<TextField
							id="label-address-permanent-state-Or-Country"
							value={client.residence.stateOrCountry}
							placeholder="State or Country"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="stateOrCountry"
						/>
						<label
							htmlFor="label-address-permanent-street"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							Street
						</label>
						<TextField
							id="label-address-permanent-street"
							value={client.residence.street}
							placeholder="Street"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="street"
						/>
						<label
							htmlFor="label-address-permanent-street-number"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							Street number
						</label>
						<TextField
							id="label-address-permanent-street-number"
							value={client.residence.streetNumber}
							placeholder="Street number"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="streetNumber"
						/>
						<label
							htmlFor="label-address-permanent-municipality"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							Municipality
						</label>
						<TextField
							id="label-address-permanent-municipality"
							value={client.residence.municipality}
							placeholder="Municipality"
							type="text"
							onChange={handleChangeResidenceInput}
							size="small"
							align="left"
							name="municipality"
						/>
						<label
							htmlFor="label-address-permanent-zipCode"
							style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
							ZIP Code
						</label>
						<TextField
							id="label-address-permanent-zipCode"
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
						<label htmlFor="label-mailing-permanent-address-true">
							Yes
							<input
								id="label-mailing-permanent-address-true"
								type="radio"
								value="Yes"
								checked={client.permanentAndMailAddressSame === 'Yes'}
								onChange={handleChangeClientInput}
								name="permanentAndMailAddressSame"
							/>
						</label>
						<label htmlFor="label-mailing-permanent-address-false">
							No
							<input
								id="label-mailing-permanent-address-false"
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
								htmlFor="label-address-permanent-state-Or-Country"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								State or Country
							</label>
							<TextField
								id="label-address-permanent-state-Or-Country"
								value={client.mailAddress.stateOrCountry}
								placeholder="State or Country"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="stateOrCountry"
							/>
							<label
								htmlFor="label-address-street"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								Street
							</label>
							<TextField
								id="label-address-street"
								value={client.mailAddress.street}
								placeholder="Street"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="street"
							/>
							<label
								htmlFor="label-address-street-number"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								Street number
							</label>
							<TextField
								id="label-address-street-number"
								value={client.mailAddress.streetNumber}
								placeholder="Street number"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="streetNumber"
							/>
							<label
								htmlFor="label-address-municipality"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								Municipality
							</label>
							<TextField
								id="label-address-municipality"
								value={client.mailAddress.municipality}
								placeholder="Municipality"
								type="text"
								onChange={handleChangeMailInput}
								size="small"
								align="left"
								name="municipality"
							/>
							<label
								htmlFor="label-address-zipCode"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block',
									fontStyle: 'italic'
								}}>
								ZIP Code
							</label>
							<TextField
								id="label-address-zipCode"
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
					<div>
						<p>Identification (ID card or passport)</p>
						<label
							htmlFor="label-identification-type"
							style={{
								margin: '6px 0 8px 0',
								display: 'inline-block',
								fontStyle: 'italic'
							}}>
							Type
						</label>
						<TextField
							id="label-identification-type"
							value={client.identification.type}
							placeholder="Type"
							type="text"
							onChange={handleChangeIdentificationInput}
							size="small"
							align="left"
							name="type"
						/>
						<label
							htmlFor="label-identification-number"
							style={{
								margin: '6px 0 8px 0',
								display: 'inline-block',
								fontStyle: 'italic'
							}}>
							Number
						</label>
						<TextField
							id="label-identification-number"
							value={client.identification.number}
							placeholder="Number"
							type="text"
							onChange={handleChangeIdentificationInput}
							size="small"
							align="left"
							name="number"
						/>
						<label
							htmlFor="label-identification-issuedBy"
							style={{
								margin: '6px 0 8px 0',
								display: 'inline-block',
								fontStyle: 'italic'
							}}>
							Issued by
						</label>
						<TextField
							id="label-identification-issuedBy"
							value={client.identification.issuedBy}
							placeholder="Issued by"
							type="text"
							onChange={handleChangeIdentificationInput}
							size="small"
							align="left"
							name="issuedBy"
						/>
						<label
							htmlFor="label-identification-validThru"
							style={{
								margin: '6px 0 8px 0',
								display: 'inline-block',
								fontStyle: 'italic'
							}}>
							Valid thru
						</label>
						<TextField
							id="label-identification-validThru"
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
					<p style={{ marginBottom: '25px' }}>
						Is the Ultimate Beneficial Owner (UBO) a legal entity?
					</p>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-evenly',
							width: '100%',
							marginBottom: '20px'
						}}>
						<label htmlFor="label-uboIsLegalEntity-true">
							Yes
							<input
								id="label-uboIsLegalEntity-true"
								type="radio"
								value="Yes"
								checked={client.uboIsLegalEntity === 'Yes'}
								onChange={handleChangeClientInput}
								name="uboIsLegalEntity"
							/>
						</label>
						<label htmlFor="label-uboIsLegalEntity-false">
							No
							<input
								id="label-uboIsLegalEntity-false"
								type="radio"
								value="No"
								checked={client.uboIsLegalEntity === 'No'}
								onChange={handleChangeClientInput}
								name="uboIsLegalEntity"
							/>
						</label>
					</div>
					{client.uboIsLegalEntity === 'Yes' && (
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
								htmlFor="label-uboInfo-name-surname"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Name and Surname
							</label>
							<TextField
								id="label-uboInfo-name-surname"
								value={client.uboInfo.nameAndSurname}
								placeholder="Name and Surname"
								type="text"
								onChange={handleChangeUboInfoInput}
								size="small"
								align="left"
								name="nameAndSurname"
							/>
							<label
								htmlFor="label-uboInfo-dateOfBirth"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Date of birth
							</label>
							<TextField
								id="label-uboInfo-dateOfBirth"
								value={client.uboInfo.dateOfBirth}
								placeholder="Date of birth"
								type="text"
								onChange={handleChangeUboInfoInput}
								size="small"
								align="left"
								name="dateOfBirth"
							/>
							<label
								htmlFor="label-uboInfo-permanentResidence"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Permanent Residence
							</label>
							<TextField
								id="label-uboInfo-permanentResidence"
								value={client.uboInfo.permanentResidence}
								placeholder="Permanent Residence"
								type="text"
								onChange={handleChangeUboInfoInput}
								size="small"
								align="left"
								name="permanentResidence"
							/>
							<label
								htmlFor="label-uboInfo-citizenship"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Citizenship
							</label>
							<TextField
								id="label-uboInfo-citizenship"
								value={client.uboInfo.citizenship}
								placeholder="Citizenship"
								type="text"
								onChange={handleChangeUboInfoInput}
								size="small"
								align="left"
								name="citizenship"
							/>
							<label
								htmlFor="label-uboInfo-subsequentlyBusinessCompany"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Subsequently business company
							</label>
							<TextField
								id="label-uboInfo-subsequentlyBusinessCompany"
								value={client.uboInfo.subsequentlyBusinessCompany}
								placeholder="Subsequently business company"
								type="text"
								onChange={handleChangeUboInfoInput}
								size="small"
								align="left"
								name="subsequentlyBusinessCompany"
							/>
							<label
								htmlFor="label-uboInfo-registeredOffice"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Registered Office
							</label>
							<TextField
								id="label-uboInfo-registeredOffice"
								value={client.uboInfo.registeredOffice}
								placeholder="Registered Office"
								type="text"
								onChange={handleChangeUboInfoInput}
								size="small"
								align="left"
								name="registeredOffice"
							/>
							<label
								htmlFor="label-uboInfo-idNumber"
								style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
								Identification number
							</label>
							<TextField
								id="label-uboInfo-idNumber"
								value={client.uboInfo.idNumber}
								placeholder="Identification number"
								type="text"
								onChange={handleChangeUboInfoInput}
								size="small"
								align="left"
								name="idNumber"
							/>
						</div>
					)}
				</div>
				<Button variant="secondary" onClick={handleSubmit}>
					Submit
				</Button>
			</Wrapper>
		</Portal>
	);
};
