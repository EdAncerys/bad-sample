export const FORM_CONFIG = {
  core_membershipapplicationid: {
    Label: "Membership Application",
    AttributeType: "Uniqueidentifier",
    MaxLength: 100,
    Required: "SystemRequired",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_ethnicity: {
    Label: "Ethnicity",
    AttributeType: "Picklist", // TODO add picklist options
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: true, // hide this field
    width: "100%",
    caption: "",
  },
  py3_ethnicity: {
    Label: "Input Label",
    AttributeType: "",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_currentgrade: {
    Label: "Current Grade",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_insertnhsnetemailaddress: {
    Label: "Email Address",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_otherregulatorybodyreference: {
    Label: "Input Lapbel",
    AttributeType: "",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_memberdirectory: {
    Label: "Include my details in the BAD Members` Directory`, AttributeType:",
    MaxLength: 100,
    Required: "None",
    order: 100,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_preferredmailingaddress: {
    Label: "Preferred mailing option",
    AttributeType: "",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_readpolicydocument: {
    Label: "Please confirm you have read the policy document",
    AttributeType: "",
    MaxLength: 100,
    Required: "ApplicationRequired",
    order: 100,
    hidden: false,
    width: "100%",
    caption: "",
    Link: "/privacy-policy",
  },
  bad_newhospitaladded: {
    Label: "Hospital / Medical School not listed",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
    order: 16,
    hidden: false,
    width: "100%",
    caption: "",
  },
  sky_newhospitaltype: {
    Label: "Select Type",
    AttributeType: "Picklist",
    Choices: [
      { value: "Hospital", Label: "Main Hospital" },
      { value: "Medical School", Label: "Medical School" },
    ],
    MaxLength: 100,
    Required: "None",
    order: 16,
    hidden: false,
    width: "100%",
    caption: "",
  },
  sky_cvurl: {
    Label: "Input Lapbel",
    AttributeType: "",
    MaxLength: 100,
    Required: "None",
    order: 16,
    hidden: false,
    width: "100%",
    caption: "",
  },
  sky_profilepicture: {
    Label: "Input Lapbel",
    AttributeType: "",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  sky_newhospitalname: {
    Label: "New Hospital Name",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_speciality: {
    Label: "Specialist Interest",
    AttributeType: "Memo",
    MaxLength: 2000,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_whatukbasedroleareyou: {
    Label: "UK / Overseas role",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_mainareaofinterest: {
    Label: "Main area of Interest",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_isbadmember: {
    Label: "Are you a BAD member?",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
    order: 19,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_includeinthebssciiemaildiscussionforum: {
    Label: "Include in the BSSCII email discussion forum",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption:
      "Do you want to be included in the BSSCII discussion forum? If yes, please tick and add your NHS address below:",
  },
  py3_constitutionagreement: {
    Label: "Constitution Agreement",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "ApplicationRequired",
    order: 100,
    hidden: false,
    width: "100%",
    caption: "",
    Link: "/about-the-bad/bad-constitution/",
  },
  bad_otherjointclinics: {
    Label: "Do you do joint clinics with any other specialties?",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_title: {
    Label: "Title",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_firstname: {
    Label: "First Name",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_initials: {
    Label: "Initials",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_lastname: {
    Label: "Last Name",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_alternativelastname: {
    Label: "Alternative Last Name",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_gender: {
    Label: "Gender",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_dateofbirth: {
    Label: "Date of Birth",
    AttributeType: "DateTime",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_email: {
    Label: "Email",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_mobilephone: {
    Label: "Mobile Phone",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_gmcnumber: {
    Label: "GMC / IMC number",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_ntnno: {
    Label:
      "NTN Number (if NTN is not applicable, please state current trainee route)",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_currentpost: {
    Label: "Post / Job Title details",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 14,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_hospitalid: {
    Label: "Main Hospital / Place of Work / Medical School details",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
    order: 15,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_proposer1: {
    Label: "Supporting Member 1",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 17,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_proposer2: {
    Label: "Supporting Member 2",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 18,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_interestinfieldquestion: {
    Label: "Describe your interest",
    AttributeType: "Memo",
    MaxLength: 2000,
    Required: "None",
    order: 20,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_mrpcqualified: {
    Label: "MRCP Qualified",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_hasmedicallicence: {
    Label: "License to practice medicine (Y/N)",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_existingsubscriptionid: {
    Label: "Existing Category",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  core_membershipsubscriptionplanid: {
    Label: "New Category",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_newcategorydate: {
    Label: "New Category Date",
    AttributeType: "DateTime",
    MaxLength: 100,
    Required: "ApplicationRequired",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_nationality: {
    Label: "Nationality",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_sigapprovalrequestdate: {
    Label: "SIG  Approval Request Date",
    AttributeType: "DateTime",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_noofdayswithsig: {
    Label: "No of Days with SIG",
    AttributeType: "Integer",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_address1ine1: {
    Label: "Home Address",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_addressline2: {
    Label: "",
    Placeholder: "Address Line 2",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_addresstowncity: {
    Label: "",
    Placeholder: "Address Town/City",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_addressline3: {
    Label: "",
    Placeholder: "Address Line 3",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_addresscountystate: {
    Label: "",
    Placeholder: "Address County/State",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_addresszippostalcode: {
    Label: "",
    Placeholder: "Address Zip/Postal Code",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  py3_addresscountry: {
    Label: "",
    Placeholder: "Address Country",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_expectedyearofqualification: {
    Label: "Expected Year of Qualification",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_qualifications: {
    Label: "Qualifications",
    AttributeType: "Memo",
    MaxLength: 500,
    Required: "None",
    order: 21,
    hidden: false,
    width: "100%",
    caption: "",
  },
  core_accountid: {
    Label: "SIG",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_organisedfor: {
    Label: "Organised For",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "ApplicationRequired",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_applicationfor: {
    Label: "Application for",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "ApplicationRequired",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  transactioncurrencyid: {
    Label: "Currency",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  bad_psychodermatologycategory: {
    Label: "Membership Category Type",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 0,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_clinicalspecialtysofpractice: {
    Label: "Clinical Specialty(s) of practice",
    AttributeType: "Virtual",
    MaxLength: 100,
    Required: "None",
    order: 16,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_fixedtermtemporaryreasonforemploymentcont: {
    Label: "Fixed term/temporary reason for employment contrac",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 17,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_jobrole: {
    Label: "Job Role",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 18,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_mainspecialtyqualification: {
    Label: "Main Specialty Qualification",
    AttributeType: "Virtual",
    MaxLength: 100,
    Required: "None",
    order: 19,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_othermainspecialtyqualification: {
    Label: "Other Main Specialty Qualification",
    AttributeType: "String",
    MaxLength: 200,
    Required: "None",
    order: 20,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_otherreasonformovingccstdate: {
    Label: "Other Reason for moving CCST date",
    AttributeType: "String",
    MaxLength: 200,
    Required: "None",
    order: 21,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_privatepracticeorganisation: {
    Label: "Private Practice Organisation",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 22,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_professionalregistrationbody: {
    Label: "Professional Registration Body",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 23,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_professionalregistrationstatus: {
    Label: "Professional Registration Status",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 24,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_qualificationtype: {
    Label: "Qualification Type",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 25,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_reasonformovingccstdate: {
    Label: "Reason for moving CCST date",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 26,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_residencystatus: {
    Label: "Residency Status",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 27,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_rotapattern: {
    Label: "Rota Pattern",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 28,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_specialiseddermatologyareasofpractice: {
    Label: "Specialised Dermatology Areas of practice",
    AttributeType: "Virtual",
    MaxLength: 100,
    Required: "None",
    order: 29,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_staffgroupcategory: {
    Label: "Staff Group Category",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 30,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_typeofcontract: {
    Label: "Type of Contract",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 31,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_typeofpractice: {
    Label: "Type of Practice",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
    order: 32,
    hidden: false,
    width: "100%",
    caption: "",
  },
  formus_otherqualificationtype: {
    Label: "Other Qualification Type",
    AttributeType: "Virtual",
    MaxLength: 100,
    Required: "None",
    order: 33,
    hidden: false,
    width: "100%",
    caption: "",
  },
};

export const BAD_STEP_ONE_FORM_CONFIG = {};
export const BAD_STEP_TWO_FORM_CONFIG = {};
export const BAD_STEP_THREE_FORM_CONFIG = {
  py3_title: {},
  py3_firstname: {},
  py3_lastname: {},
  py3_gender: {},
  py3_dateofbirth: {},
  py3_email: {},
  py3_mobilephone: {},
  py3_address1ine1: {},
  py3_addressline2: {},
  py3_addresscountystate: {},
  py3_addresszippostalcode: {},
  py3_addresscountry: {},
};
export const BAD_STEP_FOUR_FORM_CONFIG = {
  formus_staffgroupcategory: {},
  formus_jobrole: {},
  py3_hospitalid: {},
  sky_newhospitaltype: {},
  bad_newhospitaladded: {},
  sky_newhospitalname: {},
  formus_professionalregistrationbody: {},
  formus_professionalregistrationstatus: {},
  formus_residencystatus: {},
  formus_qualificationtype: {},
  formus_mainspecialtyqualification: {}, // TODO: picklist missing
  formus_clinicalspecialtysofpractice: {}, // TODO picklist missing
  formus_specialiseddermatologyareasofpractice: {}, // TODO picklist missing
  formus_typeofcontract: {},
  formus_fixedtermtemporaryreasonforemploymentcont: {},
  formus_typeofcontract: {},
  formus_rotapattern: {},
  formus_typeofpractice: {},
  formus_privatepracticeorganisation: {},
  formus_reasonformovingccstdate: {},
};

export const BAD_STEP_FIVE_FORM_CONFIG = {
  bad_proposer1: {},
  bad_preferredmailingaddress: {},
  sky_cvurl: {},
  bad_memberdirectory: {},
  py3_constitutionagreement: {},
  bad_readpolicydocument: {},
};

export const colors = {
  primary: "#1F335E",
  secondary: "#34BE82",
  blue: "#3882CD",
  ocean: "#3882CD",
  yellow: "#F2F013",
  white: "#FFFF",
  darkGrey: "#404040",
  trueBlack: "#000",
  black: "#000000",
  softBlack: "#454545",
  danger: "#EF476F",
  silver: "#ced4da",
  lightSilver: "#F0F1F4",
  darkSilver: "#A2A2A2",
  silverFillOne: "#F5F6F7",
  silverFillTwo: "#E3E7EA",
  textSoftBlack: "#707070",
  textBlack: "#171717",
  shade: "rgba(0, 0, 0, 0.25)",
  shadeIntense: "rgba(0, 0, 0, 0.5)",
  footer: "#292929",
  disabled: "#e9ecef",
  // background colours
  bgLight: "rgb(230,230,230, 0.7)",
  bgNavy: "#EFF7F9",
  bgPink: "#FCEFF0",
  // app Colours
  maroon: "#842057",
  pink: "#EF476F",
  orange: "#EF7D21",
  turquoise: "#17A2B8",
  red: "#DC3545",
  yellow: "#FFC107",
  navy: "#1E335D",
  green: "#80b918",
  darkGreen: "#29A74C",
};
