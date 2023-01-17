import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { pxToRem, spacing } from '../../styles';
import { BASE_URL, findAndReplace, makeId, useStore } from '../../helpers';
import { TextField } from '../textField/textField';
import { Button } from '../button/button';
import { Portal } from './portal';
import axios from 'axios';
import { useToasts } from '../toast/toast';
import COUNTRIES from '../../data/listOfAllCountries.json';
import WORK_AREA_LIST from '../../data/workAreaList.json';
import SOURCE_OF_FUNDS_LIST from '../../data/sourceOfFundsList.json';
import SOURCE_OF_FUNDS_LIST_COMPANY from '../../data/sourceOfFundsListCompany.json';
import FUNDS_IRREGULAR_FOR_BUSINESS_LIST from '../../data/fundsIrregularForBussinesList.json';
import SOURCE_OF_INCOME_NATURE_LIST from '../../data/sourceOfIncomeNatureList.json';
import PREVAILLING_SOURCE_OF_INCOME_COMPANY from '../../data/prevailingSourceOfIncomeCompany.json';
import DECLARE_LIST from '../../data/declareList.json';
import REPRESENT_PERSON from '../../data/representClient.json';

const Wrapper = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		overflow-y: auto;
		align-items: center;
		padding: ${spacing[10]} ${spacing[20]};

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

const TypeContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
`;

const Title = styled.h2`
	text-align: center;
	font-style: italic;
`;

const LabelInput = styled.label(() => {
	const {
		state: { theme }
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

const FileInput = styled.input`
	opacity: 0;
	position: absolute;
	z-index: -100;
`;

const Select = styled.select`
	width: 100%;
	height: 100%;
`;

const UboContainer = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		width: 45%;
		margin: ${spacing[12]};
		border: 1px solid ${theme.border.default};
		-webkit-box-shadow: 7px -7px 15px 0px rgba(0, 0, 0, 0.75);
	}`;
});

