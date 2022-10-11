export const FORM_CONFIG = {
  core_membershipapplicationid: {
    type: "text",
    Label: "Membership Application",
    AttributeType: "Uniqueidentifier",
    MaxLength: 100,
    Required: "SystemRequired",
  },
  bad_ethnicity: {
    type: "text",
    Label: "Ethnicity",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
  },
  py3_ethnicity: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_currentgrade: {
    type: "text",
    Label: "Current Grade",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_insertnhsnetemailaddress: {
    type: "text",
    Label: "If Yes Insert nhs.net email address",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_otherregulatorybodyreference: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_memberdirectory: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_preferredmailingaddress: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_readpolicydocument: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_newhospitaladded: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  sky_newhospitaltype: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  sky_cvurl: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  sky_profilepicture: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  sky_newhospitalname: {
    type: "text",
    Label: "Input Lapbel",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_speciality: {
    type: "text",
    Label: "Speciality",
    AttributeType: "Memo",
    MaxLength: 2000,
    Required: "None",
  },
  py3_whatukbasedroleareyou: {
    type: "text",
    Label: "UK/Overseas role",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_mainareaofinterest: {
    type: "text",
    Label: "Main area of Interest",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
  },
  bad_isbadmember: {
    type: "text",
    Label: "Are you a BAD member?",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
    Handler: () => console.log("🐞 onClick handler"),
  },
  bad_includeinthebssciiemaildiscussionforum: {
    type: "text",
    Label: "Include in the BSSCII email discussion forum",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
  },
  py3_constitutionagreement: {
    type: "text",
    Label: "Constitution Agreement",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
  },
  bad_otherjointclinics: {
    type: "text",
    Label: "Other joint Clinics",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_title: {
    type: "text",
    Label: "Title",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_firstname: {
    type: "text",
    Label: "First Name",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_initials: {
    type: "text",
    Label: "Initials",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_lastname: {
    type: "text",
    Label: "Last Name",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_alternativelastname: {
    type: "text",
    Label: "Alternative Last Name",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_gender: {
    type: "text",
    Label: "Gender",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
  },
  py3_dateofbirth: {
    type: "text",
    Label: "Date of Birth",
    AttributeType: "DateTime",
    MaxLength: 100,
    Required: "None",
  },
  py3_email: {
    type: "text",
    Label: "Email",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_mobilephone: {
    type: "text",
    Label: "Mobile Phone",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_gmcnumber: {
    type: "text",
    Label: "GMC Number",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_ntnno: {
    type: "text",
    Label: "NTN Number",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_currentpost: {
    type: "text",
    Label: "Current Post",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_hospitalid: {
    type: "text",
    Label: "Hospital",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
  },
  bad_proposer1: {
    type: "text",
    Label: "Proposer 1",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_proposer2: {
    type: "text",
    Label: "Proposer 2",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_interestinfieldquestion: {
    type: "text",
    Label: "Interest in Field Question",
    AttributeType: "Memo",
    MaxLength: 2000,
    Required: "None",
  },
  bad_mrpcqualified: {
    type: "text",
    Label: "MRCP Qualified",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
  },
  bad_hasmedicallicence: {
    type: "text",
    Label: "License to Practice Medicine?",
    AttributeType: "Boolean",
    MaxLength: 100,
    Required: "None",
  },
  bad_existingsubscriptionid: {
    type: "text",
    Label: "Existing Category",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
  },
  core_membershipsubscriptionplanid: {
    type: "text",
    Label: "New Category",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
  },
  bad_newcategorydate: {
    type: "text",
    Label: "New Category Date",
    AttributeType: "DateTime",
    MaxLength: 100,
    Required: "ApplicationRequired",
  },
  py3_nationality: {
    type: "text",
    Label: "Nationality",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_sigapprovalrequestdate: {
    type: "text",
    Label: "SIG  Approval Request Date",
    AttributeType: "DateTime",
    MaxLength: 100,
    Required: "None",
  },
  bad_noofdayswithsig: {
    type: "text",
    Label: "No of Days with SIG",
    AttributeType: "Integer",
    MaxLength: 100,
    Required: "None",
  },
  py3_address1ine1: {
    type: "text",
    Label: "Address Line 1",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_addressline2: {
    type: "text",
    Label: "Address Line 2",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_addresstowncity: {
    type: "text",
    Label: "Address Town/City",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_addressline3: {
    type: "text",
    Label: "Address Line 3",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_addresscountystate: {
    type: "text",
    Label: "Address County/State",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_addresszippostalcode: {
    type: "text",
    Label: "Address Zip/Postal Code",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  py3_addresscountry: {
    type: "text",
    Label: "Address Country",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_expectedyearofqualification: {
    type: "text",
    Label: "Expected Year of Qualification",
    AttributeType: "String",
    MaxLength: 100,
    Required: "None",
  },
  bad_qualifications: {
    type: "text",
    Label: "Qualifications",
    AttributeType: "Memo",
    MaxLength: 500,
    Required: "None",
  },
  core_accountid: {
    type: "text",
    Label: "SIG",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
  },
  bad_organisedfor: {
    type: "text",
    Label: "Organised For",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "ApplicationRequired",
  },
  bad_applicationfor: {
    type: "text",
    Label: "Application for",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "ApplicationRequired",
  },
  transactioncurrencyid: {
    type: "text",
    Label: "Currency",
    AttributeType: "Lookup",
    MaxLength: 100,
    Required: "None",
  },
  bad_psychodermatologycategory: {
    type: "text",
    Label: "Psychodermatology Category",
    AttributeType: "Picklist",
    MaxLength: 100,
    Required: "None",
  },
};
