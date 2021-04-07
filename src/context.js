import React, { useContext, useEffect, useReducer } from "react";

import {
  SET_LOADING,
  SET_STORIES,
  REMOVE_STORY,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from "./actions";
import reducer from "./reducer";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?";

const initialState = {
  isLoading: true,
  hits: [],
  query: "react",
  page: 0,
  nbPages: 0,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchStories = async (url) => {
    dispatch({ type: SET_LOADING });
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      dispatch({
        type: SET_STORIES,
        payLoad: { hits: data.hits, nbPages: data.nbPages },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const removeStory = (id) => {
    dispatch({ type: REMOVE_STORY, payLoad: id });
  };
  const handelSearch = (query) => {
    dispatch({ type: HANDLE_SEARCH, payLoad: query });
  };

  // useEffect(() => {
  //   fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
  // }, [state.page]);
  useEffect(() => {
    if (state.query && state.page > 0) {
      fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
    }
    const timer = setTimeout(() => {
      if (state.query && state.page === 0) {
        fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.query, state.page]);

  const handlePage = (value) => {
    dispatch({ type: HANDLE_PAGE, payLoad: value });
  };

  return (
    <AppContext.Provider
      value={{ ...state, removeStory, handelSearch, handlePage }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
