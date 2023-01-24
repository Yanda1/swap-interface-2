import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_BORDER_RADIUS, fontSize, pxToRem, spacing } from '../../styles';
import { BASE_URL, findAndReplace, makeId, useStore } from '../../helpers';
import { TextField } from '../textField/textField';
import { Button } from '../button/button';
import { Portal } from './portal';
import { useToasts } from '../toast/toast';
import COUNTRIES from '../../data/listOfAllCountries.json';
import SOURCE_OF_FUNDS_LIST_COMPANY from '../../data/sourceOfFundsListCompany.json';
import PREVAILING_SOURCE_OF_INCOME_COMPANY from '../../data/prevailingSourceOfIncomeCompany.json';
import REPRESENT_PERSON from '../../data/representClient.json';
import NET_YEARLY_INCOME_LIST_COMPANY from '../../data/netYearlyCompanyIncome.json';
import { UboModal } from './uboModal';
import { ShareHoldersModal } from './shareholdersModal';
import { SupervisoryBoardMembers } from './supervisoryBoardMembers';
import { useMedia } from '../../hooks';
import WORK_AREA_LIST from '../../data/workAreaList.json';
import axios from 'axios';

const Wrapper = styled.div(() => {
	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		padding: ${spacing[10]} ${spacing[20]};
	`;
});

const Title = styled.h2`
	text-align: center;
	font-style: italic;
`;

export const ContentTitle = styled.p`
	margin-bottom: ${pxToRem(26)};
	font-size: ${fontSize[18]};
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

const Select = styled.select(() => {
	const {
		state: { theme }
	} = useStore();
	const { mobileWidth: isMobile } = useMedia('s');

	return css`
		width: ${isMobile ? '100%' : '50%'};
		height: 100%;
		max-height: 50px;
		margin-top: ${pxToRem(15)};
		color: ${theme.font.default};
		background-color: ${theme.background.secondary};
		border-radius: ${DEFAULT_BORDER_RADIUS};
	`;
});

const Container = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		width: 40%;
		margin: ${spacing[10]};
		padding: ${spacing[10]};
		border: 1px solid ${theme.border.default};
		-webkit-box-shadow: 7px -7px 15px 0px rgba(0, 0, 0, 0.75);
	}`;
});

const ContainerText = styled.p`
	margin: ${spacing[6]} 0;
`;

const DeleteUboBtn = styled.button(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		cursor: pointer;
		margin: ${spacing[6]} 0;
		background-color: ${theme.button.transparent};
		border: 1px solid ${theme.button.error};
		border-radius: 2px;
		color: white;
		padding: ${spacing[8]} ${spacing[18]};
		text-align: center;
		text-decoration: none;
		font-size: ${fontSize[14]};
		-webkit-transition-duration: 0.4s; /* for Safari */
		transition-duration: 0.3s;

		&:hover {
			background-color: ${theme.button.error};
		}
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

type Props = {
	showKycL2: boolean;
	updateShowKycL2?: any;
};
export const KycL2LegalModal = ({ showKycL2 = true, updateShowKycL2 }: Props) => {
	const [showModal, setShowModal] = useState<boolean>(showKycL2);
	const [isValid, setIsValid] = useState(false);
	useEffect(() => {
		setShowModal(showKycL2);
	}, [showKycL2]);
	const { addToast }: any | null = useToasts();
	const [input, setInput] = useState<{
		appliedSanctions: string;
		companyIdentificationNumber: string;
		companyName: string;
		countryOfOperates: any;
		countryOfWork: string[];
		file: any;
		legalEntity: string;
		mailAddress: any;
		permanentAndMailAddressSame: string;
		politicallPerson: string;
		registeredOffice: any;
		representPerson: string[];
		representativeTypeOfClient: string;
		shareHolders: any;
		sourceOfFunds: string[];
		sourceOfFundsOther: string;
		sourceOfIncomeNature: string[];
		sourceOfIncomeNatureOther: string;
		supervisors: any;
		taxResidency: string;
		typeOfCriminal: string;
		ubo: any;
		workArea: string[];
		yearlyIncome: string[];
	}>({
		appliedSanctions: '',
		companyIdentificationNumber: '',
		companyName: '',
		countryOfOperates: [],
		countryOfWork: [],
		file: {
			// Copy of an account statement kept by an institution in the EEA
			poaDoc1: null,
			// Documents proving information on the source of funds (for instance: payslip, tax return etc.)
			posofDoc1: null,
			// Natural person Representative: Copy of personal identification or passport of the representatives
			representativesId: null,
			// Legal person: Copy of excerpt of public register of Czech Republic or Slovakia (or other comparable foreign evidence) or other valid documents proving the existence of legal entity (Articles of Associations, Deed of Foundation etc.).
			porDoc1: null,
			// Court decision on appointment of legal guardian (if relevant).
			pogDoc1: null
		},
		legalEntity: '',
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: ''
		},
		permanentAndMailAddressSame: 'Yes',
		politicallPerson: '',
		registeredOffice: {
			street: '',
			streetNumber: '',
			municipality: '',
			state: '',
			country: '',
			pc: ''
		},
		representPerson: [],
		representativeTypeOfClient: '',
		shareHolders: [],
		sourceOfFunds: [],
		sourceOfFundsOther: '',
		sourceOfIncomeNature: [],
		sourceOfIncomeNatureOther: '',
		supervisors: [],
		taxResidency: 'Afghanistan',
		typeOfCriminal: '',
		ubo: [],
		workArea: [],
		yearlyIncome: []
	});
	const [page, setPage] = useState<number>(0);
	const {
		state: { accessToken }
	} = useStore();

	const myRef = useRef<HTMLDivElement | null>(null);
	const refPoaDoc1 = useRef<HTMLInputElement>();
	const refPosofDoc1 = useRef<HTMLInputElement>();
	const refRepresentativesId = useRef<HTMLInputElement>();
	const refPorDoc1 = useRef<HTMLInputElement>();
	const refPogDoc1 = useRef<HTMLInputElement>();
	const handleNext = () => {
		myRef?.current?.scrollTo(0, 0);
		setPage((prev: number) => prev + 1);
	};
	const handleSubmit = (event: any) => {
		// after user click on submit send axios with this bodyFormData server
		event.preventDefault();
		const bodyFormData = new FormData();
		bodyFormData.append('poaDoc1', input.file.poaDoc1);
		bodyFormData.append('posofDoc1', input.file.posofDoc1);
		bodyFormData.append('porDoc1', input.file.porDoc1);
		bodyFormData.append('representativesId', input.file.representativesId);
		// TODO: pogDoc1 below NOT REQUIRED COULD BE NULL !!! ;)
		bodyFormData.append('pogDoc1', input.file.pogDoc1);
		console.log('bodyFormData on submit', bodyFormData);
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
		const filepoaDoc1: any = refPoaDoc1?.current?.files && refPoaDoc1.current.files[0];
		const fileposofDoc1: any = refPosofDoc1?.current?.files && refPosofDoc1.current.files[0];
		const filerepresentativesId: any =
			refRepresentativesId?.current?.files && refRepresentativesId.current.files[0];
		const fileporDoc1: any = refPorDoc1?.current?.files && refPorDoc1.current.files[0];
		const filePogDoc1: any = refPogDoc1?.current?.files && refPogDoc1.current.files[0];
		setInput({
			...input,
			file: {
				...input.file,
				poaDoc1: filepoaDoc1,
				posofDoc1: fileposofDoc1,
				representativesId: filerepresentativesId,
				porDoc1: fileporDoc1,
				pogDoc1: filePogDoc1
			}
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
		}
	};

	const [addUbo, setAddUbo] = useState(false);
	const [addShareHolder, setAddShareHolder] = useState(false);
	const [addSupervisor, setAddSupervisor] = useState(false);

	const handleAddUbo = () => {
		setAddUbo(true);
	};
	const handleAddShareHolder = () => {
		setAddShareHolder(true);
	};
	const handleAddSupervisor = () => {
		setAddSupervisor(true);
	};
	const updateUboModalShow = (showModal: boolean, uboClient: any) => {
		if (uboClient) {
			uboClient.id = makeId(20);
			setInput({ ...input, ubo: [...input.ubo, uboClient] });
		}
		setAddUbo(showModal);
	};
	const updateShareHoldersModalShow = (showModal: boolean, uboClient: any) => {
		if (uboClient) {
			uboClient.id = makeId(20);
			setInput({ ...input, shareHolders: [...input.shareHolders, uboClient] });
		}
		setAddShareHolder(showModal);
	};
	const updateSupervisorModalShow = (showModal: boolean, uboClient: any) => {
		if (uboClient) {
			uboClient.id = makeId(20);
			setInput({ ...input, supervisors: [...input.supervisors, uboClient] });
		}
		setAddSupervisor(showModal);
	};
	const handleDeleteUbo = (id: any) => {
		setInput({ ...input, ubo: [...input.ubo.filter((item: any) => item.id !== id)] });
	};

	const handleDeleteShareHolder = (id: any) => {
		setInput({ ...input, shareHolders: [...input.ubo.filter((item: any) => item.id !== id)] });
	};

	useEffect(() => {
		// if page == 14 send first part of form on page
		if (page === 14) {
			// TODO: send first part (axios request)
			const bodyFormData = new FormData();
			bodyFormData.append('companyName', input.companyName);
			bodyFormData.append('companyIdentificationNumber', input.companyIdentificationNumber);
			bodyFormData.append('registeredOffice', input.registeredOffice);
			bodyFormData.append('mailAddress', input.mailAddress);
			bodyFormData.append('taxResidency', input.taxResidency);
			bodyFormData.append('politicallPerson', input.politicallPerson);
			bodyFormData.append('appliedSanctions', input.appliedSanctions);
			bodyFormData.append('representPerson', JSON.stringify(input.representPerson));
			bodyFormData.append('workArea', JSON.stringify(input.workArea));
			bodyFormData.append('countryOfOperates', JSON.stringify(input.countryOfOperates));
			bodyFormData.append('countryOfWork', JSON.stringify(input.countryOfWork));
			bodyFormData.append('yearlyIncome', JSON.stringify(input.yearlyIncome));
			const sourceOfIncomeNature = findAndReplace(
				input.sourceOfIncomeNature,
				'Other',
				input.sourceOfIncomeNatureOther
			);
			bodyFormData.append('sourceOfIncomeNature', JSON.stringify(sourceOfIncomeNature));
			const sourceOfFunds = findAndReplace(input.sourceOfFunds, 'Other', input.sourceOfFundsOther);
			bodyFormData.append('sourceOfFunds', JSON.stringify(sourceOfFunds));
			bodyFormData.append(
				'legalEntity',
				JSON.stringify(input.legalEntity === 'Yes' ? 'true' : 'false')
			);
			bodyFormData.append(
				'typeOfCriminal',
				JSON.stringify(input.typeOfCriminal === 'Yes' ? 'true' : 'false')
			);
			bodyFormData.append(
				'representativeTypeOfClient',
				JSON.stringify(input.representativeTypeOfClient)
			);

			axios({
				method: 'POST',
				url: `${BASE_URL}kyc/l2-business-data`,
				data: bodyFormData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: 'Bearer ' + accessToken
				}
			})
				.then(function (response) {
					// handle success
					console.log(response);
				})
				.catch(function (response) {
					// handle error
					console.log(response);
					addToast('Something went wrong, please fill the form and try again!', 'error');
				});
		}
	}, [page]);

	useEffect(() => {
		setIsValid(false);
		if (
			page === 0 &&
			input.companyName.trim().length > 1 &&
			input.companyIdentificationNumber.trim().length > 1
		) {
			setIsValid(true);
		} else if (page === 1 && !Object.values(input.registeredOffice).includes('')) {
			setIsValid(true);
		} else if (
			(page === 2 && input.permanentAndMailAddressSame === 'Yes') ||
			(page === 2 &&
				input.permanentAndMailAddressSame === 'No' &&
				!Object.values(input.mailAddress).includes(''))
		) {
			setIsValid(true);
		} else if (page === 3 && input.taxResidency) {
			setIsValid(true);
		} else if (page === 4 && input.politicallPerson) {
			setIsValid(true);
		} else if (page === 5 && input.appliedSanctions) {
			setIsValid(true);
		} else if (page === 6 && input.representPerson.length && input.workArea.length) {
			setIsValid(true);
		} else if (page === 7 && input.countryOfOperates.length) {
			setIsValid(true);
		} else if (page === 8 && input.countryOfWork.length) {
			setIsValid(true);
		} else if (
			(page === 9 &&
				input.yearlyIncome.length &&
				input.sourceOfIncomeNature.length &&
				!input.sourceOfIncomeNature.includes('Other')) ||
			(page === 9 &&
				input.yearlyIncome.length &&
				input.sourceOfIncomeNature.includes('Other') &&
				input.sourceOfIncomeNatureOther)
		) {
			setIsValid(true);
		} else if (page === 10 && input.sourceOfFunds.length) {
			setIsValid(true);
		} else if (page === 11 && input.legalEntity) {
			setIsValid(true);
		} else if (page === 12 && input.typeOfCriminal) {
			setIsValid(true);
		} else if (page === 13 && input.representativeTypeOfClient) {
			setIsValid(true);
		} else if (page === 14 || page === 15 || page === 16) {
			setIsValid(true);
		} else if (
			page === 17 &&
			input.file.poaDoc1 &&
			input.file.posofDoc1 &&
			input.file.porDoc1 &&
			input.file.representativesId
		) {
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
							<Title>KYC L2 form for Legal Persons</Title>
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
						</WrapContainer>
					)}
					{page === 1 && (
						<WrapContainer>
							<h3>Registered office</h3>
							<div style={{ display: 'flex' }}>
								<div style={{ width: '50%', marginRight: '20px' }}>
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
										Str number
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
								</div>
								<div style={{ width: '50%' }}>
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
							</div>
						</WrapContainer>
					)}
					{page === 2 && (
						<WrapContainer>
							<ContentTitle>
								Is your mailing address the same as your registered office address?
							</ContentTitle>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-evenly',
									width: '100%',
									marginBottom: '10px'
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
								<>
									<div
										style={{
											width: '100%',
											marginBottom: '12px',
											display: 'flex',
											alignItems: 'baseline'
										}}>
										<div style={{ width: '50%', marginRight: '20px' }}>
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
										</div>
										<div style={{ width: '50%' }}>
											<label
												htmlFor="label-address-street-number"
												style={{
													margin: '6px 0 8px 0',
													display: 'inline-block',
													fontStyle: 'italic'
												}}>
												Str number
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
										</div>
									</div>
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
								</>
							)}
						</WrapContainer>
					)}
					{page === 3 && (
						<div style={{ margin: '20px 0 30px', width: '100%', textAlign: 'center' }}>
							<ContentTitle>Tax Residency</ContentTitle>
							<Select name="taxResidency" onChange={handleDropDownInput} value={input.taxResidency}>
								{COUNTRIES.map((country: any) => {
									return (
										<option value={country.name} key={country.name}>
											{country.name}
										</option>
									);
								})}
							</Select>
						</div>
					)}
					{page === 4 && (
						<div
							style={{
								height: '100%',
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center'
							}}>
							<ContentTitle>Politically exposed person?</ContentTitle>
							<div
								style={{
									display: 'flex',
									width: '100%',
									justifyContent: 'space-evenly',
									marginTop: '20px'
								}}>
								<div>
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
								</div>
								<div>
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
							</div>
						</div>
					)}
					{page === 5 && (
						<div
							style={{
								height: '100%',
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center'
							}}>
							<ContentTitle>
								Person against whom are applied CZ/international sanctions?
							</ContentTitle>
							<div
								style={{
									display: 'flex',
									width: '100%',
									justifyContent: 'space-evenly',
									marginTop: '20px'
								}}>
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
						</div>
					)}
					{page === 6 && (
						<>
							<div style={{ width: '100%' }}>
								<ContentTitle>
									The client is represented (person acting on behalf of the client in each
									Transaction)
								</ContentTitle>
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
												checked={input.representPerson.includes(`${activity}`)}
												data-key="representPerson"
											/>
											<label htmlFor={`representPerson-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
							</div>
							<ContentTitle>
								The Client conducts his work / business activity in these areas:
							</ContentTitle>
							<WrapContainer style={{ height: '50%' }}>
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
											<label htmlFor={`workAreaList-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
							</WrapContainer>
						</>
					)}
					{page === 7 && (
						<>
							<ContentTitle>
								State or country, in which a branch, organized unit or establishment of the client
								operates
							</ContentTitle>
							<WrapContainer>
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
												id={`countryOfOperates-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												checked={input.countryOfOperates.includes(`${country.name}`)}
												data-key="countryOfOperates"
											/>
											<label htmlFor={`countryOfOperates-checkbox-${index}`}>{country.name}</label>
										</div>
									);
								})}
							</WrapContainer>
						</>
					)}
					{page === 8 && (
						<>
							<ContentTitle>
								State or country, in which the client conducts his business activity
							</ContentTitle>
							<WrapContainer>
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
											<label htmlFor={`countryOfWork-checkbox-${index}`}>{country.name}</label>
										</div>
									);
								})}
							</WrapContainer>
						</>
					)}
					{page === 9 && (
						<>
							<WrapContainer>
								<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
									Net yearly income / yearly turnover
								</p>
								{NET_YEARLY_INCOME_LIST_COMPANY.map((activity: any, index: number) => {
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
												id={`yearlyIncome-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												checked={input.yearlyIncome.includes(`${activity}`)}
												data-key="yearlyIncome"
											/>
											<label htmlFor={`yearlyIncome-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
							</WrapContainer>
							<WrapContainer>
								<ContentTitle>Nature of prevailing source of income</ContentTitle>
								{PREVAILING_SOURCE_OF_INCOME_COMPANY.map((activity: string, index: number) => {
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
											<label htmlFor={`sourceOfIncomeNatureList-checkbox-${index}`}>
												{activity}
											</label>
										</div>
									);
								})}
								{input.sourceOfIncomeNature.includes('Other') ? (
									<div style={{ marginTop: '16px' }}>
										<TextField
											value={input.sourceOfIncomeNatureOther}
											type="text"
											placeholder="Specify..."
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="sourceOfIncomeNatureOther"
										/>
									</div>
								) : null}
							</WrapContainer>
						</>
					)}
					{page === 10 && (
						<WrapContainer>
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
								/>
							) : null}
						</WrapContainer>
					)}
					{page === 11 && (
						<>
							<ContentTitle>
								Have you as a legal entity (or the member of your statutory body or your supervisory
								body or your ultimate beneficial owner ) ever been convicted for a criminal offense,
								in particular an offense against property or economic offense committed not only in
								relation with work or business activities (without regards to presumption of
								innocence)?
							</ContentTitle>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-evenly',
									width: '100%',
									marginBottom: '10px'
								}}>
								<label htmlFor="legalEntityTrue">
									<input
										id="legalEntityTrue"
										type="radio"
										value="Yes"
										checked={input.legalEntity === 'Yes'}
										onChange={handleChangeInput}
										name="legalEntity"
									/>
									YES
								</label>
								<label htmlFor="legalEntityFalse">
									<input
										id="legalEntityFalse"
										type="radio"
										value="No"
										checked={input.legalEntity === 'No'}
										onChange={handleChangeInput}
										name="legalEntity"
									/>
									NO
								</label>
							</div>
						</>
					)}
					{page === 12 && (
						<>
							<ContentTitle>
								These are mainly criminal offenses in the areas of taxes, corruption, public
								procurement, and subsidy fraud.
							</ContentTitle>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-evenly',
									width: '100%',
									marginBottom: '10px'
								}}>
								<label htmlFor="typeOfCriminalTrue">
									<input
										id="typeOfCriminalTrue"
										type="radio"
										value="Yes"
										checked={input.typeOfCriminal === 'Yes'}
										onChange={handleChangeInput}
										name="typeOfCriminal"
									/>
									YES
								</label>
								<label htmlFor="typeOfCriminalFalse">
									<input
										id="typeOfCriminalFalse"
										type="radio"
										value="No"
										checked={input.typeOfCriminal === 'No'}
										onChange={handleChangeInput}
										name="typeOfCriminal"
									/>
									NO
								</label>
							</div>
						</>
					)}
					{page === 13 && (
						<>
							<ContentTitle style={{ marginBottom: '25px' }}>
								The representative of the client is a:
							</ContentTitle>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-evenly',
									width: '100%',
									marginBottom: '10px'
								}}>
								<label htmlFor="representativeTypeOfClientTrue">
									<input
										id="representativeTypeOfClientTrue"
										type="radio"
										value="Natural Person"
										checked={input.representativeTypeOfClient === 'Natural Person'}
										onChange={handleChangeInput}
										name="representativeTypeOfClient"
									/>
									Natural Person
								</label>
								<label htmlFor="representativeTypeOfClientFalse">
									<input
										id="representativeTypeOfClientFalse"
										type="radio"
										value="Legal entity"
										checked={input.representativeTypeOfClient === 'Legal entity'}
										onChange={handleChangeInput}
										name="representativeTypeOfClient"
									/>
									Legal entity
								</label>
							</div>
						</>
					)}
					{page === 14 && (
						<WrapContainer
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								width: '100%'
							}}>
							<ContentTitle>Information on Ultimate Beneficial Owner(s)</ContentTitle>
							<div style={{ marginBottom: '10px' }}>
								<Button variant="secondary" onClick={handleAddUbo}>
									Add UBO
								</Button>
							</div>
							<WrapContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
								<UboModal addUbo={addUbo} updateUboModalShow={updateUboModalShow} />
								{input.ubo.map((client: any) => {
									if (client) {
										return (
											<Container key={client.id}>
												<>
													<div
														style={{
															display: 'flex',
															width: '100%',
															flexDirection: 'column',
															alignItems: 'flex-start'
														}}>
														<ContainerText>Name: {client.fullName}</ContainerText>
														<ContainerText>Id Number: {client.idNumber}</ContainerText>
														<ContainerText>Place of birth: {client.placeOfBirth}</ContainerText>
														<ContainerText>Citizenship: {client.citizenship}</ContainerText>
														<ContainerText>Tax residency: {client.taxResidency}</ContainerText>
													</div>
													<DeleteUboBtn onClick={() => handleDeleteUbo(client.id)}>
														Delete
													</DeleteUboBtn>
												</>
											</Container>
										);
									}
								})}
							</WrapContainer>
						</WrapContainer>
					)}
					{page === 15 && (
						<WrapContainer
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								width: '100%'
							}}>
							<ContentTitle>
								Information on majority shareholders or person in control of client ({'>'}25%)
							</ContentTitle>
							<div style={{ marginBottom: '10px' }}>
								<Button variant="secondary" onClick={handleAddShareHolder}>
									Add shareholder
								</Button>
							</div>
							<WrapContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
								<ShareHoldersModal
									addShareHolder={addShareHolder}
									updateShareHoldersModalShow={updateShareHoldersModalShow}
								/>
								{input.shareHolders.map((client: any) => {
									if (client) {
										return (
											<Container key={client.id}>
												<>
													<div
														style={{
															display: 'flex',
															width: '100%',
															flexDirection: 'column',
															alignItems: 'flex-start'
														}}>
														<ContainerText>Name: {client.fullName}</ContainerText>
														<ContainerText>Id Number: {client.idNumber}</ContainerText>
														<ContainerText>Place of birth: {client.placeOfBirth}</ContainerText>
														<ContainerText>Citizenship: {client.citizenship}</ContainerText>
														<ContainerText>Tax residency: {client.taxResidency}</ContainerText>
													</div>
													<DeleteUboBtn onClick={() => handleDeleteShareHolder(client.id)}>
														Delete
													</DeleteUboBtn>
												</>
											</Container>
										);
									}
								})}
							</WrapContainer>
						</WrapContainer>
					)}
					{page === 16 && (
						<WrapContainer
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								width: '100%'
							}}>
							<ContentTitle>
								Information on members of the supervisory board (If it a client with a supervisory
								board or other supervisory body)
							</ContentTitle>
							<div style={{ marginBottom: '20px' }}>
								<Button variant="secondary" onClick={handleAddSupervisor}>
									Add member
								</Button>
							</div>
							<WrapContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
								<SupervisoryBoardMembers
									addSupervisor={addSupervisor}
									updateSupervisorModalShow={updateSupervisorModalShow}
								/>
								{input.supervisors.map((client: any) => {
									if (client) {
										return (
											<Container key={client.id}>
												<>
													<div
														style={{
															display: 'flex',
															width: '100%',
															flexDirection: 'column',
															alignItems: 'flex-start',
															marginBottom: '8px'
														}}>
														<ContainerText>Name: {client.fullName}</ContainerText>
														<ContainerText>Date of birth: {client.dateOfBirth}</ContainerText>
														<ContainerText>Place of birth: {client.placeOfBirth}</ContainerText>
														<ContainerText>
															Citizenship(s): {client.citizenship.join(', ')}
														</ContainerText>
													</div>
													<DeleteUboBtn onClick={() => handleDeleteShareHolder(client.id)}>
														Delete
													</DeleteUboBtn>
												</>
											</Container>
										);
									}
								})}
							</WrapContainer>
						</WrapContainer>
					)}
					{page === 17 && (
						<WrapContainer>
							<ContentTitle>
								Copy of an account statement kept by an institution in the EEA
							</ContentTitle>
							<LabelInput htmlFor="file-input-refPoasDoc1">
								<FileInput
									id="file-input-refPoasDoc1"
									type="file"
									ref={refPoaDoc1 as any}
									onChange={handleChangeFileInput}></FileInput>
								{input.file.poaDoc1 ? input.file.poaDoc1.name : 'Upload File'}
							</LabelInput>
							<ContentTitle>
								Documents proving information on the source of funds (for instance: payslip, tax
								return etc.)
							</ContentTitle>
							<LabelInput htmlFor="file-input-refPosofDoc1">
								<FileInput
									id="file-input-refPosofDoc1"
									type="file"
									ref={refPosofDoc1 as any}
									onChange={handleChangeFileInput}></FileInput>
								{input.file.posofDoc1 ? input.file.posofDoc1.name : 'Upload File'}
							</LabelInput>
							<ContentTitle>
								Natural person Representative: Copy of personal identification or passport of the
								representatives
							</ContentTitle>
							<LabelInput htmlFor="file-input-refRepresentativesId">
								<FileInput
									id="file-input-refRepresentativesId"
									type="file"
									ref={refRepresentativesId as any}
									onChange={handleChangeFileInput}></FileInput>
								{input.file.representativesId ? input.file.representativesId.name : 'Upload File'}
							</LabelInput>
							<ContentTitle>
								Legal person: Copy of excerpt of public register of Czech Republic or Slovakia (or
								other comparable foreign evidence) or other valid documents proving the existence of
								legal entity (Articles of Associations, Deed of Foundation etc.).
							</ContentTitle>
							<LabelInput htmlFor="file-input-refPorDoc1">
								<FileInput
									id="file-input-refPorDoc1"
									type="file"
									ref={refPorDoc1 as any}
									onChange={handleChangeFileInput}></FileInput>
								{input.file.porDoc1 ? input.file.porDoc1.name : 'Upload File'}
							</LabelInput>
							<ContentTitle>
								Court decision on appointment of legal guardian (if relevant).
							</ContentTitle>
							<LabelInput htmlFor="file-input-refPogDoc1">
								<FileInput
									id="file-input-refPogDoc1"
									type="file"
									ref={refPogDoc1 as any}
									onChange={handleChangeFileInput}></FileInput>
								{input.file.pogDoc1 ? input.file.pogDoc1.name : 'Upload File'}
							</LabelInput>
						</WrapContainer>
					)}
					{page < 17 && (
						<div
							style={{
								margin: '0 auto',
								width: '100%',
								textAlign: 'center'
							}}>
							<Button variant="secondary" onClick={handleNext} disabled={!isValid}>
								Next
							</Button>
						</div>
					)}
					{page >= 17 && (
						<div
							style={{
								margin: '0 auto',
								width: '100%',
								textAlign: 'center'
							}}>
							<Button
								disabled={!isValid}
								variant="secondary"
								// @ts-ignore
								onClick={handleSubmit}>
								Submit
							</Button>
						</div>
					)}
				</div>
			</Wrapper>
		</Portal>
	);
};
