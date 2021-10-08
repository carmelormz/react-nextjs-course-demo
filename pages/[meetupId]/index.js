import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetails from '../../components/meetups/MeetupDetail';

const MeetupDetailsPage = (props) => {
  const { meetup } = props;

  return (
    <>
      <Head>
        <title>{meetup.title} | Details</title>
        <meta name="description" content="A detail of a meetup" />
      </Head>
      <MeetupDetails
        image={meetup.image}
        title={meetup.title}
        address={meetup.address}
        description={meetup.description}
      />
    </>
  );
};

/**
 * Sets URL Paths for Static Pros in Pre-Rendering
 * @returns
 */
export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    'mongodb+srv://carmelo:Chelomelo01@cluster0.0eojp.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupCollection = db.collection('meetups');

  const storesMeetupsIds = await meetupCollection
    .find({}, { _id: 1 })
    .toArray();

  const meetupsIdsPaths = storesMeetupsIds.map((meetup) => ({
    params: { meetupId: meetup._id.toString() },
  }));

  client.close();

  return {
    fallback: 'blocking',
    paths: meetupsIdsPaths,
  };
};

export const getStaticProps = async (context) => {
  const { meetupId } = context.params;

  const client = await MongoClient.connect(
    'mongodb+srv://carmelo:Chelomelo01@cluster0.0eojp.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupCollection = db.collection('meetups');

  const selectedMeetup = await meetupCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetup: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
      },
    },
    revalidate: 1,
  };
};

export default MeetupDetailsPage;
