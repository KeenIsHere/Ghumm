import React from 'react'
import "./service-card.css"


const ServiceCard = ({item}) => {
    const {imgUrl, title, description} = item
  return (
    <div className="service-item">
      <div className="service-img">
        <img src={imgUrl} alt={title} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default ServiceCard
