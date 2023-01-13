import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { pxToRem, spacing } from '../../styles';
import { BASE_URL, button, ButtonEnum, findAndReplace, useStore, routes } from '../../helpers';
import { TextField } from '../textField/textField';
import { Button } from '../button/button';
import { Portal } from './portal';
import { useAxios } from '../../hooks';
import { useToasts } from '../toast/toast';
import COUNTRIES from '../../data/listOfAllCountries.json';
import WORK_AREA_LIST from '../../data/workAreaList.json';
import SOURCE_OF_FUNDS_LIST from '../../data/sourceOfFundsList.json';
import FUNDS_IRREGULAR_FOR_BUSINESS_LIST from '../../data/fundsIrregularForBussinesList.json';
import SOURCE_OF_INCOME_NATURE_LIST from '../../data/sourceOfIncomeNatureList.json';
import DECLARE_LIST from '../../data/declareList.json';

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

type Props = {
	showKycL2: boolean;
	updateShowKycL2?: any;
};
export const KycL2Modal = ({ showKycL2, updateShowKycL2 }: Props) => {
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
		permanentAndMailAddressSame: string;
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
		gender: 'Select gender',
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
		taxResidency: 'Select country',
		workArea: []
	});
	const [isValid, setIsValid] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [showModal, setShowModal] = useState<boolean>(showKycL2);

	const fileInputAddress = useRef<HTMLInputElement>();
	const fileInputDocs = useRef<HTMLInputElement>();
	const myRef = useRef<HTMLDivElement | null>(null);

	const { addToast }: any | null = useToasts();
	const {
		dispatch
	} = useStore();

	const api = useAxios();

	const handleNext = () => {
		myRef?.current?.scrollTo(0, 0);
		setPage((prev: number) => prev + 1);
	};
	const handleSubmit = (event: any) => {
		event.preventDefault();
		const bodyFormData = new FormData();
		bodyFormData.append('place_of_birth', input.placeOfBirth);
		bodyFormData.append('residence', JSON.stringify(input.residence));
		if (input.mailAddress) {
			bodyFormData.append('mail_address', JSON.stringify(input.mailAddress));
		}
		bodyFormData.append('gender', input.gender);
		bodyFormData.append('citizenship', input.citizenship.join(', '));
		bodyFormData.append('poa_doc_1', input.file.poaDoc1);
		bodyFormData.append('posof_doc_1', input.file.posofDoc1);
		bodyFormData.append('email', input.email);
		bodyFormData.append('tax_residency', input.taxResidency);
		bodyFormData.append('politicall_person', input.politicallPerson === 'Yes' ? 'true' : 'false');
		bodyFormData.append('applied_sanctions', input.appliedSanctions === 'Yes' ? 'true' : 'false');
		bodyFormData.append('country_of_work', input.countryOfWork.join(', '));
		bodyFormData.append('work_area', input.workArea.join(', '));
		const sourceOfIncomeNature = findAndReplace(input.sourceOfIncomeNature, 'Other', input.sourceOfIncomeNatureOther);
		bodyFormData.append('source_of_income_nature', sourceOfIncomeNature.join(', '));
		const yearlyIncome = input.yearlyIncome ? Number(input.yearlyIncome).toFixed(4) : '0';
		bodyFormData.append('yearly_income', yearlyIncome);
		bodyFormData.append('source_of_income', input.sourceOfIncome);
		const sourceOfFunds = findAndReplace(input.sourceOfFunds, 'Other', input.sourceOfFundsOther);
		bodyFormData.append('source_of_funds', sourceOfFunds.join(', '));
		const irregularSourceOfFunds = findAndReplace(input.irregularSourceOfFunds, 'Other', input.irregularSourceOfFundsOther);
		bodyFormData.append('irregular_source_of_funds', irregularSourceOfFunds.join(', '));
		bodyFormData.append(
			'has_criminal_records',
			input.hasCriminalRecords === 'Yes' ? 'true' : 'false'
		);
		bodyFormData.append('declare', `${input.declare}${input.declareOther}`);

		api.request({
			method: 'PUT',
			url: `${BASE_URL}${routes.kycL2NaturalForm}`,
			data: bodyFormData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		})
			.then(function (response) {
				// handle success
				// Status 200 OK
				console.log(response);
				if (response.status === 200) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.CHECK_KYC_L2 });
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
			fileInputAddress?.current?.files && fileInputAddress?.current?.files[0];
		const filePosofDoc1: any = fileInputDocs?.current?.files && fileInputDocs?.current?.files[0];
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

	useEffect(() => {
		setIsValid(false);
		if (
			page === 0 &&
			input.placeOfBirth.length > 3 &&
			input.yearlyIncome !== null &&
			input.email.length > 3 &&
			input.gender !== 'Select gender'
		) {
			setIsValid(true);
		} else if (
			page === 1 &&
			input.sourceOfIncome.length > 3 &&
			input.taxResidency !== 'Select country' &&
			input.countryOfWork.length
		) {
			setIsValid(true);
		} else if (
			page === 2 &&
			input.workArea.length &&
			input.sourceOfFunds.length &&
			input.sourceOfIncomeNature.length
		) {
			setIsValid(true);
		} else if (page === 3 && input.citizenship.length) {
			setIsValid(true);
		} else if (page === 4 && input.irregularSourceOfFunds.length && input.declare.length) {
			setIsValid(true);
		} else if (
			page === 5 &&
			input.hasCriminalRecords.length &&
			input.appliedSanctions.length &&
			input.politicallPerson.length
		) {
			setIsValid(true);
		} else if (page === 6 && input.file.poaDoc1 && input.file.posofDoc1) {
			setIsValid(true);
		} else if (
			page === 7 &&
			input.residence.street.length > 3 &&
			input.residence.streetNumber.length &&
			input.residence.stateOrCountry.length &&
			input.residence.municipality.length &&
			input.residence.zipCode.length
		) {
			setIsValid(true);
		} else if (page === 8 && input.permanentAndMailAddressSame === 'Yes') {
			setIsValid(true);
		} else if (
			page === 8 &&
			input.mailAddress.street.length > 3 &&
			input.mailAddress.streetNumber.length &&
			input.mailAddress.stateOrCountry.length &&
			input.mailAddress.municipality.length &&
			input.mailAddress.zipCode.length
		) {
			setIsValid(true);
		}
	}, [page, input]);

	return showModal ? (
		<Portal
			size="large"
			isOpen={showModal}
			handleClose={handleOnClose}
			hasBackButton
			handleBack={() => (page > 0 ? setPage((prev: number) => prev - 1) : null)}>
			<Wrapper ref={myRef}>
				<h2 style={{ fontStyle: 'italic' }}>KYC L2 form for Natural Person</h2>
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
									type="text"
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="email"
									error={input.email.length < 2 || input.email.indexOf('@') === -1}
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
										<option value="Select gender">Select gender</option>
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
								Prevailing source of such income (employment/business, real estate, trading, etc.)
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
								error={input.sourceOfIncome.length < 2}
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
							{COUNTRIES.slice(1).map((country: any, index: number) => {
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
								error={input.sourceOfFundsOther.length < 2}
							/>
						) : null}

						<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
							Nature of prevailing source of income:
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
										data-key="sourceOfIncomeNature"
									/>
									<label htmlFor={`sourceOfIncomeNatureList-checkbox-${index}`}>{activity}</label>
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
								error={input.sourceOfIncomeNatureOther.length < 2}
							/>
						) : null}
					</div>
				)}
				{page === 3 && (
					<div style={{ marginBottom: '10px', width: '100%' }}>
						<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
							Citizenship(s)
						</p>
						{COUNTRIES.slice(1).map((country: any, index: number) => {
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
							Have you ever been convicted or prosecuted for a criminal offense, in particular an
							offense against property or economic offense committed not only in relation with work
							or business activities (without regards to presumption of innocence)?
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
							Copies of statements of account kept by an institution in the EEA (proof of address)
						</p>
						<LabelInput htmlFor="file-input-address">
							<FileInput
								id="file-input-address"
								type="file"
								ref={fileInputAddress as any}
								onChange={handleChangeFileInput}></FileInput>
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
								onChange={handleChangeFileInput}></FileInput>
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
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
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
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
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
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
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
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
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
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
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
					<Button variant="secondary" onClick={handleNext} disabled={!isValid}>
						{isValid ? 'Next' : 'Please fill up all fields'}
					</Button>
				)}
				{page >= 8 && (
					<Button
						disabled={!isValid}
						variant="secondary"
						// @ts-ignore
						onClick={handleSubmit}>
						Submit
					</Button>
				)}
			</Wrapper>
		</Portal>
	) : null;
};
