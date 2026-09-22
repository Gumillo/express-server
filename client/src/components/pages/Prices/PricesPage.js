import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Container, Progress } from 'reactstrap';
import { getConcerts, getRequest, loadConcertsRequest } from '../../../redux/concertsRedux';

const Prices = () => {
  const dispatch = useDispatch();
  const concerts = useSelector(getConcerts);
  const request = useSelector(getRequest);

  useEffect(() => {
    dispatch(loadConcertsRequest());
  }, [dispatch]);

  const workshopsData = {
    1: '"Rock Music Style", "How to make you voice grooowl", "Make your voice stronger", "History of Rock"',
    2: '"Find your real tune", "Find your real YOU", "Fell the music", "Jam session"',
    3: '"Increase your vocal range", "How to properly warmup before singing", "It\'s time for YOU!"'
  };

  // Group concerts by day to get unique days and their prices
  const days = {};
  for (let concert of concerts) {
    if (!days[concert.day]) {
      days[concert.day] = concert.price;
    }
  }

  // Convert to array and sort by day
  const daysArray = Object.keys(days)
    .map(day => ({ day: parseInt(day), price: days[day] }))
    .sort((a, b) => a.day - b.day);

  return (
    <Container>
      <h1>Prices</h1>
      <p>Prices may differ according the day of the festival. Remember that ticket includes not only the star performance, but also 10+ workshops. We gathered several genre teachers to help you increase your vocal skills, as well as self confidence.</p>
      
      <Alert color="info">
          Attention! <strong>Children under 4 can go freely with you without any other fee!</strong>
      </Alert>

      {request.pending && <Progress animated color="primary" value={50} />}
      {request.error && <Alert color="warning">{request.error}</Alert>}
      {request.success && daysArray.map(({ day, price }) => (
        <div key={day}>
          <h2>Day {day === 1 ? 'one' : day === 2 ? 'Two' : day === 3 ? 'three' : day}</h2>
          <p>Price: {price}$</p>
          <p>Workshops: {workshopsData[day] || 'TBA'}</p>
        </div>
      ))}
    </Container>
  );
};

export default Prices;