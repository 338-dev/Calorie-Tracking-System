import axios from 'axios'
import { useCookies } from 'react-cookie';


  export const fetchAllUsers =(cookie,pg) => {
    return (dispatch) => {
    if(cookie.token!==null)
    {
      dispatch(fetchAllUsersRequest())
       axios.get(`http://localhost:3001/user/pg/${pg}`,{
                headers:{
                  jwt: cookie.token
                }
            })
        .then(response => {
          const events = response.data
          console.log(events)
          dispatch(fetchAllUsersSuccess(events[0]))
          dispatch(fetchAllUsersPages(events[1]))
  
        })
        .catch(error => {
          console.log(error)
          dispatch(fetchAllUsersFailure(error.message))
        })
    }
  }
}

  export const fetchUser =(cookie) => {

    return (dispatch) => {
      if(cookie.token!==null){
      dispatch(fetchUserRequest())
        axios.get("http://localhost:3001/user/verify",{
                headers:{
                  jwt: cookie.token
                }
            })
        .then((data)=>{
            console.log(data)
            dispatch(fetchUserSuccess(data.data.result))
        })
        .catch(error => {
          
            console.log(error)
            dispatch(fetchUserFailure(error.message))
        })}
    }
  }

  
  export const fetchFoodDetails =(cookie,pg) => {

    return (dispatch) => {
      if(cookie.token!==null){
      dispatch(fetchFoodDetailsRequest())
        axios.get(`http://localhost:3001/food/pg/${pg}`,{
                headers:{
                  jwt: cookie.token
                }
            })
        .then((data)=>{
            console.log(data.data)
            dispatch(fetchFoodDetailsSuccess(data.data[0]))
            dispatch(fetchTotalPages(data.data[1]))

        })
        .catch(error => {
          
            console.log(error)
            dispatch(fetchFoodDetailsFailure(error.message))
        })}
    }
  }
  export const fetchFoodDetailsByUsers =(cookie,id,pg) => {

    return (dispatch) => {
      if(cookie.token!==null){
        // console.log(232323)
      dispatch(fetchFoodDetailsRequest())
        axios.get(`http://localhost:3001/food/${id}/pg/${pg}`,{
                headers:{
                  jwt: cookie.token
                }
            })
        .then((data)=>{
            console.log(data.data)
            dispatch(fetchFoodDetailsSuccess(data.data[0]))
            dispatch(fetchTotalPages(data.data[1]))

        })
        .catch(error => {
          
            console.log(error)
            dispatch(fetchFoodDetailsFailure(error.message))
        })}
    }
  }
  export const fetchReportDetailsByUsers =(cookie,id) => {

    return (dispatch) => {
      if(cookie.token!==null){
        console.log(232323)
      dispatch(fetchReportDetailsRequest())
        axios.get(`http://localhost:3001/food/stats/${id}`,{
                headers:{
                  jwt: cookie.token
                }
            })
        .then((data)=>{
            console.log(data.data)
            dispatch(fetchReportDetailsSuccess(data.data))
        })
        .catch(error => {
          
            console.log(error)
            dispatch(fetchReportDetailsFailure(error.message))
        })}
    }
  }
  export const fetchFilteredFoodDetails =(cookie,filterDates,pg) => {

    return (dispatch) => {
      if(cookie.token!==null){
    console.log('j23')

      dispatch(fetchFoodDetailsRequest())
        axios.post(`http://localhost:3001/food/filtered/pg/${pg}`,{...filterDates},{
                headers:{
                  jwt: cookie.token
                }
            })
        .then((data)=>{
            console.log(data.data)
            dispatch(fetchFilterIsSet(true))
            
            dispatch(fetchFoodDetailsSuccess(data.data[0]))
            dispatch(fetchChangedFoodPage(1))
            dispatch(fetchTotalPages(data.data[1]))

        })
        .catch(error => {
          
            console.log(error)
            dispatch(fetchFoodDetailsFailure(error.message))
        })}
    }
  }

export const fetchChangedFoodPage = page => {
  return {
    type: 'FETCH_FOOD_PAGE_CHANGE_REQUEST',
    payload: page
  }
}

export const fetchChangedUserPage = page => {
  return {
    type: 'FETCH_USER_PAGE_CHANGE_REQUEST',
    payload: page
  }
}

export const fetchTotalPages = events => {
  return {
    type: 'FETCH_TOTAL_PAGES',
    payload: events
  }
}

export const fetchAllUsersPages= events => {
  return {
    type: 'FETCH_TOTAL_USERS_PAGES',
    payload: events
  }
}

export const fetchAllUsersRequest = () => {
  return {
      type: 'FETCH_ALL_USERS_REQUEST'
  }
}

export const fetchUserRequest = () => {
    return {
        type: 'FETCH_USER_REQUEST'
    }
}

export const fetchFoodDetailsRequest = () => {
  return {
      type: 'FETCH_FOOD_DETAILS_REQUEST'
  }
}

export const fetchReportDetailsRequest = () => {
  return {
      type: 'FETCH_REPORT_DETAILS_REQUEST'
  }
}

export const fetchAllUsersSuccess = events => {
  return {
    type: 'FETCH_ALL_USERS_SUCCESS',
    payload: events
  }
}
export const fetchUserSuccess = events => {
    return {
      type: 'FETCH_USER_SUCCESS',
      payload: events
    }
}

export const fetchFoodDetailsSuccess = events => {
  return {
    type: 'FETCH_FOOD_DETAILS_SUCCESS',
    payload: events
  }
}

export const fetchReportDetailsSuccess = events => {
  return {
    type: 'FETCH_REPORT_DETAILS_SUCCESS',
    payload: events
  }
}

export const fetchFilterIsSet = (event) => {
  return {
    type: 'FETCH_FILTER_IS_SET',
    payload: event
  }
}


export const fetchAllUsersFailure = error => {
  return {
    type: 'FETCH_ALL_USERS_FAILURE',
    payload: error
  }
}

export const fetchUserFailure = error => {
    return {
      type: 'FETCH_USER_FAILURE',
      payload: error
    }
}

export const fetchFoodDetailsFailure = error => {
  return {
    type: 'FETCH_FOOD_DETAILS_FAILURE',
    payload: error
  }
}

export const fetchReportDetailsFailure = error => {
  return {
    type: 'FETCH_REPORT_DETAILS_FAILURE',
    payload: error
  }
}
