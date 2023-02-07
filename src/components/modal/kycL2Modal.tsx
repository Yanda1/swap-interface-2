import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import {fontSize, fontStyle, pxToRem, spacing} from '../../styles';
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
	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		padding: ${spacing[10]} ${spacing[20]};
	`;
});

export const WrapContainer = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		width: 100%;
		overflow-y: auto;
		margin-bottom: ${spacing[10]};
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

const Title = styled.h2`
	text-align: center;
	font-style: italic;
`;

const TextTitle = styled.p(() => {

	return css`
		font-size: ${fontSize[16]};
		margin-bottom: ${pxToRem(25)};
		font-style: ${fontStyle.italic};
		font-weight: bold;
		text-align: center;
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

// const Container = styled.div(() => {
// 	const {
// 		state: { theme }
// 	} = useStore();
//
// 	return css`
// 		display: flex;
// 		flex-wrap: wrap;
// 		flex-direction: column;
// 		align-items: flex-end;
// 		justify-content: center;
// 		width: 40%;
// 		margin: ${spacing[10]};
// 		padding: ${spacing[10]};
// 		border: 1px solid ${theme.border.default};
// 		-webkit-box-shadow: 7px -7px 15px 0px rgba(0, 0, 0, 0.75);
// 	}`;
// });

// const ContainerText = styled.p`
// 	margin: ${spacing[6]} 0;
// `;
//
// const DeleteUboBtn = styled.button(() => {
// 	const {
// 		state: { theme }
// 	} = useStore();
//
// 	return css`
// 		cursor: pointer;
// 		margin: ${spacing[6]} 0;
// 		background-color: ${theme.button.transparent};
// 		border: 1px solid ${theme.button.error};
// 		border-radius: 2px;
// 		color: white;
// 		padding: ${spacing[8]} ${spacing[18]};
// 		text-align: center;
// 		text-decoration: none;
// 		font-size: ${fontSize[14]};
// 		-webkit-transition-duration: 0.4s; /* Safari */
// 		transition-duration: 0.3s;
//
// 		&:hover {
// 			background-color: ${theme.button.error};
// 		}
// 	`;
// });

