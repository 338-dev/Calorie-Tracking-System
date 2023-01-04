const initialState = {
    loading: false,
    userLoading:false,
    foodDetailsLoading:false,
    foodDetails: [],
    allUsers:[],
    error: '',
    usersError:'',
    foodDetailsError:'',
    user:[],
    userError:'',
    totalPages:1,
    currentFoodPage:1,
    isFilterSet:false,
    report:[],
    reportLoading:false,
    reportError:'',
    totalUsersPages:1,
    currentUserPage:1
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_FOOD_PAGE_CHANGE_REQUEST':
          return {
            ...state,
            currentFoodPage:action.payload
          }
          case 'FETCH_USER_PAGE_CHANGE_REQUEST':
            return {
              ...state,
              currentUserPage:action.payload
            }
      case 'FETCH_ALL_USERS_REQUEST':
        return {
          ...state,
          loading: true
        }
        case 'FETCH_TOTAL_PAGES':
          return {
            ...state,
            totalPages:action.payload
          }
          case 'FETCH_TOTAL_USERS_PAGES':
            return {
              ...state,
              totalUsersPages:action.payload
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
          case 'FETCH_REPORT_DETAILS_REQUEST':
          return {
            ...state,
            reportLoading: true,
          }
        case 'FETCH_FOOD_DETAILS_SUCCESS':
          return {
            ...state,
            foodDetailsLoading: false,
            foodDetails: action.payload,
            foodDetailsError: ''
          }
          case 'FETCH_REPORT_DETAILS_SUCCESS':
          return {
            ...state,
            reportLoading: false,
            report: action.payload,
            reportError: ''
          }
          case 'FETCH_ALL_USERS_SUCCESS':
            return {
              ...state,
              loading: false,
              allUsers: action.payload,
              usersError: ''
            }
        case 'FETCH_USER_FAILURE':
          return {
            ...state,
            userLoading: false,
            userError: action.payload,
            user:[]
          }
          case 'FETCH_FOOD_DETAILS_FAILURE':
            return {
              ...state,
              foodDetailsLoading: false,
              foodDetails: [],
              foodDetailsError: action.payload,
            }
            case 'FETCH_REPORT_DETAILS_FAILURE':
              return {
                ...state,
                reportLoading: false,
                report: [],
                reportError: action.payload,
              }
            case 'FETCH_FILTER_IS_SET':
              return {
                ...state,
                isFilterSet:action.payload
              }  
          case 'FETCH_ALL_USERS_FAILURE':
            return {
              ...state,
              loading: false,
              usersError: action.payload,
              user:[]
            }
      default: return state
    }
}

export default reducer
