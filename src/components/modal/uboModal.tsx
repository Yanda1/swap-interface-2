import styled, {css} from 'styled-components';
import {Portal} from './portal';
import {TextField} from '../textField/textField';
import {useEffect, useRef, useState} from 'react';
import {Button} from '../button/button';
import COUNTRIES from '../../data/listOfAllCountries.json';
import {ContentTitle, WrapContainer} from './kycL2LegalModal';
import {DEFAULT_BORDER_RADIUS, pxToRem, spacing} from '../../styles';
import {useStore} from '../../helpers';
import {DateInput} from './shareholdersModal';
import SelectDropDown from 'react-select';
import countries from '../../data/countries.json';

// const Wrapper = styled.div(() => {
// 	return css`
// 		display: flex;
// 		width: 100%;
// 		height: 100%;
// 		flex-direction: column;
// 		align-items: center;
// 		padding: ${spacing[10]} ${spacing[20]};
// 	`;
// });

const Select = styled.select(() => {
	const {
		state: {theme}
	} = useStore();

	return css`
		color: ${theme.font.default};
		background-color: ${theme.background.secondary};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		width: 100%;
		height: 100%;
		max-height: ${pxToRem(46)};
	`;
});

const FileInput = styled.input`
	opacity: 0;
	position: absolute;
	z-index: -100;
`;

const LabelInput = styled.label(() => {
	const {
		state: {theme}
	} = useStore();

	return css`
		text-align: center;
		cursor: pointer;
		min-width: ${pxToRem(120)};
		margin-bottom: ${pxToRem(20)};
		padding: ${spacing[4]};
		border: 1px solid ${theme.button.wallet};
		border-radius: ${pxToRem(4)};

		&:hover {
			border: 1px solid ${theme.border.secondary};
		}
	`;
});

type Props = {
	addUbo?: any;
	updateUboModalShow?: any;
};
export const UboModal = ({addUbo = false, updateUboModalShow}: Props) => {
	const {
		state: {theme}
	} = useStore();
	const fileIdentification = useRef<HTMLInputElement>();
	const [isUBOLegalEntity, setIsUBOLegalEntity] = useState<string>('empty');
	const [showModal, setShowModal] = useState<boolean>(false);
	// const [isValid, setIsValid] = useState<boolean>(false);
	// @ts-ignore
	// const {addToast} = useToasts();
	// TODO: uncomment addToast
	// @ts-ignore
	// const { addToast } = useToasts();
	const [client, setClient] = useState<any>({
		fullName: '',
		idNumber: '',
		companyName: '',
		placeOfBirth: '',
		gender: 'Select gender',
		fileIdentification: null,
		citizenship: [],
		taxResidency: 'Select country',
		permanentAndMailAddressSame: '',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		politicallPerson: '',
		appliedSanctions: '',
		uboInfo: {
			nameAndSurname: '',
			dateOfBirth: '',
			permanentResidence: '',
			citizenship: [],
			subsequentlyBusinessCompany: '',
			registeredOffice: '',
			idNumber: ''
		}
	});

	// const [emptyClient] = useState({
	// 	fullName: '',
	// 	idNumber: '',
	// 	companyName: '',
	// 	placeOfBirth: '',
	// 	gender: 'Select gender',
	// 	fileIdentification: null,
	// 	citizenship: [],
	// appliedSanctions: '',
	// 	taxResidency: 'Select country',
	// 	permanentAndMailAddressSame: '',
	// 	residence: {
	// 		street: '',
	// 		streetNumber: '',
	// 		municipality: '',
	// 		zipCode: '',
	// 		stateOrCountry: 'Select country'
	// 	},
	// 	mailAddress: {
	// 		street: '',
	// 		streetNumber: '',
	// 		municipality: '',
	// 		zipCode: '',
	// 		stateOrCountry: 'Select country'
	// 	},
	// 	politicallPerson: '',
	// 	uboInfo: {
	// 		nameAndSurname: '',
	// 		dateOfBirth: '',
	// 		permanentResidence: '',
	// 		citizenship: '',
	// 		subsequentlyBusinessCompany: '',
	// 		registeredOffice: '',
	// 		idNumber: ''
	// 	}
	// });

	// useEffect(() => {
	// 	setIsValid(false);
	// 	const {residence, identification, citizenship, taxResidency, gender, uboInfo} = client;
	// 	const result = Object.values(client);
	// 	if (
	// 		!result.includes('') &&
	// 		!Object.values(residence).includes('') &&
	// 		!Object.values(identification).includes('') &&
	// 		citizenship.length > 0 &&
	// 		taxResidency !== 'Select country' &&
	// 		gender !== 'Select gender' &&
	// 		residence.stateOrCountry !== 'Select country' &&
	// 		identification.issuedBy !== 'Select country'
	// 	) {
	// 		if (client.uboIsLegalEntity === 'Yes' && !Object.values(uboInfo).includes('') && uboInfo.citizenship.length > 0) {
	// 			setIsValid(true);
	// 		} else if (client.uboIsLegalEntity === 'No') {
	// 			setIsValid(true);
	// 		}
	// 	}
	// }, [client]);
	const handleChangeClientInput = (event: any) => {
		setClient({
			...client,
			[event.target.name]: event.target.value
		});
	};

	const handleDropDownInput = (event: any) => {
		setClient({...client, [event.target.name]: event.target.value});
	};

	const handleSelectDropdownNatural = (event: any) => {
		console.log(event);
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setClient({...client, citizenship: countries});
	};

	const handleSelectDropdownUboInfo = (event: any) => {
		console.log(event);
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setClient({...client, uboInfo: {...client.uboInfo, citizenship: countries}});
	};

	const handleChangeResidenceInput = (event: any) => {
		setClient({
			...client,
			residence: {...client.residence, [event.target.name]: event.target.value}
		});
	};

	const handleChangeMailInput = (event: any) => {
		setClient({
			...client,
			mailAddress: {...client.mailAddress, [event.target.name]: event.target.value}
		});
	};


	const handleChangeUboInfoInput = (event: any) => {
		setClient({
			...client,
			uboInfo: {...client.uboInfo, [event.target.name]: event.target.value}
		});
	};

	const handleChangeFileInput = () => {
		const file: any =
			fileIdentification?.current?.files && fileIdentification.current.files[0];
		setClient({
			...client,
			fileIdentification: file
		});
	};

	const handleClose = () => {
		updateUboModalShow(false);
	};

	// const api = useAxios();

	const handleSubmit = () => {
		console.log('ubo data', client);
		const bodyFormData = new FormData();
		if (isUBOLegalEntity === 'natural') {
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
		}
		console.log(bodyFormData);

		// api.request({
		// 	method: 'POST',
		// 	url: `${BASE_URL}kyc/l2-business/ubo/`,
		// 	data: bodyFormData,
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 	}
		// })
		// 	.then(function (response) {
		// 		// handle success
		// 		console.log(response);
		// 		client.id = response.data.id;
		// 		updateUboModalShow(false, client);
		// 		setClient(emptyClient);
		// 		addToast('UBO was added', 'info');
		// 	})
		// 	.catch(function (response) {
		// 		// handle error
		// 		console.log(response);
		// 		updateUboModalShow(false);
		// 		addToast('Something went wrong, please fill the form and try again!', 'error');
		// 	});
	};

	const handleBack = () => {
		updateUboModalShow(false);
	};

	useEffect(() => {
		setShowModal(addUbo);
	}, [addUbo]);

	return (
		<Portal
			size="xl"
			isOpen={showModal}
			handleClose={handleClose}
			handleBack={handleBack}
			hasBackButton>
			<WrapContainer
				style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 10px'}}>
				<ContentTitle>Information on Ultimate Beneficial Owner(s) (optional)</ContentTitle>
				<p style={{textAlign: 'center'}}>
					Is the Ultimate Beneficial Owner (UBO) a legal entity?
				</p>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-evenly',
						width: '100%',
						marginBottom: '20px'
					}}>
					<label htmlFor="label-typeOfClient-true">
						<input
							id="label-typeOfClient-true"
							type="radio"
							value="Yes"
							checked={isUBOLegalEntity === 'legal'}
							onChange={() => setIsUBOLegalEntity('legal')}
						/>
						Yes
					</label>
					<label htmlFor="label-typeOfClient-false">
						<input
							id="label-typeOfClient-false"
							type="radio"
							value="No"
							checked={isUBOLegalEntity === 'natural'}
							onChange={() => setIsUBOLegalEntity('natural')}
						/>
						No
					</label>
				</div>
				{isUBOLegalEntity === 'natural' ? (
					<>
						<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
							<div style={{width: '48%'}}>
								<label
									htmlFor="label-ubo-full-name">
									Name and surname
								</label>
								<TextField
									id="label-ubo-full-name"
									value={client.fullName}
									placeholder="Name and surname"
									type="text"
									onChange={handleChangeClientInput}
									size="small"
									align="left"
									name="fullName"
									error={client.fullName.length < 2}
								/>
							</div>
							<div style={{width: '48%'}}>
								<label
									htmlFor="label-ubo-place-of-birth">
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
							</div>
							<div style={{width: '48%'}}>
								<label
									htmlFor="label-ubo-id-number">
									Birth identification number
								</label>
								<TextField
									id="label-ubo-id-number"
									value={client.idNumber}
									placeholder="Birth identification number"
									type="text"
									onChange={handleChangeClientInput}
									size="small"
									align="left"
									name="idNumber"
									error={client.idNumber.length < 2}
								/>
							</div>
							<div style={{width: '48%'}}>
								<label htmlFor="label-select-gender">
									Gender
								</label>
								<Select
									name="gender"
									onChange={handleDropDownInput}
									value={client.gender}
									id="label-select-gender"
									style={{
										color: 'white',
										borderRadius: '6px'
									}}>
									<option value="Select gender">Select gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</Select>
							</div>
						</div>
						<div style={{margin: '12px 0 30px', width: '100%'}}>
							<label htmlFor="label-select-tax-residency">
								Tax Residency
							</label>
							<Select
								name="taxResidency"
								onChange={handleDropDownInput}
								value={client.taxResidency}
								id="label-select-tax-residency"
								style={{
									minHeight: '46px',
									marginTop: '8px',
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
						</div>
						<div style={{marginBottom: '10px', width: '100%'}}>
							<p style={{fontSize: '18px', fontWeight: 'bold'}}>
								Citizenship(s)
							</p>
							<SelectDropDown
								name='citizenship'
								onChange={(e: any) => handleSelectDropdownNatural(e)}
								options={countries}
								isMulti
								isSearchable
								styles={{
									menu: (base) => ({
										...base,
										backgroundColor: `${theme.background.secondary}`,
									}),
									option: (base, state) => ({
										...base,
										border: state.isFocused ? `1px solid ${theme.border.default}` : 'none',
										height: '100%',
										color: `${theme.font.default}`,
										backgroundColor: `${theme.background.secondary}`,
										cursor: 'pointer',
									}),
									control: (baseStyles) => ({
										...baseStyles,
										borderColor: 'grey',
										backgroundColor: `${theme.background.secondary}`,
										color: `${theme.font.default}`,
										padding: 0,
									}),
								}}/>
						</div>
						<p style={{marginTop: '40px', textAlign: 'center'}}>Identification (ID card or passport) <br/>Copy of
							personal identification
							or passport of the
							representatives</p>
						<div style={{textAlign: 'center', marginBottom: '40px'}}>
							<LabelInput htmlFor="file-input-address">
								<FileInput
									id="file-input-address"
									type="file"
									ref={fileIdentification as any}
									onChange={handleChangeFileInput}>
								</FileInput>
								{client.fileIdentification ? client.fileIdentification.name : 'Upload File'}
							</LabelInput>
						</div>
						<p style={{textAlign: 'center', fontSize: '18px'}}>
							Permanent or other residence
						</p>
						<div
							style={{
								margin: '0 0 10px 0',
								display: 'flex',
								flexWrap: 'wrap',
								justifyContent: 'space-between'
							}}>

							<div style={{width: '48%'}}>
								<label
									htmlFor="label-address-permanent-state-Or-Country"
									style={{margin: '6px 0 8px 0', display: 'inline-block'}}>
									Country
								</label>
								<Select
									name="stateOrCountry"
									onChange={handleChangeResidenceInput}
									value={client.residence.stateOrCountry}
									id="label-address-permanent-state-Or-Country"
									style={{
										minHeight: '35px',
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
							</div>
							<div style={{width: '48%'}}>
								<label
									htmlFor="label-address-permanent-street"
									style={{margin: '6px 0 8px 0', display: 'inline-block'}}>
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
							</div>

							<div style={{width: '48%'}}>
								<label
									htmlFor="label-address-permanent-street-number"
									style={{margin: '6px 0 8px 0', display: 'inline-block'}}>
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
							</div>
							<div style={{width: '48%'}}>
								<label
									htmlFor="label-address-permanent-municipality"
									style={{margin: '6px 0 8px 0', display: 'inline-block'}}>
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

							</div>
							<label
								htmlFor="label-address-permanent-zipCode"
								style={{margin: '6px 0 8px 0', display: 'inline-block'}}>
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
						<p style={{marginBottom: '25px'}}>
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
								<input
									id="label-mailing-permanent-address-true"
									type="radio"
									value="Yes"
									checked={client.permanentAndMailAddressSame === 'Yes'}
									onChange={handleChangeClientInput}
									name="permanentAndMailAddressSame"
								/>
								Yes
							</label>
							<label htmlFor="label-mailing-permanent-address-false">
								<input
									id="label-mailing-permanent-address-false"
									type="radio"
									value="No"
									checked={client.permanentAndMailAddressSame === 'No'}
									onChange={handleChangeClientInput}
									name="permanentAndMailAddressSame"
								/>
								No
							</label>
						</div>
						{client.permanentAndMailAddressSame === 'No' && (
							<div
								style={{
									marginTop: '30px',
									marginBottom: '30px',
									display: 'flex',
									flexDirection: 'column'
								}}>
								<span style={{textAlign: 'center', fontSize: '20px', fontWeight: 'bold'}}>Mailing address</span>
								<label
									htmlFor="label-mail-address-state-Or-Country"
									style={{
										marginTop: '10px',
										display: 'inline-block'
									}}>
									Country
								</label>
								<Select
									name="stateOrCountry"
									onChange={handleChangeMailInput}
									value={client.mailAddress.stateOrCountry}
									id="label-mail-address-state-Or-Country"
									style={{
										minHeight: '46px',
										marginTop: '8px',
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
								<label
									htmlFor="label-address-street"
									style={{
										margin: '6px 0 8px 0',
										display: 'inline-block'
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
										display: 'inline-block'
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
										display: 'inline-block'
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
										display: 'inline-block'
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
						<p style={{marginBottom: '15px'}}>Politically exposed person?</p>
						<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%', marginBottom: '30px'}}>
							<label htmlFor="politicallPersonTrue">
								<input
									id="politicallPersonTrue"
									type="radio"
									value="Yes"
									checked={client.politicallPerson === 'Yes'}
									onChange={handleChangeClientInput}
									name="politicallPerson"
								/>
								Yes
							</label>
							<label htmlFor="politicallPersonFalse">
								<input
									id="politicallPersonFalse"
									type="radio"
									value="No"
									checked={client.politicallPerson === 'No'}
									onChange={handleChangeClientInput}
									name="politicallPerson"
								/>
								No
							</label>
						</div>
						<p style={{marginBottom: '15px'}}>
							Person against whom are applied CZ/international sanctions?
						</p>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-evenly',
								width: '100%',
								marginBottom: '20px'
							}}>
							<label htmlFor="appliedSanctionsTrue">
								<input
									id="appliedSanctionsTrue"
									type="radio"
									value="Yes"
									checked={client.appliedSanctions === 'Yes'}
									onChange={handleChangeClientInput}
									name="appliedSanctions"
								/>
								Yes
							</label>
							<label htmlFor="appliedSanctionsFalse">
								<input
									id="appliedSanctionsFalse"
									type="radio"
									value="No"
									checked={client.appliedSanctions === 'No'}
									onChange={handleChangeClientInput}
									name="appliedSanctions"
								/>
								No
							</label>
						</div>
					</>
				) : isUBOLegalEntity === 'legal' ? (
					<div>
						<label
							style={{display: 'block', marginBottom: '10px'}}
							htmlFor="label-ubo-company-name">
							Business company name
						</label>
						<TextField
							id="label-ubo-company-name"
							value={client.companyName}
							placeholder="Business company name"
							type="text"
							onChange={handleChangeClientInput}
							size="small"
							align="left"
							name="companyName"
							error={client.companyName.length < 2}
						/>
						<p style={{textAlign: 'center', marginTop: '30px'}}>Identification <br/>Copy of excerpt of public register
							or other valid documents proving the existence of legal entity <br/>(Articles of Associations, Deed of
							Foundation etc.)</p>
						<div style={{textAlign: 'center'}}>
							<LabelInput htmlFor="fileIdentification">
								<FileInput
									id="fileIdentification"
									type="file"
									ref={fileIdentification as any}
									onChange={handleChangeFileInput}>
								</FileInput>
								{client.fileIdentification ? client.fileIdentification.name : 'Upload File'}
							</LabelInput>
						</div>
						<div
							style={{
								margin: '30px 0 10px 0',
								padding: '0 10px',
								display: 'flex',
								flexDirection: 'column'
							}}>
							<p style={{textAlign: 'center'}}>
								Provide information about your statutory body
							</p>
							<div style={{marginBottom: '10px', width: '100%'}}>
								<p style={{fontSize: '18px', fontWeight: 'bold'}}>
									Citizenship(s)
								</p>
								<SelectDropDown
									name='citizenship'
									onChange={(e: any) => handleSelectDropdownUboInfo(e)}
									options={countries}
									isMulti
									isSearchable
									styles={{
										menu: (base) => ({
											...base,
											backgroundColor: `${theme.background.secondary}`,
										}),
										option: (base, state) => ({
											...base,
											border: state.isFocused ? `1px solid ${theme.border.default}` : 'none',
											height: '100%',
											color: `${theme.font.default}`,
											backgroundColor: `${theme.background.secondary}`,
											cursor: 'pointer',
										}),
										control: (baseStyles) => ({
											...baseStyles,
											borderColor: 'grey',
											backgroundColor: `${theme.background.secondary}`,
											color: `${theme.font.default}`,
											padding: 0,
										}),
									}}/>
							</div>
							<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
								<div style={{width: '48%'}}>
									<label
										htmlFor="label-uboInfo-name-surname"
										style={{marginBottom: '8px', display: 'inline-block'}}>
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
										htmlFor="label-uboInfo-permanentResidence"
										style={{marginBottom: '8px', display: 'inline-block'}}>
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
								</div>
								<div style={{width: '48%'}}>
									<label
										htmlFor="label-uboInfo-subsequentlyBusinessCompany"
										style={{marginBottom: '8px', display: 'inline-block'}}>
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
										style={{marginBottom: '8px', display: 'inline-block'}}>
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
								</div>
								<div style={{width: '48%'}}>
									<label
										htmlFor="label-uboInfo-idNumber"
										style={{marginBottom: '8px', display: 'inline-block'}}>
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
								<div style={{
									width: '48%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start'
								}}>
									<label
										htmlFor="label-uboInfo-dateOfBirth"
										style={{marginBottom: '10px', display: 'inline-block'}}>
										Date of birth
									</label>
									<DateInput
										style={{
											backgroundColor: `${theme.background.secondary}`,
											color: `${theme.font.default}`,
											minHeight: '40px',
											border: '1px solid grey',
											borderRadius: `${DEFAULT_BORDER_RADIUS}`
										}}
										type="date"
										id="label-uboInfo-dateOfBirth"
										value={client.uboInfo.dateOfBirth}
										min="1900-01-01"
										name="dateOfBirth"
										onChange={handleChangeUboInfoInput}
									/>
								</div>
							</div>
						</div>
					</div>
				) : null}
				<div style={{textAlign: 'center'}}>
					<Button variant="secondary" onClick={handleSubmit}>
						Submit
					</Button>
				</div>
			</WrapContainer>

		</Portal>
	);
};
