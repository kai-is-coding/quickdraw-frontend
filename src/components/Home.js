import React from 'react';
import '../css/Home.css';
import draw from '../image/draw.png';

const Home = () => {
  return(
    <div>
      <h3>Things to know:</h3>
      <p>
        <span className="intro">Quick draw</span>,  is one type of guessing game.
      </p>
      <p>
        A guessing game is a game in which the object is to use guessing to discover some kind of information, such as a word, a phrase, a title, or the identity or location of an object. A guessing game has as its core a piece of information that one player knows, and the object is to coerce others into guessing that piece of information without actually divulging it in text or spoken word. Charades is probably the most well-known game of this type, and has spawned numerous commercial variants that involve differing rules on the type of communication to be given, such as Catch Phrase, Taboo, Pictionary, and similar. The genre also includes many game shows such as Win, Lose or Draw, Password and $25,000 Pyramid.
      </p>
      <p>
        Many of the games are played co-operatively. In some games some player(s) know the answer, but cannot tell the other(s), instead they must help them to guess it. Guessing games are "readily adaptable for classroom use", as such a game "creates just enough tension to remain exciting, challenging, and competitive" for children, so long as the teacher designs effective rules "to eliminate unruly or unsportsmanship behavior". It has been noted, however, that children in therapy may initiate guessing games as a way to avoid talking about distressing issues, and that therapists who are using other kinds of games to facilitate communication should avoid being drawn into them.
      </p>
      <div className="showpage">
        <img src={draw} alt="showpage"/>
      </div>
    </div>
  );
};
export default Home;
