import AsyncStorage from '@react-native-community/async-storage';
import {combineReducers, createStore} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'

// const [profile, setProfile] = useState("prawito");

// setProfile("Hudoro")

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ["fcm"]
}

const initialState = {
  loading: false,
  name: 'Prawito Hudoro',
  address: 'Cisauk',
};

const reducer = (state = initialState, action) => {
  if (action.type === 'SET_LOADING') {
    return {
      ...state,
      loading: action.value,
    };
  }
  if (action.type === 'SET_NAME') {
    return {
      ...state,
      name: 'Azzamy',
    };
  }
  return state;
};


const initialStateToken = {
  token:""
}
const tokenReducer = (state = initialStateToken, action) => {
  if (action.type === "ADDFCM") {
    return {
      ...state,
      token:action.data
    };
  }

  return state;
}


const initialNotifikasi = {
  route:"",
  param:null
}
const notifikasiReducer = (state = initialNotifikasi, action) => {
  switch (action.type) {
    case "ADDNOTIFIKASI":
      let data = action.data;
      return {
        ...state,
        route:data.route,
        param:data.param
      }

    case "REMOVENOTIFIKASI":
      return {
        ...state,
        route:"",
        param:null
      };
    default:
      return state;
  }
}



const rootReducer = combineReducers(
  {
    reducer:reducer,
    fcm:tokenReducer,
    notifikasi:notifikasiReducer
  }
)

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureStore = createStore(persistedReducer)
export const persistor = persistStore(configureStore);
