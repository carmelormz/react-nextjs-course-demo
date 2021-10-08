import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

const HomePage = (props) => {
  const { meetups } = props;
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={meetups} />
    </>
  );
};

// ----------- THIS CODE RUNES IN THE SERVER, NOT IN THE CLIENT -------------------

// export const getServerSideProps = async (context) => {
//   const req = context.req;
//   const res = context.res;

//   //ex. fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export const getStaticProps = async () => {
  //ex. fetch data from an API
  const client = await MongoClient.connect(
    'mongodb+srv://carmelo:Chelomelo01@cluster0.0eojp.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupCollection = db.collection('meetups');

  const storedMeetups = await meetupCollection.find().toArray();

  client.close();

  const meetups = storedMeetups.map((meetup) => {
    return {
      title: meetup.title,
      address: meetup.address,
      image: meetup.image,
      id: meetup._id.toString(),
    };
  });

  return {
    props: {
      meetups,
    },
    revalidate: 1,
  };
};

export default HomePage;