type Props = {
	showKycL2: boolean;
	updateShowKycL2?: any;
};
export const KycL2Modal = ({ showKycL2, updateShowKycL2 }: Props) => {
	const [isNatural, setIsNatural] = useState<boolean | null>(null);
	const { addToast }: any | null = useToasts();
	const [showModal, setShowModal] = useState(showKycL2);
	const [input, setInput] = useState<{
		placeOfBirth: string;
		yearlyIncome: number | null;
		email: string;
		residence: any;
		mailAddress: any;
		sourceOfIncome: string;
		gender: string;
		citizenship: string[];
		taxResidency: string;
		politicallPerson: string;
		countryOfWork: string[];
		workArea: string[];
		sourceOfFunds: string[];
		sourceOfFundsOther: string;
		sourceOfIncomeNatureOther: string;
		irregularSourceOfFunds: string[];
		irregularSourceOfFundsOther: string;
		appliedSanctions: string;
		hasCriminalRecords: string;
		sourceOfIncomeNature: string[];
		declare: string[];
		declareOther: string;
		file: any;
		registeredOffice: any;
		permanentAndMailAddressSame: string;
		identification: any;
		companyName: string;
		companyIdentificationNumber: string;
		representPerson: string[];
		legalEntity: string;
		typeOfCriminal: string;
	}>({
		citizenship: [],
		countryOfWork: [],
		hasCriminalRecords: '',
		declare: [],
		declareOther: '',
		email: '',
		file: {
			poaDoc1: null,
			posofDoc1: null
		},
		irregularSourceOfFunds: [],
		irregularSourceOfFundsOther: '',
		gender: 'Male',
		permanentAndMailAddressSame: 'Yes',
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
		sourceOfIncomeNature: [],
		sourceOfIncomeNatureOther: '',
		yearlyIncome: null,
		appliedSanctions: '',
		placeOfBirth: '',
		politicallPerson: '',
		sourceOfIncome: '',
		sourceOfFunds: [],
		sourceOfFundsOther: '',
		identification: {
			type: '',
			number: '',
			issuedBy: '',
			validThru: ''
		},
		registeredOffice: {
			street: '',
			streetNumber: '',
			municipality: '',
			state: '',
			country: '',
			pc: ''
		},
		representPerson: [],
		companyName: '',
		companyIdentificationNumber: '',
		legalEntity: '',
		typeOfCriminal: '',
		taxResidency: 'Afghanistan',
		workArea: []
	});
	const fileInputAddress = useRef<HTMLInputElement>();
	const fileInputDocs = useRef<HTMLInputElement>();
	const [page, setPage] = useState<number>(0);
	const {
		state: { accessToken }
	} = useStore();

	const isDisabled =
		!input.citizenship.length ||
		!input.countryOfWork.length ||
		input.hasCriminalRecords === '' ||
		!input.declare.length ||
		input.email === '' ||
		input.file === '' ||
		!input.irregularSourceOfFunds.length ||
		input.mailAddress === '' ||
		!input.sourceOfIncomeNature.length ||
		input.yearlyIncome === null ||
		input.appliedSanctions === '' ||
		input.placeOfBirth === '' ||
		input.politicallPerson === '' ||
		input.sourceOfIncome === '' ||
		!input.sourceOfFunds.length ||
		input.taxResidency === '' ||
		!input.workArea.length;
	const myRef = useRef<HTMLDivElement | null>(null);

	const handleTypeOfClient = (event: any) => {
		if (event.target.textContent === 'Natural Person') {
			setIsNatural(true);
		} else if (event.target.textContent === 'Legal Person') {
			setIsNatural(false);
		}
	};
	const handleNext = () => {
		myRef?.current?.scrollTo(0, 0);
		setPage((prev: number) => prev + 1);
	};
	const handleSubmit = (event: any) => {
		event.preventDefault();
		// send POST if 200 change add toast and modal (Successful submit) to check kys if 401 bad request add toast like please pass kyc again
		const bodyFormData = new FormData();
		bodyFormData.append('placeOfBirth', input.placeOfBirth);
		bodyFormData.append('poaDoc1', input.file.poaDoc1);
		bodyFormData.append('posofDoc1', input.file.posofDoc1);
		bodyFormData.append('mailAddress', input.mailAddress);
		bodyFormData.append('gender', JSON.stringify(input.gender));
		bodyFormData.append('citizenship', JSON.stringify(input.citizenship));
		bodyFormData.append('email', input.email);
		bodyFormData.append('taxResidency', JSON.stringify(input.taxResidency));
		bodyFormData.append('politicallPerson', input.politicallPerson === 'Yes' ? 'true' : 'false');
		bodyFormData.append('appliedSanctions', input.appliedSanctions === 'Yes' ? 'true' : 'false');
		bodyFormData.append('countryOfWork', JSON.stringify(input.countryOfWork));
		bodyFormData.append('workArea', JSON.stringify(input.workArea));
		const sourceOfIncomeNature = findAndReplace(
			input.sourceOfIncomeNature,
			'Other',
			input.sourceOfIncomeNatureOther
		);
		bodyFormData.append('sourceOfIncomeNature', JSON.stringify(sourceOfIncomeNature));
		const yearlyIncome = input.yearlyIncome ? Number(input.yearlyIncome).toFixed(4) : '0';
		bodyFormData.append('yearlyIncome', yearlyIncome);
		bodyFormData.append('sourceOfIncome', input.sourceOfIncome);
		const sourceOfFunds = findAndReplace(input.sourceOfFunds, 'Other', input.sourceOfFundsOther);
		bodyFormData.append('sourceOfFunds', JSON.stringify(sourceOfFunds));
		const irregularSourceOfFunds = findAndReplace(
			input.irregularSourceOfFunds,
			'Other',
			input.irregularSourceOfFundsOther
		);
		bodyFormData.append('irregularSourceOfFunds', JSON.stringify(irregularSourceOfFunds));
		bodyFormData.append(
			'hasCriminalRecords',
			input.hasCriminalRecords === 'Yes' ? 'true' : 'false'
		);
		bodyFormData.append('declare', JSON.stringify(`${input.declare}${input.declareOther}`));
		bodyFormData.append('mailAddress', input.mailAddress);

		axios({
			method: 'POST',
			url: `${BASE_URL}kyc/l2-data`,
			data: bodyFormData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Bearer ' + accessToken
			}
		})
			.then(function (response) {
				// handle success
				console.log(response);
				if (response.status === 201) {
					addToast(
						'Your documents are under review, please wait for the results of the verification!',
						'info'
					);
				}
			})
			.catch(function (response) {
				// handle error
				console.log(response);
				addToast('Something went wrong, please fill the form and try again!', 'error');
			});
		updateShowKycL2(false);
	};
	const handleChangeInput = (event: any) => {
		setInput({ ...input, [event.target.name]: event.target.value });
	};
	const handleChangeMailInput = (event: any) => {
		setInput({
			...input,
			mailAddress: { ...input.mailAddress, [event.target.name]: event.target.value }
		});
	};
	const handleChangeResidenceInput = (event: any) => {
		setInput({
			...input,
			residence: { ...input.residence, [event.target.name]: event.target.value }
		});
	};
	const handleChangeIdentificationInput = (event: any) => {
		setInput({
			...input,
			identification: { ...input.identification, [event.target.name]: event.target.value }
		});
	};
	const handleChangeRegisteredOfficeInput = (event: any) => {
		setInput({
			...input,
			registeredOffice: { ...input.registeredOffice, [event.target.name]: event.target.value }
		});
	};
	const handleChangeCheckBox = (event: any) => {
		const { value, checked } = event.target;
		const attributeValue: string = event.target.attributes['data-key'].value;

		if (checked && !input[attributeValue as keyof typeof input].includes(value)) {
			setInput({
				...input,
				[attributeValue]: [...input[attributeValue as keyof typeof input], value]
			});
		}
		if (!checked && input[attributeValue as keyof typeof input].includes(value)) {
			const filteredArray: string[] = input[attributeValue as keyof typeof input].filter(
				(item: any) => item !== value
			);
			setInput({ ...input, [attributeValue]: [...filteredArray] });
		}
	};
	const handleChangeFileInput = () => {
		const filePosoaDoc1: any =
			fileInputAddress?.current?.files && fileInputAddress.current.files[0];
		const filePosofDoc1: any = fileInputDocs?.current?.files && fileInputDocs.current.files[0];
		setInput({
			...input,
			file: { ...input.file, poaDoc1: filePosoaDoc1, posofDoc1: filePosofDoc1 }
		});
	};

	const handleDropDownInput = (event: any) => {
		setInput({ ...input, [event.target.name]: event.target.value });
	};

	const handleOnClose = () => {
		setShowModal(false);
		updateShowKycL2(false);
	};

	const handleOnBack = () => {
		if (page > 0) {
			setPage((prev: number) => prev - 1);
		} else if (page === 0) {
			setIsNatural(null);
		}
	};

	useEffect(() => {
		if (!isNatural && page === 5) {
			console.log('Send information from FIRST PART');
		}
	}, [page, isNatural]);

	const [uboList, setUboList] = useState([
		{
			id: '0',
			companyName: 'Apple',
			idNumber: '1',
			placeOfBirth: 'Ukraine',
			state: 'Kiev',
			country: 'Ukraine',
			pc: 'PC'
		},
		{
			id: '1',
			companyName: 'Ferrari',
			idNumber: '2',
			placeOfBirth: 'Italy',
			state: 'Rome',
			country: 'Italy',
			pc: 'PC'
		},
		{
			id: '2',
			companyName: 'FaceBook',
			idNumber: '3',
			placeOfBirth: 'The United State',
			state: 'Washington DC.',
			country: 'USA',
			pc: 'PC'
		}
	]);

	const handleAddUbo = () => {
		setUboList([
			{
				id: makeId(20),
				companyName: '',
				idNumber: '',
				placeOfBirth: '',
				state: '',
				country: '',
				pc: ''
			},
			...uboList
		]);
	};

	return showModal ? (
		<Portal
			size="large"
			isOpen={showModal}
			handleClose={handleOnClose}
			hasBackButton
			handleBack={handleOnBack}>
			<Wrapper ref={myRef}>
				{isNatural === null && (
					<>
						<div
							style={{
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-around'
							}}>
							<Title>Select Client type:</Title>
							<TypeContainer>
								<Button
									variant="secondary"
									// @ts-ignore
									onClick={handleTypeOfClient}>
									Natural Person
								</Button>
								<Button
									variant="secondary"
									// @ts-ignore
									onClick={handleTypeOfClient}>
									Legal Person
								</Button>
							</TypeContainer>
						</div>
					</>
				)}
				{isNatural && (
					<>
						<Title>KYC L2 form for Natural Person</Title>
						{page === 0 && (
							<div
								style={{
									marginBottom: '10px'
								}}>
								<div style={{ marginRight: '15px', marginBottom: '10px' }}>
									<div style={{ marginBottom: '10px' }}>
										<label
											htmlFor="label-place-of-birth"
											style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
											Place of birth
										</label>
										<TextField
											id="label-place-of-birth"
											value={input.placeOfBirth}
											placeholder="Place of birth"
											type="text"
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="placeOfBirth"
											required={true}
											error={input.placeOfBirth.length < 2}
										/>
									</div>
									<div style={{ marginBottom: '10px' }}>
										<label
											htmlFor="label-net-yearly-income"
											style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
											Net yearly income (Euro)
										</label>
										<TextField
											id="label-net-yearly-income"
											value={input.yearlyIncome !== null && input.yearlyIncome}
											placeholder="Net yearly income"
											type="number"
											onChange={handleChangeInput}
											size="small"
											align="left"
											required
											name="yearlyIncome"
											error={input.yearlyIncome === null}
										/>
									</div>
									<div style={{ marginBottom: '10px' }}>
										<label
											htmlFor="label-email"
											style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
											Email
										</label>
										<TextField
											id="label-email"
											value={input.email}
											placeholder="Email"
											type="email"
											onChange={handleChangeInput}
											size="small"
											align="left"
											required
											name="email"
											error={input.email.length < 2}
										/>
									</div>
									<div style={{ marginBottom: '10px' }}>
										<label htmlFor="label-select-gender" style={{ fontStyle: 'italic' }}>
											Gender
											<Select
												name="gender"
												onChange={handleDropDownInput}
												value={input.gender}
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
								</div>
							</div>
						)}
						{page === 1 && (
							<>
								<div style={{ margin: '10px 0', width: '100%' }}>
									<label
										htmlFor="label-sourceOfIncome"
										style={{ marginBottom: '8px', display: 'inline-block' }}>
										Prevailing source of such income (employment/business, real estate, trading,
										etc.)
									</label>
									<TextField
										id="label-sourceOfIncome"
										value={input.sourceOfIncome}
										placeholder="Prevailing source of such income"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="sourceOfIncome"
										required
									/>
								</div>
								<div style={{ margin: '10px 0 30px', width: '100%' }}>
									<label htmlFor="label-select-tax-residency" style={{ fontStyle: 'italic' }}>
										Tax Residency
										<Select
											name="taxResidency"
											onChange={handleDropDownInput}
											value={input.taxResidency}
											id="label-select-tax-residency"
											style={{
												maxHeight: '40px',
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
								<div style={{ marginBottom: '10px', width: '100%' }}>
									<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
										Country in which the Client conducts his work / business activity
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
													id={`countryOfWork-checkbox-${index}`}
													onChange={handleChangeCheckBox}
													// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
													checked={input.countryOfWork.includes(`${country.name}`)}
													required
													data-key="countryOfWork"
												/>
												<label htmlFor={`countryOfWork-checkbox-${index}`}>{country.name}</label>
											</div>
										);
									})}
								</div>
							</>
						)}
						{page === 2 && (
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									flexDirection: 'column',
									alignItems: 'stretch',
									marginBottom: '15px'
								}}>
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									The Client conducts his work / business activity in these areas:
								</p>
								{WORK_AREA_LIST.map((activity: string, index: number) => {
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
												value={activity}
												name={activity}
												id={`workAreaList-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
												checked={input.workArea.includes(`${activity}`)}
												required
												data-key="workArea"
											/>
											<label htmlFor={`workAreaList-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									Source of funds intended for Transaction:
								</p>
								{SOURCE_OF_FUNDS_LIST.map((activity: string, index: number) => {
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
												value={activity}
												name={activity}
												id={`sourceOfFundsList-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
												checked={input.sourceOfFunds.includes(`${activity}`)}
												required={true}
												data-key="sourceOfFunds"
											/>
											<label htmlFor={`sourceOfFundsList-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
								{input.sourceOfFunds.includes('Other') ? (
									<TextField
										value={input.sourceOfFundsOther}
										type="text"
										placeholder="Specify..."
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="sourceOfFundsOther"
									/>
								) : null}
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									Nature of prevailing source of income
								</p>
								{SOURCE_OF_INCOME_NATURE_LIST.map((activity: string, index: number) => {
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
												value={activity}
												name={activity}
												id={`sourceOfIncomeNatureList-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
												checked={input.sourceOfIncomeNature.includes(`${activity}`)}
												required={true}
												data-key="sourceOfIncomeNature"
											/>
											<label htmlFor={`sourceOfIncomeNatureList-checkbox-${index}`}>
												{activity}
											</label>
										</div>
									);
								})}
								{input.sourceOfIncomeNature.includes('Other') ? (
									<TextField
										value={input.sourceOfIncomeNatureOther}
										type="text"
										placeholder="Food industry, hospitality, transportation, consultancy, agriculture, IT, science, etc."
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="sourceOfIncomeNatureOther"
									/>
								) : null}
							</div>
						)}
						{page === 3 && (
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
												checked={input.citizenship.includes(`${country.name}`)}
												required
												data-key="citizenship"
											/>
											<label htmlFor={`citizenship-checkbox-${index}`}>{country.name}</label>
										</div>
									);
								})}
							</div>
						)}
						{page === 4 && (
							<>
								<div style={{ marginBottom: '15px' }}>
									<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
										State, which of the stated incomes of funds intended for business is irregular:
									</p>
									{FUNDS_IRREGULAR_FOR_BUSINESS_LIST.map((activity: string, index: number) => {
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
													value={activity}
													name={activity}
													id={`fundsIrregularForBusinessList-checkbox-${index}`}
													onChange={handleChangeCheckBox}
													// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
													checked={input.irregularSourceOfFunds.includes(`${activity}`)}
													required={true}
													data-key="irregularSourceOfFunds"
												/>
												<label htmlFor={`fundsIrregularForBusinessList-checkbox-${index}`}>
													{activity}
												</label>
											</div>
										);
									})}
									{input.irregularSourceOfFunds.includes('Other') ? (
										<TextField
											value={input.irregularSourceOfFundsOther}
											type="text"
											placeholder="Specify..."
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="irregularSourceOfFundsOther"
										/>
									) : null}
									<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
										I declare that:
									</p>
									{DECLARE_LIST.map((activity: string, index: number) => {
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
													value={activity}
													name={activity}
													id={`declareList-checkbox-${index}`}
													onChange={handleChangeCheckBox}
													// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
													checked={input.declare.includes(`${activity}`)}
													required={true}
													data-key="declare"
												/>
												<label htmlFor={`declareList-checkbox-${index}`}>{activity}</label>
											</div>
										);
									})}
									{input.declare.includes(
										'I am a national of another state or country, specifically:'
									) ? (
										<TextField
											value={input.declareOther}
											type="text"
											placeholder="Specify..."
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="declareOther"
										/>
									) : null}
									{input.declare.includes(
										'I am registered to a permanent or other type of residency in another state or country, specifically:'
									) ? (
										<TextField
											value={input.declareOther}
											type="text"
											placeholder="Specify..."
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="declareOther"
										/>
									) : null}
								</div>
							</>
						)}
						{page === 5 && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									marginBottom: '25px',
									alignItems: 'center'
								}}>
								<p style={{ marginBottom: '25px' }}>
									Have you ever been convicted or prosecuted for a criminal offense, in particular
									an offense against property or economic offense committed not only in relation
									with work or business activities (without regards to presumption of innocence)?
								</p>
								<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
									<label htmlFor="hasCriminalRecordsTrue">
										{' '}
										Yes
										<input
											id="hasCriminalRecordsTrue"
											type="radio"
											value="Yes"
											checked={input.hasCriminalRecords === 'Yes'}
											onChange={handleChangeInput}
											name="hasCriminalRecords"
										/>
									</label>
									<label htmlFor="hasCriminalRecordsFalse">
										No
										<input
											id="hasCriminalRecordsFalse"
											type="radio"
											value="No"
											checked={input.hasCriminalRecords === 'No'}
											onChange={handleChangeInput}
											name="hasCriminalRecords"
										/>
									</label>
								</div>
								<p style={{ marginBottom: '25px' }}>
									Person against whom are applied CZ/international sanctions?
								</p>
								<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
									<label htmlFor="appliedSanctionsTrue">
										Yes
										<input
											id="appliedSanctionsTrue"
											type="radio"
											value="Yes"
											checked={input.appliedSanctions === 'Yes'}
											onChange={handleChangeInput}
											name="appliedSanctions"
										/>
									</label>
									<label htmlFor="appliedSanctionsFalse">
										No
										<input
											id="appliedSanctionsFalse"
											type="radio"
											value="No"
											checked={input.appliedSanctions === 'No'}
											onChange={handleChangeInput}
											name="appliedSanctions"
										/>
									</label>
								</div>
								<p style={{ marginBottom: '25px' }}>Politically exposed person?</p>
								<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
									<label htmlFor="politicallPersonTrue">
										Yes
										<input
											id="politicallPersonTrue"
											type="radio"
											value="Yes"
											checked={input.politicallPerson === 'Yes'}
											onChange={handleChangeInput}
											name="politicallPerson"
										/>
									</label>
									<label htmlFor="politicallPersonFalse">
										No
										<input
											id="politicallPersonFalse"
											type="radio"
											value="No"
											checked={input.politicallPerson === 'No'}
											onChange={handleChangeInput}
											name="politicallPerson"
										/>
									</label>
								</div>
							</div>
						)}
						{page === 6 && (
							<>
								<p>
									Copies of statements of account kept by an institution in the EEA (proof of
									address)
								</p>
								<LabelInput htmlFor="file-input-address">
									<FileInput
										id="file-input-address"
										type="file"
										ref={fileInputAddress as any}
										onChange={handleChangeFileInput}
										required={true}></FileInput>
									{input.file.poaDoc1 ? input.file.poaDoc1.name : 'Upload File'}
								</LabelInput>
								<p>
									Documents proving information on the source of funds (for instance: payslip, tax
									return etc.)
								</p>
								<LabelInput htmlFor="file-input-proof">
									<FileInput
										id="file-input-proof"
										type="file"
										ref={fileInputDocs as any}
										onChange={handleChangeFileInput}
										required={true}></FileInput>
									{input.file.posofDoc1 ? input.file.posofDoc1.name : 'Upload File'}
								</LabelInput>
							</>
						)}
						{page === 7 && (
							<div
								style={{
									marginBottom: '12px',
									display: 'flex',
									flexDirection: 'column',
									width: '50%'
								}}>
								<span style={{ textAlign: 'center', fontSize: '20px' }}>Residence</span>
								<label
									htmlFor="label-address-permanent-state-Or-Country"
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
									State or Country
								</label>
								<TextField
									id="label-address-permanent-state-Or-Country"
									value={input.residence.stateOrCountry}
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
									value={input.residence.street}
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
									value={input.residence.streetNumber}
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
									value={input.residence.municipality}
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
									value={input.residence.zipCode}
									placeholder="ZIP Code"
									type="text"
									onChange={handleChangeResidenceInput}
									size="small"
									align="left"
									name="zipCode"
								/>
							</div>
						)}
						{page === 8 && (
							<>
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
											checked={input.permanentAndMailAddressSame === 'Yes'}
											onChange={handleChangeInput}
											name="permanentAndMailAddressSame"
										/>
									</label>
									<label htmlFor="label-mailing-permanent-address-false">
										No
										<input
											id="label-mailing-permanent-address-false"
											type="radio"
											value="No"
											checked={input.permanentAndMailAddressSame === 'No'}
											onChange={handleChangeInput}
											name="permanentAndMailAddressSame"
										/>
									</label>
								</div>
								{input.permanentAndMailAddressSame === 'No' && (
									<div
										style={{
											marginBottom: '12px',
											display: 'flex',
											flexDirection: 'column',
											width: '50%'
										}}>
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
											value={input.mailAddress.stateOrCountry}
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
											value={input.mailAddress.street}
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
											value={input.mailAddress.streetNumber}
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
											value={input.mailAddress.municipality}
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
											value={input.mailAddress.zipCode}
											placeholder="ZIP Code"
											type="text"
											onChange={handleChangeMailInput}
											size="small"
											align="left"
											name="zipCode"
										/>
									</div>
								)}
							</>
						)}
						{page < 8 && (
							<Button variant="secondary" onClick={handleNext}>
								Next
							</Button>
						)}
						{page >= 8 && (
							<Button
								variant="secondary"
								// @ts-ignore
								onClick={handleSubmit}
								disabled={isDisabled}>
								{isDisabled ? 'Please fill in all the fields of the form' : 'Submit'}
							</Button>
						)}
					</>
				)}
				{isNatural === false && (
					<div
						style={{
							display: 'flex',
							width: '100%',
							height: '100%',
							flexDirection: 'column',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}>
						{page === 0 && (
							<div style={{ marginBottom: '14px', width: '50%' }}>
								<Title>KYC L2 form for Legal Persons</Title>
								<div style={{ marginBottom: '8px' }}>
									<label
										htmlFor="label-place-of-birth"
										style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
										Place of birth
									</label>
									<TextField
										id="label-place-of-birth"
										value={input.placeOfBirth}
										placeholder="Place of birth"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="placeOfBirth"
										required={true}
										error={input.placeOfBirth.length < 2}
									/>
								</div>
								<div style={{ marginBottom: '8px' }}>
									<label htmlFor="label-select-gender" style={{ fontStyle: 'italic' }}>
										Gender
										<Select
											name="gender"
											onChange={handleDropDownInput}
											value={input.gender}
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
								<div style={{ marginBottom: '8px' }}>
									<label
										htmlFor="label-email"
										style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
										Email
									</label>
									<TextField
										id="label-email"
										value={input.email}
										placeholder="Email"
										type="email"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required
										name="email"
										error={input.email.length < 2}
									/>
								</div>
							</div>
						)}
						{page === 1 && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column'
								}}>
								<div style={{ margin: '10px 0 50px', width: '100%' }}>
									<label htmlFor="label-select-tax-residency" style={{ fontStyle: 'italic' }}>
										Tax Residency
										<Select
											name="taxResidency"
											onChange={handleDropDownInput}
											value={input.taxResidency}
											id="label-select-tax-residency"
											style={{
												maxHeight: '40px',
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
								<div>
									<p style={{ marginBottom: '20px', textAlign: 'center' }}>
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
											Yes
											<input
												id="appliedSanctionsTrue"
												type="radio"
												value="Yes"
												checked={input.appliedSanctions === 'Yes'}
												onChange={handleChangeInput}
												name="appliedSanctions"
											/>
										</label>
										<label htmlFor="appliedSanctionsFalse">
											No
											<input
												id="appliedSanctionsFalse"
												type="radio"
												value="No"
												checked={input.appliedSanctions === 'No'}
												onChange={handleChangeInput}
												name="appliedSanctions"
											/>
										</label>
									</div>
									<p style={{ marginBottom: '20px', textAlign: 'center' }}>
										Politically exposed person?
									</p>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-evenly',
											width: '100%',
											marginBottom: '20px'
										}}>
										<label htmlFor="politicallPersonTrue">
											Yes
											<input
												id="politicallPersonTrue"
												type="radio"
												value="Yes"
												checked={input.politicallPerson === 'Yes'}
												onChange={handleChangeInput}
												name="politicallPerson"
											/>
										</label>
										<label htmlFor="politicallPersonFalse">
											No
											<input
												id="politicallPersonFalse"
												type="radio"
												value="No"
												checked={input.politicallPerson === 'No'}
												onChange={handleChangeInput}
												name="politicallPerson"
											/>
										</label>
									</div>
								</div>
							</div>
						)}
						{page === 2 && (
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
												checked={input.citizenship.includes(`${country.name}`)}
												required
												data-key="citizenship"
											/>
											<label htmlFor={`citizenship-checkbox-${index}`}>{country.name}</label>
										</div>
									);
								})}
							</div>
						)}
						{page === 3 && (
							<div
								style={{
									marginBottom: '12px',
									display: 'flex',
									flexDirection: 'column',
									width: '50%'
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
									value={input.residence.stateOrCountry}
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
									value={input.residence.street}
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
									value={input.residence.streetNumber}
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
									value={input.residence.municipality}
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
									value={input.residence.zipCode}
									placeholder="ZIP Code"
									type="text"
									onChange={handleChangeResidenceInput}
									size="small"
									align="left"
									name="zipCode"
								/>
							</div>
						)}
						{page === 4 && (
							<>
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
											checked={input.permanentAndMailAddressSame === 'Yes'}
											onChange={handleChangeInput}
											name="permanentAndMailAddressSame"
										/>
									</label>
									<label htmlFor="label-mailing-permanent-address-false">
										No
										<input
											id="label-mailing-permanent-address-false"
											type="radio"
											value="No"
											checked={input.permanentAndMailAddressSame === 'No'}
											onChange={handleChangeInput}
											name="permanentAndMailAddressSame"
										/>
									</label>
								</div>
								{input.permanentAndMailAddressSame === 'No' && (
									<div
										style={{
											marginBottom: '12px',
											display: 'flex',
											flexDirection: 'column',
											width: '50%'
										}}>
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
											value={input.mailAddress.stateOrCountry}
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
											value={input.mailAddress.street}
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
											value={input.mailAddress.streetNumber}
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
											value={input.mailAddress.municipality}
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
											value={input.mailAddress.zipCode}
											placeholder="ZIP Code"
											type="text"
											onChange={handleChangeMailInput}
											size="small"
											align="left"
											name="zipCode"
										/>
									</div>
								)}
							</>
						)}
						{page === 5 && (
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
									value={input.identification.type}
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
									value={input.identification.number}
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
									value={input.identification.issuedBy}
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
									value={input.identification.validThru}
									placeholder="Valid thru"
									type="text"
									onChange={handleChangeIdentificationInput}
									size="small"
									align="left"
									name="validThru"
									error={input.identification.validThru < 2}
								/>
							</div>
						)}
						{page === 6 && (
							<div style={{ marginBottom: '14px', width: '100%' }}>
								<div style={{ marginBottom: '10px' }}>
									<label
										htmlFor="label-companyName"
										style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
										Business company / name
									</label>
									<TextField
										id="label-companyName"
										value={input.companyName}
										placeholder="Business company / name"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="companyName"
										error={input.companyName.length < 2}
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<label
										htmlFor="label-identification-number"
										style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
										Business identification number
									</label>
									<TextField
										id="label-identification-number"
										value={input.companyIdentificationNumber}
										placeholder="Business identification number"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="companyIdentificationNumber"
										error={input.companyIdentificationNumber.length < 2}
									/>
								</div>
							</div>
						)}
						{page === 7 && (
							<div style={{ marginBottom: '10px' }}>
								<h3>Registered office</h3>
								<label
									htmlFor="label-registeredOffice-street"
									style={{
										margin: '6px 0 8px 0',
										display: 'inline-block',
										fontStyle: 'italic'
									}}>
									Street
								</label>
								<TextField
									id="label-registeredOffice-street"
									value={input.registeredOffice.street}
									placeholder="Street"
									type="text"
									onChange={handleChangeRegisteredOfficeInput}
									size="small"
									align="left"
									name="street"
									error={input.registeredOffice.street < 2}
								/>
								<label
									htmlFor="label-registeredOffice-streetNumber"
									style={{
										margin: '6px 0 8px 0',
										display: 'inline-block',
										fontStyle: 'italic'
									}}>
									Street number
								</label>
								<TextField
									id="label-registeredOffice-streetNumber"
									value={input.registeredOffice.streetNumber}
									placeholder="Street number"
									type="text"
									onChange={handleChangeRegisteredOfficeInput}
									size="small"
									align="left"
									name="streetNumber"
								/>
								<label
									htmlFor="label-registeredOffice-municipality"
									style={{
										margin: '6px 0 8px 0',
										display: 'inline-block',
										fontStyle: 'italic'
									}}>
									Municipality
								</label>
								<TextField
									id="label-registeredOffice-municipality"
									value={input.registeredOffice.municipality}
									placeholder="Municipality"
									type="text"
									onChange={handleChangeRegisteredOfficeInput}
									size="small"
									align="left"
									name="municipality"
									error={input.registeredOffice.municipality < 2}
								/>
								<label
									htmlFor="label-registeredOffice-state"
									style={{
										margin: '6px 0 8px 0',
										display: 'inline-block',
										fontStyle: 'italic'
									}}>
									State
								</label>
								<TextField
									id="label-registeredOffice-state"
									value={input.registeredOffice.state}
									placeholder="State"
									type="text"
									onChange={handleChangeRegisteredOfficeInput}
									size="small"
									align="left"
									name="state"
									error={input.registeredOffice.state < 2}
								/>
								<label
									htmlFor="label-registeredOffice-country"
									style={{
										margin: '6px 0 8px 0',
										display: 'inline-block',
										fontStyle: 'italic'
									}}>
									Country
								</label>
								<TextField
									id="label-registeredOffice-country"
									value={input.registeredOffice.country}
									placeholder="Country"
									type="text"
									onChange={handleChangeRegisteredOfficeInput}
									size="small"
									align="left"
									name="country"
									error={input.registeredOffice.country < 2}
								/>
								<label
									htmlFor="label-registeredOffice-pc"
									style={{
										margin: '6px 0 8px 0',
										display: 'inline-block',
										fontStyle: 'italic'
									}}>
									PC
								</label>
								<TextField
									id="label-registeredOffice-pc"
									value={input.registeredOffice.pc}
									placeholder="PC"
									type="text"
									onChange={handleChangeRegisteredOfficeInput}
									size="small"
									align="left"
									name="pc"
									error={input.registeredOffice.pc < 2}
								/>
							</div>
						)}
						{page === 8 && (
							<div style={{ marginBottom: '10px', width: '100%' }}>
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									The client is represented (person acting on behalf of the client in each
									Transaction)
								</p>
								{REPRESENT_PERSON.map((activity: any, index: number) => {
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
												value={activity}
												name={activity}
												id={`representPerson-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
												checked={input.representPerson.includes(`${activity}`)}
												required
												data-key="representPerson"
											/>
											<label htmlFor={`representPerson-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
								<div style={{ marginBottom: '10px', width: '100%' }}>
									<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
										State or country, in which the client conducts his business activity
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
													id={`countryOfWork-checkbox-${index}`}
													onChange={handleChangeCheckBox}
													// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
													checked={input.countryOfWork.includes(`${country.name}`)}
													required
													data-key="countryOfWork"
												/>
												<label htmlFor={`countryOfWork-checkbox-${index}`}>{country.name}</label>
											</div>
										);
									})}
								</div>
							</div>
						)}
						{page === 9 && (
							// ADD KEY FOR THIS PART IN INPUT OBJ
							<div style={{ marginBottom: '10px', width: '100%' }}>
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									State or country, in which a branch, organized unit or establishment of the client
									operates
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
												id={`countryOfWork-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
												checked={input.countryOfWork.includes(`${country.name}`)}
												required
												data-key="countryOfWork"
											/>
											<label htmlFor={`countryOfWork-checkbox-${index}`}>{country.name}</label>
										</div>
									);
								})}
							</div>
						)}
						{page === 10 && (
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									flexDirection: 'column',
									alignItems: 'stretch',
									marginBottom: '15px'
								}}>
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									The Client conducts his work / business activity in these areas:
								</p>
								{WORK_AREA_LIST.map((activity: string, index: number) => {
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
												value={activity}
												name={activity}
												id={`workAreaList-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
												checked={input.workArea.includes(`${activity}`)}
												required
												data-key="workArea"
											/>
											<label htmlFor={`workAreaList-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
							</div>
						)}
						{page === 11 && (
							<div
								style={{
									marginBottom: '15px',
									width: '100%'
								}}>
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									Nature of prevailing source of income
								</p>
								{PREVAILLING_SOURCE_OF_INCOME_COMPANY.map((activity: string, index: number) => {
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
												value={activity}
												name={activity}
												id={`sourceOfIncomeNatureList-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
												checked={input.sourceOfIncomeNature.includes(`${activity}`)}
												required={true}
												data-key="sourceOfIncomeNature"
											/>
											<label htmlFor={`sourceOfIncomeNatureList-checkbox-${index}`}>
												{activity}
											</label>
										</div>
									);
								})}
								{input.sourceOfIncomeNature.includes('Other') ? (
									<TextField
										value={input.sourceOfIncomeNatureOther}
										type="text"
										placeholder="Specify..."
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="sourceOfIncomeNatureOther"
									/>
								) : null}
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									Source of funds intended for Transaction:
								</p>
								{SOURCE_OF_FUNDS_LIST_COMPANY.map((activity: string, index: number) => {
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
												value={activity}
												name={activity}
												id={`sourceOfFundsList-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
												checked={input.sourceOfFunds.includes(`${activity}`)}
												required={true}
												data-key="sourceOfFunds"
											/>
											<label htmlFor={`sourceOfFundsList-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
								{input.sourceOfFunds.includes('Other') ? (
									<TextField
										value={input.sourceOfFundsOther}
										type="text"
										placeholder="Specify..."
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="sourceOfFundsOther"
									/>
								) : null}
							</div>
						)}
						{page === 12 && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									marginBottom: '25px',
									alignItems: 'flex-start'
								}}>
								<p style={{ marginBottom: '25px' }}>
									Have you as a legal entity (or the member of your statutory body or your
									supervisory body or your ultimate beneficial owner ) ever been convicted for a
									criminal offense, in particular an offense against property or economic offense
									committed not only in relation with work or business activities (without regards
									to presumption of innocence)?
								</p>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-evenly',
										width: '100%',
										marginBottom: '10px'
									}}>
									<label htmlFor="legalEntityTrue">
										{' '}
										Yes
										<input
											id="legalEntityTrue"
											type="radio"
											value="Yes"
											checked={input.legalEntity === 'Yes'}
											onChange={handleChangeInput}
											name="legalEntity"
										/>
									</label>
									<label htmlFor="legalEntityFalse">
										No
										<input
											id="legalEntityFalse"
											type="radio"
											value="No"
											checked={input.legalEntity === 'No'}
											onChange={handleChangeInput}
											name="legalEntity"
										/>
									</label>
								</div>
								<p style={{ marginBottom: '25px' }}>
									These are mainly criminal offenses in the areas of taxes, corruption, public
									procurement, and subsidy fraud.
								</p>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-evenly',
										width: '100%',
										marginBottom: '10px'
									}}>
									<label htmlFor="typeOfCriminalTrue">
										Yes
										<input
											id="typeOfCriminalTrue"
											type="radio"
											value="Yes"
											checked={input.typeOfCriminal === 'Yes'}
											onChange={handleChangeInput}
											name="typeOfCriminal"
										/>
									</label>
									<label htmlFor="typeOfCriminalFalse">
										No
										<input
											id="typeOfCriminalFalse"
											type="radio"
											value="No"
											checked={input.typeOfCriminal === 'No'}
											onChange={handleChangeInput}
											name="typeOfCriminal"
										/>
									</label>
								</div>
								<p style={{ marginBottom: '25px' }}>The representative of the client is a:</p>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-evenly',
										width: '100%',
										marginBottom: '10px'
									}}>
									<label htmlFor="legalEntityTrue">
										Natural Person
										<input
											id="legalEntityTrue"
											type="radio"
											value="Natural Person"
											checked={input.legalEntity === 'Natural Person'}
											onChange={handleChangeInput}
											name="legalEntity"
										/>
									</label>
									<label htmlFor="legalEntityFalse">
										Legal entity
										<input
											id="legalEntityFalse"
											type="radio"
											value="Legal entity"
											checked={input.legalEntity === 'Legal entity'}
											onChange={handleChangeInput}
											name="legalEntity"
										/>
									</label>
								</div>
								<p style={{ color: 'red' }}>
									End of the SECOND part (submit with files to /kyc/l2-business-data)
								</p>
							</div>
						)}
						{page === 13 && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									width: '100%'
								}}>
								<h3>Information on Ultimate Beneficial Owner(s)</h3>
								<div style={{ marginBottom: '20px' }}>
									<Button variant="secondary" onClick={handleAddUbo}>
										Add UBO
									</Button>
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										width: '100%',
										flexWrap: 'wrap'
									}}>
									{uboList.map((company: any) => {
										return (
											<UboContainer>
												<div key={company.id} style={{ padding: '6px' }}>
													<label
														htmlFor={`label-ubo-company-name-${company.id}`}
														style={{
															margin: '6px 0 8px 0',
															display: 'inline-block',
															fontStyle: 'italic'
														}}>
														Name and surname / business company /name
													</label>
													<TextField
														id={`label-ubo-company-name-${company.id}`}
														value={company.companyName}
														placeholder="Name and surname / business company /name"
														type="text"
														onChange={handleChangeRegisteredOfficeInput}
														size="small"
														align="left"
														name="street"
														error={company.companyName.length < 2}
													/>
													<label
														htmlFor={`label-ubo-id-number-${company.id}`}
														style={{
															margin: '6px 0 8px 0',
															display: 'inline-block',
															fontStyle: 'italic'
														}}>
														Birth identification number / identification number
													</label>
													<TextField
														id={`label-ubo-id-number-${company.id}`}
														value={company.idNumber}
														placeholder="Birth identification number / identification number"
														type="text"
														onChange={handleChangeRegisteredOfficeInput}
														size="small"
														align="left"
														name="streetNumber"
													/>
													<label
														htmlFor={`label-ubo-place-of-birth-${company.id}`}
														style={{
															margin: '6px 0 8px 0',
															display: 'inline-block',
															fontStyle: 'italic'
														}}>
														Place of Birth
													</label>
													<TextField
														id={`label-ubo-place-of-birth-${company.id}`}
														value={company.placeOfBirth}
														placeholder="Place of Birth"
														type="text"
														onChange={handleChangeRegisteredOfficeInput}
														size="small"
														align="left"
														name="municipality"
														error={input.registeredOffice.municipality < 2}
													/>
													<label
														htmlFor={`label-ubo-state-${company.id}`}
														style={{
															margin: '6px 0 8px 0',
															display: 'inline-block',
															fontStyle: 'italic'
														}}>
														State
													</label>
													<TextField
														id={`label-ubo-state-${company.id}`}
														value={company.state}
														placeholder="State"
														type="text"
														onChange={handleChangeRegisteredOfficeInput}
														size="small"
														align="left"
														name="state"
														error={input.registeredOffice.state < 2}
													/>
													<label
														htmlFor="label-registeredOffice-country"
														style={{
															margin: '6px 0 8px 0',
															display: 'inline-block',
															fontStyle: 'italic'
														}}>
														Country
													</label>
													<TextField
														id={`label-ubo-country-${company.id}`}
														value={company.country}
														placeholder="Country"
														type="text"
														onChange={handleChangeRegisteredOfficeInput}
														size="small"
														align="left"
														name="country"
														error={input.registeredOffice.country < 2}
													/>
													<label
														htmlFor={`label-ubo-pc-${company.id}`}
														style={{
															margin: '6px 0 8px 0',
															display: 'inline-block',
															fontStyle: 'italic'
														}}>
														PC
													</label>
													<TextField
														id={`label-ubo-pc-${company.id}`}
														value={company.pc}
														placeholder="PC"
														type="text"
														onChange={handleChangeRegisteredOfficeInput}
														size="small"
														align="left"
														name="pc"
														error={input.registeredOffice.pc < 2}
													/>
												</div>
											</UboContainer>
										);
									})}
								</div>
							</div>
						)}
						{page < 20 && (
							<div
								style={{
									margin: '0 auto',
									width: '100%',
									textAlign: 'center'
								}}>
								<Button variant="secondary" onClick={handleNext}>
									Next
								</Button>
							</div>
						)}
					</div>
				)}
			</Wrapper>
		</Portal>
	) : null;
};