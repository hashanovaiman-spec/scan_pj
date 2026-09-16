export const buildSearchPayload = (form) => ({
  issueDateInterval: {
    startDate: form.startDate,
    endDate: form.endDate,
  },

  searchContext: {
    targetSearchEntitiesContext: {
      targetSearchEntities: [
        {
          type: 'company',
          sparkId: null,
          entityId: null,
          inn: form.inn,
          maxFullness: form.maxFullness,
          inBusinessNews: form.businessContext,
        },
      ],
      onlyMainRole: form.onlyMainRole,
      tonality: form.tonality,
      onlyWithRiskFactors: form.onlyWithRiskFactors,
    },
  },

  similarMode: 'duplicates',
  limit: Number(form.limit),
  sortType: 'sourceInfluence',
  sortDirectionType: 'desc',
  intervalType: 'month',
  histogramTypes: [
    'totalDocuments',
    'riskFactors',
  ],

  attributeFilters: {
    excludeTechNews: !form.includeTechNews,
    excludeAnnouncements: !form.includeAnnouncements,
    excludeDigests: !form.includeDigests,
  },
});
