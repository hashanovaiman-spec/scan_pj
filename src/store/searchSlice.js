import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getDocuments,
  getHistograms,
  searchObjects,
} from '../api/scanApi';


export const loadHistograms = createAsyncThunk(
  'search/loadHistograms',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await getHistograms(payload);

      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Не удалось получить сводку'
      );
    }
  }
);


export const runSearch = createAsyncThunk(
  'search/runSearch',
  async (payload, { dispatch, rejectWithValue }) => {
    /*
      Сводку запускаем отдельно и не ждём её здесь.
      Поэтому медленный запрос histograms не блокирует
      получение публикаций.
    */
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
        error.response?.data?.message ||
          error.message ||
          'Не удалось получить результаты поиска'
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
        error.response?.data?.message ||
          error.message ||
          'Не удалось загрузить следующие публикации'
      );
    }
  }
);


const initialState = {
  histograms: [],
  ids: [],
  documents: [],

  status: 'idle',
  histogramStatus: 'idle',
  docsStatus: 'idle',

  error: null,
  histogramError: null,
};


const searchSlice = createSlice({
  name: 'search',

  initialState,

  reducers: {
    clearSearch: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      /*
        Основной поиск:
        objectsearch + первые 10 документов
      */

      .addCase(runSearch.pending, (state) => {
        state.status = 'loading';
        state.docsStatus = 'loading';

        state.ids = [];
        state.documents = [];

        state.error = null;
      })

      .addCase(runSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.docsStatus = 'succeeded';

        state.ids = action.payload.ids;
        state.documents = action.payload.documents;
      })

      .addCase(runSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.docsStatus = 'failed';

        state.error =
          action.payload ||
          'Не удалось получить результаты поиска';
      })


      /*
        Общая сводка — отдельный запрос.
      */

      .addCase(loadHistograms.pending, (state) => {
        state.histogramStatus = 'loading';

        state.histograms = [];
        state.histogramError = null;
      })

      .addCase(loadHistograms.fulfilled, (state, action) => {
        state.histogramStatus = 'succeeded';
        state.histograms = action.payload;
      })

      .addCase(loadHistograms.rejected, (state, action) => {
        state.histogramStatus = 'failed';

        state.histogramError =
          action.payload ||
          'Не удалось получить сводку';
      })


      /*
        Кнопка "Показать больше".
      */

      .addCase(loadMoreDocuments.pending, (state) => {
        state.docsStatus = 'loading';
      })

      .addCase(
        loadMoreDocuments.fulfilled,
        (state, action) => {
          state.docsStatus = 'succeeded';

          state.documents.push(...action.payload);
        }
      )

      .addCase(
        loadMoreDocuments.rejected,
        (state, action) => {
          state.docsStatus = 'failed';

          state.error =
            action.payload ||
            'Не удалось загрузить публикации';
        }
      );
  },
});


export const { clearSearch } = searchSlice.actions;

export default searchSlice.reducer;