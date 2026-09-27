import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getDocuments,
  getHistograms,
  searchObjects,
} from '../api/scanApi';
import { loadLastSearch } from '../utils/searchStorage';

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const loadHistograms = createAsyncThunk(
  'search/loadHistograms',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await getHistograms(payload);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Не удалось получить сводку')
      );
    }
  }
);

export const runSearch = createAsyncThunk(
  'search/runSearch',
  async (payload, { dispatch, rejectWithValue }) => {
    // Сводку запускаем отдельно, чтобы она не блокировала загрузку документов.
    dispatch(loadHistograms(payload));

    try {
      const objectsResponse = await searchObjects(payload);

      const ids = (objectsResponse.data.items || []).map(
        (item) => item.encodedId
      );

      if (!ids.length) {
        return {
          ids: [],
          documents: [],
        };
      }

      const firstIds = ids.slice(0, 10);
      const documentsResponse = await getDocuments(firstIds);

      return {
        ids,
        documents: documentsResponse.data || [],
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          'Не удалось получить результаты поиска'
        )
      );
    }
  }
);

export const loadMoreDocuments = createAsyncThunk(
  'search/loadMoreDocuments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { ids, documents } = getState().search;

      const nextIds = ids.slice(
        documents.length,
        documents.length + 10
      );

      if (!nextIds.length) {
        return [];
      }

      const response = await getDocuments(nextIds);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          'Не удалось загрузить следующие публикации'
        )
      );
    }
  }
);

const createEmptyState = (lastPayload = null) => ({
  histograms: [],
  ids: [],
  documents: [],

  status: 'idle',
  histogramStatus: 'idle',
  docsStatus: 'idle',

  error: null,
  histogramError: null,

  lastPayload,

  activeSearchRequestId: null,
  activeHistogramRequestId: null,
  activeMoreRequestId: null,
});

const initialState = createEmptyState(loadLastSearch()?.payload || null);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: () => createEmptyState(),
  },
  extraReducers: (builder) => {
    builder
      // Основной поиск: objectsearch + первые 10 документов.
      .addCase(runSearch.pending, (state, action) => {
        state.activeSearchRequestId = action.meta.requestId;
        state.activeMoreRequestId = null;

        state.status = 'loading';
        state.docsStatus = 'loading';

        state.ids = [];
        state.documents = [];
        state.error = null;
        state.lastPayload = action.meta.arg;
      })
      .addCase(runSearch.fulfilled, (state, action) => {
        if (state.activeSearchRequestId !== action.meta.requestId) {
          return;
        }

        state.status = 'succeeded';
        state.docsStatus = 'succeeded';
        state.ids = action.payload.ids;
        state.documents = action.payload.documents;
        state.activeSearchRequestId = null;
      })
      .addCase(runSearch.rejected, (state, action) => {
        if (state.activeSearchRequestId !== action.meta.requestId) {
          return;
        }

        state.status = 'failed';
        state.docsStatus = 'failed';
        state.error =
          action.payload || 'Не удалось получить результаты поиска';
        state.activeSearchRequestId = null;
      })

      // Общая сводка — отдельный запрос.
      .addCase(loadHistograms.pending, (state, action) => {
        state.activeHistogramRequestId = action.meta.requestId;
        state.histogramStatus = 'loading';
        state.histograms = [];
        state.histogramError = null;
      })
      .addCase(loadHistograms.fulfilled, (state, action) => {
        if (state.activeHistogramRequestId !== action.meta.requestId) {
          return;
        }

        state.histogramStatus = 'succeeded';
        state.histograms = action.payload;
        state.activeHistogramRequestId = null;
      })
      .addCase(loadHistograms.rejected, (state, action) => {
        if (state.activeHistogramRequestId !== action.meta.requestId) {
          return;
        }

        state.histogramStatus = 'failed';
        state.histogramError =
          action.payload || 'Не удалось получить сводку';
        state.activeHistogramRequestId = null;
      })

      // Кнопка «Показать больше».
      .addCase(loadMoreDocuments.pending, (state, action) => {
        state.activeMoreRequestId = action.meta.requestId;
        state.docsStatus = 'loading';
      })
      .addCase(loadMoreDocuments.fulfilled, (state, action) => {
        if (state.activeMoreRequestId !== action.meta.requestId) {
          return;
        }

        state.docsStatus = 'succeeded';
        state.documents.push(...action.payload);
        state.activeMoreRequestId = null;
      })
      .addCase(loadMoreDocuments.rejected, (state, action) => {
        if (state.activeMoreRequestId !== action.meta.requestId) {
          return;
        }

        state.docsStatus = 'failed';
        state.error = action.payload || 'Не удалось загрузить публикации';
        state.activeMoreRequestId = null;
      });
  },
});

export const { clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
