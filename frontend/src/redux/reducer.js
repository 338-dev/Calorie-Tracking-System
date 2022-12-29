const initialState = {
    loading: false,
    userLoading:false,
    foodDetailsLoading:false,
    bikes: [],
    foodDetails: [],
    allUsers:[],
    error: '',
    usersError:'',
    foodDetailsError:'',
    user:[],
    userError:'',
    bikesPagesError:'',
    totalPages:1,
    currentBikePage:1,
    isFilterSet:false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_BIKES_REQUEST':
        return {
          ...state,
          loading: true
        }
        case 'FETCH_PAGE_CHANGE_REQUEST':
          return {
            ...state,
            currentBikePage:action.payload
          }
      case 'FETCH_BIKES_PAGES_REQUEST':
        return {
          ...state,
          bikesPagesLoading: true
        }
      case 'FETCH_ALL_USERS_REQUEST':
        return {
          ...state,
          loading: true
        }
      case 'FETCH_BIKES_SUCCESS':
        return {
          ...state,
          loading: false,
          bikes: action.payload,
          error: ''
        }
        case 'FETCH_BIKES_PAGES_SUCCESS':
          return {
            ...state,
            bikesPagesLoading: false,
            bikesPages: action.payload,
            bikesPagesError: ''
          }
        case 'FETCH_TOTAL_PAGES':
          return {
            ...state,
            totalPages:action.payload
          }
        case 'FETCH_ALL_BIKES_SUCCESS':
        return {
          ...state,
          loading: false,
          allBikes: action.payload,
          error: ''
        }
        case 'FETCH_USER_REQUEST':
          return {
            ...state,
            userLoading: true,
          }
        case 'FETCH_USER_SUCCESS':
          return {
            ...state,
            userLoading: false,
            user: action.payload,
            userError: ''
          }
          case 'FETCH_FOOD_DETAILS_REQUEST':
          return {
            ...state,
            foodDetailsLoading: true,
          }
        case 'FETCH_FOOD_DETAILS_SUCCESS':
          return {
            ...state,
            foodDetailsLoading: false,
            foodDetails: action.payload,
            foodDetailsError: ''
          }
          case 'FETCH_ALL_USERS_SUCCESS':
            return {
              ...state,
              loading: false,
              allUsers: action.payload,
              usersError: ''
            }
        case 'FETCH_BIKES_FAILURE':
          return {
            loading: false,
            bikes: [],
            allBikes:[],
            error: action.payload,
            user:[]
          }
          case 'FETCH_BIKES_PAGES_FAILURE':
            return {
              bikesPagesLoading: false,
              bikesPages: [],
              bikesPagesError: action.payload,
            }
        case 'FETCH_USER_FAILURE':
          return {
            userLoading: false,
            bikes: [],
            allBikes:[],
            userError: action.payload,
            user:[]
          }
          case 'FETCH_FOOD_DETAILS_FAILURE':
            return {
              foodDetailsLoading: false,
              foodDetails: [],
              foodDetailsError: action.payload,
            }
            case 'FETCH_FILTER_IS_SET':
              return {
                ...state,
                isFilterSet:true
              }  
          case 'FETCH_ALL_USERS_FAILURE':
            return {
              loading: false,
              bikes: [],
              allBikes:[],
              usersError: action.payload,
              user:[]
            }
      default: return state
    }
}

export default reducer
