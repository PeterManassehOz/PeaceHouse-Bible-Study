import React from 'react'
import Body from '../../components/Body/Body'
import Books from '../../components/Books/Books'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow p-6 mx-6 sm:mx-12">
          <Body />
          <Books />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default Home
