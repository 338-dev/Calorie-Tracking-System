import axios from 'axios'
import { useCookies } from 'react-cookie';

// const [cookies, setCookie] = useCookies(["user"]);



// export const fetchBikes =() => {
//     return (dispatch) => {
//       if(JSON.parse(localStorage.getItem('token'))!==null){
//       dispatch(fetchBikesRequest())
//        axios.get('https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes',{
//                 headers:{
//                   jwt: JSON.parse(localStorage.getItem('token')).jwt
//                 }
//             })
//         .then(response => {
//           const events = response.data
//           dispatch(fetchBikesSuccess(events))
//           dispatch(fetchAllBikesSuccess(events))
  
  
//           console.log(events)
//         })
//         .catch(error => {

//           console.log(error)
//           dispatch(fetchBikesFailure(error.message))
//         })}
//     }
//   }

//   export const fetchBikesWithPages =(pg=1) => {
//     return (dispatch) => {
//       if(JSON.parse(localStorage.getItem('token'))!==null){
// console.log('page')
// console.log(pg)

//       dispatch(fetchBikesPagesRequest())
//        axios.get(`https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/page/${pg}`,{
//                 headers:{
//                   jwt: JSON.parse(localStorage.getItem('token')).jwt
//                 }
//             })
//         .then(response => {
//           const events = response.data
//           dispatch(fetchBikesPagesSuccess(events[0]))  
//           dispatch(fetchTotalPages(events[1]))
//           console.log(events)
//         })
//         .catch(error => {
//           console.log(error)
//           dispatch(fetchBikesPagesFailure(error.message))
//         })
//       }    
//     }
//   }

  export const fetchAllUsers =(cookie) => {
    return (dispatch) => {
    if(cookie.token!==null)
    {
      dispatch(fetchAllUsersRequest())
       axios.get('http://localhost:3001/user',{
                headers:{
                  jwt: cookie.token
                }
            })
        .then(response => {
          const events = response.data
          dispatch(fetchAllUsersSuccess(events))
  
        })
        .catch(error => {
          console.log(error)
          dispatch(fetchAllUsersFailure(error.message))
        })
    }
  }
}

  export const fetchUser =(cookie) => {
    // const [cookies, setCookie] = useCookies(["user"]);

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

  
  export const fetchFoodDetails =(cookie) => {
    // const [cookies, setCookie] = useCookies(["user"]);

    return (dispatch) => {
      if(cookie.token!==null){
      dispatch(fetchFoodDetailsRequest())
        axios.get("http://localhost:3001/food",{
                headers:{
                  jwt: cookie.token
                }
            })
        .then((data)=>{
            console.log(data.data)
            dispatch(fetchFoodDetailsSuccess(data.data))
        })
        .catch(error => {
          
            console.log(error)
            dispatch(fetchFoodDetailsFailure(error.message))
        })}
    }
  }
  export const fetchFoodDetailsByUsers =(cookie,id) => {
    // const [cookies, setCookie] = useCookies(["user"]);
    console.log(id)
    console.log('id')

    return (dispatch) => {
      if(cookie.token!==null){
        console.log(232323)
      dispatch(fetchFoodDetailsRequest())
        axios.get(`http://localhost:3001/food/${id}`,{
                headers:{
                  jwt: cookie.token
                }
            })
        .then((data)=>{
            console.log(data.data)
            dispatch(fetchFoodDetailsSuccess(data.data))
        })
        .catch(error => {
          
            console.log(error)
            dispatch(fetchFoodDetailsFailure(error.message))
        })}
    }
  }
  export const fetchFilteredFoodDetails =(cookie,filterDates) => {
    // const [cookies, setCookie] = useCookies(["user"]);
    console.log(cookie)

    return (dispatch) => {
      if(cookie.token!==null){
    console.log('j23')

      dispatch(fetchFoodDetailsRequest())
        axios.post("http://localhost:3001/food/filtered",{...filterDates},{
                headers:{
                  jwt: cookie.token
                }
            })
        .then((data)=>{
            console.log(data.data)
            dispatch(fetchFilterIsSet())
            
            dispatch(fetchFoodDetailsSuccess(data.data))
        })
        .catch(error => {
          
            console.log(error)
            dispatch(fetchFoodDetailsFailure(error.message))
        })}
    }
  }
  // export const fetchFilteredBikes =(filter,pg=1) => {
  //   console.log('qwewq')

  //   return (dispatch) => {
  //     console.log(pg)
  //     dispatch(fetchBikesPagesRequest())
  //      axios.post(`https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/filter/${pg}`,{...filter},{
  //               headers:{
  //                 jwt: JSON.parse(localStorage.getItem('token')).jwt
  //               }
  //           })
  //       .then(response => {
  //         const events = response.data
  //         // dispatch(fetchBikesSuccess(events))
  //         console.log(events)
  //         console.log(events)

  //         dispatch(fetchBikesPagesSuccess(events[0]))
  //         dispatch(fetchTotalPages(events[1]))


  //       })
  //       .catch(error => {
  //         console.log(error)
  //         dispatch(fetchBikesPagesFailure(error.message))
  //       })
  //     }}
       

  // export const fetchBikesWithDates =(dates,filter) => {
  //   return (dispatch) => {
  //     dispatch(fetchBikesRequest())
  //      axios.get('https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes',{
  //               headers:{
  //                 jwt: JSON.parse(localStorage.getItem('token')).jwt
  //               }
  //           })
  //       .then(response => {
  //         const events = response.data
  //         dispatch(fetchAllBikesSuccess(events))


  //         let arr=[]
  //         if(dates.startDate!=='' && dates.endDate!=='' && (filter.model!==[] || filter.color!==[] || filter.city!==[]))
  //         {
  //           events.forEach(element => {
  //             if(new Date(element.availableFrom).getTime()<new Date(dates.startDate).getTime() && new Date(element.availableUntil).getTime()>new Date(dates.endDate).getTime() && (filter.model.length!==0?(filter.model.indexOf(element.model)!==-1?true:false):true) && (filter.city.length!==0?(filter.city.indexOf(element.city)!==-1?true:false):true) && (filter.color.length!==0?(filter.color.indexOf(element.color)!==-1?true:false):true)){
  //               arr.push(element)
  //             }
  //           });
  //       }
  //       else if(filter.model!==[] || filter.color!==[] || filter.city!==[])
  //       {
  //         events.forEach(element=>{
  //           if((filter.model.length!==0?(filter.model.indexOf(element.model)!==-1?true:false):true) && (filter.city.length!==0?(filter.city.indexOf(element.city)!==-1?true:false):true) && (filter.color.length!==0?(filter.color.indexOf(element.color)!==-1?true:false):true))
  //           {
  //             arr.push(element)
  //           }
           
  //         })
  //       }
  //         dispatch(fetchBikesSuccess(arr))
          
  //       })
  //       .catch(error => {
  //         console.log(error)
  //         dispatch(fetchBikesFailure(error.message))
  //       })
  //   }
  // }  
  
// export const fetchBikesRequest = () => {
//     return {
//         type: 'FETCH_BIKES_REQUEST'
//     }
// }

export const fetchAllUsersRequest = () => {
  return {
      type: 'FETCH_ALL_USERS_REQUEST'
  }
}

// export const fetchBikesPagesRequest = () => {
//   return {
//       type: 'FETCH_BIKES_PAGES_REQUEST'
//   }
// }

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
// export const fetchBikesSuccess = events => {
//     return {
//       type: 'FETCH_BIKES_SUCCESS',
//       payload: events
//     }
// }

// export const fetchBikesPagesSuccess = events => {
//   return {
//     type: 'FETCH_BIKES_PAGES_SUCCESS',
//     payload: events
//   }
// }

// export const fetchTotalPages = events => {
//   return {
//     type: 'FETCH_TOTAL_PAGES',
//     payload: events
//   }
// } 

// export const fetchAllBikesSuccess = events => {
//   return {
//     type: 'FETCH_ALL_BIKES_SUCCESS',
//     payload: events
//   }
// }
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

export const fetchFilterIsSet = () => {
  return {
    type: 'FETCH_FILTER_IS_SET',
  }
}
// export const fetchChangedPage = page => {
//   return {
//     type: 'FETCH_PAGE_CHANGE_REQUEST',
//     payload: page
//   }
// }
// export const fetchBikesFailure = error => {
//     return {
//       type: 'FETCH_BIKES_FAILURE',
//       payload: error
//     }
// }

// export const fetchBikesPagesFailure = error => {
//   return {
//     type: 'FETCH_BIKES_PAGES_FAILURE',
//     payload: error
//   }
// }

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
