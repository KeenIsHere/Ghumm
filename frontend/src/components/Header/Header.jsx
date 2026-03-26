import React,{useRef, useEffect} from 'react'
import { NavLink, Link } from 'react-router-dom';
import {Container, Row, Button} from 'reactstrap';

import logo from '../../assets/images/logo.png';
import './header.css';

const nav_links = [
  {
    path : '/home',
    display : 'Home'
  },
  {
    path : '/tours',
    display : 'Tours'
  },
  {
    path: '/about',
    display: 'About'
  },
]

const Header = () => {

const headerRef = useRef(null);

const stickyHeaderFunc = () => {
  if(!headerRef.current) return

  if(document.body.scrollTop > 80 || document.documentElement.scrollTop > 80){
    headerRef.current.classList.add('sticky__header')
  } else{
    headerRef.current.classList.remove('sticky__header')
  }
}

useEffect(() => {
  window.addEventListener('scroll', stickyHeaderFunc)
  stickyHeaderFunc()

  return () => window.removeEventListener('scroll', stickyHeaderFunc)
}, [])


  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
           {/* === Logo === */}
           <div className="logo">
            <img src={logo} alt="" />
           </div>
           {/* === Logo END === */}

            {/* === Menu === */}
            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {
                  nav_links.map((item, index) => (
                    <li className="nav__item" key={index}>
                      <NavLink to={item.path} className={navClass => navClass.isActive ? 'active__link' : ''}>{item.display}</NavLink>
                    </li>
                  ))
                }
              </ul>
            </div>
            {/* === Menu END === */}

            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                <Button className="btn secondary__btn"><Link to='/login'>Login</Link></Button>
                <Button className="btn primary__btn"><Link to='/register'>Register</Link></Button>
              </div>

              <span className='mobile__menu'>
                <i className="ri-menu-line"></i>
              </span>

            </div>
          </div>
        </Row>
      </Container>
    </header>
  )
}

export default Header
