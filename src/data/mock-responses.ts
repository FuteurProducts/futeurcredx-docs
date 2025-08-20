export const mockResponses: Record<string, unknown> = {
  "/api/v1": "Welcome to FuteurCred API v1.0",
  "/api/v1/credit-report": {
    businessInfo: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      taxId: "12-3456789",
      yearFounded: 2010,
    },
    creditScore: {
      score: 785,
      riskLevel: "Low",
      lastUpdated: "2025-07-26",
    },
    collectionsDetail: [
      {
        amountPaid: 0,
        accountStatus: "Open Account",
        collectionAgencyInfo: {
          name: "JEFFERSON CAPITAL SYSTEMS LLC",
          phoneNumber: "+18338515552",
        },
        datePlacedForCollection: "2023-12-01",
        amountPlacedForCollection: 433,
      },
    ],
    tradePaymentExperiences: [
      {
        dbt30: 0,
        dbt60: 0,
        dbt90: 0,
        terms: "NET 30",
        dbt91Plus: 0,
        dateReported: "2025-04-01",
        accountBalance: {
          amount: 12100,
          modifier: "Not applicable",
        },
        businessCategory: "BUS SERVCS",
        recentHighCredit: {
          amount: 24300,
          modifier: "Not applicable",
        },
        currentPercentage: 100,
      },
    ],
    isAvailable: true,
  },
  "/api/v1/lumiq-credit-journey": {
    commercialCreditScoreFactors: [
      {
        code: "011",
        definition: "NUMBER OF COMMERCIAL COLLECTION ACCOUNTS",
      },
      {
        code: "057",
        definition: "BALANCE OF COMMERCIAL ACCOUNTS AT WORST DELINQUENCY",
      },
    ],
    isAvailable: true,
    collectionsDetail: [
      {
        amountPaid: 0,
        accountStatus: "Open Account",
        collectionAgencyInfo: {
          name: "JEFFERSON CAPITAL SYSTEMS LLC",
          phoneNumber: "+18338515552",
        },
        datePlacedForCollection: "2023-12-01",
        amountPlacedForCollection: 433,
      },
      {
        amountPaid: 0,
        accountStatus: "Open Account",
        collectionAgencyInfo: {
          name: "JEFFERSON CAPITAL SYSTEMS LLC",
          phoneNumber: "+18338515552",
        },
        datePlacedForCollection: "2023-12-01",
        amountPlacedForCollection: 208,
      },
      {
        amountPaid: 0,
        accountStatus: "Open Account",
        collectionAgencyInfo: {
          name: "MCCARTHY BURGESS & WOLF",
          phoneNumber: "+14407355100",
        },
        datePlacedForCollection: "2020-12-01",
        amountPlacedForCollection: 422,
      },
      {
        amountPaid: 0,
        dateClosed: "2022-01-01",
        accountStatus: "Uncollected",
        collectionAgencyInfo: {
          name: "ALTUS GLOBAL TRADE SOLUTIONS",
          phoneNumber: "+18005096060",
        },
        datePlacedForCollection: "2021-07-01",
        amountPlacedForCollection: 971,
      },
    ],
  },
}
