import React from 'react';
import '../css/Home.css';


const Home = () => {
  return(
    <div>
      <nav>
        <h3>Things to know:</h3>
        <p>
          <span className="intro">Quick draw</span>, is the ability to quickly draw a handgun and fire it accurately on a target. This skill was made popular by romanticized depictions of gunslingers in the Western genre, which in turn were inspired by famous historical gunfights in the American Old West.

          In modern times, fast draw can be seen both in sports and in military practices. The World Fast Draw Association (WFDA) is the international sanctioning body of the sport of fast draw. Unlike cowboy action shooting, fast draw is shot with special blanks or wax bullets. While some competitions are strictly against the clock, with the fastest time winning, many are set up as head to head single or double elimination matches.
        </p>
        <div className="showpage">
          <img src="https://3.bp.blogspot.com/-0xG5sTRqPtQ/W-2oJuTNWmI/AAAAAAAABvU/GcYue9KOUyw7ZfUq-SgDUJNisYeiP8_GgCLcBGAs/s1600/image9.jpg" alt="image"/>
        </div>
      </nav>
    </div>
  );
};
export default Home;
