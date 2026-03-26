import React from 'react'
import ServiceCard from './ServiceCard'
import {Col} from "reactstrap"

import weatherImg from "../assets/images/weather.png"
import guideImg from "../assets/images/guide.png"
import customizationImg from "../assets/images/customization.png"


const servicesData = [
  {
    imgUrl: weatherImg,
    title: "Weather Forecast",
    description: "Get accurate weather forecasts for your travel destinations.",
  },
  {
    imgUrl: guideImg,
    title: "Local Guide",
    description: "Get local insights and recommendations from experienced guides.",
  },
  {
    imgUrl: customizationImg,
    title: "Customization",
    description: "Tailor your travel experience to your specific preferences.",
  }
]

const ServicesList = () => {
  return <>
    {
        servicesData.map((item, index) => (
          <Col lg="3" key={index}>
            <ServiceCard item={item} />
          </Col>
        ))
    }

  </>
}

export default ServicesList
