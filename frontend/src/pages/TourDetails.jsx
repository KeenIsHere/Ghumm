import React from 'react'
import '../styles/tour-details.css'
import { Container, Row, Col, Form, ListGroup } from 'reactstrap'
import { useParams } from 'react-router-dom'
import tourdata from '../assets/data/tours'
import calculateAvgRating from '../utils/avgRating'
import avatar from '../assets/images/avatar.jpg'
const TourDetails = () => {
  const { id } = useParams()
  // this is an static data letter we will call our api and load our data from database
  const tour = tourdata.find(tour => tour.id ===id)

  // destructure properties from tour object
  const 
  { photo, 
    title, 
    desc, 
    price, 
    address, 
    reviews, 
    city, 
    distance,
    maxGroupSize 
  } = tour

  const { totalRating, avgRating } = calculateAvgRating(reviews)

  // format date
  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg='8'>
              <div className="tour__content">
                <img src={photo} alt={title} />
                <div className="tour__info">
                  <h2>{title}</h2>
                  <div className='d-flex align-items-center gap-5'>

                    <span className="tour__rating d-flex align-items-center gap-1">
                <i class="ri-star-fill" style={{'color': "var(--secondary-color)"}}></i> {calculateAvgRating === 0 ? null : avgRating}
                {totalRating === 0 ? ("Not rated") : <span>({reviews.length})</span>}
                <span>({reviews?.length})</span>
              </span>
              <span>
                <i class="ri-map-pin-line"></i> {address}
              </span>
                  </div>
                  <div className='tour__extra-details'>
                    <span><i class="ri-map-pin-2-line"></i> {city}</span>
                    <span><i class="ri-money-dollar-circle-line"></i> ${price} / per person</span>
                    <span><i class="ri-map-pin-time-line"></i> {distance} k/m</span>
                    <span><i class="ri-group-line"></i> {maxGroupSize} people</span>
                </div>
                <h5>Description</h5>
                <p>{desc}</p>
                </div>

                {/* ================ tour reviews section start =============== */}

                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviews?.length} reviews)</h4>
                  
                  <Form >
                    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                      <span>1<i class="ri-star-s-fill"></i></span>
                      <span>2<i class="ri-star-s-fill"></i></span>
                      <span>3<i class="ri-star-s-fill"></i></span>
                      <span>4<i class="ri-star-s-fill"></i></span>
                      <span>5<i class="ri-star-s-fill"></i></span>
                    </div>

                    <div className="review__input">
                      <input type="text" placeholder="Write your review here..." />
                      <button className="btn primary__btn text-white" type='submit'>Submit</button>
                    </div>
                  </Form>

                  <ListGroup className='user__reviews'>
                    {
                      reviews?.map((review, index) => (
                        <div className="review__item" >
                          <img src={avatar} alt="" />
                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                              <h5>krishna</h5>
                              <p> {new Date("2023-10-10").toLocaleDateString("en-US", options)} 
                              </p>
                            </div>
                            <span className="d-flex align-items-center">5
                              <i class="ri-star-s-fill"></i>
                            </span>
                            </div>
                            <h6>Amazing tour</h6>
                          </div>
                          <img src={avatar} alt="" />
                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                              <h5>krishna</h5>
                              <p> {new Date("2023-10-10").toLocaleDateString("en-US", options)} 
                              </p>
                            </div>
                            <span className="d-flex align-items-center">5
                              <i class="ri-star-s-fill"></i>
                            </span>
                            </div>
                            <h6>Amazing tour</h6>
                          </div>
                          <img src={avatar} alt="" />
                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                              <h5>krishna</h5>
                              <p> {new Date("2023-10-10").toLocaleDateString("en-US", options)} 
                              </p>
                            </div>
                            <span className="d-flex align-items-center">5
                              <i class="ri-star-s-fill"></i>
                            </span>
                            </div>
                            <h6>Amazing tour</h6>
                          </div>
                        </div>
                        
                      ))
                    }
                  </ListGroup>
                </div>
                {/* ================ tour reviews section end =============== */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
  
}

export default TourDetails
