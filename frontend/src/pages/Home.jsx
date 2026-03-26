import React from 'react'
import '../styles/home.css'

import {Container, Row, Col} from 'reactstrap'
import heroImg from '../assets/images/hero-img01.jpg'
import heroImg02 from '../assets/images/hero-img02.jpg'
import heroVideo from '../assets/images/hero-video.mp4'
import worldImg from '../assets/images/world.png'
import experienceImg from '../assets/images/experience.png'

import Subtitle from '../shared/subtitle.jsx'

import SearchBar from '../shared/SearchBar'
import ServicesList from '../services/ServicesList'
import FeaturedTourList from '../components/Featured-tours/FeaturedTourList'
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery.jsx'
import Testimonials from '../components/Testimonials/Testimonials.jsx'
import Newsletter from '../shared/Newsletter.jsx'

const Home = () => {
  return <>
   {/*  ====== Hero Section Starts====== */}
    <section>
      <Container>
        <Row>
          <Col lg='6'>
            <div className="hero__content">
              <div className="hero__subtitle d-flex align-items-center">
                <Subtitle subtitle={'Know Before You Go'} />
                <img src={worldImg} alt="" />
              </div>
               <h1>Traveling opens the door to creating {" "} <span className="highlight"> memories</span></h1>
               <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, ex.</p>
            </div>
          </Col>

          <Col lg='2'>
            <div className="hero__img-box">
              <img src={heroImg} alt="" />
            </div>
          </Col>
          <Col lg='2'>
            <div className="hero__img-box mt-4">
              <video src={heroVideo} controls autoplay loop muted></video>
            </div>
          </Col>
          <Col lg='2'>
            <div className="hero__img-box ">
              <img src={heroImg02} alt="" />
            </div>
          </Col>
          
          <SearchBar />

        </Row>
      </Container>
    </section>
    {/* ====== Hero Section Ends====== */}

    <section>
      <Container>
        <Row>
          <Col lg='3'>
            <h5 className="services__subtitle">What we serve</h5>
            <h2 className="services__title">We offer our best services</h2>
          </Col>
          <ServicesList />
        </Row>
      </Container>
    </section>

    {/* ====== Features Section Starts====== */}
    <section>
        <Container> 
          <Row>
            <Col lg='12' className='mb-5'>
              
                <Subtitle subtitle={'Explore'} />
                <h2 className='featured__tour-title'>Featured Tours</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, ex.</p>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
    </section>
    {/* ====== Features Section Ends====== */}



    {/* ====== Experience Section Starts====== */}

    <section>
      <Container>
        <Row>
          <Col lg='6'>
            <div className='experience_content'>
              <Subtitle subtitle={'Experience the Adventure'} />

              <h2>With our all experience <br /> we will serve you</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, ex.</p>
              <br />
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, ex.</p>

            </div>

            <div className='counter_wrapper d-flex align-items-center gap-5'>
              <div className='counter_box'>
                <span>12k+</span>
                <h6>Successful Trips</h6>
              </div>
              <div className='counter_box'>
                <span>12k+</span>
                <h6>Regular Clients</h6>
              </div>
              <div className='counter_box'>
                <span>12</span>
                <h6>Years of Experience</h6>
              </div>
            </div>

          </Col>
          <Col lg='6'>
          <div>
            <div className="experience_img">
              <img src={experienceImg} alt="" />
            </div>
          </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ====== Experience Section Ends====== */}

    {/* ====== gallery Section Ends====== */}

      <section>
        <Container>
          <Row>
              <Col lg='12'>
              
                <Subtitle subtitle={'Gallery'} />
                <h2 className='gallery_title'>
                  Visit our customers tour gallery
                </h2>
              </Col>
              <Col lg = '12'>
              <MasonryImagesGallery/>
              </Col>
          </Row>
        </Container>
      </section>

    {/* ====== gallery Section Ends====== */}

    {/* ====== testimonial Section Ends====== */}

    <section>
      <Container>
        <Row>
          <Col lg='12'>
            <Subtitle subtitle={'Fans Love'} />
            <h2 className='testimonial_title'>What our fans say about us</h2>
          </Col>
          <Col lg="12">
          <Testimonials/>
          
          </Col>
        </Row>
      </Container>
    </section>
    {/* ====== testimonial Section Ends====== */}

    <Newsletter/>
    



  </>
}

export default Home