type Props = {
	showKycL2: boolean;
	updateShowKycL2?: any;
};
export const KycL2Modal = ({ showKycL2 = false, updateShowKycL2 }: Props) => {
	const [showModal, setShowModal] = useState<boolean>(showKycL2);
	useEffect(() => {
		setShowModal(showKycL2);
	}, [showKycL2]);
	const [input, setInput] = useState<{
		appliedSanctions: string;
		citizenship: string[];
		countryOfWork: string[];
		declare: string[];
		declareOther: string;
		email: string;
		file: any;
		gender: string;
		hasCriminalRecords: string;
		irregularSourceOfFunds: string[];
		irregularSourceOfFundsOther: string;
		mailAddress: any;
		permanentAndMailAddressSame: string;
		placeOfBirth: string;
		politicallPerson: string;
		residence: any;
		sourceOfFunds: string[];
		sourceOfFundsOther: string;
		sourceOfIncome: string;
		sourceOfIncomeNature: string[];
		sourceOfIncomeNatureOther: string;
		taxResidency: string;
		workArea: string[];
		yearlyIncome: number | null;
	}>({
		appliedSanctions: '',
		citizenship: [],
		countryOfWork: [],
		declare: [],
		declareOther: '',
		email: '',
		file: {
			poaDoc1: null,
			posofDoc1: null
		},
		gender: 'Select gender',
		hasCriminalRecords: '',
		irregularSourceOfFunds: [],
		irregularSourceOfFundsOther: '',
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			country: ''
		},
		permanentAndMailAddressSame: 'Yes',
		placeOfBirth: '',
		politicallPerson: '',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			country: ''
		},
		sourceOfFunds: [],
		sourceOfFundsOther: '',
		sourceOfIncome: '',
		sourceOfIncomeNature: [],
		sourceOfIncomeNatureOther: '',
		taxResidency: 'Select country',
		workArea: [],
		yearlyIncome: null,
	});
	const [page, setPage] = useState<number>(0);

	const fileInputAddress = useRef<HTMLInputElement>();
	const fileInputDocs = useRef<HTMLInputElement>();

	const { addToast }: any | null = useToasts();
	const {
		dispatch
	} = useStore();

	const api = useAxios();


	const myRef = useRef<HTMLDivElement | null>(null);
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
			fileInputAddress?.current?.files && fileInputAddress.current.files[0];
		const filePosofDoc1: any = fileInputDocs?.current?.files && fileInputDocs.current.files[0];
		setInput({
			...input,
			file: { ...input.file, poaDoc1: filePosoaDoc1, posofDoc1: filePosofDoc1 }
		});
	};

	const handleDropDownInput = (event: any) => {
		console.log(event.target.name);
		setInput({ ...input, [event.target.name]: event.target.value });
	};
	const handleDropDownInputResidence = (event: any) => {
		setInput({ ...input, residence: {...input.residence, country: [event.target.value]} });
	};
	const handleDropDownInputMailAddress = (event: any) => {
		setInput({ ...input, mailAddress: {...input.residence, country: [event.target.value]} });
	};

	const handleOnClose = () => {
		setShowModal(false);
		updateShowKycL2(false);
	};

	const handleOnBack = () => {
		if (page > 0) {
			setPage((prev: number) => prev - 1);
		}
	};

	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		setIsValid(false);
		if (page === 0 && input.email.includes('@')
			&& input.email.includes('.')
			&& input.email.trim().length > 2
			&& input.gender !== 'Select gender'
			&& input.placeOfBirth.trim().length >= 2) {
			setIsValid(true);
		} else if (page === 1 && input.sourceOfIncome.trim().length >= 2 && Number(input.yearlyIncome) > 0 && input.taxResidency !== 'Select country') {
			setIsValid(true);
		} else if (page === 2 && input.countryOfWork.length > 0) {
			setIsValid(true);
		} else if (page === 3 && input.workArea.length > 0) {
			setIsValid(true);
		} else if (page === 4 && input.sourceOfFunds.length > 0 && !input.sourceOfFunds.includes('Other') ||
			page == 4 && input.sourceOfFunds.includes('Other') && input.sourceOfFundsOther.trim().length > 0) {
			setIsValid(true);
		} else if (page === 5 && input.sourceOfIncomeNature.length > 0 && !input.sourceOfIncomeNature.includes('Other') ||
			page === 5 && input.sourceOfIncomeNature.includes('Other') && input.sourceOfIncomeNatureOther.trim().length > 0) {
			setIsValid(true);
		} else if (page === 6 && input.citizenship.length > 0) {
			setIsValid(true);
		} else if (page === 7 && !input.irregularSourceOfFunds.includes('Other') && input.irregularSourceOfFunds.length > 0  ||
		page === 7 && input.irregularSourceOfFunds.includes('Other') && input.irregularSourceOfFundsOther.trim().length > 0) {
			setIsValid(true);
		} else if (page === 8 && input.declare.includes('I am a national of the aforementioned sole state or country and simultaneously I am registered to a permanent or other type of residency in this state or country') && !input.declareOther.trim().length || page === 8 && input.declareOther.trim().length > 0) {
			setIsValid(true);
		} else if (page === 9 && input.hasCriminalRecords.length > 0) {
			setIsValid(true);
		} else if (page === 10 && input.appliedSanctions.length > 0) {
			setIsValid(true);
		} else if (page === 11 && input.politicallPerson.length > 0) {
			setIsValid(true);
		} else if (page === 12 && !Object.values(input.residence).includes('')) {
			setIsValid(true);
		} else if (page === 13 && input.permanentAndMailAddressSame === 'Yes' || page === 13 && !Object.values(input.mailAddress).includes('')) {
			setIsValid(true);
		} else if (page === 14 && input.file.poaDoc1 && input.file.posofDoc1) {
			setIsValid(true);
		}
	}, [page, input]);

	return (
		<Portal
			size="large"
			isOpen={showModal}
			handleClose={handleOnClose}
			hasBackButton
			handleBack={handleOnBack}>
			<Wrapper ref={myRef}>
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
						<WrapContainer>
						<Title>KYC L2 form for Natural Person</Title>
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
										maxLength={100}
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
										name="email"
										maxLength={100}
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

						</WrapContainer>
					)}
					{page === 1 && (
						<WrapContainer>
							<div style={{ margin: '10px 0', width: '100%' }}>
								<label
									htmlFor="label-sourceOfIncome"
									style={{ marginBottom: '8px', display: 'inline-block' }}>
									Prevailing source of such income
								</label>
								<TextField
									id="label-sourceOfIncome"
									value={input.sourceOfIncome}
									placeholder="Employment/business, real estate, trading, etc."
									type="text"
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="sourceOfIncome"
									maxLength={100}
									error={input.sourceOfIncome.length < 2}
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
									maxLength={100}
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
						</WrapContainer>
					)}
					{page === 2 && (
						<WrapContainer>
						<div style={{ marginBottom: '10px', width: '100%' }}>
							<TextTitle>
								Country in which the Client conducts his work / business activity
							</TextTitle>
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
											checked={input.countryOfWork.includes(`${country.name}`)}
											data-key="countryOfWork"
										/>
										<label style={{marginLeft: '4px'}} htmlFor={`countryOfWork-checkbox-${index}`}>{country.name}</label>
									</div>
								);
							})}
						</div>
						</WrapContainer>
					)}
					{page === 3 && (
						<WrapContainer>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								flexDirection: 'column',
								alignItems: 'stretch',
								marginBottom: '15px'
							}}>
							<TextTitle>
								The Client conducts his work / business activity in these areas:
							</TextTitle>
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
											checked={input.workArea.includes(`${activity}`)}
											data-key="workArea"
										/>
										<label style={{marginLeft: '4px'}} htmlFor={`workAreaList-checkbox-${index}`}>{activity}</label>
									</div>
								);
							})}
						</div>
						</WrapContainer>
					)}
					{page === 4 && (
						<WrapContainer>
							<TextTitle>
								Source of funds intended for Transaction:
							</TextTitle>
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
							checked={input.sourceOfFunds.includes(`${activity}`)}
							data-key="sourceOfFunds"
							/>
							<label style={{marginLeft: '4px'}} htmlFor={`sourceOfFundsList-checkbox-${index}`}>{activity}</label>
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
							maxLength={100}
							/>
							) : null}
						</WrapContainer>
					)}
					{page === 5 && (
						<WrapContainer>
							<TextTitle>
								Nature of prevailing source of income
							</TextTitle>
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
									checked={input.sourceOfIncomeNature.includes(`${activity}`)}
									data-key="sourceOfIncomeNature"
									/>
									<label style={{marginLeft: '4px'}} htmlFor={`sourceOfIncomeNatureList-checkbox-${index}`}>{activity}</label>
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
									maxLength={100}
									/>
									) : null}
						</WrapContainer>
					)}
					{page === 6 && (
						<WrapContainer style={{ marginBottom: '10px'}}>
							<TextTitle>
								Citizenship(s)
							</TextTitle>
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
											data-key="citizenship"
										/>
										<label htmlFor={`citizenship-checkbox-${index}`}>{country.name}</label>
									</div>
								);
							})}
						</WrapContainer>
					)}
					{page === 7 && (
						<WrapContainer>
							<div style={{ marginBottom: '15px' }}>
								<TextTitle>
									State, which of the stated incomes of funds intended for business is irregular:
								</TextTitle>
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
												checked={input.irregularSourceOfFunds.includes(`${activity}`)}
												data-key="irregularSourceOfFunds"
											/>
											<label style={{marginLeft: '4px'}} htmlFor={`fundsIrregularForBusinessList-checkbox-${index}`}>
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
										maxLength={100}
									/>
								) : null}
							</div>
						</WrapContainer>
					)}
					{page === 8 && (
						<WrapContainer>
							<TextTitle>
								I declare that
							</TextTitle>
							{DECLARE_LIST.map((activity: string, index: number) => {
								return (
									<div style={{marginBottom: '14px'}} key={activity}>
									<label htmlFor={`declare-${index}`}>
									<input
										id={`declare-${index}`}
										type="radio"
										value={activity}
										checked={input.declare.includes(activity)}
										onChange={handleChangeInput}
										name="declare"
									/>
										{activity}
								</label>
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
									maxLength={100}
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
									maxLength={100}
									/>
									) : null}
						</WrapContainer>
					)}
					{page === 9 && (
						<>
							<TextTitle>
								Have you ever been convicted or prosecuted for a criminal offense, in particular an
								offense against property or economic offense committed not only in relation with
								work or business activities (without regards to presumption of innocence)?
							</TextTitle>
							<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
								<label htmlFor="hasCriminalRecordsTrue">
									<input
										id="hasCriminalRecordsTrue"
										type="radio"
										value="Yes"
										checked={input.hasCriminalRecords === 'Yes'}
										onChange={handleChangeInput}
										name="hasCriminalRecords"
									/>
									Yes
								</label>
								<label htmlFor="hasCriminalRecordsFalse">
									<input
										id="hasCriminalRecordsFalse"
										type="radio"
										value="No"
										checked={input.hasCriminalRecords === 'No'}
										onChange={handleChangeInput}
										name="hasCriminalRecords"
									/>
									No
								</label>
							</div>
						</>
					)}
					{page === 10 && (
						<>
							<TextTitle>
								Person against whom are applied CZ/international sanctions?
							</TextTitle>
							<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
							<label htmlFor="appliedSanctionsTrue">
							<input
							id="appliedSanctionsTrue"
							type="radio"
							value="Yes"
							checked={input.appliedSanctions === 'Yes'}
							onChange={handleChangeInput}
							name="appliedSanctions"
							/>
								Yes
							</label>
							<label htmlFor="appliedSanctionsFalse">
							<input
							id="appliedSanctionsFalse"
							type="radio"
							value="No"
							checked={input.appliedSanctions === 'No'}
							onChange={handleChangeInput}
							name="appliedSanctions"
							/>
								No
							</label>
							</div>
						</>
					)}
					{page === 11 && (
						<>
							<TextTitle>Politically exposed person?</TextTitle>
							<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
							<label htmlFor="politicallPersonTrue">
							<input
							id="politicallPersonTrue"
							type="radio"
							value="Yes"
							checked={input.politicallPerson === 'Yes'}
							onChange={handleChangeInput}
							name="politicallPerson"
							/>
								Yes
							</label>
							<label htmlFor="politicallPersonFalse">
							<input
							id="politicallPersonFalse"
							type="radio"
							value="No"
							checked={input.politicallPerson === 'No'}
							onChange={handleChangeInput}
							name="politicallPerson"
							/>
								No
							</label>
							</div>
						</>
					)}
					{page === 12 && (
						<WrapContainer>
							<TextTitle>Residence</TextTitle>
							<div style={{marginRight: '10px'}}>
							<label
								htmlFor="input.residence.country"
								style={{ fontStyle: 'italic' }}>
								Country
							</label>
							<Select
								onChange={handleDropDownInputResidence}
								value={input.residence.country}
								id="input.residence.country"
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
								maxLength={100}
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
								maxLength={100}
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
								maxLength={100}
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
								maxLength={100}
							/>
							</div>
						</WrapContainer>
					)}
					{page === 13 && (
						<WrapContainer>
							<TextTitle>
								Is your permanent (RESIDENCE) address the same as your mailing address?
							</TextTitle>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-evenly',
									marginBottom: '20px'
								}}>
								<label htmlFor="label-mailing-permanent-address-true">
									<input
										id="label-mailing-permanent-address-true"
										type="radio"
										value="Yes"
										checked={input.permanentAndMailAddressSame === 'Yes'}
										onChange={handleChangeInput}
										name="permanentAndMailAddressSame"
									/>
									Yes
								</label>
								<label htmlFor="label-mailing-permanent-address-false">
									<input
										id="label-mailing-permanent-address-false"
										type="radio"
										value="No"
										checked={input.permanentAndMailAddressSame === 'No'}
										onChange={handleChangeInput}
										name="permanentAndMailAddressSame"
									/>
									No
								</label>
							</div>
							{input.permanentAndMailAddressSame === 'No' && (
								<div
									style={{
										marginBottom: '12px',
										marginRight: '10px',
										display: 'flex',
										flexDirection: 'column',
									}}>
									<label
										htmlFor="label-address-permanent-state-Or-Country"
										style={{
											margin: '6px 0 8px 0',
											display: 'inline-block',
											fontStyle: 'italic'
										}}>
										Country
									</label>
									<Select
										name="mailAddressStateOrCountry"
										onChange={handleDropDownInputMailAddress}
										value={input.mailAddress.stateOrCountry}
										id="label-address-permanent-state-Or-Country"
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
										maxLength={100}
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
										maxLength={100}
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
										maxLength={100}
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
										maxLength={100}
									/>
								</div>
							)}
						</WrapContainer>
					)}
					{page === 14 && (
						<>
							<TextTitle>
								Copies of statements of account kept by an institution in the EEA (proof of address)
							</TextTitle>
							<LabelInput htmlFor="file-input-address">
								<FileInput
									id="file-input-address"
									type="file"
									ref={fileInputAddress as any}
									onChange={handleChangeFileInput}>
								</FileInput>
								{input.file.poaDoc1 ? input.file.poaDoc1.name : 'Upload File'}
							</LabelInput>
							<TextTitle>
								Documents proving information on the source of funds (for instance: payslip, tax
								return etc.)
							</TextTitle>
							<LabelInput htmlFor="file-input-proof">
								<FileInput
									id="file-input-proof"
									type="file"
									ref={fileInputDocs as any}
									onChange={handleChangeFileInput}>
								</FileInput>
								{input.file.posofDoc1 ? input.file.posofDoc1.name : 'Upload File'}
							</LabelInput>
						</>
					)}
					{page < 14 && (
						<Button variant="secondary" onClick={handleNext} disabled={!isValid}>
							Next
						</Button>
					)}
					{page >= 14 && (
						<Button
							variant="secondary"
							disabled={!isValid}
							// @ts-ignore
							onClick={handleSubmit}>
							Submit
						</Button>
					)}
				</div>
			</Wrapper>
		</Portal>
	);
};
