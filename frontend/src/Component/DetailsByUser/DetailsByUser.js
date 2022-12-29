import React from 'react'
import { connect } from 'react-redux'
import FoodList from '../FoodList/FoodList'
import Navbar from '../Navbar/Navbar'

export const DetailsByUser = (props) => {
  return (
    <div>
      <Navbar/>
      <FoodList/>
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsByUser)