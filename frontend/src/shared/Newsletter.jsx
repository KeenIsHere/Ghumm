import React from 'react'
import './newsletter.css'

import { Container, Row, Col } from 'reactstrap'
import maleTourist from '../assets/images/male-tourist.png'

const Newsletter = () => {
  return (
  <section className='newsletter'>
    <Container>
      <Row>
        <Col lg='6'>
          <div className="newsletter__content">
            <h2>Subscribe to Our Newsletter</h2>

            <div className="newsletter__input">
              <input type="email" placeholder='Enter your email' />
              <button className='btn newsletter__btn'>Subscribe</button>
            </div>
            <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat, atque totam! Sed facilis eligendi amet, assumenda qui debitis minima pariatur aliquam veniam reiciendis cum delectus magnam praesentium ex blanditiis nulla?
            </p>
          </div>
        </Col>
        <Col lg='6'>
          <div className='newsletter_img'>
            <img src={maleTourist} alt="Male Tourist" />
          </div>
        </Col>
      </Row>
    </Container>
  </section>
  )
}
export default Newsletter
